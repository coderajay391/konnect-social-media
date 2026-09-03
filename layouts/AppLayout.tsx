import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header/Header';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { RightSidebar } from '../components/layout/RightSidebar/RightSidebar';
import { BottomNavigation } from '../components/layout/BottomNavigation/BottomNavigation';
import { Modal } from '../components/common/Modal/Modal';
import { CreatePost } from '../components/post/CreatePost/CreatePost';

export const AppLayout: React.FC = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const location = useLocation();

  // Hide right sidebar on specific pages like messages or settings for clean spacious experience
  const isMessagingPage = location.pathname.startsWith('/messages');
  const isSettingsPage = location.pathname.startsWith('/settings');
  const showRightSidebar = !isMessagingPage && !isSettingsPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Sticky Header */}
      <Header onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Main Content Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Navigation Sidebar (Desktop & Tablet) */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Sidebar onOpenCreatePost={() => setIsCreatePostOpen(true)} />
          </div>

          {/* Central Main Content Area */}
          <main
            className={
              showRightSidebar
                ? 'col-span-1 md:col-span-9 lg:col-span-6 pb-20 md:pb-8'
                : 'col-span-1 md:col-span-9 lg:col-span-9 pb-20 md:pb-8'
            }
          >
            <Outlet />
          </main>

          {/* Right Sidebar (Desktop only) */}
          {showRightSidebar && (
            <div className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation onOpenCreatePost={() => setIsCreatePostOpen(true)} />

      {/* Global Quick Create Post Modal */}
      <Modal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        title="Create New Post"
        maxWidth="lg"
      >
        <CreatePost onPostCreated={() => setIsCreatePostOpen(false)} />
      </Modal>
    </div>
  );
};
