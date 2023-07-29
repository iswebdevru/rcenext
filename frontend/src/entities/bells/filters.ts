import { BellsScheduleVariant } from '@/shared/ui/Select';
import {
  DEFAULT_BELLS_SCHEDULE_TYPE,
  DEFAULT_BELLS_SCHEDULE_VARIANT,
} from './constants';

export function prepareType(data: unknown) {
  return typeof data === 'string' && ['mixed', 'changes', 'main'].includes(data)
    ? data
    : DEFAULT_BELLS_SCHEDULE_TYPE;
}

export function prepareVariant(data: unknown): BellsScheduleVariant {
  return typeof data === 'string' && ['normal', 'reduced'].includes(data)
    ? (data as BellsScheduleVariant)
    : DEFAULT_BELLS_SCHEDULE_VARIANT;
}
