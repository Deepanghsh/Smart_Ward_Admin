import { io } from 'socket.io-client';
import { showToast } from './toast';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    const token = localStorage.getItem('accesstoken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      console.warn('No auth token found. Socket connection skipped.');
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
        hostelId: user.hostel?._id || user.hostelId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      showToast.success('Real-time connection established');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Reconnect manually if server disconnected
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      showToast.error('Connection error. Retrying...');
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      showToast.info('Reconnected successfully');
    });

    // Listen for real-time events
    this.setupListeners();
  }

  setupListeners() {
    if (!this.socket) return;

    // Issue-related events
    this.socket.on('issue:created', (data) => {
      console.log('New issue created:', data);
      showToast.info(`New issue reported: ${data.title}`);
      this.emit('issue:created', data);
    });

    this.socket.on('issue:updated', (data) => {
      console.log('Issue updated:', data);
      showToast.info(`Issue updated: ${data.title}`);
      this.emit('issue:updated', data);
    });

    this.socket.on('issue:assigned', (data) => {
      console.log('Issue assigned:', data);
      showToast.success(`Issue assigned: ${data.title}`);
      this.emit('issue:assigned', data);
    });

    this.socket.on('issue:resolved', (data) => {
      console.log('Issue resolved:', data);
      showToast.success(`Issue resolved: ${data.title}`);
      this.emit('issue:resolved', data);
    });

    // Announcement events
    this.socket.on('announcement:created', (data) => {
      console.log('New announcement:', data);
      showToast.info(`📢 New announcement: ${data.title}`);
      this.emit('announcement:created', data);
    });

    // Notification events
    this.socket.on('notification', (data) => {
      console.log('Notification received:', data);
      showToast.info(data.message);
      this.emit('notification', data);
    });
  }

  // Subscribe to custom events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Unsubscribe from events
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // Emit to custom listeners
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => callback(data));
  }

  // Send data to server
  send(event, data, callback) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    this.socket.emit(event, data, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('🔌 Socket disconnected');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
