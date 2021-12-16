import {FilterType} from './const.js';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomiseArray = (array, countOfElements) => {
  const copyArray = array.slice();

  const result = [];
  while (copyArray.length > 0) {
    const random = getRandomInteger(0, copyArray.length-1);
    const elem = copyArray.splice(random, 1)[0];
    result.push(elem);
  }

  return result.slice(0, countOfElements);
};


export const filter = {
  [FilterType.ALL]: (films) => films.filter(() => true),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
};
