import {
  DEFAULT_CLASSES_SCHEDULE_BLOCK,
  DEFAULT_CLASSES_SCHEDULE_TYPE,
} from './constants';

export function prepareType(data: unknown) {
  return typeof data === 'string' && ['mixed', 'main'].includes(data)
    ? data
    : DEFAULT_CLASSES_SCHEDULE_TYPE;
}

export function prepareBlock(data: unknown) {
  return typeof data === 'string' && ['-1', '6', '1'].includes(data)
    ? data
    : DEFAULT_CLASSES_SCHEDULE_BLOCK;
}
