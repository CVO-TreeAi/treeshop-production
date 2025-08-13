import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { updateProposal, createProposalEvent } from '@/lib/firestore/proposals';

export const runtime = 'nodejs';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Processing Stripe webhook event: ${event.type} (ID: ${event.id})`);

  try {
    switch (event.type) {
      // Core Payment Events
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionExpired(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }

      case 'payment_intent.requires_action': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentRequiresAction(paymentIntent);
        break;
      }

      // Charge Events
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeSucceeded(charge);
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeFailed(charge);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleChargeDisputeCreated(dispute);
        break;
      }

      case 'charge.dispute.updated': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleChargeDisputeUpdated(dispute);
        break;
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleChargeDisputeClosed(dispute);
        break;
      }

      // Customer Events
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerCreated(customer);
        break;
      }

      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerUpdated(customer);
        break;
      }

      case 'customer.deleted': {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerDeleted(customer);
        break;
      }

      // Payment Method Events
      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        await handlePaymentMethodAttached(paymentMethod);
        break;
      }

      // Refund Events
      case 'refund.created': {
        const refund = event.data.object as Stripe.Refund;
        await handleRefundCreated(refund);
        break;
      }

      case 'refund.updated': {
        const refund = event.data.object as Stripe.Refund;
        await handleRefundUpdated(refund);
        break;
      }

      case 'refund.failed': {
        const refund = event.data.object as Stripe.Refund;
        await handleRefundFailed(refund);
        break;
      }

      // Account & Balance Events (for Connect accounts if used)
      case 'balance.available': {
        const balance = event.data.object as Stripe.Balance;
        await handleBalanceAvailable(balance);
        break;
      }

      case 'payout.created': {
        const payout = event.data.object as Stripe.Payout;
        await handlePayoutCreated(payout);
        break;
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout;
        await handlePayoutFailed(payout);
        break;
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout;
        await handlePayoutPaid(payout);
        break;
      }

      // Risk Management Events
      case 'radar.early_fraud_warning.created': {
        const warning = event.data.object as Stripe.EarlyFraudWarning;
        await handleEarlyFraudWarningCreated(warning);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        // Log unhandled events for monitoring
        await logUnhandledEvent(event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Log the error with event details for debugging
    await logWebhookError(event, error);
    
    // Return 500 so Stripe will retry
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      eventType: event.type,
      eventId: event.id
    }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const proposalId = session.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in checkout session metadata');
    return;
  }

  console.log(`Checkout completed for proposal: ${proposalId}`);

  // Update proposal status to paid
  await updateProposal(proposalId, {
    status: 'paid',
    audit: {
      paidAt: new Date().toISOString(),
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paymentAmount: session.amount_total || 0,
    },
  });

  // Log payment event
  await createProposalEvent({
    proposalId,
    type: 'PAID',
    timestamp: new Date().toISOString(),
    metadata: {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      amount: session.amount_total || 0,
      customerEmail: session.customer_email || session.metadata?.customerEmail,
    },
  });

  console.log(`Proposal ${proposalId} marked as paid`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const proposalId = paymentIntent.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in payment intent metadata');
    return;
  }

  console.log(`Payment succeeded for proposal: ${proposalId}, amount: ${paymentIntent.amount}`);

  // Additional logging for successful payment
  await createProposalEvent({
    proposalId,
    type: 'PAID',
    timestamp: new Date().toISOString(),
    metadata: {
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      paymentMethod: paymentIntent.payment_method_types[0],
      receiptEmail: paymentIntent.receipt_email,
    },
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const proposalId = paymentIntent.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in failed payment intent metadata');
    return;
  }

  console.log(`Payment failed for proposal: ${proposalId}, reason: ${paymentIntent.last_payment_error?.message}`);

  // Log failed payment event
  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_FAILED',
    timestamp: new Date().toISOString(),
    metadata: {
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      failureCode: paymentIntent.last_payment_error?.code,
    },
  });
}

// Additional webhook handlers for comprehensive payment processing

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const proposalId = session.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in expired checkout session metadata');
    return;
  }

  console.log(`Checkout session expired for proposal: ${proposalId}`);

  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_EXPIRED',
    timestamp: new Date().toISOString(),
    metadata: {
      stripeSessionId: session.id,
      expirationReason: 'checkout_session_expired',
    },
  });
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const proposalId = paymentIntent.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in canceled payment intent metadata');
    return;
  }

  console.log(`Payment intent canceled for proposal: ${proposalId}`);

  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_CANCELLED',
    timestamp: new Date().toISOString(),
    metadata: {
      stripePaymentIntentId: paymentIntent.id,
      cancellationReason: paymentIntent.cancellation_reason,
    },
  });
}

async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
  const proposalId = paymentIntent.metadata?.proposalId;
  
  if (!proposalId) {
    console.error('No proposalId found in payment intent requiring action');
    return;
  }

  console.log(`Payment intent requires action for proposal: ${proposalId}`);

  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_ACTION_REQUIRED',
    timestamp: new Date().toISOString(),
    metadata: {
      stripePaymentIntentId: paymentIntent.id,
      actionRequired: paymentIntent.next_action?.type,
    },
  });
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
  const proposalId = charge.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Charge succeeded but no proposalId in metadata - likely not proposal related');
    return;
  }

  console.log(`Charge succeeded for proposal: ${proposalId}, amount: ${charge.amount}`);

  await createProposalEvent({
    proposalId,
    type: 'CHARGE_SUCCEEDED',
    timestamp: new Date().toISOString(),
    metadata: {
      chargeId: charge.id,
      amount: charge.amount,
      paymentMethodType: charge.payment_method_details?.type,
      last4: charge.payment_method_details?.card?.last4,
      brand: charge.payment_method_details?.card?.brand,
    },
  });
}

async function handleChargeFailed(charge: Stripe.Charge) {
  const proposalId = charge.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Charge failed but no proposalId in metadata - likely not proposal related');
    return;
  }

  console.log(`Charge failed for proposal: ${proposalId}, reason: ${charge.failure_message}`);

  await createProposalEvent({
    proposalId,
    type: 'CHARGE_FAILED',
    timestamp: new Date().toISOString(),
    metadata: {
      chargeId: charge.id,
      amount: charge.amount,
      failureCode: charge.failure_code,
      failureMessage: charge.failure_message,
      declineCode: charge.outcome?.seller_message,
    },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const proposalId = charge.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Charge refunded but no proposalId in metadata - likely not proposal related');
    return;
  }

  console.log(`Charge refunded for proposal: ${proposalId}, refunded amount: ${charge.amount_refunded}`);

  // Update proposal status if fully refunded
  if (charge.refunded && charge.amount_refunded === charge.amount) {
    await updateProposal(proposalId, {
      status: 'cancelled',
      audit: {
        refundedAt: new Date().toISOString(),
        refundAmount: charge.amount_refunded,
      },
    });
  }

  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_REFUNDED',
    timestamp: new Date().toISOString(),
    metadata: {
      chargeId: charge.id,
      originalAmount: charge.amount,
      refundedAmount: charge.amount_refunded,
      fullyRefunded: charge.refunded,
    },
  });
}

async function handleChargeDisputeCreated(dispute: Stripe.Dispute) {
  const proposalId = dispute.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Dispute created but no proposalId in charge metadata - likely not proposal related');
    return;
  }

  console.log(`Dispute created for proposal: ${proposalId}, amount: ${dispute.amount}`);

  await createProposalEvent({
    proposalId,
    type: 'PAYMENT_DISPUTED',
    timestamp: new Date().toISOString(),
    metadata: {
      disputeId: dispute.id,
      chargeId: typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id,
      disputeAmount: dispute.amount,
      reason: dispute.reason,
      status: dispute.status,
    },
  });
}

async function handleChargeDisputeUpdated(dispute: Stripe.Dispute) {
  const proposalId = dispute.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Dispute updated but no proposalId in charge metadata');
    return;
  }

  console.log(`Dispute updated for proposal: ${proposalId}, status: ${dispute.status}`);

  await createProposalEvent({
    proposalId,
    type: 'DISPUTE_UPDATED',
    timestamp: new Date().toISOString(),
    metadata: {
      disputeId: dispute.id,
      status: dispute.status,
      reason: dispute.reason,
    },
  });
}

async function handleChargeDisputeClosed(dispute: Stripe.Dispute) {
  const proposalId = dispute.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Dispute closed but no proposalId in charge metadata');
    return;
  }

  console.log(`Dispute closed for proposal: ${proposalId}, status: ${dispute.status}`);

  await createProposalEvent({
    proposalId,
    type: 'DISPUTE_CLOSED',
    timestamp: new Date().toISOString(),
    metadata: {
      disputeId: dispute.id,
      status: dispute.status,
      reason: dispute.reason,
    },
  });
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log(`New customer created: ${customer.id} (${customer.email})`);
  
  // Log customer creation for analytics
  await createProposalEvent({
    proposalId: `customer-${customer.id}`,
    type: 'CUSTOMER_CREATED',
    timestamp: new Date().toISOString(),
    metadata: {
      customerId: customer.id,
      customerEmail: customer.email,
      customerName: customer.name,
    },
  });
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log(`Customer updated: ${customer.id}`);
  
  await createProposalEvent({
    proposalId: `customer-${customer.id}`,
    type: 'CUSTOMER_UPDATED',
    timestamp: new Date().toISOString(),
    metadata: {
      customerId: customer.id,
      customerEmail: customer.email,
    },
  });
}

async function handleCustomerDeleted(customer: Stripe.Customer) {
  console.log(`Customer deleted: ${customer.id}`);
  
  await createProposalEvent({
    proposalId: `customer-${customer.id}`,
    type: 'CUSTOMER_DELETED',
    timestamp: new Date().toISOString(),
    metadata: {
      customerId: customer.id,
    },
  });
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log(`Payment method attached: ${paymentMethod.id} to customer: ${paymentMethod.customer}`);
  
  if (paymentMethod.customer) {
    await createProposalEvent({
      proposalId: `customer-${paymentMethod.customer}`,
      type: 'PAYMENT_METHOD_ATTACHED',
      timestamp: new Date().toISOString(),
      metadata: {
        paymentMethodId: paymentMethod.id,
        customerId: paymentMethod.customer as string,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
      },
    });
  }
}

async function handleRefundCreated(refund: Stripe.Refund) {
  const proposalId = refund.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    console.log('Refund created but no proposalId in charge metadata');
    return;
  }

  console.log(`Refund created for proposal: ${proposalId}, amount: ${refund.amount}`);

  await createProposalEvent({
    proposalId,
    type: 'REFUND_CREATED',
    timestamp: new Date().toISOString(),
    metadata: {
      refundId: refund.id,
      chargeId: typeof refund.charge === 'string' ? refund.charge : refund.charge?.id,
      amount: refund.amount,
      reason: refund.reason,
    },
  });
}

async function handleRefundUpdated(refund: Stripe.Refund) {
  const proposalId = refund.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    return;
  }

  await createProposalEvent({
    proposalId,
    type: 'REFUND_UPDATED',
    timestamp: new Date().toISOString(),
    metadata: {
      refundId: refund.id,
      status: refund.status,
    },
  });
}

async function handleRefundFailed(refund: Stripe.Refund) {
  const proposalId = refund.charge?.metadata?.proposalId;
  
  if (!proposalId) {
    return;
  }

  console.log(`Refund failed for proposal: ${proposalId}`);

  await createProposalEvent({
    proposalId,
    type: 'REFUND_FAILED',
    timestamp: new Date().toISOString(),
    metadata: {
      refundId: refund.id,
      failureReason: refund.failure_reason,
    },
  });
}

// Account and payout handlers (for future Stripe Connect integration)
async function handleBalanceAvailable(balance: Stripe.Balance) {
  console.log('Balance available updated:', balance.available);
  
  // Log for business intelligence
  await createProposalEvent({
    proposalId: 'system-balance',
    type: 'BALANCE_UPDATED',
    timestamp: new Date().toISOString(),
    metadata: {
      availableUsd: balance.available.find(b => b.currency === 'usd')?.amount || 0,
      pendingUsd: balance.pending.find(b => b.currency === 'usd')?.amount || 0,
    },
  });
}

async function handlePayoutCreated(payout: Stripe.Payout) {
  console.log(`Payout created: ${payout.id}, amount: ${payout.amount}`);
  
  await createProposalEvent({
    proposalId: 'system-payout',
    type: 'PAYOUT_CREATED',
    timestamp: new Date().toISOString(),
    metadata: {
      payoutId: payout.id,
      amount: payout.amount,
      currency: payout.currency,
      method: payout.method,
    },
  });
}

async function handlePayoutFailed(payout: Stripe.Payout) {
  console.log(`Payout failed: ${payout.id}`);
  
  await createProposalEvent({
    proposalId: 'system-payout',
    type: 'PAYOUT_FAILED',
    timestamp: new Date().toISOString(),
    metadata: {
      payoutId: payout.id,
      failureCode: payout.failure_code,
      failureMessage: payout.failure_message,
    },
  });
}

async function handlePayoutPaid(payout: Stripe.Payout) {
  console.log(`Payout paid: ${payout.id}`);
  
  await createProposalEvent({
    proposalId: 'system-payout',
    type: 'PAYOUT_PAID',
    timestamp: new Date().toISOString(),
    metadata: {
      payoutId: payout.id,
      amount: payout.amount,
      arrivalDate: new Date(payout.arrival_date * 1000).toISOString(),
    },
  });
}

async function handleEarlyFraudWarningCreated(warning: Stripe.EarlyFraudWarning) {
  const proposalId = warning.charge?.metadata?.proposalId;
  
  console.log(`Early fraud warning created for charge: ${warning.charge?.id}`);
  
  await createProposalEvent({
    proposalId: proposalId || 'system-fraud',
    type: 'FRAUD_WARNING',
    timestamp: new Date().toISOString(),
    metadata: {
      warningId: warning.id,
      chargeId: typeof warning.charge === 'string' ? warning.charge : warning.charge?.id,
      fraudType: warning.fraud_type,
    },
  });
}

// Logging and monitoring functions
async function logUnhandledEvent(event: Stripe.Event) {
  console.log(`Unhandled Stripe event: ${event.type}`);
  
  await createProposalEvent({
    proposalId: 'system-unhandled',
    type: 'UNHANDLED_EVENT',
    timestamp: new Date().toISOString(),
    metadata: {
      eventType: event.type,
      eventId: event.id,
      created: new Date(event.created * 1000).toISOString(),
    },
  });
}

async function logWebhookError(event: Stripe.Event, error: unknown) {
  console.error(`Webhook processing error for event ${event.type}:`, error);
  
  await createProposalEvent({
    proposalId: 'system-error',
    type: 'WEBHOOK_ERROR',
    timestamp: new Date().toISOString(),
    metadata: {
      eventType: event.type,
      eventId: event.id,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
    },
  });
}

// Note: ProposalEventType has been extended in @/types/proposals to include all payment event types