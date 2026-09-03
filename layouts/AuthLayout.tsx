import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { Sparkles, MessageCircle, Heart, Share2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
      {/* Left Feature & Branding Banner (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between overflow-hidden">
        {/* Background glow ambient circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-white text-brand-700 flex items-center justify-center font-black text-xl shadow-lg shadow-black/20">
              P
            </div>
            <span className="text-2xl font-black tracking-tight text-white">{APP_NAME}</span>
          </Link>
        </div>

        {/* Center Visual Content */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Social Network</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Where ideas connect and stories come alive.
          </h1>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
            Experience real-time discussions, rich multimedia posts, dynamic story timelines, and effortless networking designed for the modern creator.
          </p>

          {/* Social Proof stats pill */}
          <div className="pt-4 flex items-center gap-6 text-slate-300 text-xs font-medium">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-400" />
              <span>Real-Time Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Threaded Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Sharing</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-slate-400">
          <p>© 2026 {APP_NAME} Platform, Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Outlet Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              P
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{APP_NAME}</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
