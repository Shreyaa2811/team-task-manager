import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiPlus,
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiUserMinus,
} from 'react-icons/fi';
import TaskRow from '../components/taskRow';
import TaskFormDialog from '../components/taskFormDialog';
import WorkspaceFormDialog from '../components/workspaceFormDialog';
import Dialog from '../components/dialog';
import { useApp } from '../state/AppContext';
import { cx } from '../helpers/classNames';

const STATUS_OPTIONS = [
  { v: '', label: 'All' },
  { v: 'todo', label: 'Todo' },
  { v: 'in_progress', label: 'In progress' },
  { v: 'done', label: 'Done' },
];

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state,
    loadProject,
    loadProjectTasks,
    loadUsers,
    createTask,
    updateTask,
    deleteTask,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('');
  const [taskDialog, setTaskDialog] = useState({ open: false, task: null });
  const [wsDialog, setWsDialog] = useState(false);
  const [memberDialog, setMemberDialog] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null); // { kind, target }
  const [newMember, setNewMember] = useState({ userId: '', role: 'member' });

  useEffect(() => {
    loadProject(id);
    loadUsers();
  }, [id, loadProject, loadUsers]);

  useEffect(() => {
    loadProjectTasks(id, { status: statusFilter || undefined });
  }, [id, statusFilter, loadProjectTasks]);

  const project = state.projects.current && state.projects.current.id === id
    ? state.projects.current
    : state.projects.list.find((p) => p.id === id);

  const tasks = state.tasks.byProject[id] || [];
  const me = state.auth.user;

  const myProjectRole = useMemo(() => {
    if (!project || !me) return null;
    if (project.owner_id === me.id) return 'admin';
    const m = (project.members || []).find((x) => x.user_id === me.id);
    return m?.role || null;
  }, [project, me]);

  const isAdmin = myProjectRole === 'admin';

  const memberIds = new Set((project?.members || []).map((m) => m.user_id));
  const addableUsers = state.users.filter((u) => !memberIds.has(u.id));

  async function handleSubmitTask(payload) {
    if (taskDialog.task) {
      return await updateTask(taskDialog.task.id, payload);
    }
    return await createTask(id, payload);
  }

  async function handleStatusChange(task, newStatus) {
    await updateTask(task.id, { status: newStatus });
  }

  async function handleDeleteTask() {
    if (!confirmDel || confirmDel.kind !== 'task') return;
    await deleteTask(confirmDel.target.id, id);
    setConfirmDel(null);
  }

  async function handleDeleteWorkspace() {
    if (!confirmDel || confirmDel.kind !== 'workspace') return;
    const r = await deleteProject(id);
    setConfirmDel(null);
    if (r.ok) navigate('/workspaces', { replace: true });
  }

  async function handleAddMember(e) {
    e?.preventDefault?.();
    if (!newMember.userId) return;
    const r = await addMember(id, newMember.userId, newMember.role);
    if (r.ok) {
      setNewMember({ userId: '', role: 'member' });
      setMemberDialog(false);
    }
  }

  if (!project) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Link to="/workspaces" className="sk-link text-sm inline-flex items-center gap-1">
          <FiArrowLeft size={14} /> Back to workspaces
        </Link>
        <div className="sk-card p-10 mt-4 text-center text-slate-400">Loading workspace...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <Link
        to="/workspaces"
        className="sk-link text-xs inline-flex items-center gap-1 font-mono uppercase"
      >
        <FiArrowLeft size={12} /> Workspaces
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-100 truncate">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="sk-chip bg-ink-700 text-slate-300">role: {myProjectRole || 'guest'}</span>
            <span>{project.members?.length || 0} members</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setWsDialog(true)} className="sk-btn sk-btn-ghost">
              <FiEdit2 size={14} /> Edit
            </button>
            <button
              onClick={() => setConfirmDel({ kind: 'workspace', target: project })}
              className="sk-btn sk-btn-danger"
            >
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* tasks column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-ink-900/60 p-1 rounded-lg border border-ink-700">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.v || 'all'}
                  onClick={() => setStatusFilter(opt.v)}
                  className={cx(
                    'px-3 py-1 text-xs rounded-md font-medium transition-colors',
                    statusFilter === opt.v
                      ? 'bg-ink-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTaskDialog({ open: true, task: null })}
              className="sk-btn sk-btn-primary"
            >
              <FiPlus /> New task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="sk-card p-10 text-center">
              <p className="text-slate-300 font-semibold">No tasks here yet</p>
              <p className="text-sm text-slate-500 mt-2">
                {statusFilter ? 'Try clearing the filter, or' : 'Get going by'} creating one.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  users={state.users}
                  canEdit={true}
                  onEdit={(task) => setTaskDialog({ open: true, task })}
                  onDelete={(task) => setConfirmDel({ kind: 'task', target: task })}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* members column */}
        <aside className="space-y-3">
          <div className="sk-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-100 font-mono uppercase">
                Members
              </h3>
              {isAdmin && (
                <button
                  onClick={() => setMemberDialog(true)}
                  className="sk-btn sk-btn-ghost text-xs py-1 px-2"
                >
                  <FiUserPlus size={12} /> Add
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {(project.members || []).map((m) => (
                <li
                  key={m.user_id}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-ink-800"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-slate-100 truncate">
                      {m.name || m.email || m.user_id}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {m.role}
                      {project.owner_id === m.user_id ? ' · owner' : ''}
                    </p>
                  </div>
                  {isAdmin && project.owner_id !== m.user_id && (
                    <button
                      onClick={() => removeMember(id, m.user_id)}
                      className="p-1 text-slate-500 hover:text-accent-pink"
                      aria-label="Remove"
                    >
                      <FiUserMinus size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* dialogs */}
      <TaskFormDialog
        open={taskDialog.open}
        onClose={() => setTaskDialog({ open: false, task: null })}
        onSubmit={handleSubmitTask}
        task={taskDialog.task}
        members={project.members || []}
      />

      <WorkspaceFormDialog
        open={wsDialog}
        onClose={() => setWsDialog(false)}
        onSubmit={(body) => updateProject(id, body)}
        project={project}
      />

      <Dialog
        open={memberDialog}
        onClose={() => setMemberDialog(false)}
        title="Add member"
        footer={
          <>
            <button
              type="button"
              onClick={() => setMemberDialog(false)}
              className="sk-btn sk-btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-member-form"
              className="sk-btn sk-btn-primary"
              disabled={!newMember.userId}
            >
              Add
            </button>
          </>
        }
      >
        <form id="add-member-form" onSubmit={handleAddMember} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">User</label>
            <select
              className="sk-input mt-1"
              value={newMember.userId}
              onChange={(e) => setNewMember((s) => ({ ...s, userId: e.target.value }))}
            >
              <option value="">Pick a user...</option>
              {addableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.email}
                </option>
              ))}
            </select>
            {addableUsers.length === 0 && (
              <p className="text-xs text-slate-500 mt-1">No more users available to add.</p>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Role</label>
            <select
              className="sk-input mt-1"
              value={newMember.role}
              onChange={(e) => setNewMember((s) => ({ ...s, role: e.target.value }))}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title={confirmDel?.kind === 'workspace' ? 'Delete workspace?' : 'Delete task?'}
        size="sm"
        footer={
          <>
            <button onClick={() => setConfirmDel(null)} className="sk-btn sk-btn-ghost">
              Cancel
            </button>
            <button
              onClick={
                confirmDel?.kind === 'workspace' ? handleDeleteWorkspace : handleDeleteTask
              }
              className="sk-btn sk-btn-danger"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          {confirmDel?.kind === 'workspace'
            ? 'This will permanently remove the workspace and all its tasks.'
            : `This will permanently remove "${confirmDel?.target?.title}".`}
        </p>
      </Dialog>
    </div>
  );
}
