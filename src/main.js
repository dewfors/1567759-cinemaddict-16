import {RenderPosition, renderTemplate} from './render.js';
import {createProfileTemplate} from './view/profile.js';
import {createSortTemplate} from './view/sort.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createButtonShowMoreTemplate} from './view/button-show-more.js';
import {createFilmsStatisticsTemplate} from './view/films-statistics.js';
import APIMOCK from './mock/mockService.js';

const API = new APIMOCK();
const films = API.getFilms();

console.log(films);

const FILM_COUNT_ALL_MOVIES = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

// Header
const siteHeaderElement = document.querySelector('.header');
renderTemplate(siteHeaderElement, createProfileTemplate(),RenderPosition.BEFOREEND);

// Main
const siteMainElement = document.querySelector('.main');
renderTemplate(siteMainElement,createMenuTemplate(),RenderPosition.BEFOREEND);
renderTemplate(siteMainElement,createSortTemplate(),RenderPosition.BEFOREEND);
renderTemplate(siteMainElement,createFilmsTemplate(),RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
const filmListAllMovies = filmsElement.querySelector('.films-list--all-movies');
const filmListTopRated = filmsElement.querySelector('.films-list--top-rated');
const filmListMostCommented = filmsElement.querySelector('.films-list--most-commented');

// All movies
const filmListContainerAllMovies = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_ALL_MOVIES; i++) {
  renderTemplate(filmListContainerAllMovies, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}
renderTemplate(filmListAllMovies, createButtonShowMoreTemplate(),  RenderPosition.BEFOREEND);

// Top rated
const filmListContainerTopRated = filmListTopRated.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
  renderTemplate(filmListContainerTopRated, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

// Most commented
const filmListContainerMostCommented = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
  renderTemplate(filmListContainerMostCommented, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
renderTemplate(siteFooterStatisticsElement, createFilmsStatisticsTemplate(),  RenderPosition.BEFOREEND);
