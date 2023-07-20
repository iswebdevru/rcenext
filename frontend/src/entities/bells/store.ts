import { Reducer, useReducer } from 'react';
import { BellsAction, BellsPeriodEditing } from './types';

const periods: BellsPeriodEditing[] = [
  {
    index: 0,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
  {
    index: 1,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
  {
    index: 2,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
  {
    index: 3,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
  {
    index: 4,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
  {
    index: 5,
    has_break: false,
    period_from: '',
    period_to: '',
    period_from_after: '',
    period_to_after: '',
  },
];

const bellsDispatcher: Reducer<BellsPeriodEditing[], BellsAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'update-one':
      return state.map(period => {
        if (period.index !== action.payload.index) {
          return { ...period };
        }
        return { ...period, ...action.payload };
      });
    case 'load':
      return periods.map(period => {
        const periodFromPayload = action.payload.find(
          periodFromPayload => periodFromPayload.index === period.index,
        );
        if (!periodFromPayload) {
          return period;
        }
        return {
          ...period,
          ...periodFromPayload,
        };
      });
    case 'init':
      return periods;
    default:
      return state;
  }
};

export function useBellsStore() {
  return useReducer(bellsDispatcher, periods);
}
