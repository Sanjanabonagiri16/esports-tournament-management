import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress
} from '@mui/material';
import { Elements } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paymentService } from '@/services/payment';
import { transactionLogService } from '@/services/transactionLog';
import { toast } from 'react-toastify';
import StripePaymentForm from './StripePaymentForm';

function PaymentProcessor({ amount, recipient, onSuccess, onError }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleStripePayment = async (paymentDetails) => {
    setProcessing(true);
    setError(null);
    try {
      // Process payment
      const paymentResult = await paymentService.processStripePayment({
        amount,
        recipient,
        ...paymentDetails
      });

      // Verify payment
      const verificationResult = await paymentService.verifyPayment(
        paymentResult.id,
        'stripe'
      );

      // Log transaction
      await transactionLogService.logTransaction({
        paymentId: paymentResult.id,
        amount,
        recipient,
        method: 'stripe',
        status: 'completed'
      });

      onSuccess(paymentResult);
      toast.success('Payment processed successfully');
    } catch (err) {
      setError(err.message);
      onError(err);
      toast.error(`Payment failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setProcessing(true);
    setError(null);
    try {
      const paymentResult = await paymentService.processPayPalPayment({
        amount,
        recipient
      });

      await transactionLogService.logTransaction({
        paymentId: paymentResult.id,
        amount,
        recipient,
        method: 'paypal',
        status: 'completed'
      });

      onSuccess(paymentResult);
      toast.success('PayPal payment processed successfully');
    } catch (err) {
      setError(err.message);
      onError(err);
      toast.error(`PayPal payment failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Process Payment
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Amount: ${amount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recipient: {recipient}
          </Typography>
        </Box>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="stripe"
            control={<Radio />}
            label="Credit Card (Stripe)"
          />
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label="PayPal"
          />
        </RadioGroup>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {paymentMethod === 'stripe' ? (
          <Elements stripe={paymentService.initializeStripe()}>
            <StripePaymentForm
              amount={amount}
              onSubmit={handleStripePayment}
              processing={processing}
            />
          </Elements>
        ) : (
          <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: amount
                    }
                  }]
                });
              }}
              onApprove={handlePayPalPayment}
              disabled={processing}
            />
          </PayPalScriptProvider>
        )}
      </CardContent>
    </Card>
  );
}

export default PaymentProcessor; 