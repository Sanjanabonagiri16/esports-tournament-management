const BASE_URL = '/api/matches';

export const matchService = {
  async getMatches(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}?${queryString}`);
    return response.json();
  },

  async getMatchDetails(matchId) {
    const response = await fetch(`${BASE_URL}/${matchId}`);
    return response.json();
  },

  async updateMatchScore(matchId, scoreData) {
    const response = await fetch(`${BASE_URL}/${matchId}/score`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });
    return response.json();
  },

  async getMatchesByTournament(tournamentId) {
    const response = await fetch(`${BASE_URL}/tournament/${tournamentId}`);
    return response.json();
  },

  async getMatchesByTeam(teamId) {
    const response = await fetch(`${BASE_URL}/team/${teamId}`);
    return response.json();
  }
}; 