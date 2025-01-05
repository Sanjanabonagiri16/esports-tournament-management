import React, { useState, useEffect } from 'react';
import BracketManagement from '../../components/BracketManagement/BracketManagement';
import TournamentList from '../../components/TournamentList/TournamentList';
import { Box, Container, Typography, Tab, Tabs } from '@mui/material';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tournaments, setTournaments] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ my: 4 }}>
        Tournament Organizer Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Active Tournaments" />
          <Tab label="Bracket Management" />
          <Tab label="Tournament Settings" />
        </Tabs>
      </Box>

      {activeTab === 0 && <TournamentList tournaments={tournaments} />}
      {activeTab === 1 && <BracketManagement />}
      {activeTab === 2 && <TournamentSettings />}
    </Container>
  );
};

export default OrganizerDashboard; 