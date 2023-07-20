import { BellsPeriod } from '@/shared/api';

export type BellsPeriodEditing = {
  index: number;
  has_break: boolean;
  period_from: string;
  period_to: string;
  period_from_after: string;
  period_to_after: string;
};

export type BellsAction =
  | {
      type: 'update-one';
      payload: Partial<BellsPeriodEditing> & { index: number };
    }
  | {
      type: 'load';
      payload: BellsPeriod[];
    }
  | {
      type: 'init';
    };
