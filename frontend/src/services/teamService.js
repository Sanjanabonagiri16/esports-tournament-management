const BASE_URL = '/api/teams';

export const teamService = {
  async getTeamsByTournament(tournamentId) {
    const response = await fetch(`${BASE_URL}/tournament/${tournamentId}`);
    return response.json();
  },

  async createTeam(teamData) {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return response.json();
  },

  async updateTeam(teamId, teamData) {
    const response = await fetch(`${BASE_URL}/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return response.json();
  },

  async deleteTeam(teamId) {
    const response = await fetch(`${BASE_URL}/${teamId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async addPlayer(teamId, playerData) {
    const response = await fetch(`${BASE_URL}/${teamId}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });
    return response.json();
  },

  async removePlayer(teamId, playerId) {
    const response = await fetch(`${BASE_URL}/${teamId}/players/${playerId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}; 