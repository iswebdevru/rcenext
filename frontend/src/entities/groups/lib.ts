import { Group } from '@/shared/api';

export const groupRegExp = /^([А-ЯA-Z]+)(к)?-([1-4])(\d{2,})$/;

export function displayGroupName(group: Group) {
  return `${group.specialization}${group.is_commercial ? 'к' : ''}-${
    group.course
  }${group.index < 10 ? 0 : ''}${group.index}`;
}

export function parseGroupName(group: string): Partial<Group> {
  const parsed = group.match(groupRegExp);
  if (!parsed) {
    /([А-ЯA-Z]+)/;
    throw new Error('Неверное название группы');
  }
  const [_, specialization, isCommercial, course, index] = parsed;
  return {
    specialization,
    is_commercial: !!isCommercial,
    course: parseInt(course),
    index: parseInt(index),
  };
}