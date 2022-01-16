import {generateFilm} from './film.js';

// const FILMS_COUNT = 27;
const FILMS_COUNT = 3;

export default class mockApi {

  getFilms() {
    return new Array(FILMS_COUNT).fill().map(generateFilm);
  }

}
