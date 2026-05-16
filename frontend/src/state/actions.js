// action type constants — keeping them all in one file
export const A = {
  AUTH_BOOT: 'auth/boot',
  AUTH_SET_USER: 'auth/setUser',
  AUTH_CLEAR: 'auth/clear',
  AUTH_LOADING: 'auth/loading',
  AUTH_ERROR: 'auth/error',

  PROJECTS_SET: 'projects/set',
  PROJECTS_UPSERT: 'projects/upsert',
  PROJECTS_REMOVE: 'projects/remove',
  PROJECTS_CURRENT: 'projects/current',

  TASKS_SET_PROJECT: 'tasks/setProject',
  TASKS_UPSERT: 'tasks/upsert',
  TASKS_REMOVE: 'tasks/remove',
  TASKS_SET_MINE: 'tasks/setMine',
  TASKS_SET_STATS: 'tasks/setStats',

  USERS_SET: 'users/set',

  TOAST_PUSH: 'toast/push',
  TOAST_POP: 'toast/pop',
};
