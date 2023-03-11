import { API, Teacher, TeacherAdd } from './contracts';
import { fetcher } from './fetch';

export async function getTeachers() {
  return fetcher<Teacher[]>(`${API}/teachers/`);
}

export async function getTeacher(id: number) {
  return fetcher<Teacher>(`${API}/teachers/${id}/`);
}

export async function deleteTeacher(id: number) {
  return fetch(`${API}/teachers/${id}/`, {
    method: 'DELETE',
  });
}

export function createTeacher(payload: TeacherAdd) {
  return fetcher(`${API}/teachers/`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
