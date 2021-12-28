import AbstractView from './abstract-view.js';

const createFilmsListTopRatedTemplate = () => `<section class="films-list films-list--extra films-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
    </section>`;

export default class FilmsListTopRatedView extends AbstractView{
  get template() {
    return createFilmsListTopRatedTemplate();
  }
}
