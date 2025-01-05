import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamCaptain, setTeamCaptain] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);

  const handleAddTeam = () => {
    const newTeam = {
      id: Date.now(),
      name: teamName,
      captain: teamCaptain,
      players: [],
      substitutes: [],
    };

    if (editingTeam) {
      setTeams(teams.map(team => team.id === editingTeam.id ? newTeam : team));
    } else {
      setTeams([...teams, newTeam]);
    }

    handleCloseDialog();
  };

  const handleOpenDialog = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setTeamName(team.name);
      setTeamCaptain(team.captain);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTeamName('');
    setTeamCaptain('');
    setEditingTeam(null);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Team Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <List>
                {teams.map((team) => (
                  <ListItem
                    key={team.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={team.name}
                      secondary={`Captain: ${team.captain}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleOpenDialog(team)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {teams.length === 0 && (
                  <Typography color="text.secondary" align="center">
                    No teams registered yet
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTeam ? 'Edit Team' : 'Add New Team'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Team Captain"
            fullWidth
            value={teamCaptain}
            onChange={(e) => setTeamCaptain(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddTeam} variant="contained">
            {editingTeam ? 'Save Changes' : 'Add Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamManagement; 