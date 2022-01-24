import {getSortedGenres} from './common.js';
import {humanizeDuration} from './date.js';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getStatistics = (films) => {
  const viewedFilmsCount = films.length;
  if (viewedFilmsCount === 0) {
    return {
      viewedFilmsCount: 0,
      totalDuration: false,
      topGenre: false,
    };
  }

  const totalDuration = films.reduce((duration, filmItem) => duration + filmItem.runtime, 0);
  const topGenre = getSortedGenres(films)[0][0];
  return {
    viewedFilmsCount,
    totalDuration: humanizeDuration(totalDuration, {asObject: true}),
    topGenre,
  };
};

export const formatNumber = (number) => {
  if (number < 10) {
    number = `0${number.toString()}`;
  }
  return number;
};

export const getStringPeriod = (period) => (period[0].toUpperCase() + period.slice(1)).replace(/-/g, ' ');
