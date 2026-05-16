import { api } from './api';

export async function listProjectTasks(projectId, filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.assigneeId) params.assignee_id = filters.assigneeId;
  const { data } = await api.get(`/projects/${projectId}/tasks`, { params });
  return data;
}

export async function listMyTasks() {
  const { data } = await api.get('/tasks/me');
  return data;
}

export async function fetchStats() {
  const { data } = await api.get('/tasks/stats');
  return data;
}

export async function createTask(projectId, payload) {
  const body = {
    title: payload.title,
    description: payload.description || '',
    status: payload.status || 'todo',
    priority: payload.priority || 'medium',
    assignee_id: payload.assignee_id || null,
    due_date: payload.due_date || null,
  };
  const { data } = await api.post(`/projects/${projectId}/tasks`, body);
  return data;
}

export async function patchTask(taskId, payload) {
  // forward only the fields we have
  const body = {};
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.status !== undefined) body.status = payload.status;
  if (payload.priority !== undefined) body.priority = payload.priority;
  if (payload.assignee_id !== undefined) body.assignee_id = payload.assignee_id;
  if (payload.due_date !== undefined) body.due_date = payload.due_date;
  const { data } = await api.patch(`/tasks/${taskId}`, body);
  return data;
}

export async function removeTask(taskId) {
  await api.delete(`/tasks/${taskId}`);
  return taskId;
}
