import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Account Details', 'Player Profile', 'Team Selection'];

function PlayerRegistration() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    gameId: '',
    teamOption: 'join', // 'join' or 'create'
    teamName: '',
    teamCode: '',
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await handleRegistration();
      } catch (error) {
        setError(error.message);
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistration = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.fullName,
        gameId: formData.gameId,
        team: formData.teamOption === 'create' ? {
          name: formData.teamName,
          captain: true,
        } : {
          code: formData.teamCode,
          captain: false,
        },
      });
      navigate('/tournaments');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Username"
                fullWidth
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="fullName"
                label="Full Name"
                fullWidth
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="gameId"
                label="Game ID"
                fullWidth
                value={formData.gameId}
                onChange={handleInputChange}
                required
                helperText="Your in-game identifier"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Team Option</InputLabel>
                <Select
                  name="teamOption"
                  value={formData.teamOption}
                  onChange={handleInputChange}
                >
                  <MenuItem value="join">Join Existing Team</MenuItem>
                  <MenuItem value="create">Create New Team</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.teamOption === 'create' ? (
              <Grid item xs={12}>
                <TextField
                  name="teamName"
                  label="Team Name"
                  fullWidth
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  name="teamCode"
                  label="Team Code"
                  fullWidth
                  value={formData.teamCode}
                  onChange={handleInputChange}
                  required
                  helperText="Enter the team code provided by your team captain"
                />
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Player Registration
        </Typography>

        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 2 }}>
              {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Complete Registration' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default PlayerRegistration; 