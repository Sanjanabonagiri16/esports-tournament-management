import axios from 'axios';

export const automationService = {
  async generateSeeding(tournamentId, criteria = 'random') {
    try {
      const response = await axios.post(`/api/tournaments/${tournamentId}/seed`, { criteria });
      return response.data;
    } catch (error) {
      console.error('Error generating seeding:', error);
      throw error;
    }
  },

  async generateSchedule(tournamentId, preferences = {}) {
    try {
      const response = await axios.post(`/api/tournaments/${tournamentId}/schedule`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error generating schedule:', error);
      throw error;
    }
  },

  async autoUpdateBrackets(tournamentId) {
    try {
      const response = await axios.post(`/api/tournaments/${tournamentId}/auto-update`);
      return response.data;
    } catch (error) {
      console.error('Error updating brackets:', error);
      throw error;
    }
  },

  async processPrizePayouts(tournamentId) {
    try {
      const response = await axios.post(`/api/tournaments/${tournamentId}/process-payouts`);
      return response.data;
    } catch (error) {
      console.error('Error processing payouts:', error);
      throw error;
    }
  },

  async sendAutomatedNotifications(tournamentId, type) {
    try {
      const response = await axios.post(`/api/tournaments/${tournamentId}/notifications`, { type });
      return response.data;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }
}; 