import AbstractView from './abstract-view.js';

const createFilmsListAllMoviesTemplate = () => `<section class="films-list films-list--all-movies">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;

export default class FilmsListAllMoviesView extends AbstractView{

  get template() {
    return createFilmsListAllMoviesTemplate();
  }

}
