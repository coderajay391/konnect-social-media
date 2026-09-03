import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { Button } from '../../../components/common/Button/Button';

export const VerifyEmail: React.FC = () => {
  return (
    <div className="card-base p-6 sm:p-8 space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
        <MailCheck className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Verify your email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          We have sent a verification code to your email address. Click the link in the message to activate your account.
        </p>
      </div>

      <div className="pt-2 space-y-3">
        <Link to="/home">
          <Button className="w-full" size="lg">
            Proceed to Dashboard
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="w-full text-xs">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
};
