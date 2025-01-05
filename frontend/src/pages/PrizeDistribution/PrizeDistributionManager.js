import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { paymentService } from '../../services/paymentService';

const PrizeDistributionManager = ({ tournamentId }) => {
  const [prizeData, setPrizeData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchPrizeData();
  }, [tournamentId]);

  const fetchPrizeData = async () => {
    try {
      const data = await paymentService.getPrizeDistribution(tournamentId);
      setPrizeData(data);
    } catch (error) {
      console.error('Error fetching prize data:', error);
    }
  };

  const handleInitiatePayout = async (teamId) => {
    try {
      await paymentService.initializePrizePayment(tournamentId, teamId);
      fetchPrizeData();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error initiating payout:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Prize Distribution
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Prize Pool: ${prizeData?.totalPrizePool}
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Team</TableCell>
                <TableCell align="right">Prize Amount</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prizeData?.distributions.map((dist) => (
                <TableRow key={dist.position}>
                  <TableCell>{dist.position}</TableCell>
                  <TableCell>{dist.team.name}</TableCell>
                  <TableCell align="right">${dist.amount}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={dist.paymentStatus}
                      color={dist.paymentStatus === 'COMPLETED' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={dist.paymentStatus === 'COMPLETED'}
                      onClick={() => {
                        setSelectedTeam(dist.team);
                        setOpenDialog(true);
                      }}
                    >
                      Initiate Payout
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Prize Payout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to initiate the prize payout for {selectedTeam?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleInitiatePayout(selectedTeam?._id)}
          >
            Confirm Payout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrizeDistributionManager; 