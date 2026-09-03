import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '../../../schemas/authSchema';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';

export const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword('demo_token', data.password);
      setIsSuccess(true);
      success('Your password has been reset successfully!', 'Password Updated');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toastError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="card-base p-6 sm:p-8 space-y-6">
      {!isSuccess ? (
        <>
          <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create new password
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your new password must be different from previous passwords
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat new password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Reset Password
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Password Updated!</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Redirecting you to sign in...
          </p>
          <Link to="/login">
            <Button className="w-full">Sign In Now</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
