import React from 'react';
import { Bell, Check } from 'lucide-react';
import './NotificationItem.css';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        <Bell size={18} />
      </div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="notification-time">{notification.time}</span>
      </div>
      {!notification.read && (
        <button className="mark-read-btn" onClick={handleMarkAsRead}>
          <Check size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;