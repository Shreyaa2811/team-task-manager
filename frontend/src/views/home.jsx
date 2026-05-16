import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCheckCircle,
  FiLoader,
  FiList,
  FiAlertTriangle,
  FiArrowRight,
} from 'react-icons/fi';
import StatBlock from '../components/statBlock';
import TaskRow from '../components/taskRow';
import { useApp } from '../state/AppContext';

export default function Home() {
  const { state, loadStats, loadMyTasks, loadProjects, loadUsers } = useApp();

  // bunch of effects on mount — fine for now
  useEffect(() => {
    loadStats();
    loadMyTasks();
    loadProjects();
    loadUsers();
  }, [loadStats, loadMyTasks, loadProjects, loadUsers]);

  const stats = state.tasks.stats || { total: 0, todo: 0, in_progress: 0, done: 0, overdue: 0 };
  const recent = (state.tasks.mine || [])
    .slice()
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 8);

  const projById = {};
  for (const p of state.projects.list) projById[p.id] = p;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <p className="text-xs font-mono text-accent-cyan uppercase tracking-wider">
          // overview
        </p>
        <h1 className="text-2xl font-bold text-slate-100 mt-1">
          Hey {state.auth.user?.name?.split(' ')[0] || 'there'}.
        </h1>
        <p className="text-sm text-slate-400 mt-1">Here's where your tasks stand right now.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBlock label="Total" value={stats.total} icon={FiList} tone="slate" />
        <StatBlock label="In progress" value={stats.in_progress} icon={FiLoader} tone="cyan" />
        <StatBlock label="Done" value={stats.done} icon={FiCheckCircle} tone="purple" />
        <StatBlock label="Overdue" value={stats.overdue} icon={FiAlertTriangle} tone="pink" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-100">Recent tasks</h2>
          <Link to="/workspaces" className="sk-link text-sm flex items-center gap-1">
            All workspaces <FiArrowRight size={12} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="sk-card p-10 text-center">
            <p className="text-sm text-slate-400">
              No tasks yet. Spin up a workspace and add one.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((t) => (
              <div key={t.id} className="relative">
                <TaskRow task={t} users={state.users} canEdit={false} compact />
                {projById[t.project_id] && (
                  <Link
                    to={`/workspaces/${t.project_id}`}
                    className="absolute top-3 right-4 text-[11px] font-mono text-slate-500 hover:text-accent-cyan"
                  >
                    {projById[t.project_id].name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
