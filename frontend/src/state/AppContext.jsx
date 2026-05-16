import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { A } from './actions';
import { readToken, writeToken, wipeToken } from '../helpers/tokenStore';
import { doLogin, doSignup, fetchMe, fetchUsers } from '../services/authApi';
import {
  listProjects,
  getProject,
  createProject as apiCreateProject,
  patchProject as apiPatchProject,
  removeProject as apiRemoveProject,
  addMember as apiAddMember,
  removeMember as apiRemoveMember,
} from '../services/projectApi';
import {
  listProjectTasks,
  listMyTasks,
  fetchStats,
  createTask as apiCreateTask,
  patchTask as apiPatchTask,
  removeTask as apiRemoveTask,
} from '../services/taskApi';
import { explainError } from '../services/api';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ----- toasts -----
  const pushToast = useCallback((msg, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: A.TOAST_PUSH, payload: { id, msg, kind } });
    setTimeout(() => dispatch({ type: A.TOAST_POP, payload: id }), 3500);
  }, []);

  // ----- session restore -----
  useEffect(() => {
    const tok = readToken();
    if (!tok) {
      dispatch({ type: A.AUTH_BOOT, payload: false });
      return;
    }
    (async () => {
      try {
        const user = await fetchMe();
        dispatch({ type: A.AUTH_SET_USER, payload: { user, token: tok } });
      } catch (e) {
        wipeToken();
        dispatch({ type: A.AUTH_CLEAR });
      } finally {
        dispatch({ type: A.AUTH_BOOT, payload: false });
      }
    })();
  }, []);

  // ----- auth ops -----
  const signIn = useCallback(async (email, password) => {
    try {
      const res = await doLogin({ email, password });
      writeToken(res.token);
      dispatch({ type: A.AUTH_SET_USER, payload: { user: res.user, token: res.token } });
      return { ok: true };
    } catch (e) {
      const msg = explainError(e);
      dispatch({ type: A.AUTH_ERROR, payload: msg });
      return { ok: false, error: msg };
    }
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    try {
      const res = await doSignup({ name, email, password, role });
      writeToken(res.token);
      dispatch({ type: A.AUTH_SET_USER, payload: { user: res.user, token: res.token } });
      return { ok: true };
    } catch (e) {
      const msg = explainError(e);
      dispatch({ type: A.AUTH_ERROR, payload: msg });
      return { ok: false, error: msg };
    }
  }, []);

  const signOut = useCallback(() => {
    wipeToken();
    dispatch({ type: A.AUTH_CLEAR });
  }, []);

  // ----- users -----
  const loadUsers = useCallback(async () => {
    try {
      const u = await fetchUsers();
      dispatch({ type: A.USERS_SET, payload: u });
    } catch (e) {
      pushToast(explainError(e), 'error');
    }
  }, [pushToast]);

  // ----- projects -----
  const loadProjects = useCallback(async () => {
    try {
      const p = await listProjects();
      dispatch({ type: A.PROJECTS_SET, payload: p });
    } catch (e) {
      pushToast(explainError(e), 'error');
    }
  }, [pushToast]);

  const loadProject = useCallback(
    async (id) => {
      try {
        const p = await getProject(id);
        dispatch({ type: A.PROJECTS_CURRENT, payload: p });
        dispatch({ type: A.PROJECTS_UPSERT, payload: p });
        return p;
      } catch (e) {
        pushToast(explainError(e), 'error');
        return null;
      }
    },
    [pushToast]
  );

  const createProject = useCallback(
    async (body) => {
      try {
        const p = await apiCreateProject(body);
        dispatch({ type: A.PROJECTS_UPSERT, payload: p });
        pushToast('Workspace created', 'success');
        return { ok: true, project: p };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const updateProject = useCallback(
    async (id, body) => {
      try {
        const p = await apiPatchProject(id, body);
        dispatch({ type: A.PROJECTS_UPSERT, payload: p });
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const deleteProject = useCallback(
    async (id) => {
      try {
        await apiRemoveProject(id);
        dispatch({ type: A.PROJECTS_REMOVE, payload: id });
        pushToast('Workspace deleted', 'success');
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const addMember = useCallback(
    async (projectId, userId, role) => {
      try {
        const p = await apiAddMember(projectId, userId, role);
        dispatch({ type: A.PROJECTS_UPSERT, payload: p });
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const removeMember = useCallback(
    async (projectId, userId) => {
      try {
        const p = await apiRemoveMember(projectId, userId);
        dispatch({ type: A.PROJECTS_UPSERT, payload: p });
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  // ----- tasks -----
  const loadProjectTasks = useCallback(
    async (projectId, filters) => {
      try {
        const tasks = await listProjectTasks(projectId, filters);
        dispatch({ type: A.TASKS_SET_PROJECT, payload: { projectId, tasks } });
      } catch (e) {
        pushToast(explainError(e), 'error');
      }
    },
    [pushToast]
  );

  const loadMyTasks = useCallback(async () => {
    try {
      const t = await listMyTasks();
      dispatch({ type: A.TASKS_SET_MINE, payload: t });
    } catch (e) {
      pushToast(explainError(e), 'error');
    }
  }, [pushToast]);

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchStats();
      dispatch({ type: A.TASKS_SET_STATS, payload: s });
    } catch (e) {
      pushToast(explainError(e), 'error');
    }
  }, [pushToast]);

  const createTask = useCallback(
    async (projectId, payload) => {
      try {
        const t = await apiCreateTask(projectId, payload);
        dispatch({ type: A.TASKS_UPSERT, payload: t });
        pushToast('Task created', 'success');
        return { ok: true, task: t };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const updateTask = useCallback(
    async (taskId, payload) => {
      try {
        const t = await apiPatchTask(taskId, payload);
        dispatch({ type: A.TASKS_UPSERT, payload: t });
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const deleteTask = useCallback(
    async (taskId, projectId) => {
      try {
        await apiRemoveTask(taskId);
        dispatch({ type: A.TASKS_REMOVE, payload: { taskId, projectId } });
        return { ok: true };
      } catch (e) {
        const msg = explainError(e);
        pushToast(msg, 'error');
        return { ok: false, error: msg };
      }
    },
    [pushToast]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      // auth
      signIn,
      register,
      signOut,
      // toasts
      pushToast,
      // users
      loadUsers,
      // projects
      loadProjects,
      loadProject,
      createProject,
      updateProject,
      deleteProject,
      addMember,
      removeMember,
      // tasks
      loadProjectTasks,
      loadMyTasks,
      loadStats,
      createTask,
      updateTask,
      deleteTask,
    }),
    [
      state,
      signIn,
      register,
      signOut,
      pushToast,
      loadUsers,
      loadProjects,
      loadProject,
      createProject,
      updateProject,
      deleteProject,
      addMember,
      removeMember,
      loadProjectTasks,
      loadMyTasks,
      loadStats,
      createTask,
      updateTask,
      deleteTask,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp must be used inside <AppProvider />');
  return v;
}
