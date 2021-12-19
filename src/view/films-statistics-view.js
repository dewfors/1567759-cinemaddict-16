import {createElement} from '../render.js';

const createFilmsStatisticsTemplate = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class FilmsStatisticsView {
  #element = null;
  #filmsCount = null;

  constructor(filmsCount) {
    this.#filmsCount = filmsCount;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsStatisticsTemplate(this.#filmsCount);
  }

  removeElement() {
    this.#element = null;
  }
}
