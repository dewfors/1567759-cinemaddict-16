import AbstractView from './abstract-view.js';

const createFilmsListNoFilmsTemplate = () => `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>

      <!-- todo
        Значение отображаемого текста зависит от выбранного фильтра:
          * All movies – 'There are no movies in our database'
          * Watchlist — 'There are no movies to watch now';
          * History — 'There are no watched movies now';
          * Favorites — 'There are no favorite movies now'.
      -->
    </section>`;

export default class FilmsListNoFilmsView extends AbstractView{
  get template() {
    return createFilmsListNoFilmsTemplate();
  }
}
