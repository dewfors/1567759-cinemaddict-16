import AbstractView from './abstract-view.js';

const createLoadingBlock = () => `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>
</section>`;

export default class LoadingView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createLoadingBlock();
  }
}
