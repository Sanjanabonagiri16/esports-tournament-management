import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Esports Tournament Management
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Organize and manage your esports tournaments with ease
        </Typography>

        {!user && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register/organizer')}
            >
              Register as Organizer
            </Button>
          </Box>
        )}

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Tournament Organization
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create and manage tournaments with various formats, including single elimination,
                  double elimination, and round-robin.
                </Typography>
              </CardContent>
              <CardActions>
                {user?.role === 'organizer' ? (
                  <Button onClick={() => navigate('/organizer/dashboard')}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/register/organizer')}>
                    Become an Organizer
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Team Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Register teams, manage rosters, and track team performance throughout the
                  tournament.
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => navigate('/tournaments')}>
                  Browse Tournaments
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  Prize Distribution
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Set up prize pools and automate prize distribution to winning teams and
                  players.
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => navigate('/register/player')}>
                  Register as Player
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 8, p: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h4" gutterBottom align="center">
            Ready to get started?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join our platform and take your esports tournaments to the next level.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register/organizer')}
            >
              Create Tournament
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/tournaments')}
            >
              Browse Tournaments
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 