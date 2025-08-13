import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Client-side Stripe instance (lazy loaded)
let stripePromise: Promise<Stripe | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Stripe configuration and utilities
export const STRIPE_CONFIG = {
  currency: 'usd',
  paymentMethods: ['card'],
  billingAddressCollection: 'required' as const,
  shippingAddressCollection: null,
} as const;

// Create a payment intent for deposits
export async function createDepositPaymentIntent({
  amount,
  proposalId,
  customerName,
  customerEmail,
  description,
}: {
  amount: number; // in cents
  proposalId: string;
  customerName: string;
  customerEmail: string;
  description: string;
}): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency: STRIPE_CONFIG.currency,
    payment_method_types: STRIPE_CONFIG.paymentMethods,
    description,
    metadata: {
      proposalId,
      customerName,
      customerEmail,
      type: 'deposit',
    },
    receipt_email: customerEmail,
  });
}

// Create a checkout session for deposits
export async function createDepositCheckoutSession({
  amount,
  proposalId,
  customerName,
  customerEmail,
  description,
  successUrl,
  cancelUrl,
}: {
  amount: number; // in cents
  proposalId: string;
  customerName: string;
  customerEmail: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    payment_method_types: STRIPE_CONFIG.paymentMethods,
    billing_address_collection: STRIPE_CONFIG.billingAddressCollection,
    line_items: [
      {
        price_data: {
          currency: STRIPE_CONFIG.currency,
          product_data: {
            name: 'Project Deposit',
            description,
            metadata: {
              proposalId,
              type: 'deposit',
            },
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      proposalId,
      customerName,
      customerEmail,
      type: 'deposit',
    },
    payment_intent_data: {
      description,
      metadata: {
        proposalId,
        customerName,
        customerEmail,
        type: 'deposit',
      },
    },
  });
}

// Get customer from email or create new one
export async function getOrCreateStripeCustomer(email: string, name: string): Promise<Stripe.Customer> {
  // First try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'treeshop-proposals',
    },
  });
}

// Retrieve a checkout session
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });
}

// Helper to format amount for display
export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100);
}

// Helper to convert dollars to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

// Helper to convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100;
}