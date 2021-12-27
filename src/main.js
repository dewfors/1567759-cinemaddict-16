import {RenderPosition, render} from './utils/render.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from './utils/const.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import ProfileView from './view/profile-view.js';
import FilmsBoardView from './view/films-board-view.js';
import FilmsListAllMoviesView from './view/films-list-all-movies-view.js';
import FilmsListNoFilmsView from './view/films-list-no-films-view.js';
import FilmsListTopRatedView from './view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from './view/films-list-most-commented-view.js';
import FilmsListContainerView from './view/films-list-container-view.js';
import FilmCardView from './view/film-card-view.js';
import FilmPopupView from './view/film-popup-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FilmsStatisticsView from './view/films-statistics-view.js';
import APIMOCK from './mock/mockService.js';

const API = new APIMOCK();
const films = API.getFilms();

// console.log(films);

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

// body
const siteBodyElement = document.querySelector('body');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const filmPopupComponent = new FilmPopupView(film);

  const showFilmPopup = () => {
    siteBodyElement.appendChild(filmPopupComponent.element);
    siteBodyElement.classList.add(BODY_HIDE_OVERFLOW_CLASS_NAME);
  };

  const hideFilmPopup = () => {
    siteBodyElement.removeChild(filmPopupComponent.element);
    siteBodyElement.classList.remove(BODY_HIDE_OVERFLOW_CLASS_NAME);
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
};

// Header
const siteHeaderElement = document.querySelector('.header');
const renderHeader = () => {
  const profileComponent = new ProfileView();
  render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
};

// Main
const siteMainElement = document.querySelector('.main');

const renderMainBoard = () => {
  const menuComponent = new MenuView(films);
  const sortComponent = new SortView();
  render(siteMainElement, menuComponent, RenderPosition.BEFOREEND);

  const filmsBoardComponent = new FilmsBoardView();

  const filmsListAllMoviesComponent = new FilmsListAllMoviesView();
  const filmsListAllComponent = new FilmsListContainerView();

  const filmsListTopRatedComponent = new FilmsListTopRatedView();
  const filmsListRateComponent = new FilmsListContainerView();

  const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
  const filmsListCommentComponent = new FilmsListContainerView();

  // All movies
  if (films.length === 0) {
    render(filmsBoardComponent, new FilmsListNoFilmsView(), RenderPosition.AFTERBEGIN);
  } else {
    render(siteMainElement, sortComponent, RenderPosition.BEFOREEND);
    render(siteMainElement, filmsBoardComponent, RenderPosition.BEFOREEND);


    render(filmsBoardComponent, filmsListAllMoviesComponent, RenderPosition.BEFOREEND);
    render(filmsListAllMoviesComponent, filmsListAllComponent, RenderPosition.BEFOREEND);

    render(filmsBoardComponent, filmsListTopRatedComponent, RenderPosition.BEFOREEND);
    render(filmsListTopRatedComponent, filmsListRateComponent, RenderPosition.BEFOREEND);

    render(filmsBoardComponent, filmsListMostCommentedComponent, RenderPosition.BEFOREEND);
    render(filmsListMostCommentedComponent, filmsListCommentComponent, RenderPosition.BEFOREEND);


    for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
      renderFilm(filmsListAllComponent.element, films[i]);
    }

    if (films.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;

      const showMoreButtonComponent = new ShowMoreButtonView();
      render(filmsListAllMoviesComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

      showMoreButtonComponent.setClickHandler(() => {
        films
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmsListAllComponent.element, film));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= films.length) {
          showMoreButtonComponent.element.remove();
          showMoreButtonComponent.removeElement();
        }
      });
    }

    // Top rated
    for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
      renderFilm(filmsListRateComponent.element, films[i]);
    }

    // Most commented
    for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
      renderFilm(filmsListCommentComponent.element, films[i]);
    }
  }
};

// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderFooter = () => {
  const footerStatisticsComponent = new FilmsStatisticsView(films.length);
  render(siteFooterStatisticsElement, footerStatisticsComponent, RenderPosition.BEFOREEND);
};

renderHeader();
renderMainBoard();
renderFooter();
