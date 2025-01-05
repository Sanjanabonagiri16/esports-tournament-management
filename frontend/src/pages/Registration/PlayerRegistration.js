import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Button,
  Typography
} from '@mui/material';
import AccountSetup from './steps/AccountSetup';
import TeamSelection from './steps/TeamSelection';
import ProfileCompletion from './steps/ProfileCompletion';
import { userService } from '../../services/userService';

const steps = ['Account Setup', 'Team Selection', 'Profile Completion'];

const PlayerRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    account: {
      username: '',
      email: '',
      password: ''
    },
    team: {
      selectedTeam: null,
      createNewTeam: false,
      newTeamData: null
    },
    profile: {
      displayName: '',
      gameIds: {},
      socialLinks: {}
    }
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await userService.completeRegistration(formData);
        // Redirect to player portal
      } catch (error) {
        console.error('Registration error:', error);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <AccountSetup 
            data={formData.account}
            onChange={(accountData) => setFormData({ ...formData, account: accountData })}
          />
        );
      case 1:
        return (
          <TeamSelection
            data={formData.team}
            onChange={(teamData) => setFormData({ ...formData, team: teamData })}
          />
        );
      case 2:
        return (
          <ProfileCompletion
            data={formData.profile}
            onChange={(profileData) => setFormData({ ...formData, profile: profileData })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Player Registration
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {renderStepContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
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
  );
};

export default PlayerRegistration; 