import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBefore from 'dayjs/plugin/isSameOrBefore';
import {MINUTES_IN_HOUR} from './const.js';

dayjs.extend(isBefore);
dayjs.extend(isSameOrBefore);

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
