import React from 'react';
import { NotificationList } from '../../components/notification/NotificationList/NotificationList';

export const Notifications: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <NotificationList />
    </div>
  );
};
