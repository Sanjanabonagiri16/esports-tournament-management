import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { matchService } from '../../services/matchService';

const GameSchedule = ({ tournamentId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [matches, setMatches] = useState({
    upcoming: [],
    completed: []
  });

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const [upcoming, completed] = await Promise.all([
        matchService.getMatches({ status: 'SCHEDULED' }),
        matchService.getMatches({ status: 'COMPLETED' })
      ]);
      setMatches({ upcoming, completed });
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const renderMatchCard = (match) => (
    <Grid item xs={12} md={6} key={match._id}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {format(new Date(match.scheduledTime), 'MMM dd, yyyy - HH:mm')}
            </Typography>
            <Chip 
              label={match.status}
              color={match.status === 'COMPLETED' ? 'success' : 'primary'}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Avatar src={match.team1?.logo} alt={match.team1?.name} sx={{ mr: 1 }} />
              <Typography variant="body1">
                {match.team1?.name}
              </Typography>
            </Box>
            
            <Box sx={{ mx: 2, textAlign: 'center' }}>
              {match.status === 'COMPLETED' ? (
                <Typography variant="h6">
                  {match.score.team1Score} - {match.score.team2Score}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  VS
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
              <Typography variant="body1">
                {match.team2?.name}
              </Typography>
              <Avatar src={match.team2?.logo} alt={match.team2?.name} sx={{ ml: 1 }} />
            </Box>
          </Box>

          {match.status === 'COMPLETED' && match.winner && (
            <Box sx={{ textAlign: 'center' }}>
              <Chip 
                label={`Winner: ${match.winner.name}`}
                color="success"
                variant="outlined"
                size="small"
              />
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Tournament: {match.tournament?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Round {match.round}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Game Schedule</Typography>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Upcoming (${matches.upcoming.length})`} />
        <Tab label={`Completed (${matches.completed.length})`} />
      </Tabs>

      <Grid container spacing={3}>
        {activeTab === 0 ? (
          matches.upcoming.length > 0 ? (
            matches.upcoming.map(match => renderMatchCard(match))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No upcoming matches scheduled
              </Typography>
            </Grid>
          )
        ) : (
          matches.completed.length > 0 ? (
            matches.completed.map(match => renderMatchCard(match))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No completed matches yet
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default GameSchedule; 