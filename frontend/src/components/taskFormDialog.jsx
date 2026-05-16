import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from './dialog';
import { isoToDateInput, dateInputToIso } from '../helpers/dateHelpers';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(4000).optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assigneeId: z.string().optional().default(''),
  dueDate: z.string().optional().default(''),
});

export default function TaskFormDialog({ open, onClose, onSubmit, task, members = [] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'todo',
        priority: task?.priority || 'medium',
        assigneeId: task?.assignee_id || '',
        dueDate: isoToDateInput(task?.due_date),
      });
    }
  }, [open, task, reset]);

  async function submit(v) {
    const payload = {
      title: v.title.trim(),
      description: v.description?.trim() || '',
      status: v.status,
      priority: v.priority,
      assignee_id: v.assigneeId || null,
      due_date: v.dueDate ? dateInputToIso(v.dueDate) : null,
    };
    const result = await onSubmit(payload);
    if (result?.ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={task ? 'Edit task' : 'New task'}
      size="lg"
      footer={
        <>
          <button type="button" onClick={onClose} className="sk-btn sk-btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            className="sk-btn sk-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
          </button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit(submit)} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Title</label>
          <input className="sk-input mt-1" {...register('title')} placeholder="Task title" />
          {errors.title && <p className="text-xs text-accent-pink mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Description</label>
          <textarea
            className="sk-input mt-1 min-h-[80px] resize-y"
            {...register('description')}
            placeholder="Optional details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Status</label>
            <select className="sk-input mt-1" {...register('status')}>
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Priority</label>
            <select className="sk-input mt-1" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Assignee</label>
            <select className="sk-input mt-1" {...register('assigneeId')}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.user_id || m.id} value={m.user_id || m.id}>
                  {m.name || m.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Due date</label>
            <input type="date" className="sk-input mt-1" {...register('dueDate')} />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
