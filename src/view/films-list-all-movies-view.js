import {createElement} from '../render.js';

const createFilmsListAllMoviesTemplate = () => `<section class="films-list films-list--all-movies">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;

export default class FilmsListAllMoviesView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListAllMoviesTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
