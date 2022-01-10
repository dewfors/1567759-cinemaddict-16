import SortView from '../view/sort-view.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';


export default class SortPresenter {
  #container = null;
  #sortComponent = null;
  #changeSort = null;

  constructor(container, changeSort) {
    this.#container = container;
    this.#changeSort = changeSort;
  }

  init = (currentSortType) => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView(currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#changeSort);

    if (prevSortComponent === null) {
      render(this.#container, this.#sortComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);

  }

  destroy = () => {
    remove(this.#sortComponent);
  }


}
