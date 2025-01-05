import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { analyticsService } from '../../../services/analyticsService';

const TournamentAnalytics = ({ tournamentId }) => {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [tournamentId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const analyticsData = await analyticsService.getTournamentAnalytics(tournamentId, timeRange);
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!data) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Tournament Analytics</Typography>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          size="small"
        >
          <MenuItem value="day">Last 24 Hours</MenuItem>
          <MenuItem value="week">Last Week</MenuItem>
          <MenuItem value="month">Last Month</MenuItem>
        </Select>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Participants
              </Typography>
              <Typography variant="h4">
                {data.totalParticipants}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Matches Completed
              </Typography>
              <Typography variant="h4">
                {data.matchesCompleted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Average Match Duration
              </Typography>
              <Typography variant="h4">
                {data.avgMatchDuration} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Prize Pool
              </Typography>
              <Typography variant="h4">
                ${data.totalPrizePool}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Viewer Engagement Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Viewer Engagement
              </Typography>
              <LineChart width={500} height={300} data={data.viewerEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="viewers" stroke="#8884d8" />
                <Line type="monotone" dataKey="chatActivity" stroke="#82ca9d" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Player Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Teams
              </Typography>
              <BarChart width={500} height={300} data={data.teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#8884d8" />
                <Bar dataKey="winRate" fill="#82ca9d" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TournamentAnalytics; 