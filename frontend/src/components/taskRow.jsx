import { FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { fmtDate, isOverdue } from '../helpers/dateHelpers';
import { cx } from '../helpers/classNames';

const STATUS_STYLES = {
  todo: 'bg-slate-500/15 text-slate-300',
  in_progress: 'bg-accent-cyan/15 text-accent-cyan',
  done: 'bg-emerald-500/15 text-emerald-400',
};

const STATUS_LABELS = {
  todo: 'todo',
  in_progress: 'in progress',
  done: 'done',
};

const PRIORITY_STYLES = {
  low: 'bg-slate-500/15 text-slate-400',
  medium: 'bg-amber-500/15 text-amber-300',
  high: 'bg-accent-pink/15 text-accent-pink',
};

export default function TaskRow({ task, users = [], onEdit, onDelete, onStatusChange, canEdit = true, compact = false }) {
  const assignee = users.find((u) => u.id === task.assignee_id);
  const overdue = isOverdue(task);

  return (
    <div className="sk-card p-4 flex items-start gap-4 hover:border-ink-600 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-slate-100 truncate">{task.title}</h4>
          {overdue && (
            <span className="sk-chip bg-accent-pink/15 text-accent-pink">
              <FiAlertTriangle size={10} /> overdue
            </span>
          )}
        </div>
        {!compact && task.description && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-2">{task.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          {onStatusChange && canEdit ? (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className={cx('sk-chip cursor-pointer outline-none border-0', STATUS_STYLES[task.status])}
            >
              <option value="todo">todo</option>
              <option value="in_progress">in progress</option>
              <option value="done">done</option>
            </select>
          ) : (
            <span className={cx('sk-chip', STATUS_STYLES[task.status])}>
              {STATUS_LABELS[task.status]}
            </span>
          )}
          <span className={cx('sk-chip', PRIORITY_STYLES[task.priority])}>{task.priority}</span>
          {task.due_date && (
            <span className="text-slate-500 font-mono">due {fmtDate(task.due_date)}</span>
          )}
          {assignee && (
            <span className="text-slate-500 font-mono">@{assignee.name || assignee.email}</span>
          )}
        </div>
      </div>

      {canEdit && (
        <div className="flex flex-col gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-md text-slate-500 hover:text-accent-cyan hover:bg-ink-700"
              aria-label="Edit"
            >
              <FiEdit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-md text-slate-500 hover:text-accent-pink hover:bg-ink-700"
              aria-label="Delete"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
