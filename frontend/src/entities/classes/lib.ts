import { ClassesSchedulePeriod } from '@/shared/api';
import { defaultPeriods } from './constants';

export function withBlankPeriods(periods: ClassesSchedulePeriod[]) {
  return defaultPeriods.map(period => {
    const existing = periods.find(p => p.index === period.index);
    if (existing) {
      return structuredClone(existing);
    }
    return structuredClone(period);
  });
}

// import {
//   API_CLASSES,
//   API_CLASSES_MAIN,
//   WeekDay,
//   WeekType,
//   API_CLASSES_CHANGES,
// } from '@/shared/api';
// import { formatDate } from '@/shared/lib/date';
// import { CollegeBlock } from './ui';

// type GroupQuery = {
//   specialization: string;
//   course: number;
//   index: number;
//   main_block: number;
//   is_commercial: boolean;
// };

// export type ClassesScheduleUrlConfig =
//   | {
//       kind: 'mixed';
//       collegeBlock: CollegeBlock;
//       date: Date;
//     }
//   | {
//       kind: 'changes';
//       collegeBlock: CollegeBlock;
//       date: Date;
//     }
//   | {
//       kind: 'main';
//       collegeBlock: CollegeBlock;
//       weekType: WeekType;
//       weekDay: WeekDay;
//     };

// export function createClassesScheduleUrl(options: ClassesScheduleUrlConfig) {
//   const collegeBlock = options.collegeBlock === -1 ? '' : options.collegeBlock;
//   switch (options.kind) {
//     case 'mixed':
//       return `${API_CLASSES}?block=${collegeBlock}&date=${formatDate(
//         options.date
//       )}`;
//     case 'changes':
//       return `${API_CLASSES_CHANGES}?block=${collegeBlock}&date=${formatDate(
//         options.date
//       )}`;
//     case 'main':
//       return `${API_CLASSES_MAIN}?block=${collegeBlock}&week_type=${options.weekType}&week_day=${options.weekDay}`;
//   }
// }
