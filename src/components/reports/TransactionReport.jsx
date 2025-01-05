import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { transactionLogService } from '@/services/transactionLog';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

function TransactionReport() {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await transactionLogService.getTransactionLogs({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setTransactions(response.data);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await transactionLogService.generateTransactionReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transaction-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transaction Report
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            Generate Report
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownloadReport}
            disabled={loading || transactions.length === 0}
          >
            Download PDF
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'PPP')}</TableCell>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.recipient}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default TransactionReport; 