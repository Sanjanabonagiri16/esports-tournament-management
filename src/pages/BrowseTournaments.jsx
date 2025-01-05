import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Event as EventIcon,
  People as PeopleIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { tournaments } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import TeamRegistration from '../components/tournament/TeamRegistration';

function BrowseTournaments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tournamentList, setTournamentList] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    game: '',
    status: '',
    format: '',
    prizePool: '',
  });
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const itemsPerPage = 9;

  const gameOptions = [
    'All Games',
    'League of Legends',
    'Dota 2',
    'CS:GO',
    'Valorant',
    'Overwatch',
    'Rocket League',
    'FIFA',
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const formatOptions = [
    { value: '', label: 'All Formats' },
    { value: 'single-elimination', label: 'Single Elimination' },
    { value: 'double-elimination', label: 'Double Elimination' },
    { value: 'round-robin', label: 'Round Robin' },
    { value: 'swiss', label: 'Swiss System' },
  ];

  const prizePoolOptions = [
    { value: '', label: 'Any Prize Pool' },
    { value: '1000', label: 'Up to $1,000' },
    { value: '5000', label: 'Up to $5,000' },
    { value: '10000', label: 'Up to $10,000' },
    { value: '10001', label: '$10,000+' },
  ];

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, tournamentList]);

  const loadTournaments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await tournaments.getAll();
      setTournamentList(response.data);
    } catch (error) {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const applyFilters = () => {
    let filtered = [...tournamentList];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(query) ||
          tournament.game.toLowerCase().includes(query) ||
          tournament.description.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.game && filters.game !== 'All Games') {
      filtered = filtered.filter((tournament) => tournament.game === filters.game);
    }

    if (filters.status) {
      filtered = filtered.filter((tournament) => tournament.status === filters.status);
    }

    if (filters.format) {
      filtered = filtered.filter((tournament) => tournament.format === filters.format);
    }

    if (filters.prizePool) {
      const maxPrize = parseInt(filters.prizePool);
      if (maxPrize === 10001) {
        filtered = filtered.filter((tournament) => tournament.prizePool >= maxPrize);
      } else {
        filtered = filtered.filter((tournament) => tournament.prizePool <= maxPrize);
      }
    }

    setFilteredTournaments(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      upcoming: { color: 'primary', label: 'Upcoming' },
      in_progress: { color: 'success', label: 'In Progress' },
      completed: { color: 'default', label: 'Completed' },
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  const handleRegisterClick = (tournament) => {
    setSelectedTournament(tournament);
    setRegistrationOpen(true);
  };

  const handleRegistrationClose = () => {
    setRegistrationOpen(false);
    setSelectedTournament(null);
  };

  const renderTournamentCard = (tournament) => (
    <Grid item xs={12} sm={6} md={4} key={tournament.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {tournament.name}
            </Typography>
            {getStatusChip(tournament.status)}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {tournament.registeredTeams}/{tournament.maxTeams} Teams
            </Typography>
          </Box>

          {tournament.prizePool > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrophyIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                ${tournament.prizePool.toLocaleString()} Prize Pool
              </Typography>
            </Box>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {tournament.description}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            size="small"
            onClick={() => navigate(`/tournaments/${tournament.id}`)}
          >
            View Details
          </Button>
          {tournament.status === 'upcoming' && (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleRegisterClick(tournament)}
            >
              Register
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Browse Tournaments
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Game</InputLabel>
                <Select
                  name="game"
                  value={filters.game}
                  onChange={handleFilterChange}
                  label="Game"
                >
                  {gameOptions.map((game) => (
                    <MenuItem key={game} value={game}>
                      {game}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  name="format"
                  value={filters.format}
                  onChange={handleFilterChange}
                  label="Format"
                >
                  {formatOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Prize Pool</InputLabel>
                <Select
                  name="prizePool"
                  value={filters.prizePool}
                  onChange={handleFilterChange}
                  label="Prize Pool"
                >
                  {prizePoolOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredTournaments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No tournaments found
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredTournaments
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map(renderTournamentCard)}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}
      </Box>

      <TeamRegistration
        open={registrationOpen}
        onClose={handleRegistrationClose}
        tournament={selectedTournament}
      />
    </Container>
  );
}

export default BrowseTournaments; 