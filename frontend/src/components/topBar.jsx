import { useApp } from '../state/AppContext';
import { FiCommand } from 'react-icons/fi';

export default function TopBar() {
  const { state } = useApp();
  const u = state.auth.user;

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-ink-700 bg-ink-900/60 backdrop-blur">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <FiCommand className="text-accent-cyan" />
        <span className="font-mono">Team Task Manager</span>
      </div>
      {u && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">{u.email}</span>
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-ink-900 font-bold text-sm">
            {(u.name || u.email || '?').slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}
    </header>
  );
}
