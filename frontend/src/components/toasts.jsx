import { useApp } from '../state/AppContext';
import { cx } from '../helpers/classNames';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const KIND = {
  success: { cls: 'border-emerald-500/40 text-emerald-300', icon: FiCheckCircle },
  error: { cls: 'border-accent-pink/40 text-accent-pink', icon: FiAlertCircle },
  info: { cls: 'border-accent-cyan/40 text-accent-cyan', icon: FiInfo },
};

export default function Toasts() {
  const { state } = useApp();
  if (!state.toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm">
      {state.toasts.map((t) => {
        const k = KIND[t.kind] || KIND.info;
        const Icon = k.icon;
        return (
          <div
            key={t.id}
            className={cx('sk-card px-4 py-3 flex items-start gap-2 text-sm border', k.cls)}
          >
            <Icon className="mt-0.5 flex-shrink-0" />
            <span className="text-slate-200">{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
