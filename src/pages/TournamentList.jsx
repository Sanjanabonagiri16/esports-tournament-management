import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function TournamentList() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Tournament List
        </Typography>
      </Box>
    </Container>
  );
}

export default TournamentList; 