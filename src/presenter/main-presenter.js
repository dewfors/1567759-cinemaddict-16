import {render, RenderPosition, remove} from '../utils/render.js';
import LoadingView from '../view/loading-view.js';
import FilmsListNoFilmsView from '../view/films-list-no-films-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListAllMoviesView from '../view/films-list-all-movies-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import StatisticsView from '../view/statistics-view.js';
import FilmPresenter from './film-presenter';
import {TypeFilmList, SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommetns} from '../utils/film.js';
import SortPresenter from './sort-presenter.js';
import {filter} from '../utils/filter.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import {getNewPopupState} from '../utils/popup.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

export default class MainPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #filmsComponent = new FilmsBoardView();
  #filmsListAllMoviesComponent = new FilmsListAllMoviesView();
  #filmsListAllComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListRateComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListCommentComponent = new FilmsListContainerView();

  #showMoreButtonComponent = new ShowMoreButtonView();

  #loadingComponent = new LoadingView();

  #noFilmsComponent = null;
  #statisticsComponent = null;

  #sortPresenter = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenterAll = new Map();
  #filmPresenterRate = new Map();
  #filmPresenterComment = new Map();
  #popupPresenter = null;
  #popupState = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, filmsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  getFilms() {
    this.#filterType = this.#filterModel.filter;

    if (this.#filterType === FilterType.STATS) {
      return [];
    }

    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
  }

  #destroy = () => {
    this.#clearBoard();

    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
      this.#sortPresenter = null;
    }
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.getFilms().length;

    this.#filmPresenterAll.forEach((presenter) => presenter.destroy());
    this.#filmPresenterRate.forEach((presenter) => presenter.destroy());
    this.#filmPresenterComment.forEach((presenter) => presenter.destroy());
    this.#filmPresenterAll.clear();
    this.#filmPresenterRate.clear();
    this.#filmPresenterComment.clear();

    remove(this.#showMoreButtonComponent);
    remove(this.#filmsComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (this.#statisticsComponent) {
      remove(this.#statisticsComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.getFilms().length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmsBoard();
  }

  #renderPopup = (filmId) => {
    const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);

    if (this.#popupPresenter && this.#popupPresenter.film.id !== filmId) {
      this.#popupPresenter.resetView();
    }

    this.#popupPresenter = new FilmPopupPresenter(this.#handleViewAction, this.#handleModeChange, this.#resetPopup);

    this.#filmsModel.getComments(filmId)
      .then((comments) => {
        this.#popupState = getNewPopupState();
        this.#popupPresenter.init(film, comments, this.#popupState);
      })
      .catch(() => {
        this.#popupState = getNewPopupState();
        this.#popupState = {...this.#popupState, isLoadCommentsError: true};
        this.#popupPresenter.init(film, [], this.#popupState);
      });
  }

  #initPopup = () => {
    if (this.#popupPresenter) {
      const filmId = this.#popupPresenter.film.id;
      const film = this.#filmsModel.films.find((filmItem) => filmId === filmItem.id);

      this.#filmsModel.getComments(film.id)
        .then((comments) => {
          this.#popupState = getNewPopupState();
          this.#popupPresenter.init(film, comments, this.#popupState);
        })
        .catch(() => {
          this.#popupState = getNewPopupState();
          this.#popupPresenter.init(film, [], this.#popupState);
        });
    }
  };

  #resetPopup = () => {
    if (!this.#popupPresenter) {
      return;
    }
    this.#popupPresenter = null;
  }

  #handleModeChange = (filmId) => {
    this.#renderPopup(filmId);
  }

  #handleViewAction = async (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#filmsModel.addComment(updateType, update);
        } catch (err) {
          this.#popupPresenter.shakeCommentElement();
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#filmsModel.deleteComment(updateType, update);
          await this.#filmsModel.updateFilm(UpdateType.PATCH, update.film);
        } catch (err) {
          this.#popupPresenter.shakeCommentElement(update.commentId);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    // ?? ?????????????????????? ???? ???????? ?????????????????? ????????????, ?????? ????????????:
    // - PATCH ???????????????? ?????????? ???????????? (????????????????, ?????????? ???????????????????? ??????????????????????)
    // - MINOR ???????????????? ???????????? (????????????????, ?????? ???????????????????? ?? ??????????????????)
    // - MAJOR ???????????????? ?????? ?????????? (?????? ???????????????????????? ??????????????)

    const filterType = this.#filterModel.filter;

    switch (updateType) {
      case UpdateType.PATCH:
        this.#handleFilmChange(data);
        this.#clearFilmListCommentMovies();
        this.#renderFilmsListCommentMovies();
        break;
      case UpdateType.MINOR:
        if (filterType === FilterType.ALL) {
          this.#handleFilmChange(data);
        } else {
          this.#clearBoard();
          this.#renderBoard();
        }
        break;
      case UpdateType.MAJOR:
        if (filterType !== FilterType.STATS) {
          this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
          this.#renderBoard();
        } else {
          this.#destroy();
          this.#renderStatistics();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }

    this.#initPopup();
  }


  #handleFilmChange = (updatedFilm) => {
    if (this.#filmPresenterAll.has(updatedFilm.id)) {
      this.#filmPresenterAll.get(updatedFilm.id).init(updatedFilm);
    }
    if (this.#filmPresenterRate.has(updatedFilm.id)) {
      this.#filmPresenterRate.get(updatedFilm.id).init(updatedFilm);
    }
    if (this.#filmPresenterComment.has(updatedFilm.id)) {
      this.#filmPresenterComment.get(updatedFilm.id).init(updatedFilm);
    }
  }

  #renderLoading = () => {
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new FilmsListNoFilmsView(this.#filterType);
    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);
    render(this.#filmsComponent, this.#noFilmsComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsBoard = () => {
    this.#renderSort();

    render(this.#mainContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    render(this.#filmsComponent, this.#filmsListAllMoviesComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListAllMoviesComponent, this.#filmsListAllComponent, RenderPosition.BEFOREEND);

    render(this.#filmsComponent, this.#filmsListTopRatedComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListTopRatedComponent, this.#filmsListRateComponent, RenderPosition.BEFOREEND);

    render(this.#filmsComponent, this.#filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListMostCommentedComponent, this.#filmsListCommentComponent, RenderPosition.BEFOREEND);

    this.#renderFilmsListAllMovies();
    this.#renderFilmsListRateMovies();
    this.#renderFilmsListCommentMovies();
  }

  #renderStatistics = () => {
    this.#statisticsComponent = new StatisticsView(this.#filmsModel.films);
    render(this.#mainContainer, this.#statisticsComponent, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderSort();

    this.#clearFilmListAllMovies();
    this.#renderFilmsListAllMovies();
  }

  #renderSort = () => {
    if (!this.#sortPresenter) {
      this.#sortPresenter = new SortPresenter(this.#mainContainer, this.#handleSortTypeChange);
    }
    this.#sortPresenter.init(this.#currentSortType);
  }

  #renderFilm = (filmListElement, film, typeFilmList) => {
    const filmPresenter = new FilmPresenter(filmListElement, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(film);

    if (typeFilmList === TypeFilmList.ALL_MOVIES) {
      this.#filmPresenterAll.set(film.id, filmPresenter);
    }
    if (typeFilmList === TypeFilmList.TOP_RATED) {
      this.#filmPresenterRate.set(film.id, filmPresenter);
    }
    if (typeFilmList === TypeFilmList.MOST_COMMENTED) {
      this.#filmPresenterComment.set(film.id, filmPresenter);
    }
  }

  #renderFilmsAllMovies = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmsListAllComponent.element, film, TypeFilmList.ALL_MOVIES));
  }

  #renderFilmsListAllMovies = () => {
    const filmCount = this.getFilms().length;
    const films = this.getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this.#renderFilmsAllMovies(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.getFilms().slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilmsAllMovies(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListAllMoviesComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsListRateMovies = () => {
    const films = this.#filmsModel.films.sort(sortFilmsByRating).slice(0, FILM_COUNT_TOP_RATED);
    films.forEach((film) => this.#renderFilm(this.#filmsListRateComponent.element, film, TypeFilmList.TOP_RATED));
  }

  #renderFilmsListCommentMovies = () => {
    const films = this.#filmsModel.films.sort(sortFilmsByCommetns).slice(0, FILM_COUNT_MOST_COMMENTED);
    films.forEach((film) => this.#renderFilm(this.#filmsListCommentComponent.element, film, TypeFilmList.MOST_COMMENTED));
  }

  #clearFilmListAllMovies = () => {
    this.#filmPresenterAll.forEach((presenter) => presenter.destroy());
    this.#filmPresenterAll.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #clearFilmListRateMovies = () => {
    this.#filmPresenterRate.forEach((presenter) => presenter.destroy());
    this.#filmPresenterRate.clear();
  }

  #clearFilmListCommentMovies = () => {
    this.#filmPresenterComment.forEach((presenter) => presenter.destroy());
    this.#filmPresenterComment.clear();
  }

}
