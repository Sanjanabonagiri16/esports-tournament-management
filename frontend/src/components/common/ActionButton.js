import React from 'react';
import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme, color = 'primary' }) => ({
  background: `linear-gradient(to right, 
    ${theme.palette[color].main}, 
    ${theme.palette[color].dark})`,
  color: theme.palette.common.white,
  padding: '10px 24px',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[4],
  }
}));

export const ActionButton = ({ children, color, ...props }) => {
  return (
    <StyledButton color={color} {...props}>
      {children}
    </StyledButton>
  );
}; 