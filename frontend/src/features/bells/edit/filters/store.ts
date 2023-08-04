import { BellsMixed, WeekDay } from '@/shared/api';
import { getAppDate } from '@/shared/lib/date';
import { create } from 'zustand';

export type BellsScheduleEditFiltersStore = {
  type: BellsMixed['type'];
  variant: BellsMixed['variant'];
  date: Date;
  weekDay: WeekDay;

  changeType: (type: BellsMixed['type']) => void;
  changeVariant: (variant: BellsMixed['variant']) => void;
  changeDate: (date: Date) => void;
  changeWeekDay: (weekDay: WeekDay) => void;
};

export const useBellsScheduleEditFiltersStore =
  create<BellsScheduleEditFiltersStore>(set => ({
    date: new Date(getAppDate()),
    type: 'main',
    variant: 'normal',
    weekDay: 'ПН',

    changeDate(date) {
      set({ date });
    },
    changeType(type) {
      set({ type });
    },
    changeVariant(variant) {
      set({ variant });
    },
    changeWeekDay(weekDay) {
      set({ weekDay });
    },
  }));
