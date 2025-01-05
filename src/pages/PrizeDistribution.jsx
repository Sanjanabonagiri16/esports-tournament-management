import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import paymentService from '../services/paymentService';
import notificationService from '../services/notificationService';

const steps = ['Verify Results', 'Review Payouts', 'Process Distribution'];

function PrizeDistribution() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [automaticPayouts, setAutomaticPayouts] = useState(true);
  const [winners, setWinners] = useState([]);
  const [prizePool, setPrizePool] = useState(0);

  useEffect(() => {
    loadTournamentResults();
  }, []);

  const loadTournamentResults = async () => {
    try {
      // TODO: Replace with actual tournament ID
      const tournamentId = 1;
      const response = await paymentService.calculatePrizeDistribution(10000, [50, 30, 20]);
      
      setWinners([
        { rank: 1, team: 'Team Alpha', prize: response.distributions[0].amount, status: 'pending', paymentDetails: '' },
        { rank: 2, team: 'Team Beta', prize: response.distributions[1].amount, status: 'pending', paymentDetails: '' },
        { rank: 3, team: 'Team Gamma', prize: response.distributions[2].amount, status: 'pending', paymentDetails: '' },
      ]);
      
      setPrizePool(response.total);
    } catch (error) {
      setError('Failed to load tournament results');
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleProcessPayouts();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentDetailsChange = (teamIndex, value) => {
    setWinners(prev => prev.map((winner, index) =>
      index === teamIndex
        ? { ...winner, paymentDetails: value }
        : winner
    ));
  };

  const handleProcessPayouts = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Process payouts for each winner
      for (const winner of winners) {
        if (automaticPayouts) {
          // Process automatic payout
          await paymentService.processPayment(winner.paymentDetails, winner.prize);
        }

        // Send notifications
        const notificationData = {
          amount: winner.prize,
          team: winner.team,
          tournamentName: 'Tournament Name', // Replace with actual tournament name
        };

        const template = notificationService.getTemplateMessage('prizeDistribution', notificationData);
        
        await Promise.all([
          notificationService.sendEmail(winner.paymentDetails, 'prize_distribution', notificationData),
          notificationService.sendSMS(winner.paymentDetails, template.sms),
          notificationService.sendWhatsApp(winner.paymentDetails, template.whatsapp),
        ]);
      }

      setWinners(prev => prev.map(winner => ({
        ...winner,
        status: 'completed'
      })));

      setSuccess('Prize distribution completed successfully!');
    } catch (error) {
      setError('Failed to process payouts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tournament Results
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Prize Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {winners.map((winner) => (
                      <TableRow key={winner.rank}>
                        <TableCell>{winner.rank}</TableCell>
                        <TableCell>{winner.team}</TableCell>
                        <TableCell align="right">${winner.prize.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={automaticPayouts}
                    onChange={(e) => setAutomaticPayouts(e.target.checked)}
                  />
                }
                label="Enable automatic payouts"
              />
              {!automaticPayouts && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Manual payment processing enabled. Please enter payment details for each team.
                </Alert>
              )}
              <Box sx={{ mt: 3 }}>
                {winners.map((winner, index) => (
                  <Card key={winner.rank} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {winner.team} - ${winner.prize.toLocaleString()}
                      </Typography>
                      <TextField
                        fullWidth
                        label="Payment Details"
                        value={winner.paymentDetails}
                        onChange={(e) => handlePaymentDetailsChange(index, e.target.value)}
                        disabled={automaticPayouts}
                        helperText={automaticPayouts ? "Automatic payout enabled" : "Enter payment information (e.g., PayPal email, bank details)"}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Distribution Summary
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {winners.map((winner) => (
                      <TableRow key={winner.rank}>
                        <TableCell>{winner.team}</TableCell>
                        <TableCell align="right">${winner.prize.toLocaleString()}</TableCell>
                        <TableCell>
                          {winner.status === 'completed' ? (
                            <Typography color="success.main">Paid</Typography>
                          ) : (
                            <Typography color="text.secondary">Pending</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Prize Distribution
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

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ mt: 2, mb: 4 }}>
              {getStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Process Payouts'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default PrizeDistribution; 