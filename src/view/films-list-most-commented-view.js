import {createElement} from '../render.js';

const createFilmsListMostCommentedTemplate = () => `<section class="films-list films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
    </section>`;

export default class FilmsListMostCommentedView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListMostCommentedTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
