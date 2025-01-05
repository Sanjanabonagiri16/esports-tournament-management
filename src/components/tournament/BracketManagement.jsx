import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import bracketService from '../../services/bracketService';
import { tournaments } from '../../services/api';

function BracketManagement() {
  const [bracketType, setBracketType] = useState('single-elimination');
  const [teams, setTeams] = useState([]);
  const [bracket, setBracket] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [openScoreDialog, setOpenScoreDialog] = useState(false);
  const [scores, setScores] = useState({ team1: '', team2: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const bracketTypes = [
    { value: 'single-elimination', label: 'Single Elimination' },
    { value: 'double-elimination', label: 'Double Elimination' },
    { value: 'round-robin', label: 'Round Robin' },
    { value: 'swiss', label: 'Swiss System' },
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const response = await tournaments.getParticipants(1); // Replace with actual tournament ID
      setTeams(response.data);
    } catch (error) {
      setError('Failed to load teams');
    }
  };

  const handleGenerateBracket = () => {
    try {
      let newBracket;
      switch (bracketType) {
        case 'single-elimination':
          newBracket = bracketService.generateSingleEliminationBracket(teams);
          break;
        case 'double-elimination':
          newBracket = bracketService.generateDoubleEliminationBracket(teams);
          break;
        case 'round-robin':
          newBracket = bracketService.generateRoundRobinBracket(teams);
          break;
        case 'swiss':
          newBracket = bracketService.generateSwissBracket(teams);
          break;
        default:
          throw new Error('Invalid bracket type');
      }
      setBracket(newBracket);
      setSuccess('Bracket generated successfully');
    } catch (error) {
      setError('Failed to generate bracket');
    }
  };

  const handleMatchClick = (match) => {
    if (match.state === 'SCHEDULED') {
      setSelectedMatch(match);
      setScores({
        team1: match.participants[0]?.score || '',
        team2: match.participants[1]?.score || '',
      });
      setOpenScoreDialog(true);
    }
  };

  const handleUpdateScore = () => {
    try {
      const updatedBracket = bracketService.updateBracket(bracket, selectedMatch.id, [
        parseInt(scores.team1),
        parseInt(scores.team2),
      ]);
      setBracket(updatedBracket);
      setOpenScoreDialog(false);
      setSuccess('Match score updated successfully');
    } catch (error) {
      setError('Failed to update match score');
    }
  };

  const renderBracket = () => {
    if (!bracket) return null;

    return bracket.rounds.map((round, roundIndex) => (
      <Grid item xs={12} key={roundIndex}>
        <Typography variant="h6" gutterBottom>
          Round {roundIndex + 1}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {round.matches.map((match) => (
            <Card
              key={match.id}
              sx={{
                cursor: match.state === 'SCHEDULED' ? 'pointer' : 'default',
                '&:hover': {
                  bgcolor: match.state === 'SCHEDULED' ? 'action.hover' : 'inherit',
                },
              }}
              onClick={() => handleMatchClick(match)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography>
                      {match.participants[0]?.name || 'TBD'} vs {match.participants[1]?.name || 'TBD'}
                    </Typography>
                  </Box>
                  {match.participants[0] && match.participants[1] && (
                    <Typography variant="h6">
                      {match.participants[0].score} - {match.participants[1].score}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bracket Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tournament Settings
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Bracket Type</InputLabel>
                <Select
                  value={bracketType}
                  label="Bracket Type"
                  onChange={(e) => setBracketType(e.target.value)}
                >
                  {bracketTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleGenerateBracket}
                disabled={teams.length < 2}
              >
                Generate Bracket
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tournament Bracket
              </Typography>
              <Box sx={{ mt: 2 }}>
                {teams.length === 0 ? (
                  <Typography color="text.secondary" align="center">
                    No teams available
                  </Typography>
                ) : !bracket ? (
                  <Typography color="text.secondary" align="center">
                    Generate a bracket to view it here
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {renderBracket()}
                  </Grid>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openScoreDialog} onClose={() => setOpenScoreDialog(false)}>
        <DialogTitle>Update Match Score</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label={selectedMatch?.participants[0]?.name || 'Team 1'}
                type="number"
                fullWidth
                value={scores.team1}
                onChange={(e) => setScores({ ...scores, team1: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={selectedMatch?.participants[1]?.name || 'Team 2'}
                type="number"
                fullWidth
                value={scores.team2}
                onChange={(e) => setScores({ ...scores, team2: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScoreDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateScore} variant="contained">
            Update Score
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BracketManagement; 