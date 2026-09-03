import React from 'react';
import { MoreHorizontal, Edit2, Trash2, Flag, Link as LinkIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '../../common/DropdownMenu/DropdownMenu';
import { copyToClipboard } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';

export interface PostMenuProps {
  postId: string;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

export const PostMenu: React.FC<PostMenuProps> = ({ postId, isOwner, onEdit, onDelete, onReport }) => {
  const { success } = useToast();

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    await copyToClipboard(postUrl);
    success('Post link copied to clipboard!');
  };

  const menuItems: DropdownMenuItem[] = [
    {
      id: 'copy',
      label: 'Copy link to post',
      icon: <LinkIcon className="w-4 h-4" />,
      onClick: handleCopyLink,
    },
  ];

  if (isOwner) {
    if (onEdit) {
      menuItems.push({
        id: 'edit',
        label: 'Edit post',
        icon: <Edit2 className="w-4 h-4" />,
        onClick: onEdit,
      });
    }
    if (onDelete) {
      menuItems.push({
        id: 'delete',
        label: 'Delete post',
        icon: <Trash2 className="w-4 h-4" />,
        variant: 'danger',
        onClick: onDelete,
      });
    }
  } else {
    if (onReport) {
      menuItems.push({
        id: 'report',
        label: 'Report post',
        icon: <Flag className="w-4 h-4" />,
        variant: 'danger',
        onClick: onReport,
      });
    }
  }

  return (
    <DropdownMenu
      trigger={
        <button
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Post options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      items={menuItems}
      align="right"
    />
  );
};
