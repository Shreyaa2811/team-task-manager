// date helpers — kept small, no external date lib

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fmtDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// returns true if due_date is in the past AND status is not done
export function isOverdue(task) {
  if (!task || !task.due_date) return false;
  if (task.status === 'done') return false;
  const d = new Date(task.due_date);
  if (isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}

// convert a yyyy-mm-dd from a date input into an ISO string for the API
export function dateInputToIso(val) {
  if (!val) return null;
  // input is like "2025-05-15"; convert to UTC midnight
  const d = new Date(val + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

// reverse — pull yyyy-mm-dd out of an ISO string for prefilling an input
export function isoToDateInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
