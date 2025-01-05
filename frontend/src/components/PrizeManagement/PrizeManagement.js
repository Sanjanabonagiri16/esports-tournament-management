import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { tournamentService } from '../../services/tournamentService';

const PrizeManagement = ({ tournamentId }) => {
  const [prizePool, setPrizePool] = useState(0);
  const [distribution, setDistribution] = useState([
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 }
  ]);

  useEffect(() => {
    fetchPrizeData();
  }, [tournamentId]);

  const fetchPrizeData = async () => {
    const data = await tournamentService.getTournamentPrizes(tournamentId);
    setPrizePool(data.prizePool);
    setDistribution(data.distribution);
  };

  const handleSave = async () => {
    try {
      await tournamentService.updatePrizeDistribution(tournamentId, {
        prizePool,
        distribution
      });
    } catch (error) {
      console.error('Error saving prize distribution:', error);
    }
  };

  const calculatePrizeAmount = (percentage) => {
    return (prizePool * percentage) / 100;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Prize Management</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Prize Pool</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="number"
              label="Total Prize Pool"
              value={prizePool}
              onChange={(e) => setPrizePool(Number(e.target.value))}
              InputProps={{
                startAdornment: <Typography>$</Typography>
              }}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Prize Distribution</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distribution.map((item, index) => (
                <TableRow key={item.position}>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.percentage}
                      onChange={(e) => {
                        const newDist = [...distribution];
                        newDist[index].percentage = Number(e.target.value);
                        setDistribution(newDist);
                      }}
                      InputProps={{
                        endAdornment: <Typography>%</Typography>
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    ${calculatePrizeAmount(item.percentage).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setDistribution(distribution.filter((_, i) => i !== index));
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setDistribution([
                ...distribution,
                { position: distribution.length + 1, percentage: 0 }
              ]);
            }}
          >
            Add Position
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrizeManagement; 