import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '../../components/common/Button/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-lg">
        <Compass className="w-10 h-10 animate-spin [animation-duration:8s]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Page not found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The link you followed may be broken, or the page may have been removed.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Link to="/home">
          <Button leftIcon={<Home className="w-4 h-4" />}>Back to Feed</Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline">Explore Pulse</Button>
        </Link>
      </div>
    </div>
  );
};
