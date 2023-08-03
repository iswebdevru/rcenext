'use server';

import { cookies } from 'next/headers';
import { Theme } from './types';

export async function changeTheme(theme: Theme) {
  cookies().set('theme', theme);
}
