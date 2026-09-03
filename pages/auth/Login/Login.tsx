import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { loginSchema, LoginFormData } from '../../../schemas/authSchema';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      success('Welcome back to Pulse!', 'Logged In');
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError(err.message || 'Invalid email or password');
    }
  };

  const handleFillDemo = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  return (
    <div className="card-base p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Demo Credentials Quick Fill Buttons */}
      <div className="p-3 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Demo Logins</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('alex@example.com')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors shadow-2xs"
          >
            Alex (Architect)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('sarah@example.com')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors shadow-2xs"
          >
            Sarah (Dev)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('elena@example.com')}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors shadow-2xs"
          >
            Elena (Photos)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/30"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};
