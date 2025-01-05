import axios from 'axios';

export const gameDataService = {
  async getGameStats(gameId, matchId) {
    try {
      const response = await axios.get(`/api/game-data/${gameId}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game stats:', error);
      throw error;
    }
  },

  async getPlayerStats(gameId, playerId) {
    try {
      const response = await axios.get(`/api/game-data/${gameId}/players/${playerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  },

  async syncGameData(tournamentId) {
    try {
      const response = await axios.post(`/api/game-data/sync/${tournamentId}`);
      return response.data;
    } catch (error) {
      console.error('Error syncing game data:', error);
      throw error;
    }
  }
}; 