import FilmCardView from '../view/film-card-view.js';
import {TypeControls, UpdateType, UserAction} from '../utils/const.js';
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

    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setShowPopupClickHandler(this.#showFilmPopup);
    this.#filmComponent.setControlsClickHandler(this.#handleControlsClick);

    if (prevFilmComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #showFilmPopup = () => {
    this.#changeMode(this.#film.id);
  };

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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: userDetails},
    );
  }

}
