import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Paper 
} from '@mui/material';
import BracketNode from './BracketNode';

const BracketManagement = ({ tournamentId }) => {
  const [bracketData, setBracketData] = useState([]);
  const [format, setFormat] = useState('SINGLE_ELIMINATION');
  const [rounds, setRounds] = useState([]);

  const generateBracket = async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/generate-bracket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });
      const data = await response.json();
      setBracketData(data);
      organizeRounds(data);
    } catch (error) {
      console.error('Error generating bracket:', error);
    }
  };

  const organizeRounds = (matches) => {
    const roundsMap = new Map();
    matches.forEach(match => {
      if (!roundsMap.has(match.round)) {
        roundsMap.set(match.round, []);
      }
      roundsMap.get(match.round).push(match);
    });
    setRounds(Array.from(roundsMap.values()));
  };

  const updateMatchResult = async (matchId, winner) => {
    try {
      await fetch(`/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner }),
      });
      // Refresh bracket data
      fetchBracketData();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Tournament Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            label="Tournament Format"
          >
            <MenuItem value="SINGLE_ELIMINATION">Single Elimination</MenuItem>
            <MenuItem value="DOUBLE_ELIMINATION">Double Elimination</MenuItem>
            <MenuItem value="ROUND_ROBIN">Round Robin</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          onClick={generateBracket}
          sx={{ mt: 1 }}
        >
          Generate Bracket
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={2}>
          {rounds.map((round, roundIndex) => (
            <Grid item key={roundIndex}>
              <Paper sx={{ p: 2, minWidth: 200 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {round.map((match) => (
                    <BracketNode 
                      key={match._id}
                      match={match}
                      onUpdateResult={updateMatchResult}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BracketManagement; 