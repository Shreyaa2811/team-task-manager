import { cx } from '../helpers/classNames';

export default function StatBlock({ label, value, icon: Icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-accent-cyan/20 to-transparent text-accent-cyan border-accent-cyan/20',
    purple: 'from-accent-purple/20 to-transparent text-accent-purple border-accent-purple/20',
    pink: 'from-accent-pink/20 to-transparent text-accent-pink border-accent-pink/20',
    slate: 'from-slate-500/15 to-transparent text-slate-300 border-slate-500/20',
  };

  return (
    <div
      className={cx(
        'sk-card p-5 relative overflow-hidden bg-gradient-to-br transition-all duration-200 hover:-translate-y-0.5',
        tones[tone],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-mono">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-ink-900/60">
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
