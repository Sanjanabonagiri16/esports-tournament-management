const BASE_URL = '/api/tournaments';

export const tournamentService = {
  async generateBracket(tournamentId, format) {
    const response = await fetch(`${BASE_URL}/${tournamentId}/generate-bracket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    });
    return response.json();
  },

  async updateMatch(matchId, data) {
    const response = await fetch(`/api/matches/${matchId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getTournamentBracket(tournamentId) {
    const response = await fetch(`${BASE_URL}/${tournamentId}/bracket`);
    return response.json();
  },

  async getTournaments(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}?${queryString}`);
    return response.json();
  },
}; 