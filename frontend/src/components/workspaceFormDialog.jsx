import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from './dialog';

const wsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  description: z.string().max(2000).optional().default(''),
});

export default function WorkspaceFormDialog({ open, onClose, onSubmit, project }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(wsSchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: project?.name || '', description: project?.description || '' });
    }
  }, [open, project, reset]);

  async function submit(v) {
    const res = await onSubmit({ name: v.name.trim(), description: v.description?.trim() || '' });
    if (res?.ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={project ? 'Edit workspace' : 'Create workspace'}
      footer={
        <>
          <button type="button" onClick={onClose} className="sk-btn sk-btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            form="ws-form"
            className="sk-btn sk-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : project ? 'Save' : 'Create'}
          </button>
        </>
      }
    >
      <form id="ws-form" onSubmit={handleSubmit(submit)} className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Name</label>
          <input className="sk-input mt-1" {...register('name')} placeholder="My workspace" />
          {errors.name && <p className="text-xs text-accent-pink mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Description</label>
          <textarea
            className="sk-input mt-1 min-h-[90px] resize-y"
            {...register('description')}
            placeholder="What's this workspace for?"
          />
        </div>
      </form>
    </Dialog>
  );
}
