import { A } from './actions';

export const initialState = {
  auth: {
    user: null,
    token: null,
    booting: true, // until we've tried to restore the session
    error: null,
  },
  projects: {
    list: [],
    current: null,
  },
  tasks: {
    byProject: {}, // projectId -> tasks[]
    mine: [],
    stats: null,
  },
  users: [],
  toasts: [],
};

// little helper for upserting by id
function upsert(list, item) {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [item, ...list];
  const cp = list.slice();
  cp[i] = item;
  return cp;
}

export function reducer(state, action) {
  switch (action.type) {
    case A.AUTH_BOOT:
      return { ...state, auth: { ...state.auth, booting: action.payload } };

    case A.AUTH_SET_USER:
      return {
        ...state,
        auth: {
          user: action.payload.user,
          token: action.payload.token ?? state.auth.token,
          booting: false,
          error: null,
        },
      };

    case A.AUTH_CLEAR:
      return {
        ...state,
        auth: { user: null, token: null, booting: false, error: null },
        projects: { list: [], current: null },
        tasks: { byProject: {}, mine: [], stats: null },
        users: [],
      };

    case A.AUTH_ERROR:
      return { ...state, auth: { ...state.auth, error: action.payload, booting: false } };

    case A.PROJECTS_SET:
      return { ...state, projects: { ...state.projects, list: action.payload } };

    case A.PROJECTS_UPSERT: {
      const list = upsert(state.projects.list, action.payload);
      const current =
        state.projects.current && state.projects.current.id === action.payload.id
          ? action.payload
          : state.projects.current;
      return { ...state, projects: { list, current } };
    }

    case A.PROJECTS_REMOVE: {
      const list = state.projects.list.filter((p) => p.id !== action.payload);
      const current =
        state.projects.current && state.projects.current.id === action.payload
          ? null
          : state.projects.current;
      return { ...state, projects: { list, current } };
    }

    case A.PROJECTS_CURRENT:
      return { ...state, projects: { ...state.projects, current: action.payload } };

    case A.TASKS_SET_PROJECT: {
      const { projectId, tasks } = action.payload;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          byProject: { ...state.tasks.byProject, [projectId]: tasks },
        },
      };
    }

    case A.TASKS_UPSERT: {
      const t = action.payload;
      const list = state.tasks.byProject[t.project_id] || [];
      const newList = upsert(list, t);
      const mine = upsert(state.tasks.mine, t);
      return {
        ...state,
        tasks: {
          ...state.tasks,
          byProject: { ...state.tasks.byProject, [t.project_id]: newList },
          mine,
        },
      };
    }

    case A.TASKS_REMOVE: {
      const { taskId, projectId } = action.payload;
      const existing = state.tasks.byProject[projectId] || [];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          byProject: {
            ...state.tasks.byProject,
            [projectId]: existing.filter((t) => t.id !== taskId),
          },
          mine: state.tasks.mine.filter((t) => t.id !== taskId),
        },
      };
    }

    case A.TASKS_SET_MINE:
      return { ...state, tasks: { ...state.tasks, mine: action.payload } };

    case A.TASKS_SET_STATS:
      return { ...state, tasks: { ...state.tasks, stats: action.payload } };

    case A.USERS_SET:
      return { ...state, users: action.payload };

    case A.TOAST_PUSH:
      return { ...state, toasts: [...state.toasts, action.payload] };

    case A.TOAST_POP:
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}
