import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTerminal } from 'react-icons/fi';
import PwInput from '../components/pwInput';
import { useApp } from '../state/AppContext';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function SignIn() {
  const { signIn } = useApp();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  // shouldUnregister: false + no reset() means values stay even after a failed submit
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(v) {
    setServerError(null);
    const r = await signIn(v.email, v.password);
    if (r.ok) {
      navigate('/', { replace: true });
    } else {
      // do NOT clear form values — keep email & password as-is
      setServerError(r.error || 'Sign in failed');
    }
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
          <h2 className="text-lg font-semibold text-slate-100">Sign in</h2>
          <p className="text-sm text-slate-400 mt-1">Welcome back. Authenticate to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Email</label>
              <input
                className="sk-input mt-1"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-accent-pink mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                Password
              </label>
              <PwInput {...register('password')} autoComplete="current-password" className="mt-1" />
              {errors.password && (
                <p className="text-xs text-accent-pink mt-1">{errors.password.message}</p>
              )}
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
              {isSubmitting ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            New here?{' '}
            <Link to="/register" className="sk-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
