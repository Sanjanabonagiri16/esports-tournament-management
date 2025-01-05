import api from './api';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const paymentService = {
  // Initialize payment methods
  async initializeStripe() {
    return await stripePromise;
  },

  // Process Stripe payment
  async processStripePayment(paymentDetails) {
    try {
      const stripe = await stripePromise;
      const response = await api.post('/payments/stripe/create-intent', paymentDetails);
      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: paymentDetails.cardElement,
          billing_details: {
            name: paymentDetails.name,
            email: paymentDetails.email
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      throw new Error(`Payment failed: ${error.message}`);
    }
  },

  // Process PayPal payment
  async processPayPalPayment(paymentDetails) {
    try {
      const response = await api.post('/payments/paypal/create-order', paymentDetails);
      return response.data;
    } catch (error) {
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  },

  // Verify payment status
  async verifyPayment(paymentId, type) {
    try {
      const response = await api.get(`/payments/verify/${type}/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  },

  // Get transaction history
  async getTransactionHistory(filters) {
    try {
      const response = await api.get('/payments/transactions', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  },

  // Generate payment report
  async generatePaymentReport(reportParams) {
    try {
      const response = await api.post('/payments/reports', reportParams, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to generate report: ${error.message}`);
    }
  }
}; 