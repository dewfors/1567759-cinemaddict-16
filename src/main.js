import {RenderPosition, render} from './utils/render.js';
import ProfileView from './view/profile-view.js';
import FilmsStatisticsView from './view/films-statistics-view.js';
import APIMOCK from './mock/mockService.js';
import MainPresenter from './presenter/main-presenter.js';

const API = new APIMOCK();
const films = API.getFilms();
// const films = [];

// console.log(films);

// Header
const siteHeaderElement = document.querySelector('.header');
const renderHeader = () => {
  const profileComponent = new ProfileView();
  render(siteHeaderElement, profileComponent, RenderPosition.BEFOREEND);
};

// Main
const siteMainElement = document.querySelector('.main');

// Footer
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const renderFooter = () => {
  const footerStatisticsComponent = new FilmsStatisticsView(films.length);
  render(siteFooterStatisticsElement, footerStatisticsComponent, RenderPosition.BEFOREEND);
};

renderHeader();

const mainPresenter = new MainPresenter(siteMainElement);
mainPresenter.init(films);

renderFooter();
