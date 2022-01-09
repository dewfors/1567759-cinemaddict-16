import MenuView from '../view/menu-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import SortView from '../view/sort-view.js';
import FilmsListNoFilmsView from '../view/films-list-no-films-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListAllMoviesView from '../view/films-list-all-movies-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmPresenter from './film-presenter';
import {TypeFilmList, SortType} from '../utils/const.js';
import {updateItem} from '../utils/common.js';
import {sortFilmsByDate, sortFilmsByRating} from '../utils/film.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

export default class MainPresenter {
  #mainContainer = null;
  #filmsModel = null;

  #sortComponent = new SortView();
  #filmsComponent = new FilmsBoardView();
  #filmsListAllMoviesComponent = new FilmsListAllMoviesView();
  #filmsListAllComponent = new FilmsListContainerView();
  #filmsListTopRatedComponent = new FilmsListTopRatedView();
  #filmsListRateComponent = new FilmsListContainerView();
  #filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  #filmsListCommentComponent = new FilmsListContainerView();

  #showMoreButtonComponent = new ShowMoreButtonView();

  #noFilmsComponent = new FilmsListNoFilmsView();

  // #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenterAll = new Map();
  #filmPresenterRate = new Map();
  #filmPresenterComment = new Map();

  #currentSortType = SortType.DEFAULT;
  // #sourcedFilms = [];

  constructor(mainContainer, filmsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
  }

  get films() {

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    // this.#films = [...films];
    // this.#sourcedFilms = [...films];
    this.#renderBoard();
  }

  #renderBoard = () => {
    this.#renderMenu();

    if (this.films.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmsBoard();
  }

  #handleModeChange = () => {
    this.#filmPresenterAll.forEach((presenter) => presenter.resetView());
    this.#filmPresenterRate.forEach((presenter) => presenter.resetView());
    this.#filmPresenterComment.forEach((presenter) => presenter.resetView());
  }

  #handleFilmChange = (updatedFilm) => {
    // this.#films = updateItem(this.#films, updatedFilm);
    // this.#sourcedFilms = updateItem(this.#films, updatedFilm);

    // здесь будет вызываться обновление модели

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

  #renderNoFilms = () => {
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

  #renderMenu = () => {


    // Метод для рендеринга меню
    const menuComponent = new MenuView(this.films);
    render(this.#mainContainer, menuComponent, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#renderSort();


    // - Очищаем список
    this.#clearFilmListAllMovies();
    // - Рендерим список заново
    this.#renderFilmsListAllMovies();
  }

  #renderSort = () => {

    this.#sortComponent = new SortView(this.#currentSortType);

    // Метод для рендеринга сортировки
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (filmListElement, film, typeFilmList) => {
    const filmPresenter = new FilmPresenter(filmListElement, this.#handleFilmChange, this.#handleModeChange);
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

    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    this.#renderFilmsAllMovies(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

  }

  #handleShowMoreButtonClick = () => {

    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

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
    // for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
    //   this.#renderFilm(this.#filmsListRateComponent.element, this.#films[i], TypeFilmList.TOP_RATED);
    // }
  }

  #renderFilmsListCommentMovies = () => {
    // for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
    //   this.#renderFilm(this.#filmsListCommentComponent.element, this.#films[i], TypeFilmList.MOST_COMMENTED);
    // }
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
