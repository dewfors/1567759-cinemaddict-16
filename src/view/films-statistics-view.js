import AbstractView from './abstract-view.js';

const createFilmsStatisticsTemplate = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class FilmsStatisticsView extends AbstractView{
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFilmsStatisticsTemplate(this.#filmsCount);
  }
}
