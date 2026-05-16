import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTerminal } from 'react-icons/fi';
import PwInput from '../components/pwInput';
import { useApp } from '../state/AppContext';

const regSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['admin', 'member']),
});

export default function Register() {
  const { register: signupAction } = useApp();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(regSchema),
    defaultValues: { name: '', email: '', password: '', role: 'member' },
  });

  async function onSubmit(v) {
    setServerError(null);
    const r = await signupAction(v.name, v.email, v.password, v.role);
    if (r.ok) navigate('/', { replace: true });
    else setServerError(r.error || 'Signup failed');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <FiTerminal className="text-ink-900" />
          </div>
          <h1 className="text-xl font-bold text-slate-100 font-mono">Team Task Manager</h1>
        </div>

        <div className="sk-card p-7">
          <h2 className="text-lg font-semibold text-slate-100">Create account</h2>
          <p className="text-sm text-slate-400 mt-1">Spin up a new identity in seconds.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Name</label>
              <input className="sk-input mt-1" {...register('name')} autoComplete="name" />
              {errors.name && (
                <p className="text-xs text-accent-pink mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="sk-input mt-1"
                {...register('email')}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-accent-pink mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Password</label>
              <PwInput {...register('password')} autoComplete="new-password" className="mt-1" />
              {errors.password && (
                <p className="text-xs text-accent-pink mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Role</label>
              <select className="sk-input mt-1" {...register('role')}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {serverError && (
              <div className="text-sm text-accent-pink bg-accent-pink/10 border border-accent-pink/30 rounded-lg px-3 py-2">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="sk-btn sk-btn-primary w-full justify-center"
            >
              {isSubmitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Already registered?{' '}
            <Link to="/signin" className="sk-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
