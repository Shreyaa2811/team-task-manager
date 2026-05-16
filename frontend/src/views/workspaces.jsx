import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import ProjectTile from '../components/projectTile';
import WorkspaceFormDialog from '../components/workspaceFormDialog';
import { useApp } from '../state/AppContext';

export default function Workspaces() {
  const { state, loadProjects, createProject } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const me = state.auth.user;

  function isAdminOfProject(p) {
    if (!me) return false;
    if (p.owner_id === me.id) return true;
    return (p.members || []).some((m) => m.user_id === me.id && m.role === 'admin');
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-accent-cyan uppercase tracking-wider">// workspaces</p>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">All workspaces</h1>
          <p className="text-sm text-slate-400 mt-1">
            Projects you belong to. Click to dive in.
          </p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="sk-btn sk-btn-primary">
          <FiPlus /> New workspace
        </button>
      </div>

      {state.projects.list.length === 0 ? (
        <div className="sk-card p-12 text-center">
          <p className="text-slate-300 font-semibold">No workspaces yet</p>
          <p className="text-sm text-slate-500 mt-2">
            Create your first workspace to start grouping tasks.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="sk-btn sk-btn-primary mt-5 mx-auto"
          >
            <FiPlus /> Create workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.projects.list.map((p) => (
            <ProjectTile key={p.id} project={p} isAdmin={isAdminOfProject(p)} />
          ))}
        </div>
      )}

      <WorkspaceFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={createProject}
      />
    </div>
  );
}
