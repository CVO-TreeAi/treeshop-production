import { NextRequest, NextResponse } from 'next/server';
import { getProposal } from '@/lib/firestore/proposals';
import { createDepositCheckoutSession, dollarsToCents } from '@/lib/stripe';
import { ProposalTokenManager, isTokenUsed } from '@/lib/proposal-tokens';

export const runtime = 'nodejs';

interface CheckoutRequest {
  proposalId: string;
  token: string;
}

export async function POST(req: NextRequest) {
  try {
    const { proposalId, token }: CheckoutRequest = await req.json();

    // Validate required fields
    if (!proposalId || !token) {
      return NextResponse.json({ 
        error: 'Missing required fields: proposalId, token' 
      }, { status: 400 });
    }

    // Verify token
    const claims = await ProposalTokenManager.verifyApproveToken(token);
    if (!claims || claims.pid !== proposalId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Check if token is already used (but allow if proposal is already accepted)
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Only allow checkout for accepted proposals that require deposits
    if (proposal.status !== 'accepted') {
      return NextResponse.json({ error: 'Proposal must be accepted before payment' }, { status: 400 });
    }

    if (proposal.computed.depositAmount <= 0) {
      return NextResponse.json({ error: 'No deposit required for this proposal' }, { status: 400 });
    }

    // Check if deposit is already paid
    if (proposal.status === 'paid') {
      return NextResponse.json({ error: 'Deposit already paid' }, { status: 409 });
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://treeai.us';
    const successUrl = `${baseUrl}/p/${proposalId}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/p/${proposalId}?t=${token}&payment=cancelled`;

    const session = await createDepositCheckoutSession({
      amount: dollarsToCents(proposal.computed.depositAmount),
      proposalId,
      customerName: proposal.customer.name,
      customerEmail: proposal.customer.email,
      description: `Deposit for ${proposal.inputs.acreage} acre forestry mulching project at ${proposal.inputs.address}`,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}