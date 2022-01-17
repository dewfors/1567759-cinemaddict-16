import SmartView from './smart-view.js';
import {calcChart} from '../utils/statistics.js';
import {getRangUser, getDatePeriod} from '../utils/common.js';
import {DatePeriod} from '../utils/const.js';
import {isDateInRange} from '../utils/date.js';
import {getStatistics, formatNumber, getStringPeriod} from '../utils/utils.js';

const createStatisticsTemplate = (state, films) => {
  const {period, filmsPeriod} = state;
  const filmsCount = films.length;
  const {viewedFilmsCount, totalDuration, topGenre} = getStatistics(filmsPeriod);
  const setChecked = (value) => period === value ? 'checked' : '';


  const createTotalDurationElement = () => totalDuration
    ? `${formatNumber(totalDuration.hours)}<span class="statistic__item-description">h</span> ${formatNumber(totalDuration.minutes)} <span class="statistic__item-description">m</span>`
    : 'No movies';

  const createMenuItemTemplate = (periodItem) => `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${periodItem}" value="${periodItem}" ${setChecked(periodItem)}>
      <label for="statistic-${periodItem}" class="statistic__filters-label">${getStringPeriod(periodItem)}</label>`;

  const createStatisticsElement = () => {
    let statsFiltersElement = '';

    statsFiltersElement = Object.values(DatePeriod)
      .map((periodItem) => createMenuItemTemplate(periodItem))
      .join('');

    return statsFiltersElement;
  };

  return `<section class="statistic">

    ${filmsCount
    ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRangUser(filmsCount)}</span>
    </p>`
    : ''}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${createStatisticsElement()}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${viewedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${createTotalDurationElement()}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : 'No movies'}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;

};

export default class StatisticsView extends SmartView {
  #films = null;
  #state = null;

  constructor(films) {
    super();
    this.#films = films;
    this.#state = {period: DatePeriod.ALL, filmsPeriod: this._getFilmsByPeriod(DatePeriod.ALL, this.#films)};

    this.#setPeriodClickHandler();
    this._calcChart();
  }

  get template() {
    return createStatisticsTemplate(this.#state, this.#films);
  }

  restoreHandlers = () => {
    this.#setPeriodClickHandler();
    this._calcChart();
  }

  _calcChart() {
    const statisticsCtx = this.element.querySelector('.statistic__chart');
    calcChart(statisticsCtx, this.#state);
  }

  _getFilmsByPeriod(period, films) {
    if (period === DatePeriod.ALL) {
      return films.slice();
    }
    const dateFrom = getDatePeriod(period);
    return films.filter((film) => isDateInRange(film.userDetails.watchingDate, dateFrom));
  }

  #setPeriodClickHandler = () => {
    this.element.querySelector('.statistic__filters')
      .addEventListener('click', this.#periodClickHandler);
  }

  #periodClickHandler = (evt) => {
    const target = evt.target;

    if (!target.classList.contains('statistic__filters-input')) {
      return;
    }
    this.updateState({
      period: target.value,
      filmsPeriod: this._getFilmsByPeriod(target.value, this.#films),
    });
  }

  updateState(update) {
    if (!update) {
      return;
    }
    this.#state = {...this.#state, ...update};
    this.updateElement();
  }

}
