import api from './api';

export const transactionLogService = {
  async logTransaction(transactionData) {
    try {
      const response = await api.post('/transactions/log', transactionData);
      return response.data;
    } catch (error) {
      console.error('Failed to log transaction:', error);
      throw error;
    }
  },

  async getTransactionLogs(filters) {
    try {
      const response = await api.get('/transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transaction logs:', error);
      throw error;
    }
  },

  async generateTransactionReport(reportParams) {
    try {
      const response = await api.post('/transactions/reports', reportParams, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate transaction report:', error);
      throw error;
    }
  }
}; 