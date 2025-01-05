import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

function TournamentDetails() {
  const { id } = useParams();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Tournament Details
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tournament ID: {id}
        </Typography>
      </Box>
    </Container>
  );
}

export default TournamentDetails; 