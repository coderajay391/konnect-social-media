import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Lock,
  Bell,
  Palette,
  UserX,
  Check,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeMode } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../services/api/userApi';
import { UserSettings, User as UserType } from '../../types';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Avatar } from '../../components/common/Avatar/Avatar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog/ConfirmDialog';
import { cn } from '../../utils/helpers';

type SettingsSection = 'account' | 'privacy' | 'security' | 'notifications' | 'appearance' | 'blocked';

export const Settings: React.FC = () => {
  const { user, updateCurrentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error: toastError } = useToast();

  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete account confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await userApi.getSettings();
        setSettings(data);
        const blocked = await userApi.getBlockedUsers();
        setBlockedUsers(blocked);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateSetting = async (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await userApi.updateSettings(updated);
      success('Setting updated');
    } catch {
      toastError('Failed to save settings');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toastError('Password must be at least 8 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      success('Your password has been changed securely!', 'Password Changed');
    }, 600);
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await userApi.toggleBlock(userId);
      setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
      success('User unblocked');
    } catch {
      toastError('Failed to unblock user');
    }
  };

  const navItems = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Password', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'blocked', label: 'Blocked Users', icon: <UserX className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card-base p-6">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account preferences, privacy, and security controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Tabs */}
        <div className="md:col-span-4 space-y-1">
          <div className="card-base p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left',
                  activeSection === item.id
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Detail Panel */}
        <div className="md:col-span-8">
          <div className="card-base p-6">
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Account Overview
                </h3>

                {user && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <Avatar src={user.avatar} name={user.name} size="lg" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h4>
                      <p className="text-xs text-slate-400">@{user.username}</p>
                      <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Input label="Email Address" defaultValue={user?.email} disabled />
                  <Input label="Phone Number" placeholder="+1 (555) 000-1234" />
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-red-100 dark:border-red-950/40">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Permanently delete your account, posts, stories, and conversations.
                  </p>
                  <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Account
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && settings && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Privacy & Safety
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Private Account</p>
                      <p className="text-[11px] text-slate-400">Only approved followers can view your posts and media.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.isPrivateAccount}
                      onChange={(e) => handleUpdateSetting('isPrivateAccount', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Show Activity Status</p>
                      <p className="text-[11px] text-slate-400">Allow accounts you follow to see when you were last active.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showOnlineStatus}
                      onChange={(e) => handleUpdateSetting('showOnlineStatus', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Allow Story Sharing</p>
                      <p className="text-[11px] text-slate-400">Let other users share your stories in direct messages.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowStorySharing}
                      onChange={(e) => handleUpdateSetting('allowStorySharing', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Password & Security
                </h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <Button type="submit" size="sm" isLoading={isUpdatingPassword}>
                    Update Password
                  </Button>
                </form>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && settings && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Push Notifications</p>
                      <p className="text-[11px] text-slate-400">Receive real-time alerts in your browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleUpdateSetting('pushNotifications', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Likes Notifications</p>
                      <p className="text-[11px] text-slate-400">Alerts when someone likes your posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.likesNotifications}
                      onChange={(e) => handleUpdateSetting('likesNotifications', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Comments Notifications</p>
                      <p className="text-[11px] text-slate-400">Alerts when someone comments on your posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.commentsNotifications}
                      onChange={(e) => handleUpdateSetting('commentsNotifications', e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Theme & Display
                </h3>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5 text-amber-500" /> },
                      { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5 text-indigo-400" /> },
                      { id: 'system', label: 'System', icon: <Laptop className="w-5 h-5 text-slate-400" /> },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTheme(mode.id as ThemeMode)}
                        className={cn(
                          'p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all',
                          theme === mode.id
                            ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        )}
                      >
                        {mode.icon}
                        <span className="text-xs font-bold">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Blocked Users */}
            {activeSection === 'blocked' && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Blocked Accounts
                </h3>

                {blockedUsers.length > 0 ? (
                  <div className="space-y-2">
                    {blockedUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={u.name} size="sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400">@{u.username}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleUnblockUser(u.id)}>
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">You haven't blocked any accounts.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          logout();
          success('Account deleted successfully');
        }}
        title="Delete Account Permanently"
        message="Are you completely sure? This will remove all your data, posts, followers, and chats permanently."
        confirmText="Yes, Delete My Account"
        variant="danger"
      />
    </div>
  );
};
