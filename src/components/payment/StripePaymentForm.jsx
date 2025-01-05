import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function StripePaymentForm({ amount, onSubmit, processing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (stripeError) {
      setError(stripeError.message);
      return;
    }

    onSubmit({
      paymentMethodId: paymentMethod.id,
      cardElement: elements.getElement(CardElement)
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Card Details
      </Typography>
      
      <Box sx={{ 
        p: 2, 
        border: '1px solid rgba(0, 0, 0, 0.23)', 
        borderRadius: 1,
        mb: 2 
      }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </Button>
    </Box>
  );
}

export default StripePaymentForm; 