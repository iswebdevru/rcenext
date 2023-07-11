import { ClassesDataWithDraft, ClassesPartialPeriod } from './types';

export type ClassesType = 'main' | 'changes' | 'mixed';

export const defaultPeriods: ClassesPartialPeriod[] = [
  { index: 0, subject: null, cabinet: '', teachers: [] },
  { index: 1, subject: null, cabinet: '', teachers: [] },
  { index: 2, subject: null, cabinet: '', teachers: [] },
  { index: 3, subject: null, cabinet: '', teachers: [] },
  { index: 4, subject: null, cabinet: '', teachers: [] },
  { index: 5, subject: null, cabinet: '', teachers: [] },
  { index: 6, subject: null, cabinet: '', teachers: [] },
  { index: 7, subject: null, cabinet: '', teachers: [] },
];

export const defaultClassesDataWithHistory: ClassesDataWithDraft = {
  init: {
    view: 'table',
    message: '',
    periods: structuredClone(defaultPeriods),
  },
  draft: {
    view: 'table',
    message: '',
    periods: structuredClone(defaultPeriods),
  },
};
