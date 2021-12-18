import {RenderPosition, render} from './render.js';
import {BODY_HIDE_OVERFLOW_CLASS_NAME} from './utils/const.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import ProfileView from './view/profile-view.js';
import FilmsBoardView from './view/films-board-view.js';
import FilmsListAllMoviesView from './view/films-list-all-movies-view.js';
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

  filmComponent.element.querySelector('.film-card__poster').addEventListener('click', () => {
    showFilmPopup();
  });
  filmComponent.element.querySelector('.film-card__title').addEventListener('click', () => {
    showFilmPopup();
  });
  filmComponent.element.querySelector('.film-card__comments').addEventListener('click', () => {
    showFilmPopup();
  });
  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    hideFilmPopup();
  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
};

// Header
const siteHeaderElement = document.querySelector('.header');
const profileComponent = new ProfileView();
render(siteHeaderElement, profileComponent.element, RenderPosition.BEFOREEND);

// Main
const siteMainElement = document.querySelector('.main');
const menuComponent = new MenuView(films);
const sortComponent = new SortView();
render(siteMainElement, menuComponent.element,RenderPosition.BEFOREEND);
render(siteMainElement, sortComponent.element,RenderPosition.BEFOREEND);

const filmsBoardComponent = new FilmsBoardView();
render(siteMainElement, filmsBoardComponent.element, RenderPosition.BEFOREEND);

const filmsListAllMoviesComponent = new FilmsListAllMoviesView();
const filmsListAllComponent = new FilmsListContainerView();
render(filmsBoardComponent.element, filmsListAllMoviesComponent.element, RenderPosition.BEFOREEND);
render(filmsListAllMoviesComponent.element, filmsListAllComponent.element, RenderPosition.BEFOREEND);

const filmsListTopRatedComponent = new FilmsListTopRatedView();
const filmsListRateComponent = new FilmsListContainerView();
render(filmsBoardComponent.element, filmsListTopRatedComponent.element, RenderPosition.BEFOREEND);
render(filmsListTopRatedComponent.element, filmsListRateComponent.element, RenderPosition.BEFOREEND);

const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
const filmsListCommentComponent = new FilmsListContainerView();
render(filmsBoardComponent.element, filmsListMostCommentedComponent.element, RenderPosition.BEFOREEND);
render(filmsListMostCommentedComponent.element, filmsListCommentComponent.element, RenderPosition.BEFOREEND);


// All movies
for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilm(filmsListAllComponent.element, films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListAllMoviesComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener('click', (evt) =>{
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) =>renderFilm(filmsListAllComponent.element, film));

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

// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const footerStatisticsComponent = new FilmsStatisticsView(films.length);
render(siteFooterStatisticsElement, footerStatisticsComponent.element, RenderPosition.BEFOREEND);
