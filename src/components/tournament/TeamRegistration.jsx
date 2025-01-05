import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { tournaments, teams } from '../../services/api';

const steps = ['Team Details', 'Payment', 'Confirmation'];

export default function TeamRegistration({ open, onClose, tournament }) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [formData, setFormData] = useState({
    teamName: '',
    gameMode: '',
    participants: [],
    joinCode: '',
    paymentMethod: '',
  });

  const calculateRegistrationFee = () => {
    const basePrice = tournament.registrationFee || 10; // Default base price if not set
    const participantCount = formData.participants.length;
    return basePrice * participantCount;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData((prev) => ({
      ...prev,
      participants: newParticipants,
    }));
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, ''],
    }));
  };

  const removeParticipant = (index) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleJoinTeam = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await teams.joinWithCode(teamCode);
      // Handle successful team join
      onClose();
    } catch (error) {
      setError('Invalid team code or team is full');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Create payment intent
      const amount = calculateRegistrationFee();
      const paymentIntent = await tournaments.createPaymentIntent({
        amount,
        tournamentId: tournament.id,
        teamName: formData.teamName,
      });

      // Process payment using Stripe or other payment gateway
      const { clientSecret } = paymentIntent.data;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Move to next step after successful payment
      setActiveStep((prev) => prev + 1);
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Create team
      const teamResponse = await teams.create({
        name: formData.teamName,
        gameMode: formData.gameMode,
        participants: formData.participants,
        tournamentId: tournament.id,
      });

      // Send confirmation notifications
      await Promise.all([
        // Send email notification
        tournaments.sendEmailConfirmation({
          tournamentId: tournament.id,
          teamId: teamResponse.data.id,
          email: user.email,
        }),
        // Send WhatsApp notification
        tournaments.sendWhatsAppConfirmation({
          tournamentId: tournament.id,
          teamId: teamResponse.data.id,
          phone: user.phone,
        }),
      ]);

      onClose();
    } catch (error) {
      setError('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Team Name"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Game Mode</InputLabel>
              <Select
                name="gameMode"
                value={formData.gameMode}
                onChange={handleInputChange}
                label="Game Mode"
              >
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="competitive">Competitive</MenuItem>
                <MenuItem value="ranked">Ranked</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Team Participants
            </Typography>

            {formData.participants.map((participant, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Participant ${index + 1}`}
                  value={participant}
                  onChange={(e) => handleParticipantChange(index, e.target.value)}
                />
                <Button
                  color="error"
                  onClick={() => removeParticipant(index)}
                  disabled={index === 0}
                >
                  Remove
                </Button>
              </Box>
            ))}

            <Button
              onClick={addParticipant}
              disabled={formData.participants.length >= tournament.maxTeamSize}
            >
              Add Participant
            </Button>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              - OR -
            </Typography>

            <TextField
              fullWidth
              label="Join Existing Team (Enter Code)"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Registration Fee
            </Typography>
            <Typography variant="body1" gutterBottom>
              Base Price per Participant: ${tournament.registrationFee || 10}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Number of Participants: {formData.participants.length}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Total Amount: ${calculateRegistrationFee()}
            </Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                label="Payment Method"
              >
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="netbanking">Net Banking</MenuItem>
              </Select>
            </FormControl>

            {formData.paymentMethod === 'card' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  sx={{ mb: 2 }}
                  InputProps={{
                    inputProps: { maxLength: 16 },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Expiry Date"
                    sx={{ width: '50%' }}
                    placeholder="MM/YY"
                    InputProps={{
                      inputProps: { maxLength: 5 },
                    }}
                  />
                  <TextField
                    label="CVV"
                    sx={{ width: '50%' }}
                    InputProps={{
                      inputProps: { maxLength: 3 },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Registration Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Team code: {formData.joinCode || 'Generating...'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Confirmation details have been sent to your email and WhatsApp.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && teamCode) {
      handleJoinTeam();
    } else if (activeStep === 1) {
      handlePayment();
    } else if (activeStep === 2) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {teamCode ? 'Join Team' : 'Register Team'}
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {activeStep === steps.length - 1
            ? 'Complete Registration'
            : activeStep === 1
            ? 'Process Payment'
            : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 