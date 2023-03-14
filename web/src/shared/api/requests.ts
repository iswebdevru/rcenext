import { Teacher, TeacherAdd, TeacherUpdate } from './contracts';
import { fetcher } from './fetcher';

const API = 'http://localhost:8000';

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

export async function updateTeacher(id: number, body: TeacherUpdate) {
  return fetcher(`${API}/teachers/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
