import AbstractView from './abstract-view.js';
import {formatDate, getTimeDuration} from '../utils/common.js';
import {TypeControls} from '../utils/const.js';

const getClassNameActive = (flag) => {
  return flag
    ? 'film-details__control-button--active'
    : '';
};

export const createFilmPopupTemplate = (film) => {

  const {
    title, alternativeTitle, totalRating, release, runtime,
    genre, description, poster, ageRating, director, writers,
    actors} = film;

  const filmComments = film.comments;

  const dateRelease = formatDate(release.date, 'D MMMM YYYY');
  const countryRelease = release.releaseCountry;

  const hours = getTimeDuration(runtime).hours();
  const minutes = getTimeDuration(runtime).minutes();

  const watchlistClassName = getClassNameActive(film.userDetails.watchlist);
  const watchedClassName = getClassNameActive(film.userDetails.alreadyWatched);
  const favoriteClassName = getClassNameActive(film.userDetails.favorite);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${alternativeTitle}</h3>
              <p class="film-details__title-original">${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${hours}h ${minutes}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${countryRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genre.map((genreCurrent) => `<span class="film-details__genre">${genreCurrent}</span>`).join('')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist" data-type="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched" data-type="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite" data-type="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">
           Comments <span class="film-details__comments-count">${filmComments.length}</span>
        </h3>

        <ul class="film-details__comments-list">
          ${filmComments.map(({author, comment, date, emotion}) =>`<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatDate(date, 'YYYY/MM/DD HH:mm')}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`).join('')}

        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;

};


export default class FilmPopupView extends AbstractView{
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  }

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  }

  setControlsClickHandler = (callback) => {
    this._callback.controlsClick = callback;
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#controlsClickHandler);
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

}
