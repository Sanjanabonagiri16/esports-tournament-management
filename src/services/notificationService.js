import api from './api';

class NotificationService {
  async sendEmail(to, templateId, data) {
    try {
      const response = await api.post('/notifications/email', {
        to,
        templateId,
        data,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }

  async sendSMS(to, message) {
    try {
      const response = await api.post('/notifications/sms', {
        to,
        message,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send SMS');
    }
  }

  async sendWhatsApp(to, message) {
    try {
      const response = await api.post('/notifications/whatsapp', {
        to,
        message,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send WhatsApp message');
    }
  }

  async sendTournamentInvite(tournamentId, teamId) {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/invite`, {
        teamId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send tournament invitation');
    }
  }

  async sendTeamInvite(teamId, userId) {
    try {
      const response = await api.post(`/teams/${teamId}/invite`, {
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send team invitation');
    }
  }

  async notifyMatchResult(matchId, result) {
    try {
      const response = await api.post(`/matches/${matchId}/notify`, {
        result,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send match result notification');
    }
  }

  async notifyPrizeDistribution(tournamentId, winners) {
    try {
      const response = await api.post(`/tournaments/${tournamentId}/notify-prizes`, {
        winners,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send prize distribution notification');
    }
  }

  async getNotificationPreferences(userId) {
    try {
      const response = await api.get(`/users/${userId}/notification-preferences`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notification preferences');
    }
  }

  async updateNotificationPreferences(userId, preferences) {
    try {
      const response = await api.put(`/users/${userId}/notification-preferences`, preferences);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update notification preferences');
    }
  }

  // Template messages
  getTemplateMessage(type, data) {
    const templates = {
      tournamentInvite: {
        email: {
          subject: 'Tournament Invitation',
          body: `You've been invited to participate in ${data.tournamentName}. Click here to join: ${data.inviteLink}`,
        },
        sms: `You've been invited to ${data.tournamentName}. Join here: ${data.inviteLink}`,
        whatsapp: `🎮 Tournament Invitation!\n\nYou've been invited to participate in ${data.tournamentName}.\n\nJoin here: ${data.inviteLink}`,
      },
      matchSchedule: {
        email: {
          subject: 'Match Schedule Update',
          body: `Your match against ${data.opponent} is scheduled for ${data.datetime}. Prepare for battle!`,
        },
        sms: `Match scheduled: You vs ${data.opponent} at ${data.datetime}`,
        whatsapp: `🎯 Match Schedule\n\nYou vs ${data.opponent}\nTime: ${data.datetime}\n\nGood luck!`,
      },
      matchResult: {
        email: {
          subject: 'Match Results',
          body: `Match results: ${data.team1} ${data.score1} - ${data.score2} ${data.team2}`,
        },
        sms: `Match ended: ${data.team1} ${data.score1}-${data.score2} ${data.team2}`,
        whatsapp: `🏆 Match Results\n\n${data.team1} ${data.score1} - ${data.score2} ${data.team2}\n\nCongratulations to the winner!`,
      },
      prizeDistribution: {
        email: {
          subject: 'Prize Distribution Update',
          body: `Congratulations! Your prize of $${data.amount} has been processed and will be transferred to your account.`,
        },
        sms: `Prize alert: $${data.amount} will be transferred to your account`,
        whatsapp: `💰 Prize Distribution\n\nCongratulations!\nYour prize of $${data.amount} has been processed.\n\nCheck your account for details.`,
      },
    };

    return templates[type] || null;
  }
}

export default new NotificationService(); 