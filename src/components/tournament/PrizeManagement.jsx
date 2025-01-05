import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

function PrizeManagement() {
  const [prizePool, setPrizePool] = useState('');
  const [distributions, setDistributions] = useState([
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ]);

  const handlePrizePoolChange = (event) => {
    const value = event.target.value;
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setPrizePool(value);
    }
  };

  const handleDistributionChange = (position, value) => {
    if (!value || /^\d*\.?\d*$/.test(value)) {
      setDistributions(prevDist =>
        prevDist.map(dist =>
          dist.position === position
            ? { ...dist, percentage: value }
            : dist
        )
      );
    }
  };

  const addPosition = () => {
    const nextPosition = distributions.length + 1;
    setDistributions([...distributions, { position: nextPosition, percentage: 0 }]);
  };

  const removePosition = (position) => {
    setDistributions(distributions.filter(dist => dist.position !== position));
  };

  const calculatePrize = (percentage) => {
    if (!prizePool || !percentage) return 0;
    return (Number(prizePool) * Number(percentage)) / 100;
  };

  const totalPercentage = distributions.reduce((sum, dist) => sum + Number(dist.percentage || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prize Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prize Pool Setup
              </Typography>
              <TextField
                fullWidth
                label="Total Prize Pool"
                value={prizePool}
                onChange={handlePrizePoolChange}
                type="text"
                InputProps={{
                  startAdornment: '$',
                }}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addPosition}
                sx={{ mr: 1 }}
              >
                Add Position
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SaveIcon />}
                disabled={totalPercentage !== 100}
              >
                Save Distribution
              </Button>
              {totalPercentage !== 100 && (
                <Typography color="error" sx={{ mt: 1 }}>
                  Total percentage must equal 100% (currently {totalPercentage}%)
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Prize Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {distributions.map((dist) => (
                  <TableRow key={dist.position}>
                    <TableCell>{dist.position}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={dist.percentage}
                        onChange={(e) => handleDistributionChange(dist.position, e.target.value)}
                        InputProps={{
                          endAdornment: '%',
                        }}
                        sx={{ width: '100px' }}
                      />
                    </TableCell>
                    <TableCell>
                      ${calculatePrize(dist.percentage).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Remove Position">
                        <IconButton
                          size="small"
                          onClick={() => removePosition(dist.position)}
                          disabled={dist.position === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PrizeManagement; 