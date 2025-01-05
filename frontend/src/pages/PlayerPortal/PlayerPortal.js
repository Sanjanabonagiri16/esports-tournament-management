import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Typography 
} from '@mui/material';
import TournamentRegistration from '../../components/TournamentRegistration/TournamentRegistration';
import TeamRegistration from '../../components/TeamRegistration/TeamRegistration';
import PlayerProfile from '../../components/PlayerProfile/PlayerProfile';
import GameSchedule from '../../components/GameSchedule/GameSchedule';

const PlayerPortal = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ my: 4 }}>
        Player Portal
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Tournament Registration" />
          <Tab label="Team Management" />
          <Tab label="Game Schedule" />
          <Tab label="My Profile" />
        </Tabs>
      </Box>

      {activeTab === 0 && <TournamentRegistration />}
      {activeTab === 1 && <TeamRegistration />}
      {activeTab === 2 && <GameSchedule />}
      {activeTab === 3 && <PlayerProfile />}
    </Container>
  );
};

export default PlayerPortal; 