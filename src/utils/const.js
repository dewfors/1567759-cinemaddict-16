export const SHORT_DESCRIPTION_MAX_LENGTH = 140;

export const BODY_HIDE_OVERFLOW_CLASS_NAME = 'hide-overflow';

export const MINUTES_IN_HOUR = 60;

export const FilterType = {
  NONE: null,
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const TypeFilmList = {
  ALL_MOVIES: 'all_movies',
  TOP_RATED: 'top_rated',
  MOST_COMMENTED: 'most_commented',
};

export const TypeControls = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITE: 'favorite',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const DatePeriod = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const RankLevels = {
  NOVICE: {
    min: 1,
    max: 10,
  },
  FAN: {
    min: 11,
    max: 20,
  },
};

export const ChartSettings = {
  TYPE: 'horizontalBar',
  DATASETS_BACKGROUND_COLOR: '#ffe800',
  DATASETS_HOVER_BACKGROUND_COLOR: '#ffe800',
  DATASETS_ANCHOR: 'start',
  DATASETS_BAR_THICKNESS: 24,
  OPTIONS_RESPONSIVE: false,
  DATALABELS_FONT_SIZE: 20,
  DATALABELS_COLOR: '#ffffff',
  DATALABELS_ANCHOR: 'start',
  DATALABELS_ALIGN: 'start',
  DATALABELS_OFFSET: 40,
  SCALES_Y_TICKS_FONT_COLOR: '#ffffff',
  SCALES_Y_TICKS_PADDING: 100,
  SCALES_Y_TICKS_FONT_SIZE: 20,
  SCALES_Y_GRIDLINES_DISPLAY: false,
  SCALES_Y_GRIDLINES_DRAW_BORDER: false,
  SCALES_Y_BAR_THICKNESS: 24,
  SCALES_X_TICKS_DISPLAY: false,
  SCALES_X_TICKS_BEGIN_AT_ZERO: true,
  SCALES_X_GRIDLINES_DISPLAY: false,
  SCALES_X_GRIDLINES_DRAW_BORDER: false,
  LEGEND_DISPLAY: false,
  TOOLTIPS_ENABLED: false,
};
