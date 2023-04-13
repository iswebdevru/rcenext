import { formatDate } from '../lib/date';
import { WeekDay, WeekType } from './contracts';
import { API_CLASSES, API_CLASSES_MAIN } from './urls';

type GroupQuery = {
  specialization: string;
  course: number;
  index: number;
  main_block: number;
  is_commercial: boolean;
};

export type CreateClassesScheduleUrlOptions =
  | {
      withChanges: true;
      date: Date;
      blockType: 1 | 6 | 'all';
      group?: GroupQuery;
    }
  | {
      withChanges: false;
      weekType: WeekType;
      weekDay: WeekDay;
      blockType: 1 | 6 | null;
      group?: GroupQuery;
    };

export function createClassesScheduleUrl(
  options: CreateClassesScheduleUrlOptions
): string | null {
  if (options.blockType === null) {
    return null;
  }
  if (options.withChanges) {
    return `${API_CLASSES}?block=${options.blockType}&date=${formatDate(
      options.date
    )}`;
  }
  return `${API_CLASSES_MAIN}?block=${options.blockType}&week_type=${options.weekType}&week_day=${options.weekDay}`;
}
