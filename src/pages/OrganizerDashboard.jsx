import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { tournaments } from '../services/api';
import RegistrationManagement from '../components/organizer/RegistrationManagement';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await tournaments.getAll({ organizerId: user.id });
      setTournaments(response.data);
      if (response.data.length > 0) {
        setSelectedTournament(response.data[0]);
      }
    } catch (error) {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTournamentChange = (tournamentId) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    setSelectedTournament(tournament);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tournament Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {tournaments.length === 0 ? (
          <Alert severity="info">
            You haven't created any tournaments yet. Create your first tournament to get started.
          </Alert>
        ) : (
          <>
            <Paper sx={{ mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Overview" />
                <Tab label="Registrations" />
                <Tab label="Brackets" />
                <Tab label="Matches" />
                <Tab label="Prizes" />
              </Tabs>
            </Paper>

            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Active Tournaments
                      </Typography>
                      <Typography variant="h3">
                        {tournaments.filter((t) => t.status === 'active').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Total Participants
                      </Typography>
                      <Typography variant="h3">
                        {tournaments.reduce((sum, t) => sum + (t.registeredTeams || 0), 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {selectedTournament && (
                <RegistrationManagement tournamentId={selectedTournament.id} />
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {/* Bracket Management Component */}
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              {/* Match Management Component */}
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              {/* Prize Management Component */}
            </TabPanel>
          </>
        )}
      </Box>
    </Container>
  );
} 