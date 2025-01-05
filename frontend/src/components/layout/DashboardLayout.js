import React from 'react';
import { Box, Container, styled } from '@mui/material';

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.background.default,
  minHeight: '100vh',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  background: `radial-gradient(
    circle at top right,
    ${theme.palette.primary.dark}20,
    transparent 40%
  )`,
}));

export const DashboardLayout = ({ children }) => {
  return (
    <LayoutRoot>
      <MainContent>
        <Container maxWidth="xl">
          {children}
        </Container>
      </MainContent>
    </LayoutRoot>
  );
}; 