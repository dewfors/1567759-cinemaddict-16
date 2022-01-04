import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from '../utils/const.js';
import {render, RenderPosition} from '../utils/render.js';


export default class FilmPresenter {
  #filmListContainer = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;

  constructor(filmListContainer) {
    this.#filmListContainer = filmListContainer;
  }

  init = (film) => {
    this.#film = film;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setShowPopupClickHandler(this.#handleShowPopupClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#handleClosePopupClick);

    render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
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

}

