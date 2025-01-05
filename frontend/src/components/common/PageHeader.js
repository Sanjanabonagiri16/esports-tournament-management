import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.dark} 0%, 
    ${theme.palette.secondary.dark} 100%)`,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  color: theme.palette.common.white,
}));

export const PageHeader = ({ title, subtitle }) => {
  return (
    <HeaderContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </HeaderContainer>
  );
}; 