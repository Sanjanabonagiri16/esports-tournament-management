import { io } from 'socket.io-client';

class LiveUpdateService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_SOCKET_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to live updates server');
      });

      this.socket.on('error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeTournament(tournamentId, callbacks) {
    if (!this.socket) this.connect();

    this.socket.emit('join-tournament', tournamentId);

    // Subscribe to various tournament events
    const events = [
      'match-update',
      'bracket-update',
      'leaderboard-update',
      'stream-update'
    ];

    events.forEach(event => {
      if (callbacks[event]) {
        this.socket.on(`${event}:${tournamentId}`, callbacks[event]);
        this.listeners.set(`${event}:${tournamentId}`, callbacks[event]);
      }
    });
  }

  unsubscribeTournament(tournamentId) {
    if (!this.socket) return;

    this.socket.emit('leave-tournament', tournamentId);

    // Clean up event listeners
    this.listeners.forEach((listener, event) => {
      if (event.includes(tournamentId)) {
        this.socket.off(event, listener);
        this.listeners.delete(event);
      }
    });
  }
}

export const liveUpdateService = new LiveUpdateService(); 