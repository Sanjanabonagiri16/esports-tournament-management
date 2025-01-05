class BracketService {
  generateSingleEliminationBracket(teams) {
    const numTeams = teams.length;
    const rounds = Math.ceil(Math.log2(numTeams));
    const totalMatches = Math.pow(2, rounds) - 1;
    const bracket = {
      rounds: [],
      matches: new Array(totalMatches).fill(null).map((_, index) => ({
        id: index + 1,
        nextMatchId: index === totalMatches - 1 ? null : Math.floor((index + 1) / 2) + 1,
        tournamentRoundText: null,
        startTime: null,
        state: 'SCHEDULED',
        participants: [],
      })),
    };

    // Seed initial matches with teams
    const firstRoundMatches = Math.pow(2, rounds - 1);
    for (let i = 0; i < firstRoundMatches; i++) {
      const match = bracket.matches[i];
      match.participants = [
        teams[i * 2] ? { id: teams[i * 2].id, name: teams[i * 2].name, score: 0 } : null,
        teams[i * 2 + 1] ? { id: teams[i * 2 + 1].id, name: teams[i * 2 + 1].name, score: 0 } : null,
      ];
    }

    // Organize matches into rounds
    let matchIndex = 0;
    for (let round = 0; round < rounds; round++) {
      const roundMatches = Math.pow(2, rounds - round - 1);
      bracket.rounds.push({
        matches: bracket.matches.slice(matchIndex, matchIndex + roundMatches),
      });
      matchIndex += roundMatches;
    }

    return bracket;
  }

  generateDoubleEliminationBracket(teams) {
    // Similar to single elimination but with losers bracket
    const winnersRoundCount = Math.ceil(Math.log2(teams.length));
    const losersRoundCount = winnersRoundCount * 2 - 1;
    
    // Implementation details for double elimination
    // This is a simplified version
    return {
      winnersRounds: this.generateSingleEliminationBracket(teams),
      losersRounds: [], // Add logic for losers bracket
    };
  }

  generateRoundRobinBracket(teams) {
    const matches = [];
    const rounds = teams.length - 1;
    const halfSize = teams.length / 2;

    const teamsCopy = [...teams];
    if (teams.length % 2 === 1) {
      teamsCopy.push({ id: 'bye', name: 'BYE' });
    }

    for (let round = 0; round < rounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < halfSize; i++) {
        const match = {
          id: matches.length + roundMatches.length + 1,
          round: round + 1,
          participants: [
            { id: teamsCopy[i].id, name: teamsCopy[i].name, score: 0 },
            { id: teamsCopy[teamsCopy.length - 1 - i].id, name: teamsCopy[teamsCopy.length - 1 - i].name, score: 0 },
          ],
          state: 'SCHEDULED',
        };
        if (match.participants[0].id !== 'bye' && match.participants[1].id !== 'bye') {
          roundMatches.push(match);
        }
      }
      matches.push(...roundMatches);

      // Rotate teams for next round
      teamsCopy.splice(1, 0, teamsCopy.pop());
    }

    return {
      rounds: Array.from({ length: rounds }, (_, index) => ({
        matches: matches.filter(m => m.round === index + 1),
      })),
      matches,
    };
  }

  generateSwissBracket(teams) {
    const rounds = Math.ceil(Math.log2(teams.length));
    const bracket = {
      rounds: [],
      matches: [],
      standings: teams.map(team => ({
        team,
        wins: 0,
        losses: 0,
        points: 0,
      })),
    };

    // Generate first round randomly
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const firstRound = [];
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      if (i + 1 < shuffledTeams.length) {
        firstRound.push({
          id: bracket.matches.length + 1,
          round: 1,
          participants: [
            { id: shuffledTeams[i].id, name: shuffledTeams[i].name, score: 0 },
            { id: shuffledTeams[i + 1].id, name: shuffledTeams[i + 1].name, score: 0 },
          ],
          state: 'SCHEDULED',
        });
      }
    }

    bracket.rounds.push({ matches: firstRound });
    bracket.matches.push(...firstRound);

    return bracket;
  }

  updateBracket(bracket, matchId, scores) {
    const match = bracket.matches.find(m => m.id === matchId);
    if (!match) return bracket;

    // Update match scores
    match.participants = match.participants.map((p, index) => ({
      ...p,
      score: scores[index],
    }));

    // Determine winner
    const winner = match.participants.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    // If there's a next match, update it with the winner
    if (match.nextMatchId) {
      const nextMatch = bracket.matches.find(m => m.id === match.nextMatchId);
      if (nextMatch) {
        const participantIndex = nextMatch.participants.findIndex(p => !p || !p.id);
        if (participantIndex !== -1) {
          nextMatch.participants[participantIndex] = {
            id: winner.id,
            name: winner.name,
            score: 0,
          };
        }
      }
    }

    return { ...bracket };
  }

  getMatchesByRound(bracket, round) {
    return bracket.rounds[round]?.matches || [];
  }

  getWinnerPath(bracket, teamId) {
    return bracket.matches
      .filter(match => match.participants.some(p => p?.id === teamId))
      .map(match => match.id);
  }
}

export default new BracketService(); 