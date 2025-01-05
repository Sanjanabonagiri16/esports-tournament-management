import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  FormHelperText,
  Divider,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tournaments } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  'Basic Information',
  'Tournament Format',
  'Prize Setup',
  'Team Registration',
];

function CreateTournament() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    format: '',
    maxTeams: '',
    prizePool: '',
    prizeDistribution: [
      { position: 1, percentage: 50 },
      { position: 2, percentage: 30 },
      { position: 3, percentage: 20 },
    ],
    teamSize: '',
    allowSubstitutes: true,
    maxSubstitutes: 2,
    rules: '',
    streamingPlatform: '',
    streamLink: '',
  });

  const [errors, setErrors] = useState({});

  const gameOptions = [
    'League of Legends',
    'Dota 2',
    'CS:GO',
    'Valorant',
    'Overwatch',
    'Rocket League',
    'FIFA',
  ];

  const formatOptions = [
    { value: 'single-elimination', label: 'Single Elimination' },
    { value: 'double-elimination', label: 'Double Elimination' },
    { value: 'round-robin', label: 'Round Robin' },
    { value: 'swiss', label: 'Swiss System' },
  ];

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0: // Basic Information
        if (!formData.name) newErrors.name = 'Tournament name is required';
        if (!formData.game) newErrors.game = 'Game selection is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.registrationDeadline)
          newErrors.registrationDeadline = 'Registration deadline is required';
        if (new Date(formData.startDate) <= new Date())
          newErrors.startDate = 'Start date must be in the future';
        if (new Date(formData.endDate) <= new Date(formData.startDate))
          newErrors.endDate = 'End date must be after start date';
        if (new Date(formData.registrationDeadline) >= new Date(formData.startDate))
          newErrors.registrationDeadline =
            'Registration deadline must be before start date';
        break;

      case 1: // Tournament Format
        if (!formData.format) newErrors.format = 'Tournament format is required';
        if (!formData.maxTeams) newErrors.maxTeams = 'Maximum teams is required';
        if (formData.maxTeams < 4)
          newErrors.maxTeams = 'Minimum 4 teams are required';
        if (!formData.teamSize) newErrors.teamSize = 'Team size is required';
        if (formData.teamSize < 1)
          newErrors.teamSize = 'Team size must be at least 1';
        break;

      case 2: // Prize Setup
        if (!formData.prizePool) newErrors.prizePool = 'Prize pool is required';
        if (formData.prizePool < 0)
          newErrors.prizePool = 'Prize pool cannot be negative';
        const totalPercentage = formData.prizeDistribution.reduce(
          (sum, prize) => sum + prize.percentage,
          0
        );
        if (totalPercentage !== 100)
          newErrors.prizeDistribution = 'Prize distribution must total 100%';
        break;

      case 3: // Team Registration
        if (!formData.rules) newErrors.rules = 'Tournament rules are required';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const response = await tournaments.create(formData);
      navigate(`/tournaments/${response.data.id}`);
    } catch (error) {
      setError('Failed to create tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPrizePosition = () => {
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: [
        ...prev.prizeDistribution,
        {
          position: prev.prizeDistribution.length + 1,
          percentage: 0,
        },
      ],
    }));
  };

  const removePrizePosition = (index) => {
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: prev.prizeDistribution.filter((_, i) => i !== index),
    }));
  };

  const handlePrizeDistributionChange = (index, value) => {
    const newValue = Math.min(Math.max(0, value), 100);
    setFormData((prev) => ({
      ...prev,
      prizeDistribution: prev.prizeDistribution.map((prize, i) =>
        i === index ? { ...prize, percentage: newValue } : prize
      ),
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tournament Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.game}>
                <InputLabel>Game</InputLabel>
                <Select
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  label="Game"
                >
                  {gameOptions.map((game) => (
                    <MenuItem key={game} value={game}>
                      {game}
                    </MenuItem>
                  ))}
                </Select>
                {errors.game && <FormHelperText>{errors.game}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="datetime-local"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Registration Deadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                error={!!errors.registrationDeadline}
                helperText={errors.registrationDeadline}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.format}>
                <InputLabel>Tournament Format</InputLabel>
                <Select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  label="Tournament Format"
                >
                  {formatOptions.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.format && <FormHelperText>{errors.format}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Teams"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleInputChange}
                error={!!errors.maxTeams}
                helperText={errors.maxTeams}
                InputProps={{ inputProps: { min: 4 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Team Size"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                error={!!errors.teamSize}
                helperText={errors.teamSize}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Substitutes"
                name="maxSubstitutes"
                value={formData.maxSubstitutes}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prize Pool ($)"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleInputChange}
                error={!!errors.prizePool}
                helperText={errors.prizePool}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Prize Distribution
                </Typography>
                {errors.prizeDistribution && (
                  <FormHelperText error>{errors.prizeDistribution}</FormHelperText>
                )}
              </Box>

              {formData.prizeDistribution.map((prize, index) => (
                <Box
                  key={prize.position}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ minWidth: 100 }}>
                    {index + 1}
                    {index === 0
                      ? 'st'
                      : index === 1
                      ? 'nd'
                      : index === 2
                      ? 'rd'
                      : 'th'}{' '}
                    Place
                  </Typography>
                  <TextField
                    type="number"
                    value={prize.percentage}
                    onChange={(e) =>
                      handlePrizeDistributionChange(index, Number(e.target.value))
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                      inputProps: { min: 0, max: 100 },
                    }}
                    sx={{ width: 120 }}
                  />
                  {formData.prizePool > 0 && (
                    <Typography color="text.secondary">
                      $
                      {((formData.prizePool * prize.percentage) / 100).toLocaleString()}
                    </Typography>
                  )}
                  {index > 2 && (
                    <IconButton
                      size="small"
                      onClick={() => removePrizePosition(index)}
                      color="error"
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addPrizePosition}
                disabled={formData.prizeDistribution.length >= 8}
              >
                Add Prize Position
              </Button>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Tournament Rules"
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                error={!!errors.rules}
                helperText={errors.rules}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Streaming Platform</InputLabel>
                <Select
                  name="streamingPlatform"
                  value={formData.streamingPlatform}
                  onChange={handleInputChange}
                  label="Streaming Platform"
                >
                  <MenuItem value="twitch">Twitch</MenuItem>
                  <MenuItem value="youtube">YouTube</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stream Link"
                name="streamLink"
                value={formData.streamLink}
                onChange={handleInputChange}
              />
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
          Create Tournament
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Create Tournament
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreateTournament; 