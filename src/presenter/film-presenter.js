import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from '../utils/const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';


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

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setShowPopupClickHandler(this.#handleShowPopupClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#handleClosePopupClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
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

}

