import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../utils/const.js';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;

  }


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

  getComments = async (id) => {
    const comments = await this.#apiService.getComments(id);
    return comments;
  }

  addComment = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    try {
      const response = await this.#apiService.addComment(update);
      const updateFilm = this.#adaptToClient(response.movie);

      this.#films = [
        ...this.#films.slice(0, index),
        updateFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updateFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    try {
      await this.#apiService.deleteComment(update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
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
