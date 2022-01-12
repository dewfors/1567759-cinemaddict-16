import AbstractView from './abstract-view.js';
import {filter} from '../utils/utils.js';
import {FilterType} from '../utils/const.js';

const LINK_ACTIVE_CLASS_NAME = 'main-navigation__item--active';

const createFilterCountTemplate = (currentFilter) => {
  const {type, count} = currentFilter;

  return type === FilterType.ALL
    ? ''
    : `<span class="main-navigation__item-count">${count}</span>`;

};

const createMenuItemTemplate = (currentFilter, currentFilterType) => {
  const {type, name} = currentFilter;

  const filterCountTemplate = createFilterCountTemplate(currentFilter);

  return (
    `<a
        href="#${type}"
        class="main-navigation__item ${type === currentFilterType ? LINK_ACTIVE_CLASS_NAME : ''}"
        data-filter="${type}">
        ${name} ${filterCountTemplate}
    </a>`
  );
};

export const createMenuTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems
    .map((currentFilter) => createMenuItemTemplate(currentFilter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    <a href="#stats" class="main-navigation__additional" data-filter="stats">Stats</a>
  </nav>`;


  // const watchlistCount = filter[FilterType.WATCHLIST](films).length;
  // const historyCount = filter[FilterType.HISTORY](films).length;
  // const favoriteCount = filter[FilterType.FAVORITES](films).length;
  //
  // return `<nav class="main-navigation">
  //   <div class="main-navigation__items">
  //     <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  //     <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
  //     <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
  //     <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
  //   </div>
  //   <a href="#stats" class="main-navigation__additional">Stats</a>
  // </nav>`;
};

export default class MenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMenuTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.dataset.filter){
      return;
    }

    const isLinkActive = evt.target.classList.contains(LINK_ACTIVE_CLASS_NAME);
    if (isLinkActive) {
      return;
    }

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }
}
