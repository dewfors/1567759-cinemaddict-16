import dayjs from 'dayjs';

export const sortFilmsByDate = (filmA, filmB) => dayjs(filmB.release.date).diff(dayjs(filmA.release.date));

export const sortFilmsByRating = (objectA, objectB) => {
  const rankA = objectA.totalRating;
  const rankB = objectB.totalRating;

  return rankB - rankA;
};

export const sortFilmsByCommetns = (pictureA, pictureB) => {
  const rankA = pictureA.comments.length;
  const rankB = pictureB.comments.length;

  return rankB - rankA;
};
