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
import BasicInfo from './steps/BasicInfo';
import FormatSetup from './steps/FormatSetup';
import PrizeSetup from './steps/PrizeSetup';
import StreamingSetup from './steps/StreamingSetup';
import { tournamentService } from '../../services/tournamentService';

const steps = [
  'Basic Information',
  'Tournament Format',
  'Prize Setup',
  'Streaming Setup'
];

const TournamentSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tournamentData, setTournamentData] = useState({
    basic: {
      name: '',
      game: '',
      startDate: null,
      endDate: null,
      registrationDeadline: null,
      maxTeams: 0
    },
    format: {
      type: 'SINGLE_ELIMINATION',
      settings: {}
    },
    prize: {
      prizePool: 0,
      distribution: []
    },
    streaming: {
      platform: '',
      channelUrl: '',
      streamKey: ''
    }
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await tournamentService.createTournament(tournamentData);
        // Redirect to tournament dashboard
      } catch (error) {
        console.error('Tournament creation error:', error);
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
          <BasicInfo
            data={tournamentData.basic}
            onChange={(basicData) => setTournamentData({ ...tournamentData, basic: basicData })}
          />
        );
      case 1:
        return (
          <FormatSetup
            data={tournamentData.format}
            onChange={(formatData) => setTournamentData({ ...tournamentData, format: formatData })}
          />
        );
      case 2:
        return (
          <PrizeSetup
            data={tournamentData.prize}
            onChange={(prizeData) => setTournamentData({ ...tournamentData, prize: prizeData })}
          />
        );
      case 3:
        return (
          <StreamingSetup
            data={tournamentData.streaming}
            onChange={(streamingData) => setTournamentData({ ...tournamentData, streaming: streamingData })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Create Tournament
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
              {activeStep === steps.length - 1 ? 'Create Tournament' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TournamentSetup; 