export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Pulse';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'pulse_auth_token',
  CURRENT_USER: 'pulse_current_user',
  THEME: 'pulse_theme',
  POSTS: 'pulse_db_posts',
  USERS: 'pulse_db_users',
  STORIES: 'pulse_db_stories',
  COMMENTS: 'pulse_db_comments',
  CONVERSATIONS: 'pulse_db_conversations',
  NOTIFICATIONS: 'pulse_db_notifications',
  BOOKMARKS: 'pulse_db_bookmarks',
  RECENT_SEARCHES: 'pulse_recent_searches',
  SETTINGS: 'pulse_user_settings',
} as const;

export const POST_CATEGORIES = [
  'All',
  'Technology',
  'Design',
  'Photography',
  'Coding',
  'Music',
  'Travel',
  'Gaming',
  'Science',
] as const;

export const MAX_POST_LENGTH = 500;
export const MAX_BIO_LENGTH = 160;
export const MAX_COMMENT_LENGTH = 300;
