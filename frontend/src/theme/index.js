import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // Blue-500
      light: '#60A5FA', // Blue-400
      dark: '#2563EB', // Blue-600
    },
    secondary: {
      main: '#8B5CF6', // Purple-500
      light: '#A78BFA', // Purple-400
      dark: '#7C3AED', // Purple-600
    },
    background: {
      default: '#111827', // Gray-900
      paper: '#1F2937', // Gray-800
      card: '#374151', // Gray-700
    },
    text: {
      primary: '#F9FAFB', // Gray-50
      secondary: '#D1D5DB', // Gray-300
      disabled: '#9CA3AF', // Gray-400
    },
    action: {
      active: '#60A5FA', // Blue-400
      hover: 'rgba(96, 165, 250, 0.08)',
      selected: 'rgba(96, 165, 250, 0.16)',
    },
    success: {
      main: '#10B981', // Emerald-500
      light: '#34D399', // Emerald-400
      dark: '#059669', // Emerald-600
    },
    error: {
      main: '#EF4444', // Red-500
      light: '#F87171', // Red-400
      dark: '#DC2626', // Red-600
    },
    warning: {
      main: '#F59E0B', // Amber-500
      light: '#FBBF24', // Amber-400
      dark: '#D97706', // Amber-600
    },
    info: {
      main: '#06B6D4', // Cyan-500
      light: '#22D3EE', // Cyan-400
      dark: '#0891B2', // Cyan-600
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          }
        },
        contained: {
          backgroundImage: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
          '&:hover': {
            backgroundImage: 'linear-gradient(to right, #2563EB, #7C3AED)',
          }
        }
      }
    }
  }
}); 