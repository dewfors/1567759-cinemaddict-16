import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME, TypeControls, UpdateType, UserAction} from '../utils/const.js';
import {remove} from '../utils/render.js';

export default class FilmPopupPresenter {
  #changeData = null;
  #changeMode = null;
  #clearPopup = null;

  #filmPopupComponent = null;
  #scrollTop = 0;

  #film = null;
  #comments = null;
  #state = null;

  constructor(changeData, changeMode, handlePopupClose) {
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#clearPopup = handlePopupClose;
    this.#scrollTop = 0;
  }

  get film() {
    return this.#film;
  }

  init = (film, comments, state) => {
    this.#film = film;
    this.#comments = comments;
    this.#state = state;

    this.#renderPopup(this.#state);
  }

  #renderPopup = (state) => {
    const prevFilmPopupComponent = this.#filmPopupComponent;
    this.#filmPopupComponent = new FilmPopupView(this.#film, this.#comments, state);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#filmPopupComponent.setControlsClickHandler(this.#handleControlsClick);
    this.#filmPopupComponent.setAddCommentHandler(this.#handleAddComment);
    this.#filmPopupComponent.setDelCommentHandler(this.#handleDelComment);


    if (prevFilmPopupComponent !== null) {
      this.#scrollTop = prevFilmPopupComponent.element.scrollTop;
      remove(prevFilmPopupComponent);
    }

    this.#showFilmPopup();
    this.#filmPopupComponent.element.scrollTop = this.#scrollTop;

  }

  resetView = () => {
    this.#hideFilmPopup();
  }

  #showFilmPopup = () => {
    document.body.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add(BODY_HIDE_OVERFLOW_CLASS_NAME);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #hideFilmPopup = () => {
    if (document.body.contains(this.#filmPopupComponent.element)) {
      document.body.removeChild(this.#filmPopupComponent.element);
      document.body.classList.remove(BODY_HIDE_OVERFLOW_CLASS_NAME);
    }
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#hideFilmPopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#clearPopup();
    }
  };

  #handleShowPopupClick = () => {
    this.#showFilmPopup();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #handleClosePopupClick = () => {
    this.#hideFilmPopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#clearPopup();
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
    this.#changeData (
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: userDetails},
    );
  }

  #setStateCommentSave = (commentEmotion, commentText) => {
    this.#filmPopupComponent.updateState({
      isCommentSaving: true,
      commentText: commentText,
      commentEmotion: commentEmotion,
    });
  }

  #handleAddComment = (data, newComment) => {
    const commentText = newComment.comment;
    const commentEmotion = newComment.emotion;
    this.#setStateCommentSave(commentEmotion, commentText);

    const comment = {comment: newComment.comment, emotion: newComment.emotion};

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {id: this.#film.id, comment: comment},
      {...this.#filmPopupComponent.state},
    );
  }


  #setStateCommentDelete = (commentId) => {
    this.#filmPopupComponent.updateState({
      isCommentDeleting: true,
      idCommentDelete: commentId,
    });
  }

  #handleDelComment = (data, commentId) => {
    this.#setStateCommentDelete(commentId);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {film: data, commentId: commentId},
      {...this.#filmPopupComponent.state},
    );
  }

  shakeCommentElement = (idCommentToDelete = null) => {
    const resetState = () => {
      this.#filmPopupComponent.updateState({
        isCommentSaving: false,
        isCommentDeleting: false,
        idCommentDelete: null,
      });
    };
    const commentElementClassName = idCommentToDelete
      ? `.film-details__comment[data-id='${idCommentToDelete}']`
      : '.film-details__new-comment';
    this.#filmPopupComponent.shakeElement(commentElementClassName, resetState);
  }
}
