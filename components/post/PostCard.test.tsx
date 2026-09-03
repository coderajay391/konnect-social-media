import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PostCard } from './PostCard/PostCard';
import { Post } from '../../types';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';

const mockPost: Post = {
  id: 'post_test_1',
  authorId: 'user_1',
  author: {
    id: 'user_1',
    name: 'Sarah Chen',
    username: 'sarah_codes',
    email: 'sarah@example.com',
    avatar: 'https://example.com/avatar.jpg',
    joinedDate: '2023-01-01',
    followersCount: 100,
    followingCount: 50,
    postsCount: 10,
    verified: true,
  },
  content: 'Testing modern post with #react and @alexrivera',
  likesCount: 42,
  commentsCount: 5,
  sharesCount: 3,
  isLiked: false,
  isSaved: false,
  createdAt: new Date().toISOString(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('PostCard Component', () => {
  it('renders author name, username, and formatted content', () => {
    renderWithProviders(
      <PostCard post={mockPost} onLike={vi.fn()} onSave={vi.fn()} />
    );

    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('@sarah_codes')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('@alexrivera')).toBeInTheDocument();
  });

  it('triggers onLike handler when like button is clicked', () => {
    const handleLike = vi.fn();
    renderWithProviders(
      <PostCard post={mockPost} onLike={handleLike} onSave={vi.fn()} />
    );

    const likeButton = screen.getByLabelText('Like post');
    fireEvent.click(likeButton);
    expect(handleLike).toHaveBeenCalledWith('post_test_1');
  });

  it('triggers onSave handler when bookmark button is clicked', () => {
    const handleSave = vi.fn();
    renderWithProviders(
      <PostCard post={mockPost} onLike={vi.fn()} onSave={handleSave} />
    );

    const saveButton = screen.getByLabelText('Bookmark post');
    fireEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledWith('post_test_1');
  });
});
