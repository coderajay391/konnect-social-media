import React, { useState } from 'react';
import { BadgeCheck, Calendar, MapPin, Globe, Edit3, UserPlus, UserCheck, MessageSquare, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import { Avatar } from '../../common/Avatar/Avatar';
import { Button } from '../../common/Button/Button';
import { EditProfileModal } from '../EditProfile/EditProfileModal';
import { FollowersModal } from '../FollowersModal/FollowersModal';
import { formatNumber } from '../../../utils/formatDate';

export interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
  onFollowToggle: () => void;
  onUpdateProfile: (data: Partial<User>) => Promise<any>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwner,
  onFollowToggle,
  onUpdateProfile,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const navigate = useNavigate();

  const joinedYear = new Date(user.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="card-base overflow-hidden">
      {/* Cover Image Banner */}
      <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-brand-700 via-indigo-800 to-slate-900 relative">
        {user.coverImage && (
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Main Info Bar */}
      <div className="px-5 sm:px-6 pb-6 pt-3 relative">
        {/* Avatar overlay */}
        <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
          <div className="p-1 rounded-full bg-white dark:bg-slate-900 shadow-xl">
            <Avatar src={user.avatar} name={user.name} size="2xl" status={user.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isOwner ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
                leftIcon={<Edit3 className="w-4 h-4" />}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={user.isFollowing ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={onFollowToggle}
                  leftIcon={user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/messages')}
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              {user.verified && (
                <BadgeCheck className="w-5 h-5 text-brand-500 fill-brand-500/20 shrink-0" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl whitespace-pre-line">
              {user.bio}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-brand-500" />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined {joinedYear}</span>
            </div>
          </div>

          {/* Followers & Following Stats */}
          <div className="flex items-center gap-6 pt-1 text-xs sm:text-sm">
            <button
              onClick={() => setModalType('following')}
              className="hover:underline flex items-center gap-1.5"
            >
              <strong className="text-slate-900 dark:text-white font-bold">
                {formatNumber(user.followingCount)}
              </strong>
              <span className="text-slate-500 dark:text-slate-400">Following</span>
            </button>

            <button
              onClick={() => setModalType('followers')}
              className="hover:underline flex items-center gap-1.5"
            >
              <strong className="text-slate-900 dark:text-white font-bold">
                {formatNumber(user.followersCount)}
              </strong>
              <span className="text-slate-500 dark:text-slate-400">Followers</span>
            </button>

            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900 dark:text-white font-bold">
                {formatNumber(user.postsCount)}
              </strong>
              <span className="text-slate-500 dark:text-slate-400">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={onUpdateProfile}
      />

      {/* Followers / Following List Modal */}
      {modalType && (
        <FollowersModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          title={modalType === 'followers' ? 'Followers' : 'Following'}
          userId={user.id}
        />
      )}
    </div>
  );
};
