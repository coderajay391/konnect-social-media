import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../../types';
import { userApi } from '../../../services/api/userApi';
import { Modal } from '../../common/Modal/Modal';
import { Avatar } from '../../common/Avatar/Avatar';
import { Button } from '../../common/Button/Button';
import { Loader } from '../../common/Loader/Loader';

export interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId: string;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({ isOpen, onClose, title }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      userApi
        .getAllUsers()
        .then((all) => setUsers(all.slice(0, 4)))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      {loading ? (
        <Loader size="sm" text="Loading list..." />
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <Link to={`/profile/${u.username}`} onClick={onClose} className="flex items-center gap-2.5 min-w-0">
                <Avatar src={u.avatar} name={u.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">@{u.username}</p>
                </div>
              </Link>

              <Button size="sm" variant={u.isFollowing ? 'secondary' : 'primary'} className="rounded-full text-xs px-3 py-1">
                {u.isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
