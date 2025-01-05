import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';

const TeamRegistration = () => {
  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    players: []
  });
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    fetchUserTeams();
    fetchAvailablePlayers();
  }, []);

  const fetchUserTeams = async () => {
    const data = await teamService.getUserTeams();
    setTeams(data);
  };

  const fetchAvailablePlayers = async () => {
    const data = await userService.getPlayers();
    setAvailablePlayers(data);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamService.createTeam(formData);
      setOpenDialog(false);
      fetchUserTeams();
      setFormData({ name: '', players: [] });
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleAddPlayer = () => {
    if (selectedPlayer && !formData.players.includes(selectedPlayer._id)) {
      setFormData({
        ...formData,
        players: [...formData.players, selectedPlayer._id]
      });
      setSelectedPlayer(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">My Teams</Typography>
        <Button 
          variant="contained" 
          onClick={() => setOpenDialog(true)}
        >
          Create New Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} key={team._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {team.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Team Members:
                </Typography>
                <List dense>
                  {team.players.map((player) => (
                    <ListItem key={player._id}>
                      <ListItemText 
                        primary={player.username}
                        secondary={player.role}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateTeam} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Team Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Autocomplete
                fullWidth
                options={availablePlayers}
                getOptionLabel={(option) => option.username}
                value={selectedPlayer}
                onChange={(event, newValue) => setSelectedPlayer(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Search Players" />
                )}
              />
              <Button onClick={handleAddPlayer}>Add Player</Button>
            </Box>

            <List>
              {formData.players.map((playerId) => {
                const player = availablePlayers.find(p => p._id === playerId);
                return (
                  <ListItem key={playerId}>
                    <ListItemText primary={player?.username} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => {
                        setFormData({
                          ...formData,
                          players: formData.players.filter(id => id !== playerId)
                        });
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateTeam}
            variant="contained"
            disabled={!formData.name || formData.players.length === 0}
          >
            Create Team
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamRegistration; 