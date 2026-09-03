export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  isPrivate?: boolean;
  isBlocked?: boolean;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  aspectRatio?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  media?: PostMedia[];
  tags?: string[];
  mentions?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt?: string;
  visibility?: 'public' | 'followers' | 'private';
  location?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string | null;
  replies?: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  isViewed?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  readBy: string[];
  isDeleted?: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'message';

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  sender: User;
  type: NotificationType;
  entityId?: string; // post id, comment id, or conversation id
  postPreview?: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
}

export interface UserSettings {
  isPrivateAccount: boolean;
  allowTagging: boolean;
  allowStorySharing: boolean;
  showOnlineStatus: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  likesNotifications: boolean;
  commentsNotifications: boolean;
  newFollowersNotifications: boolean;
  messagesNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
}
