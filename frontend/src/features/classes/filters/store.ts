import { SetStateAction } from 'react';
import { create } from 'zustand';

export type ClassesScheduleFiltersStore = {
  date: Date;
  type: 'main' | 'changes' | 'mixed';
  block: number;
  groupName: string;
  cabinet: string;

  changeDate: (state: SetStateAction<Date>) => void;
  changeType: (type: 'main' | 'changes' | 'mixed') => void;
  changeBlock: (block: number) => void;
  changeGroupName: (groupName: string) => void;
  changeCabinet: (cabinet: string) => void;
};

export const useClassesScheduleFiltersStore =
  create<ClassesScheduleFiltersStore>(set => ({
    date: new Date(),
    type: 'mixed',
    block: -1,
    groupName: '',
    cabinet: '',

    changeDate(date) {
      set(prev => {
        const updated = typeof date === 'function' ? date(prev.date) : date;
        return { date: updated };
      });
    },
    changeType(type) {
      set({ type });
    },
    changeBlock(block) {
      set({ block });
    },
    changeCabinet(cabinet) {
      set({ cabinet });
    },
    changeGroupName(groupName) {
      set({ groupName });
    },
  }));
