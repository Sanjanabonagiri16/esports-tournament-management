import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  YouTube as YouTubeIcon,
  Tv as TwitchIcon,
} from '@mui/icons-material';

function LiveTournament() {
  const [tabValue, setTabValue] = useState(0);

  // Sample data - replace with actual data from your backend
  const leaderboard = [
    { rank: 1, team: 'Team Alpha', wins: 5, losses: 1, points: 15 },
    { rank: 2, team: 'Team Beta', wins: 4, losses: 2, points: 12 },
    { rank: 3, team: 'Team Gamma', wins: 3, losses: 3, points: 9 },
    { rank: 4, team: 'Team Delta', wins: 2, losses: 4, points: 6 },
  ];

  const streams = [
    {
      platform: 'twitch',
      channel: 'tournament_main',
      title: 'Main Stream',
      viewers: 1200,
    },
    {
      platform: 'youtube',
      channel: 'tournament_b',
      title: 'Secondary Stream',
      viewers: 800,
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    // TODO: Implement refresh logic
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Live Tournament
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Streams" />
          <Tab label="Leaderboard" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Bracket
                </Typography>
                <Box
                  sx={{
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  {/* TODO: Implement bracket visualization */}
                  <Typography color="text.secondary">
                    Tournament bracket visualization
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tournament Stats
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    Total Teams: 8
                  </Typography>
                  <Typography variant="body1">
                    Matches Completed: 12/28
                  </Typography>
                  <Typography variant="body1">
                    Current Round: Quarter Finals
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {streams.map((stream, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {stream.platform === 'twitch' ? (
                      <TwitchIcon sx={{ mr: 1, color: '#6441a5' }} />
                    ) : (
                      <YouTubeIcon sx={{ mr: 1, color: '#ff0000' }} />
                    )}
                    <Typography variant="h6">
                      {stream.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 aspect ratio
                      height: 0,
                      overflow: 'hidden',
                      backgroundColor: 'black',
                    }}
                  >
                    {/* TODO: Implement stream embed */}
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                      }}
                    >
                      Stream embed placeholder
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    {stream.viewers.toLocaleString()} viewers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Team</TableCell>
                <TableCell align="right">W</TableCell>
                <TableCell align="right">L</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((team) => (
                <TableRow key={team.rank}>
                  <TableCell>{team.rank}</TableCell>
                  <TableCell>{team.team}</TableCell>
                  <TableCell align="right">{team.wins}</TableCell>
                  <TableCell align="right">{team.losses}</TableCell>
                  <TableCell align="right">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default LiveTournament; 