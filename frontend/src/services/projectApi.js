import { api } from './api';

export async function listProjects() {
  const { data } = await api.get('/projects');
  return data;
}

export async function getProject(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data;
}

export async function createProject(body) {
  const { data } = await api.post('/projects', body);
  return data;
}

export async function patchProject(id, body) {
  const { data } = await api.patch(`/projects/${id}`, body);
  return data;
}

export async function removeProject(id) {
  await api.delete(`/projects/${id}`);
  return id;
}

export async function addMember(projectId, userId, role) {
  const { data } = await api.post(`/projects/${projectId}/members`, { user_id: userId, role });
  return data;
}

export async function removeMember(projectId, userId) {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
  return data;
}
