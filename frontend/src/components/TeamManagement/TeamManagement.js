import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { teamService } from '../../services/teamService';

const TeamManagement = ({ tournamentId }) => {
  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    players: [],
    substitutes: []
  });

  useEffect(() => {
    fetchTeams();
  }, [tournamentId]);

  const fetchTeams = async () => {
    const data = await teamService.getTeamsByTournament(tournamentId);
    setTeams(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTeam) {
        await teamService.updateTeam(selectedTeam._id, formData);
      } else {
        await teamService.createTeam({ ...formData, tournamentId });
      }
      setOpenDialog(false);
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Team Management</Typography>
        <Button 
          variant="contained" 
          onClick={() => {
            setSelectedTeam(null);
            setFormData({ name: '', players: [], substitutes: [] });
            setOpenDialog(true);
          }}
        >
          Add New Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} key={team._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{team.name}</Typography>
                  <Box>
                    <IconButton onClick={() => {
                      setSelectedTeam(team);
                      setFormData(team);
                      setOpenDialog(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => teamService.deleteTeam(team._id).then(fetchTeams)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2 }}>Players:</Typography>
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
        <DialogTitle>
          {selectedTeam ? 'Edit Team' : 'Add New Team'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Team Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            {/* Add more form fields for players and substitutes */}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeamManagement; 