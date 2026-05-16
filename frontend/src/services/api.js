import axios from 'axios';
import { readToken, wipeToken } from '../helpers/tokenStore';

const baseURL = 'https://team-task-manager-production-0d38.up.railway.app/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tok = readToken();

  if (tok) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tok}`;
  }

  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {

    if (err?.response?.status === 401) {
      wipeToken();
    }

    return Promise.reject(err);
  }
);

export function explainError(err) {

  if (!err) return 'Something went wrong';

  const d = err?.response?.data?.detail;

  if (typeof d === 'string') return d;

  if (Array.isArray(d) && d.length) {
    return d.map((it) => it?.msg || 'invalid').join(', ');
  }

  if (err.message) return err.message;

  return 'Unexpected error';
}