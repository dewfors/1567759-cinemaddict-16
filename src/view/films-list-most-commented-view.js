import AbstractView from './abstract-view.js';

const createFilmsListMostCommentedTemplate = () => `<section class="films-list films-list--extra films-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
    </section>`;

export default class FilmsListMostCommentedView extends AbstractView{
  get template() {
    return createFilmsListMostCommentedTemplate();
  }
}
