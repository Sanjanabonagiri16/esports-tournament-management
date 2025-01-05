import axios from 'axios';

const BASE_URL = '/api/payments';

export const paymentService = {
  async processEntryFee(tournamentId, paymentMethodId) {
    try {
      const response = await axios.post(`${BASE_URL}/process-entry-fee`, {
        tournamentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment processing failed');
    }
  },

  async initializePrizePayment(tournamentId, teamId) {
    try {
      const response = await axios.post(`${BASE_URL}/initialize-prize-payment`, {
        tournamentId,
        teamId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Prize payment initialization failed');
    }
  },

  async getPaymentHistory(tournamentId) {
    try {
      const response = await axios.get(`${BASE_URL}/history/${tournamentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment history');
    }
  }
}; 