import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

export const formatDate = (value, format = 'YYYY') => dayjs(value).format(format);
export const getTimeDuration = (count, format = 'm') => dayjs.duration(count, format);
