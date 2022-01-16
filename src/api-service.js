const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });


    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  getComments = async (id) => {
    return this.#load({url: `comments/${id}`})
      .then(ApiService.parseResponse);
  }



  addComment = async (data) => {
    const response = await this.#load({
      url: `comments/${data.id}`,
      method: Method.POST,
      body: JSON.stringify(data.comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    // console.log(data);

    const parsedResponse = await ApiService.parseResponse(response);

    // console.log(parsedResponse);

    return parsedResponse;
  }

  deleteComment = async (data) => {
    const response = await this.#load({
      url: `comments/${data.commentId}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info': {
        'actors': film.actors,
        'age_rating': film.ageRating,
        'alternative_title': film.alternativeTitle,
        'description': film.description,
        'director': film.director,
        'genre': film.genre,
        'poster': film.poster,
        'release': {
          'date': film.release.date.toISOString(),
          'release_country': film.release.releaseCountry,
        },
        'runtime': film.runtime,
        'title': film.title,
        'total_rating': film.totalRating,
        'writers': film.writers,
      },
      'user_details': {
        'already_watched': film.userDetails.alreadyWatched,
        'favorite': film.userDetails.favorite,
        'watching_date': film.userDetails.watchingDate.toISOString(),
        'watchlist': film.userDetails.watchlist,
      },
    };

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
