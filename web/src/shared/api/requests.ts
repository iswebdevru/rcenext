import {
  Subject,
  SubjectCreate,
  SubjectUpdate,
  Teacher,
  TeacherCreate,
  TeacherUpdate,
} from './contracts';
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

export function createTeacher(body: TeacherCreate) {
  return fetcher(`${API}/teachers/`, {
    method: 'POST',
    body: JSON.stringify(body),
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

export async function createSubject(body: SubjectCreate) {
  return fetcher<Subject>(`${API}/subjects/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getSubjects() {
  return fetcher<Subject[]>(`${API}/subjects/`);
}

export async function getSubject(id: number) {
  return fetcher<Subject>(`${API}/subjects/${id}/`);
}

export async function updateSubject(id: number, body: SubjectUpdate) {
  return fetcher<Subject>(`${API}/subjects/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteSubject(id: number) {
  return fetch(`${API}/subjects/${id}/`, {
    method: 'DELETE',
  });
}
