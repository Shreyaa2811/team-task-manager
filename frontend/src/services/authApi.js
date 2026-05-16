import { api } from './api';

export async function doSignup({ name, email, password, role }) {
  const { data } = await api.post('/auth/signup', { name, email, password, role });
  return data; // { user, token }
}

export async function doLogin({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data;
}
