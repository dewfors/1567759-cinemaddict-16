import {RenderPosition, renderElement, renderTemplate} from './render.js';
import SortView from './view/sort-view.js';
import {createProfileTemplate} from './view/profile.js';
import {createSortTemplate} from './view/sort-view.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createFilmPopupTemplate} from './view/film-popup.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsStatisticsTemplate} from './view/films-statistics.js';
import APIMOCK from './mock/mockService.js';

const API = new APIMOCK();
const films = API.getFilms();

// console.log(films);

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

// Header
const siteHeaderElement = document.querySelector('.header');
renderTemplate(siteHeaderElement, createProfileTemplate(),RenderPosition.BEFOREEND);

// Main
const siteMainElement = document.querySelector('.main');
renderTemplate(siteMainElement,createMenuTemplate(films),RenderPosition.BEFOREEND);
// renderTemplate(siteMainElement,createSortTemplate(),RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().element,RenderPosition.BEFOREEND);
renderTemplate(siteMainElement,createFilmsTemplate(),RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
const filmListAllMovies = filmsElement.querySelector('.films-list--all-movies');
const filmListTopRated = filmsElement.querySelector('.films-list--top-rated');
const filmListMostCommented = filmsElement.querySelector('.films-list--most-commented');

// All movies
const filmListContainerAllMovies = filmListAllMovies.querySelector('.films-list__container');
for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmListContainerAllMovies, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderTemplate(filmListAllMovies, createShowMoreButtonTemplate(),  RenderPosition.BEFOREEND);

  const showMoreButton = filmListAllMovies.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) =>{
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) =>renderTemplate(filmListContainerAllMovies, createFilmCardTemplate(film), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }

  });

}

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
renderTemplate(siteFooterStatisticsElement, createFilmsStatisticsTemplate(films.length),  RenderPosition.BEFOREEND);


// Popup
// const siteBodyElement = document.querySelector('body');
// renderTemplate(siteBodyElement, createFilmPopupTemplate(films[0]),  RenderPosition.BEFOREEND);
