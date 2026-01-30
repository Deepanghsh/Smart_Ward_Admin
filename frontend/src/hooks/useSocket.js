import { useEffect, useCallback } from 'react';
import socketService from '../utils/socketService';

/**
 * Custom hook for Socket.IO real-time updates
 */
export const useSocket = (events = {}) => {
  useEffect(() => {
    // Connect socket if not already connected
    if (!socketService.socket?.connected) {
      socketService.connect();
    }

    // Register event listeners
    Object.entries(events).forEach(([event, handler]) => {
      socketService.on(event, handler);
    });

    // Cleanup function
    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        socketService.off(event, handler);
      });
    };
  }, [events]);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  const on = useCallback((event, handler) => {
    socketService.on(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketService.off(event, handler);
  }, []);

  return {
    emit,
    on,
    off,
    isConnected: socketService.socket?.connected || false
  };
};

/**
 * Hook for listening to specific issue updates
 */
export const useIssueUpdates = (onUpdate) => {
  useEffect(() => {
    const handleIssueCreated = (issue) => {
      console.log('New issue created:', issue);
      if (onUpdate) onUpdate({ type: 'created', issue });
    };

    const handleIssueUpdated = (issue) => {
      console.log('Issue updated:', issue);
      if (onUpdate) onUpdate({ type: 'updated', issue });
    };

    const handleIssueDeleted = (data) => {
      console.log('Issue deleted:', data);
      if (onUpdate) onUpdate({ type: 'deleted', ...data });
    };

    const handleStatusChanged = (data) => {
      console.log('Issue status changed:', data);
      if (onUpdate) onUpdate({ type: 'status-changed', ...data });
    };

    socketService.on('issue:created', handleIssueCreated);
    socketService.on('issue:updated', handleIssueUpdated);
    socketService.on('issue:deleted', handleIssueDeleted);
    socketService.on('issue:status-changed', handleStatusChanged);

    return () => {
      socketService.off('issue:created', handleIssueCreated);
      socketService.off('issue:updated', handleIssueUpdated);
      socketService.off('issue:deleted', handleIssueDeleted);
      socketService.off('issue:status-changed', handleStatusChanged);
    };
  }, [onUpdate]);
};

/**
 * Hook for listening to announcement updates
 */
export const useAnnouncementUpdates = (onUpdate) => {
  useEffect(() => {
    const handleAnnouncementCreated = (announcement) => {
      console.log('New announcement:', announcement);
      if (onUpdate) onUpdate({ type: 'created', announcement });
    };

    const handleAnnouncementUpdated = (announcement) => {
      console.log('Announcement updated:', announcement);
      if (onUpdate) onUpdate({ type: 'updated', announcement });
    };

    const handleAnnouncementDeleted = (data) => {
      console.log('Announcement deleted:', data);
      if (onUpdate) onUpdate({ type: 'deleted', ...data });
    };

    socketService.on('announcement:created', handleAnnouncementCreated);
    socketService.on('announcement:updated', handleAnnouncementUpdated);
    socketService.on('announcement:deleted', handleAnnouncementDeleted);

    return () => {
      socketService.off('announcement:created', handleAnnouncementCreated);
      socketService.off('announcement:updated', handleAnnouncementUpdated);
      socketService.off('announcement:deleted', handleAnnouncementDeleted);
    };
  }, [onUpdate]);
};
