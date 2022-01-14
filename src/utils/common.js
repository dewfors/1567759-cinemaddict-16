import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import {Rank, RankLevels, DatePeriod} from './const';

dayjs.extend(duration);

export const formatDate = (value, format = 'YYYY') => dayjs(value).format(format);
export const getTimeDuration = (count, format = 'm') => dayjs.duration(count, format);

export const getRangUser = (filmsCount) => {
  const { NOVICE, FAN } = RankLevels;
  if (!filmsCount) {
    return false;
  }
  if (filmsCount >= NOVICE.min && filmsCount <= NOVICE.max) {
    return Rank.NOVICE;
  } else if (filmsCount >= FAN.min && filmsCount <= FAN.max) {
    return Rank.FAN;
  }

  return Rank.MOVIE_BUFF;
};


export const getSortedGenres = (films) => {
  const genresMap = new Map();
  films.forEach((filmItem) => {
    filmItem.genre.forEach((genre) => {
      const counter = genresMap.get(genre) + 1 || 1;
      genresMap.set(genre, counter);
    });
  });
  return [...genresMap.entries()].sort((a, b) => b[1] - a[1]);
};

export const getDatePeriod = (period) => {
  switch (period) {
    case DatePeriod.TODAY:
      return dayjs().toDate();
    case DatePeriod.WEEK:
      return dayjs().subtract(6, 'day').toDate();
    case DatePeriod.MONTH:
      return dayjs().subtract(1, 'month').toDate();
    case DatePeriod.YEAR:
      return dayjs().subtract(1, 'year').toDate();
  }
};
