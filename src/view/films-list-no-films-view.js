import AbstractView from './abstract-view.js';
import {FilterType} from '../utils/const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createFilmsListNoFilmsTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return `<section class="films-list">
      <h2 class="films-list__title">${noFilmsTextValue}</h2>

      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->
    </section>`;
};

export default class FilmsListNoFilmsView extends AbstractView{

  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createFilmsListNoFilmsTemplate(this._data);
  }
}
