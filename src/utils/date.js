import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MINUTES_IN_HOUR} from './const.js';

dayjs.extend(isBefore);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

export const isDateInRange = (currentDate, dateFrom) => dayjs(dateFrom).isSameOrBefore(currentDate);

export const humanizeDuration = (duration, {asObject = false} = {}) => {
  const hours = Math.trunc(duration / MINUTES_IN_HOUR);
  const minutes = duration % MINUTES_IN_HOUR;
  if (asObject) {
    return {
      hours,
      minutes,
    };
  }
  return `${hours}h ${minutes}m`;
};

export const humanizeTimeFromNow = (date) => {
  return dayjs(date).fromNow();
};
