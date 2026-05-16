import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiFolder, FiLogOut, FiTerminal } from 'react-icons/fi';
import { useApp } from '../state/AppContext';
import { cx } from '../helpers/classNames';

const navItems = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/workspaces', label: 'Workspaces', icon: FiFolder },
];

export default function SideNav() {
  const { signOut, state } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/signin', { replace: true });
  }

  const u = state.auth.user;

  return (
    <aside className="w-60 flex-shrink-0 border-r border-ink-700 bg-ink-900/40 flex flex-col">
      <div className="h-14 flex items-center gap-2 px-5 border-b border-ink-700">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
          <FiTerminal className="text-ink-900" size={14} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100 leading-tight">Team Task Manager</p>
          <p className="text-[10px] text-slate-500 font-mono leading-tight">v0.1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-ink-700 text-slate-50 border border-ink-600'
                  : 'text-slate-400 hover:bg-ink-800 hover:text-slate-200'
              )
            }
          >
            <it.icon size={16} />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-ink-700">
        {u && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm text-slate-100 truncate">{u.name}</p>
            <p className="text-[11px] text-slate-500 font-mono uppercase">{u.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-ink-800 hover:text-accent-pink transition-colors"
        >
          <FiLogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
