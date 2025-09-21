import { DateTime } from 'luxon';
import { constant } from '@src/core/configurations/constants';
import { IWeek } from '@src/core/interfaces/datetime.interface';

export const datetime = DateTime.local().setLocale(constant.date.locale);

export const getWeek = (from: string): IWeek => {
  let today: any = datetime;
  if (from) {
    today = DateTime.fromFormat(from, constant.date.format).setLocale(constant.date.locale);
  }
  const firstDay = today.startOf('week');
  const lastDay = firstDay.plus({days: 6});

  return {
    firstDay: firstDay.toFormat(constant.date.format),
    lastDay: lastDay.toFormat(constant.date.format),
    today: today.toFormat(constant.date.format),
  };
};

export const getDayWeek = (date: string): string => {
  return DateTime
  .fromFormat(date, constant.date.format, { locale: constant.date.locale })
  .toFormat(constant.date.formatDayOfWeek);
};

export const getToday = () => {
  return datetime.toFormat(constant.date.format);
};
export const toFormat = (date: Date, format: string): string => {
  return DateTime.fromJSDate(date).toFormat(format, {locale: 'es'});
};
export const isToday = (date: Date): boolean => {
  const today = getToday();
  const dateTime = DateTime.fromJSDate(date).toFormat(constant.date.format);
 
  return today === dateTime;
};

export const isOneDayOld = (date: Date): boolean => {
  const now = DateTime.now();
  const createdAt = DateTime.fromJSDate(date);
  const oneDayOld = now.minus({ hours: 24 });

  return createdAt >= oneDayOld && createdAt <= now;
}
