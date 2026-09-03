import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, Globe, Camera } from 'lucide-react';
import { profileSchema, ProfileFormData } from '../../../schemas/profileSchema';
import { User as UserType } from '../../../types';
import { Modal } from '../../common/Modal/Modal';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { MAX_BIO_LENGTH } from '../../../utils/constants';

export interface EditProfileModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UserType>) => Promise<any>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bioCount, setBioCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const currentBio = watch('bio') || '';

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        avatar: user.avatar,
        coverImage: user.coverImage || '',
      });
      setAvatarUrl(user.avatar);
      setCoverUrl(user.coverImage || '');
      setBioCount(user.bio?.length || 0);
    }
  }, [user, reset]);

  useEffect(() => {
    setBioCount(currentBio.length);
  }, [currentBio]);

  if (!user) return null;

  const onSubmit = async (data: ProfileFormData) => {
    await onSave({
      ...data,
      avatar: avatarUrl || user.avatar,
      coverImage: coverUrl || user.coverImage,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Cover & Avatar Simulator */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 h-32">
          {coverUrl && (
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              onClick={() =>
                setCoverUrl(
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
                )
              }
              className="px-2 py-1 bg-black/60 hover:bg-black/80 text-white text-[10px] rounded-lg backdrop-blur-sm"
            >
              Preset 1
            </button>
            <button
              type="button"
              onClick={() =>
                setCoverUrl(
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80'
                )
              }
              className="px-2 py-1 bg-black/60 hover:bg-black/80 text-white text-[10px] rounded-lg backdrop-blur-sm"
            >
              Preset 2
            </button>
          </div>

          <div className="absolute bottom-2 left-4 flex items-end gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-brand-600 relative group">
              <img src={avatarUrl || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-1 mb-1">
              <button
                type="button"
                onClick={() =>
                  setAvatarUrl(
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                  )
                }
                className="px-2 py-0.5 bg-black/60 text-white text-[9px] rounded"
              >
                Avatar 1
              </button>
              <button
                type="button"
                onClick={() =>
                  setAvatarUrl(
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                  )
                }
                className="px-2 py-0.5 bg-black/60 text-white text-[9px] rounded"
              >
                Avatar 2
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Username"
            leftIcon={<span className="text-xs font-bold">@</span>}
            error={errors.username?.message}
            {...register('username')}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bio</label>
            <span className="text-[11px] text-slate-400">
              {MAX_BIO_LENGTH - bioCount} left
            </span>
          </div>
          <textarea
            rows={3}
            placeholder="Tell the community about yourself..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            {...register('bio')}
          />
          {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            placeholder="e.g. San Francisco, CA"
            leftIcon={<MapPin className="w-4 h-4" />}
            error={errors.location?.message}
            {...register('location')}
          />

          <Input
            label="Website"
            placeholder="https://example.com"
            leftIcon={<Globe className="w-4 h-4" />}
            error={errors.website?.message}
            {...register('website')}
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
