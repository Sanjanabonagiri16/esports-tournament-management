import React from 'react';
import { 
  Paper, 
  Typography, 
  Box,
  IconButton,
  Tooltip 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const BracketNode = ({ match, onUpdateResult }) => {
  const handleWinnerSelection = (teamId) => {
    onUpdateResult(match._id, teamId);
  };

  return (
    <Paper 
      elevation={2}
      sx={{
        p: 1,
        minWidth: 180,
        backgroundColor: match.status === 'COMPLETED' ? '#f5f5f5' : '#fff'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2">
            {match.team1?.name || 'TBD'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mx: 1 }}>
          {match.score?.team1Score || 0}
        </Typography>
        {match.status !== 'COMPLETED' && (
          <Tooltip title="Set as winner">
            <IconButton 
              size="small"
              onClick={() => handleWinnerSelection(match.team1?._id)}
            >
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2">
            {match.team2?.name || 'TBD'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mx: 1 }}>
          {match.score?.team2Score || 0}
        </Typography>
        {match.status !== 'COMPLETED' && (
          <Tooltip title="Set as winner">
            <IconButton 
              size="small"
              onClick={() => handleWinnerSelection(match.team2?._id)}
            >
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default BracketNode; 