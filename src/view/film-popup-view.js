import he from 'he';
import SmartView from './smart-view.js';
import {formatDate, getTimeDuration} from '../utils/common.js';
import {TypeControls, UserAction} from '../utils/const.js';
import {nanoid} from 'nanoid';

const deleteCommentButtonClassName = 'film-details__comment-delete';
const commentContainerClassName = 'film-details__comment';
const getClassNameActive = (flag) => flag ? 'film-details__control-button--active' : '';
const emojiList = ['smile', 'sleeping', 'puke', 'angry'];

export const createFilmPopupTemplate = (film, commentsAll, state) => {

  console.log(state);

  const {isLoadCommentsError} = state;
  const commentsList = commentsAll;

  const {
    title, alternativeTitle, totalRating, release, runtime,
    genre, description, poster, ageRating, director, writers,
    actors, currentCommentEmoji, currentCommentText,
  } = film;

  const currentEmoji = currentCommentEmoji ? currentCommentEmoji : '';
  const currentText = currentCommentText ? currentCommentText : '';

  const {isCommentSaving, isCommentDeleting, idCommentDelete} = state;

  const filmComments = commentsList;

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
           ${isLoadCommentsError ? 'Comments not loaded. Please, reload page' : `Comments <span class="film-details__comments-count">${commentsList.length}</span>`}
        </h3>

       <ul class="film-details__comments-list">
         ${filmComments.map(({id, author, comment, date, emotion}) => `<li class="film-details__comment" data-id="${id}">
           <span class="film-details__comment-emoji">
             <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
           </span>
           <div>
             <p class="film-details__comment-text">${he.encode(comment)}</p>
             <p class="film-details__comment-info">
               <span class="film-details__comment-author">${author}</span>
               <span class="film-details__comment-day">${formatDate(date, 'YYYY/MM/DD HH:mm')}</span>
               <button ${isCommentSaving || isCommentDeleting ? 'disabled' : ''} class="film-details__comment-delete">${isCommentDeleting && idCommentDelete === id ? 'Deleting...' : 'Delete'}</button>
             </p>
           </div>
         </li>`).join('')}

       </ul>


        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${currentEmoji ? `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-smile">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea ${isCommentSaving ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${!currentText ? '' : he.encode(currentText)}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojiList.map((emojiItem) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiItem}" value="${emojiItem}" ${emojiItem === currentCommentEmoji ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-${emojiItem}">
                <img src="./images/emoji/${emojiItem}.png" width="30" height="30" alt="emoji">
              </label>`).join('')}

          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;

};


export default class FilmPopupView extends SmartView {
  // #film = null;
  #comments = null;
  _state = null;


  constructor(film, comments, state) {
    super();
    // this.#film = film;
    this._data = FilmPopupView.parseFilmToData(film);
    this.#comments = comments;
    this._state = state;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._data, this.#comments, this._state);
  }

  get state() {
    return this._state;
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

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
  }

  setDelCommentHandler = (callback) => {
    this._callback.delComment = callback;
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

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#handlerCommentEmojiChange);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#handlerCommentTextInput);
    this.element.addEventListener('keydown', this.#handlerCommentSend);
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#handlerCommentDelete);
  }

  #handlerCommentEmojiChange = (evt) => {
    evt.preventDefault();
    this.updateData({currentCommentEmoji: evt.target.value});
  }

  #handlerCommentTextInput = (evt) => {
    evt.preventDefault();
    this.updateData({currentCommentText: evt.target.value}, true);
  }

  #handlerCommentSend = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {

      if (!this._data.currentCommentEmoji || !this._data.currentCommentText) {
        return;
      }

      const newComment = {
        id: nanoid(),
        comment: this._data.currentCommentText,
        emotion: this._data.currentCommentEmoji,
        //
        date: 1641686983166,
        author: 'Jessica'
      };

      // надо записать новый комментарий
      this._data = FilmPopupView.parseFilmToData(this._data, UserAction.ADD_COMMENT, newComment);
      this._callback.addComment(this._data, newComment);
    }
  }

  #handlerCommentDelete = (evt) => {
    evt.preventDefault();

    //console.log(evt);

    const isDeleteCommentButton = evt.target.classList.contains(deleteCommentButtonClassName);
    if (!isDeleteCommentButton) {
      return;
    }

    const commentIdToDelete = evt.target.closest(`.${commentContainerClassName}`).dataset.id;

    //console.log('commentIdToDelete', commentIdToDelete);

    this._data = FilmPopupView.parseFilmToData(this._data, UserAction.DELETE_COMMENT, commentIdToDelete);

    //console.log(this._data);

    this._callback.delComment(this._data, commentIdToDelete);

  }


  static parseFilmToData = (film, action, comment) => {
    const filmData = {...film};

    if (action === UserAction.ADD_COMMENT) {
      filmData.comments.push(comment);
      delete filmData.currentCommentEmoji;
      delete filmData.currentCommentText;
    }

    if (action === UserAction.DELETE_COMMENT) {
      filmData.comments = [...filmData.comments].filter((commentItem) => commentItem !== comment);
    }


    return filmData;
  }

  static parseDataToFilm = (data) => {
    const film = {...data};


    delete film.currentCommentEmoji;
    // delete film.isRepeating;

    return film;
  }

  shakeElement(commentElementClassName, resetState) {
    const commentElement = this.element.querySelector(commentElementClassName);
    this.shake(commentElement, resetState);
  }

}
