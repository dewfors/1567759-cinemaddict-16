import MenuView from '../view/menu-view.js';
import {render, RenderPosition} from '../utils/render.js';
import SortView from '../view/sort-view.js';
import FilmsListNoFilmsView from '../view/films-list-no-films-view.js';
import FilmsBoardView from '../view/films-board-view.js';
import FilmsListAllMoviesView from '../view/films-list-all-movies-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from '../utils/const.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

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

  #renderSort = () => {
    // Метод для рендеринга сортировки
    render(this.#mainContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListAllMovies = () => {
    for (let i = 0; i < Math.min(this.#films.length, FILM_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#filmsListAllComponent.element, this.#films[i]);
    }

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;

      this.#renderShowMoreButton();

      // render(this.#filmsListAllMoviesComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

      // this.#showMoreButtonComponent.setClickHandler(() => {
      //   // this.#films
      //   //   .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      //   //   .forEach((film) => this.#renderFilm(this.#filmsListAllComponent.element, film));
      //   //
      //   // this.#renderedFilmCount += FILM_COUNT_PER_STEP;
      //   //
      //   // if (this.#renderedFilmCount >= this.#films.length) {
      //   //   this.#showMoreButtonComponent.element.remove();
      //   //   this.#showMoreButtonComponent.removeElement();
      //   // }
      // });
    }
  }

  #handleShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(this.#filmsListAllComponent.element, film));

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
      this.#renderFilm(this.#filmsListRateComponent.element, this.#films[i]);
    }
  }

  #renderFilmsListCommentMovies = () => {
    for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
      this.#renderFilm(this.#filmsListCommentComponent.element, this.#films[i]);
    }
  }

  #renderFilm = (filmListElement, film) => {
    const filmComponent = new FilmCardView(film);
    const filmPopupComponent = new FilmPopupView(film);

    const showFilmPopup = () => {
      document.body.appendChild(filmPopupComponent.element);
      document.body.classList.add(BODY_HIDE_OVERFLOW_CLASS_NAME);
    };

    const hideFilmPopup = () => {
      document.body.removeChild(filmPopupComponent.element);
      document.body.classList.remove(BODY_HIDE_OVERFLOW_CLASS_NAME);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        hideFilmPopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmComponent.setShowPopupClickHandler(() => {
      showFilmPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    filmPopupComponent.setClosePopupClickHandler(() => {
      hideFilmPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
  }

}
