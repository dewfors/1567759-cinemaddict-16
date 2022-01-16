import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from "nanoid";
import {getRandomInteger} from "../utils/utils";
import {UpdateType} from "../utils/const";

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;

    // this.#apiService.films.then((films) => {
    //   console.log(films);
    //   console.log(films.map(this.#adaptToClient));
    //   // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
    //   // а ещё на сервере используется snake_case, а у нас camelCase.
    //   // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
    //   // Есть вариант получше - паттерн "Адаптер"
    // });
  }

  // set films(films) {
  //   this.#films = [...films];
  // }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updateFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }

  }

  #adaptToClient = (film) => {

    const adaptedFilm = {
      id: film.id,
      title: film['film_info'].title,
      alternativeTitle: film['film_info']['alternative_title'],
      totalRating: film['film_info']['total_rating'],
      poster: film['film_info'].poster,
      ageRating: film['film_info']['age_rating'],
      director: film['film_info'].director,
      writers: film['film_info'].writers,
      actors: film['film_info'].actors,
      release: {
        date: new Date(film['film_info'].release.date),
        releaseCountry: film['film_info'].release['release_country'],
      },
      runtime: film['film_info'].runtime,
      genre: film['film_info'].genre,
      description: film['film_info'].description,
      comments: film.comments,

      userDetails: {
        watchlist: film['user_details'].watchlist,
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: new Date(film['user_details']['watching_date']),
        favorite: film['user_details'].favorite,
      }
    };


    return adaptedFilm;
  }
}
