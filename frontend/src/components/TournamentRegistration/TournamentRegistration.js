import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { tournamentService } from '../../services/tournamentService';
import { teamService } from '../../services/teamService';

const TournamentRegistration = () => {
  const [tournaments, setTournaments] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    fetchTournaments();
    fetchUserTeams();
  }, []);

  const fetchTournaments = async () => {
    const data = await tournamentService.getTournaments({ status: 'UPCOMING' });
    setTournaments(data);
  };

  const fetchUserTeams = async () => {
    const data = await teamService.getUserTeams();
    setUserTeams(data);
  };

  const handleRegister = (tournament) => {
    setSelectedTournament(tournament);
    setOpenDialog(true);
  };

  const handleConfirmRegistration = async () => {
    try {
      await tournamentService.registerTeam(selectedTournament._id, selectedTeam);
      setOpenDialog(false);
      fetchTournaments(); // Refresh tournaments list
    } catch (error) {
      console.error('Error registering for tournament:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Available Tournaments</Typography>

      <Grid container spacing={3}>
        {tournaments.map((tournament) => (
          <Grid item xs={12} md={6} lg={4} key={tournament._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tournament.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Game: {tournament.game}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Prize Pool: $${tournament.prizePool}`}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`Format: ${tournament.format}`}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2">
                  Registration Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Teams: {tournament.teams.length}/{tournament.maxTeams}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleRegister(tournament)}
                  disabled={tournament.teams.length >= tournament.maxTeams}
                >
                  Register Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Register for {selectedTournament?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              label="Select Team"
            >
              {userTeams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmRegistration} 
            variant="contained"
            disabled={!selectedTeam}
          >
            Confirm Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TournamentRegistration; 