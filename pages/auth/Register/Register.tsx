import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, AtSign, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../../../schemas/authSchema';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/common/Input/Input';
import { Button } from '../../../components/common/Button/Button';

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      success('Welcome to Pulse! Your account is created.', 'Registration Successful');
      navigate('/home', { replace: true });
    } catch (err: any) {
      toastError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="card-base p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create an account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Join the community to start connecting and sharing
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            leftIcon={<UserIcon className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Username"
            placeholder="janedoe"
            leftIcon={<AtSign className="w-4 h-4" />}
            error={errors.username?.message}
            {...register('username')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
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

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repeat password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="space-y-1">
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500/30"
              {...register('agreeToTerms')}
            />
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-500 font-medium">{errors.agreeToTerms.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
