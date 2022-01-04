import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from '../utils/const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {TypeControls} from "../utils/const";


export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setShowPopupClickHandler(this.#handleShowPopupClick);
    // this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setControlsClickHandler(this.#handleControlsClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#handleClosePopupClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    // if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (document.body.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);

  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  #showFilmPopup = () => {
    document.body.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add(BODY_HIDE_OVERFLOW_CLASS_NAME);
  };

  #hideFilmPopup = () => {
    document.body.removeChild(this.#filmPopupComponent.element);
    document.body.classList.remove(BODY_HIDE_OVERFLOW_CLASS_NAME);
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

  // #handleFavoriteClick = () => {
  //   const userDetails = {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite};
  //   this.#changeData({...this.#film, userDetails: userDetails});
  // }

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

