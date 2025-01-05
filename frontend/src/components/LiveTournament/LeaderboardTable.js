import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Typography
} from '@mui/material';

const LeaderboardTable = ({ teams }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Rank</TableCell>
          <TableCell>Team</TableCell>
          <TableCell align="center">Matches</TableCell>
          <TableCell align="center">W/L</TableCell>
          <TableCell align="center">Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map((team, index) => (
          <TableRow key={team._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={team.logo} sx={{ mr: 1 }} />
                <Typography variant="body2">{team.name}</Typography>
              </Box>
            </TableCell>
            <TableCell align="center">{team.matchesPlayed}</TableCell>
            <TableCell align="center">{team.wins}/{team.losses}</TableCell>
            <TableCell align="center">{team.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable; 