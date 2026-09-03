import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../../schemas/authSchema';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';

export const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { forgotPassword } = useAuth();
  const { toastError } = useToast() as any;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err: any) {
      if (toastError) toastError(err.message || 'Failed to dispatch reset email');
    }
  };

  return (
    <div className="card-base p-6 sm:p-8 space-y-6">
      {!isSubmitted ? (
        <>
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Forgot password?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your registered email and we'll send you recovery instructions
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check your email</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            We've sent a password reset link to <strong className="text-slate-800 dark:text-slate-200">{submittedEmail}</strong>.
          </p>

          <div className="pt-2">
            <Link to="/reset-password?token=demo_token">
              <Button variant="outline" className="w-full">
                Simulate clicking reset link
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="pt-2 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>
    </div>
  );
};
