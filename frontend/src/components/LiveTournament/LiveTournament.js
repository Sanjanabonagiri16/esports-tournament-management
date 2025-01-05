import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import { io } from 'socket.io-client';
import BracketDisplay from './BracketDisplay';
import LeaderboardTable from './LeaderboardTable';
import StreamEmbed from './StreamEmbed';

const LiveTournament = ({ tournamentId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [tournamentData, setTournamentData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('join-tournament', tournamentId);
    });

    socket.on('tournament-update', (data) => {
      setTournamentData(data);
    });

    socket.on('leaderboard-update', (data) => {
      setLeaderboard(data);
    });

    socket.on('stream-update', (url) => {
      setStreamUrl(url);
    });

    return () => {
      socket.disconnect();
    };
  }, [tournamentId]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {tournamentData?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {tournamentData?.game}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stream Section */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <StreamEmbed url={streamUrl} />
            </CardContent>
          </Card>
        </Grid>

        {/* Live Updates Section */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                <Tab label="Bracket" />
                <Tab label="Leaderboard" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 ? (
                  <BracketDisplay matches={tournamentData?.matches || []} />
                ) : (
                  <LeaderboardTable teams={leaderboard} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveTournament; 