import AbstractView from './abstract-view.js';
import {formatDate, getTimeDuration} from '../utils/common.js';
import {SHORT_DESCRIPTION_MAX_LENGTH, TypeControls} from '../utils/const.js';

const getClassNameActive = (flag) => {
  return flag
    ? 'film-card__controls-item--active'
    : '';
};

const createFilmCardTemplate = (film) => {
  const {title, totalRating, release, runtime, genre, description, poster} = film;

  const year = formatDate(release.date);
  const hours = getTimeDuration(runtime).hours();
  const minutes = getTimeDuration(runtime).minutes();

  const currentGenre = genre[0];

  const shortDescription = description.length > SHORT_DESCRIPTION_MAX_LENGTH
    ? `${description.slice(0, SHORT_DESCRIPTION_MAX_LENGTH)}...`
    : description;
  const commentsCount = film.comments.length;

  const watchlistClassName = getClassNameActive(film.userDetails.watchlist);
  const watchedClassName = getClassNameActive(film.userDetails.alreadyWatched);
  const favoriteClassName = getClassNameActive(film.userDetails.favorite);

  return `<article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${year}</span>
              <span class="film-card__duration">${hours}h ${minutes}m</span>
              <span class="film-card__genre">${currentGenre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${shortDescription}</p>
            <span class="film-card__comments">${commentsCount} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button" data-type="watchlist">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" data-type="watched">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button" data-type="favorite">Mark as favorite</button>
          </div>
        </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setShowPopupClickHandler = (callback) => {
    this._callback.showPopup = callback;
    this.element.addEventListener('click', this.#showPopupClickHandler);
  }

  #showPopupClickHandler = (evt) => {
    evt.preventDefault();

    const target = evt.target;
    const isCorrectClick = target.classList.contains('film-card__title')
      || target.classList.contains('film-card__poster')
      || target.classList.contains('film-card__comments');

    if (!isCorrectClick) {
      return;
    }

    this._callback.showPopup();
  }

  setControlsClickHandler = (callback) => {
    this._callback.controlsClick = callback;
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#controlsClickHandler);
  }

  #controlsClickHandler = (evt) => {
    evt.preventDefault();

    const buttonType = evt.target.dataset.type;
    if (!buttonType) {
      return;
    }

    switch (buttonType) {
      case TypeControls.WATCHLIST:
        this._callback.controlsClick(TypeControls.WATCHLIST);
        break;
      case TypeControls.WATCHED:
        this._callback.controlsClick(TypeControls.WATCHED);
        break;
      case TypeControls.FAVORITE:
        this._callback.controlsClick(TypeControls.FAVORITE);
        break;
    }
  }

  // setWatchlistClickHandler = (callback) => {
  //   this._callback.favoriteClick = callback;
  //   this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  // }
  //
  // setWatchedClickHandler = (callback) => {
  //   this._callback.favoriteClick = callback;
  //   this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  // }
  //
  // setFavoriteClickHandler = (callback) => {
  //   this._callback.favoriteClick = callback;
  //   this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  // }

  // #watchlistClickHandler = (evt) => {
  //   evt.preventDefault();
  //   this._callback.watchlistClick();
  // }
  //
  // #watchedClickHandler = (evt) => {
  //   evt.preventDefault();
  //   this._callback.watchedClick();
  // }
  //
  // #favoriteClickHandler = (evt) => {
  //   evt.preventDefault();
  //   this._callback.favoriteClick();
  // }


}
