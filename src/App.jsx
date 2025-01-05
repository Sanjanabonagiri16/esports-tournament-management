import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/layout/Navigation';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import OrganizerRegistration from './pages/OrganizerRegistration';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateTournament from './pages/CreateTournament';
import TournamentList from './pages/TournamentList';
import TournamentDetails from './pages/TournamentDetails';
import PlayerRegistration from './pages/PlayerRegistration';
import MatchManagement from './pages/MatchManagement';
import PrizeDistribution from './pages/PrizeDistribution';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/organizer" element={<OrganizerRegistration />} />
            <Route path="/tournaments" element={<TournamentList />} />
            <Route path="/tournaments/:id" element={<TournamentDetails />} />
            <Route path="/register/player" element={<PlayerRegistration />} />

            {/* Protected Organizer Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/tournaments/create"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateTournament />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/matches/:id"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <MatchManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/prizes/:id"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <PrizeDistribution />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 