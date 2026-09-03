import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Loader } from '../components/common/Loader/Loader';

// Lazy loaded page views for optimal code-splitting and performance
const Home = lazy(() => import('../pages/Home/Home').then((m) => ({ default: m.Home })));
const Explore = lazy(() => import('../pages/Explore/Explore').then((m) => ({ default: m.Explore })));
const Search = lazy(() => import('../pages/Search/Search').then((m) => ({ default: m.Search })));
const Profile = lazy(() => import('../pages/Profile/Profile').then((m) => ({ default: m.Profile })));
const Messages = lazy(() => import('../pages/Messages/Messages').then((m) => ({ default: m.Messages })));
const Notifications = lazy(() => import('../pages/Notifications/Notifications').then((m) => ({ default: m.Notifications })));
const Bookmarks = lazy(() => import('../pages/Bookmarks/Bookmarks').then((m) => ({ default: m.Bookmarks })));
const Settings = lazy(() => import('../pages/Settings/Settings').then((m) => ({ default: m.Settings })));
const Login = lazy(() => import('../pages/auth/Login/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('../pages/auth/Register/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const VerifyEmail = lazy(() => import('../pages/auth/VerifyEmail/VerifyEmail').then((m) => ({ default: m.VerifyEmail })));
const NotFound = lazy(() => import('../pages/NotFound/NotFound').then((m) => ({ default: m.NotFound })));

const SuspenseFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="lg" text="Loading Pulse..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public Authentication Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>
        </Route>

        {/* Protected Core Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
