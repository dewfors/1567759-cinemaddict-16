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
import {TypeFilmList} from '../utils/const.js';
import {updateItem} from '../utils/common.js';


const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

export default class MainPresenter {
  #mainContainer = null;

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

  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenterAll = new Map();
  #filmPresenterRate = new Map();
  #filmPresenterComment = new Map();

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (films) => {
    this.#films = [...films];
    this.#renderBoard();
  }

  #renderBoard = () => {
    this.#renderMenu();

    if (this.#films.length === 0) {
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
    this.#films = updateItem(this.#films, updatedFilm);

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
    const menuComponent = new MenuView(this.#films);
    render(this.#mainContainer, menuComponent, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {

    console.log(sortType);

    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilmsListAllMovies = () => {
    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#filmsListAllComponent.element, this.#films[i], TypeFilmList.ALL_MOVIES);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;

      this.#renderShowMoreButton();
    }
  }

  #handleShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(this.#filmsListAllComponent.element, film, TypeFilmList.ALL_MOVIES));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListAllMoviesComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsListRateMovies = () => {
    for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
      this.#renderFilm(this.#filmsListRateComponent.element, this.#films[i], TypeFilmList.TOP_RATED);
    }
  }

  #renderFilmsListCommentMovies = () => {
    for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
      this.#renderFilm(this.#filmsListCommentComponent.element, this.#films[i], TypeFilmList.MOST_COMMENTED);
    }
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

}
