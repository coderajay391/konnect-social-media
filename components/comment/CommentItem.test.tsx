import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CommentItem } from './Comment/CommentItem';
import { Comment } from '../../types';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';

const mockComment: Comment = {
  id: 'comm_1',
  postId: 'post_1',
  authorId: 'user_2',
  author: {
    id: 'user_2',
    name: 'Marcus Vance',
    username: 'marcus_vance',
    email: 'marcus@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    joinedDate: '2023-01-01',
    followersCount: 50,
    followingCount: 20,
    postsCount: 5,
  },
  content: 'Exceptional work on this architecture!',
  createdAt: new Date().toISOString(),
  likesCount: 3,
  isLiked: false,
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

describe('CommentItem Component', () => {
  it('renders author and comment text', () => {
    renderWithProviders(
      <CommentItem
        comment={mockComment}
        onLike={vi.fn()}
        onReply={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Marcus Vance')).toBeInTheDocument();
    expect(screen.getByText('Exceptional work on this architecture!')).toBeInTheDocument();
  });

  it('calls onLike when like is clicked', () => {
    const handleLike = vi.fn();
    renderWithProviders(
      <CommentItem
        comment={mockComment}
        onLike={handleLike}
        onReply={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const likeBtn = screen.getByText('3');
    fireEvent.click(likeBtn);
    expect(handleLike).toHaveBeenCalledWith('comm_1');
  });
});
