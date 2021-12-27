import AbstractView from './abstract-view.js';
import {formatDate, getTimeDuration} from '../utils/common.js';
import {SHORT_DESCRIPTION_MAX_LENGTH} from '../utils/const.js';

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
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
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
    this.element.querySelector('.film-card__poster').addEventListener('click', this.#showPopupClickHandler);
    this.element.querySelector('.film-card__title').addEventListener('click', this.#showPopupClickHandler);
    this.element.querySelector('.film-card__comments').addEventListener('click', this.#showPopupClickHandler);
  }

  #showPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showPopup();
  }

}
