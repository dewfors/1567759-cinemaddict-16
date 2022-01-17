import {RenderPosition, render} from './utils/render.js';
import ProfileView from './view/profile-view.js';
import FilmsStatisticsView from './view/films-statistics-view.js';
import MainPresenter from './presenter/main-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic a67bfj56nkldfvm5k';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

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
  const films = filmsModel.films;
  const footerStatisticsComponent = new FilmsStatisticsView(films.length);
  render(siteFooterStatisticsElement, footerStatisticsComponent, RenderPosition.BEFOREEND);
};

const renderNavigation = () => {
  const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
  filterPresenter.init();
};

renderHeader();

const mainPresenter = new MainPresenter(siteMainElement, filmsModel, filterModel);
mainPresenter.init();

filmsModel.init().finally(() => {
  renderNavigation();
  renderFooter();
});
