import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create notification context
export const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => useContext(NotificationContext);

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    const id = Date.now();
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { id, message, type, duration }
    ]);
    
    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Shorthand methods for different notification types
  const success = (message, duration) => addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
  const error = (message, duration) => addNotification(message, NOTIFICATION_TYPES.ERROR, duration);
  const warning = (message, duration) => addNotification(message, NOTIFICATION_TYPES.WARNING, duration);
  const info = (message, duration) => addNotification(message, NOTIFICATION_TYPES.INFO, duration);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

// Notification Container component
const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            notification={notification} 
            onClose={() => removeNotification(notification.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Notification component
const Notification = ({ notification, onClose }) => {
  const { id, message, type } = notification;
  
  // Progress bar state
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (notification.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress - (100 / (notification.duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [notification.duration]);
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <i className="fas fa-check-circle"></i>;
      case NOTIFICATION_TYPES.ERROR:
        return <i className="fas fa-exclamation-circle"></i>;
      case NOTIFICATION_TYPES.WARNING:
        return <i className="fas fa-exclamation-triangle"></i>;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };
  
  // Get class based on notification type
  const getTypeClass = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'notification-success';
      case NOTIFICATION_TYPES.ERROR:
        return 'notification-error';
      case NOTIFICATION_TYPES.WARNING:
        return 'notification-warning';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'notification-info';
    }
  };
  
  // Animation variants
  const notificationVariants = {
    initial: { opacity: 0, x: 300, scale: 0.8 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 300, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div 
      className={`notification ${getTypeClass()} glass-effect`}
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">
          {message}
        </div>
        <button 
          className="notification-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      {notification.duration > 0 && (
        <div className="notification-progress-container">
          <div 
            className="notification-progress" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationProvider;
