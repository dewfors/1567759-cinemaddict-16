import {RenderPosition, renderElement, renderTemplate} from './render.js';
import MenuView from './view/menu-view.js';
import SortView from './view/sort-view.js';
import ProfileView from './view/profile-view.js';
import FilmsBoardView from './view/films-board-view.js';
import FilmsListAllMoviesView from './view/films-list-all-movies-view.js';
import FilmsListTopRatedView from './view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from './view/films-list-most-commented-view.js';
import FilmsListContainerView from './view/films-list-container-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FilmsStatisticsView from './view/films-statistics-view.js';
import APIMOCK from './mock/mockService.js';

const API = new APIMOCK();
const films = API.getFilms();

// console.log(films);

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_TOP_RATED = 2;
const FILM_COUNT_MOST_COMMENTED = 2;

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


// All movies
for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderElement(filmsListAllComponent.element, new FilmCardView(films[i]).element, RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  renderElement(filmsListAllMoviesComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener('click', (evt) =>{
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) =>renderElement(filmsListAllComponent.element, new FilmCardView(film).element, RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }

  });

}


// Top rated
// const filmListContainerTopRated = filmListTopRated.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_TOP_RATED; i++) {
  renderElement(filmsListRateComponent.element, new FilmCardView(films[i]).element, RenderPosition.BEFOREEND);
  // renderTemplate(filmListContainerTopRated, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

// Most commented
// const filmListContainerMostCommented = filmListMostCommented.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_MOST_COMMENTED; i++) {
  renderElement(filmsListCommentComponent.element, new FilmCardView(films[i]).element, RenderPosition.BEFOREEND);
  // renderTemplate(filmListContainerMostCommented, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}







// renderTemplate(siteMainElement,createFilmsTemplate(),RenderPosition.BEFOREEND);
//
// const filmsElement = siteMainElement.querySelector('.films');
// const filmListAllMovies = filmsElement.querySelector('.films-list--all-movies');
// const filmListTopRated = filmsElement.querySelector('.films-list--top-rated');
// const filmListMostCommented = filmsElement.querySelector('.films-list--most-commented');

// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const footerStatisticsComponent = new FilmsStatisticsView(films.length);
renderElement(siteFooterStatisticsElement, footerStatisticsComponent.element, RenderPosition.BEFOREEND);

// // Popup
// // const siteBodyElement = document.querySelector('body');
// // renderTemplate(siteBodyElement, createFilmPopupTemplate(films[0]),  RenderPosition.BEFOREEND);
