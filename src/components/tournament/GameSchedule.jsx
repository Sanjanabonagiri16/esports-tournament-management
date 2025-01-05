import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

function GameSchedule() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  // Sample data - replace with actual data from your backend
  const matches = [
    {
      id: 1,
      team1: 'Team Alpha',
      team2: 'Team Beta',
      scheduledTime: '2024-01-10T15:00:00',
      status: 'upcoming',
      score1: null,
      score2: null,
    },
    {
      id: 2,
      team1: 'Team Gamma',
      team2: 'Team Delta',
      scheduledTime: '2024-01-10T16:30:00',
      status: 'live',
      score1: 2,
      score2: 1,
    },
    {
      id: 3,
      team1: 'Team Epsilon',
      team2: 'Team Zeta',
      scheduledTime: '2024-01-10T14:00:00',
      status: 'completed',
      score1: 3,
      score2: 0,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenScoreDialog = (match) => {
    setSelectedMatch(match);
    setScore1(match.score1?.toString() || '');
    setScore2(match.score2?.toString() || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMatch(null);
    setScore1('');
    setScore2('');
  };

  const handleUpdateScore = () => {
    // TODO: Implement score update logic
    handleCloseDialog();
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'upcoming':
        return <Chip icon={<ScheduleIcon />} label="Upcoming" color="primary" />;
      case 'live':
        return <Chip icon={<TimerIcon />} label="Live" color="error" />;
      case 'completed':
        return <Chip icon={<CheckCircleIcon />} label="Completed" color="success" />;
      default:
        return null;
    }
  };

  const filterMatches = (status) => {
    return matches.filter(match => match.status === status);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Game Schedule
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Upcoming" />
          <Tab label="Live" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {filterMatches(['upcoming', 'live', 'completed'][tabValue]).map((match) => (
          <Grid item xs={12} key={match.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">
                      {match.team1} vs {match.team2}
                    </Typography>
                    <Typography color="text.secondary">
                      {new Date(match.scheduledTime).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {match.status !== 'upcoming' && (
                      <Typography variant="h6">
                        {match.score1} - {match.score2}
                      </Typography>
                    )}
                    {getStatusChip(match.status)}
                    {match.status === 'live' && (
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenScoreDialog(match)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Match Score</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label={selectedMatch?.team1}
                type="number"
                fullWidth
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={selectedMatch?.team2}
                type="number"
                fullWidth
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateScore} variant="contained">
            Update Score
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GameSchedule; 