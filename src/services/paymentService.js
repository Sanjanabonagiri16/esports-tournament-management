import { loadStripe } from '@stripe/stripe-js';
import api from './api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

class PaymentService {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const response = await api.payments.createPaymentIntent({
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  }

  async processPayment(paymentMethodId, amount, currency = 'usd') {
    try {
      const stripe = await stripePromise;
      const { clientSecret } = await this.createPaymentIntent(amount, currency);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      throw new Error('Payment failed: ' + error.message);
    }
  }

  async distributePrizes(tournamentId, winners) {
    try {
      const payouts = [];
      for (const winner of winners) {
        const payout = await api.prizes.processPayout(tournamentId, {
          teamId: winner.team.id,
          amount: winner.prize,
          rank: winner.rank,
        });
        payouts.push(payout.data);
      }
      return payouts;
    } catch (error) {
      throw new Error('Prize distribution failed');
    }
  }

  async getPaymentMethods(userId) {
    try {
      const response = await api.payments.getPaymentMethods();
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch payment methods');
    }
  }

  async addPaymentMethod(paymentMethodData) {
    try {
      const stripe = await stripePromise;
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: paymentMethodData,
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = await api.payments.addPaymentMethod({
        paymentMethodId: paymentMethod.id,
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to add payment method: ' + error.message);
    }
  }

  async calculatePrizeDistribution(totalPrize, positions) {
    const distributions = positions.map((percentage, index) => ({
      position: index + 1,
      percentage,
      amount: (totalPrize * percentage) / 100,
    }));

    return {
      total: totalPrize,
      distributions,
      platformFee: totalPrize * 0.05, // 5% platform fee
      netPrizePool: totalPrize * 0.95,
    };
  }

  async verifyPaymentStatus(paymentId) {
    try {
      const stripe = await stripePromise;
      const paymentIntent = await stripe.retrievePaymentIntent(paymentId);
      return paymentIntent;
    } catch (error) {
      throw new Error('Failed to verify payment status');
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const stripe = await stripePromise;
      const refund = await stripe.refunds.create({
        payment_intent: paymentId,
        amount,
      });
      return refund;
    } catch (error) {
      throw new Error('Failed to process refund');
    }
  }

  generatePaymentReport(transactions) {
    return {
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      successfulPayments: transactions.filter(t => t.status === 'succeeded'),
      failedPayments: transactions.filter(t => t.status === 'failed'),
      pendingPayments: transactions.filter(t => t.status === 'pending'),
      summary: {
        count: transactions.length,
        avgAmount: transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
        dateRange: {
          start: Math.min(...transactions.map(t => new Date(t.created))),
          end: Math.max(...transactions.map(t => new Date(t.created))),
        },
      },
    };
  }
}

export default new PaymentService(); 