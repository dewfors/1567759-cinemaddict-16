import {generateFilm} from './film.js';

const FILMS_COUNT = 27;

export default class mockApi {

  getFilms() {
    return new Array(FILMS_COUNT).fill().map(generateFilm);
  }

}
