import {RenderPosition, renderElement, renderTemplate} from './render.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import ProfileView from './view/profile-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FilmsBoardView from './view/films-board-view.js';
import FilmsListAllMoviesView from './view/films-list-all-movies-view.js';
import FilmsListTopRatedView from './view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from './view/films-list-most-commented-view.js';
import FilmsListContainerView from './view/films-list-container-view.js';


import FilmsStatisticsView from './view/films-statistics-view.js';
// import {createProfileTemplate} from './view/profile-view.js';
// import {createMenuTemplate} from './view/menu-view.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmCardTemplate} from './view/film-card.js';
// import {createFilmPopupTemplate} from './view/film-popup.js';
// import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createFilmsStatisticsTemplate} from './view/films-statistics-view.js';
import APIMOCK from './mock/mockService.js';

const API = new APIMOCK();
const films = API.getFilms();

// console.log(films);

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

// body
const bodyElement = document.querySelector('body');

// Header
const siteHeaderElement = document.querySelector('.header');
const profileComponent = new ProfileView();
renderElement(siteHeaderElement, profileComponent.element, RenderPosition.BEFOREEND);


// Main
const siteMainElement = document.querySelector('.main');
const menuComponent = new MenuView(films);
const sortComponent = new SortView();
renderElement(siteMainElement, menuComponent.element,RenderPosition.BEFOREEND);
renderElement(siteMainElement, sortComponent.element,RenderPosition.BEFOREEND);

const filmsBoardComponent = new FilmsBoardView();
renderElement(siteMainElement, filmsBoardComponent.element, RenderPosition.BEFOREEND);

const filmsListAllMoviesComponent = new FilmsListAllMoviesView();
const filmsListAllComponent = new FilmsListContainerView();
renderElement(filmsBoardComponent.element, filmsListAllMoviesComponent.element, RenderPosition.BEFOREEND);
renderElement(filmsListAllMoviesComponent.element, filmsListAllComponent.element, RenderPosition.BEFOREEND);

const filmsListTopRatedComponent = new FilmsListTopRatedView();
const filmsListRateComponent = new FilmsListContainerView();
renderElement(filmsBoardComponent.element, filmsListTopRatedComponent.element, RenderPosition.BEFOREEND);
renderElement(filmsListTopRatedComponent.element, filmsListRateComponent.element, RenderPosition.BEFOREEND);

const filmsListMostCommentedComponent = new FilmsListMostCommentedView();
const filmsListCommentComponent = new FilmsListContainerView();
renderElement(filmsBoardComponent.element, filmsListMostCommentedComponent.element, RenderPosition.BEFOREEND);
renderElement(filmsListMostCommentedComponent.element, filmsListCommentComponent.element, RenderPosition.BEFOREEND);




// renderTemplate(siteMainElement,createMenuTemplate(films),RenderPosition.BEFOREEND);





renderTemplate(siteMainElement,createFilmsTemplate(),RenderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films');
const filmListAllMovies = filmsElement.querySelector('.films-list--all-movies');
const filmListTopRated = filmsElement.querySelector('.films-list--top-rated');
const filmListMostCommented = filmsElement.querySelector('.films-list--most-commented');

// // All movies
// const filmListContainerAllMovies = filmListAllMovies.querySelector('.films-list__container');
// for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
//   renderTemplate(filmListContainerAllMovies, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
// }
//
// if (films.length > FILM_COUNT_PER_STEP) {
//   let renderedFilmCount = FILM_COUNT_PER_STEP;
//
//   // renderTemplate(filmListAllMovies, createShowMoreButtonTemplate(),  RenderPosition.BEFOREEND);
//   const showMoreButtonComponent = new ShowMoreButtonView();
//
//   //const showMoreButton = filmListAllMovies.querySelector('.films-list__show-more');
//   renderElement(filmListAllMovies, showMoreButtonComponent.element, RenderPosition.BEFOREEND);
//
//   // showMoreButton.addEventListener('click', (evt) =>{
//   showMoreButtonComponent.element.addEventListener('click', (evt) =>{
//     evt.preventDefault();
//     films
//       .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
//       .forEach((film) =>renderTemplate(filmListContainerAllMovies, createFilmCardTemplate(film), RenderPosition.BEFOREEND));
//
//     renderedFilmCount += FILM_COUNT_PER_STEP;
//
//     if (renderedFilmCount >= films.length) {
//       // showMoreButton.remove();
//       showMoreButtonComponent.element.remove();
//       showMoreButtonComponent.removeElement();
//     }
//
//   });
//
// }
//
// // Top rated
// const filmListContainerTopRated = filmListTopRated.querySelector('.films-list__container');
// for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
//   renderTemplate(filmListContainerTopRated, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
// }
//
// // Most commented
// const filmListContainerMostCommented = filmListMostCommented.querySelector('.films-list__container');
// for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
//   renderTemplate(filmListContainerMostCommented, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
// }
//
// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const footerStatisticsComponent = new FilmsStatisticsView(films.length);
renderElement(siteFooterStatisticsElement, footerStatisticsComponent.element, RenderPosition.BEFOREEND);

// // Popup
// // const siteBodyElement = document.querySelector('body');
// // renderTemplate(siteBodyElement, createFilmPopupTemplate(films[0]),  RenderPosition.BEFOREEND);
