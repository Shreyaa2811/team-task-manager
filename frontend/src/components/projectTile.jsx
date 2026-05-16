import { Link } from 'react-router-dom';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

export default function ProjectTile({ project, isAdmin }) {
  return (
    <Link
      to={`/workspaces/${project.id}`}
      className="sk-card p-5 hover:border-accent-cyan/50 transition-all group block"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-100 group-hover:text-accent-cyan transition-colors">
          {project.name}
        </h3>
        {isAdmin && (
          <span className="sk-chip bg-accent-purple/15 text-accent-purple">admin</span>
        )}
      </div>
      <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
        {project.description || <span className="italic text-slate-600">No description</span>}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <FiUsers size={12} /> {project.members?.length || 0} members
        </span>
        <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-cyan" />
      </div>
    </Link>
  );
}
