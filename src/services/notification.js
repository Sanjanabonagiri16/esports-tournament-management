import api from './api';

export const sendInvitation = async (emails, tournamentId) => {
  try {
    const response = await api.post('/notifications/invite', {
      emails,
      tournamentId
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send invitations');
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify email');
  }
}; 