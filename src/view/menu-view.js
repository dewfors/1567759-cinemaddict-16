import AbstractView from './abstract-view.js';
import {filter} from '../utils/utils.js';
import {FilterType} from '../utils/const.js';

export const createMenuTemplate = (films) => {
  const watchlistCount = filter[FilterType.WATCHLIST](films).length;
  const historyCount = filter[FilterType.HISTORY](films).length;
  const favoriteCount = filter[FilterType.FAVORITES](films).length;

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MenuView extends AbstractView{
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createMenuTemplate(this.#films);
  }
}
