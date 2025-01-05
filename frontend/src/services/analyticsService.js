import axios from 'axios';

export const analyticsService = {
  async getTournamentAnalytics(tournamentId, timeRange = 'week') {
    try {
      const response = await axios.get(`/api/analytics/tournaments/${tournamentId}`, {
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tournament analytics:', error);
      throw error;
    }
  },

  async getPlayerPerformance(playerId, tournamentId) {
    try {
      const response = await axios.get(`/api/analytics/players/${playerId}`, {
        params: { tournamentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching player performance:', error);
      throw error;
    }
  },

  async getViewerEngagement(tournamentId) {
    try {
      const response = await axios.get(`/api/analytics/engagement/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching viewer engagement:', error);
      throw error;
    }
  },

  async getStreamMetrics(tournamentId) {
    try {
      const response = await axios.get(`/api/analytics/streams/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stream metrics:', error);
      throw error;
    }
  }
}; 