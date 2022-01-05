import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME, TypeControls} from '../utils/const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setShowPopupClickHandler(this.#handleShowPopupClick);
    this.#filmComponent.setControlsClickHandler(this.#handleControlsClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#handleClosePopupClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);

  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#hideFilmPopup();
    }
  }

  #showFilmPopup = () => {
    this.#changeMode();
    this.#mode = Mode.POPUP;
    document.body.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add(BODY_HIDE_OVERFLOW_CLASS_NAME);
  };

  #hideFilmPopup = () => {
    if (document.body.contains(this.#filmPopupComponent.element)) {
      document.body.removeChild(this.#filmPopupComponent.element);
      document.body.classList.remove(BODY_HIDE_OVERFLOW_CLASS_NAME);
    }
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hideFilmPopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleShowPopupClick = () => {
    this.#showFilmPopup();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleClosePopupClick = () => {
    this.#hideFilmPopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #handleControlsClick = (buttonType) => {
    let userDetails = {};

    switch (buttonType) {
      case TypeControls.WATCHLIST:
        userDetails = {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist};
        break;
      case TypeControls.WATCHED:
        userDetails = {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched};
        break;
      case TypeControls.FAVORITE:
        userDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite};
        break;
    }
    this.#changeData({...this.#film, userDetails: userDetails});
  }

}

