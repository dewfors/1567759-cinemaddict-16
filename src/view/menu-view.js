import AbstractView from './abstract-view.js';
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

const createMenuAddItemTemplate = (currentFilterType) => {

  const isFilterTypeStats = currentFilterType === FilterType.STATS;

  return (
    `<a
        href="#${FilterType.STATS}"
        class="main-navigation__additional ${isFilterTypeStats ? LINK_ACTIVE_CLASS_NAME : ''}"
        data-filter="stats">
        Stats
    </a>`
  );
};

export const createMenuTemplate = (filterItems, currentFilterType) => {

  const filterItemsTemplate = filterItems
    .map((currentFilter) => createMenuItemTemplate(currentFilter, currentFilterType))
    .join('');

  const filterAddTemplate = createMenuAddItemTemplate(currentFilterType);

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    ${filterAddTemplate}
  </nav>`;

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
