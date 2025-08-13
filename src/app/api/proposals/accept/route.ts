import { NextRequest, NextResponse } from 'next/server';
import { getProposal, updateProposal, createProposalEvent } from '@/lib/firestore/proposals';
import { ProposalTokenManager, isTokenUsed, markTokenAsUsed } from '@/lib/proposal-tokens';
import type { AcceptProposalRequest, AcceptProposalResponse } from '@/types/proposals';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const requestData: AcceptProposalRequest = await req.json();
    const { proposalId, token, fullName, consent } = requestData;

    // Validate required fields
    if (!proposalId || !token || !fullName?.trim() || !consent) {
      return NextResponse.json({ 
        error: 'Missing required fields: proposalId, token, fullName, consent' 
      }, { status: 400 });
    }

    // Verify token
    const claims = await ProposalTokenManager.verifyApproveToken(token);
    if (!claims || claims.pid !== proposalId) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Check if token is already used
    const used = await isTokenUsed(proposalId, claims.jti);
    if (used) {
      return NextResponse.json({ error: 'Token has already been used' }, { status: 409 });
    }

    // Get proposal
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Check if proposal is in correct state
    if (proposal.status === 'accepted') {
      return NextResponse.json({ error: 'Proposal already accepted' }, { status: 409 });
    }

    if (proposal.status !== 'sent' && proposal.status !== 'viewed') {
      return NextResponse.json({ error: 'Proposal not available for acceptance' }, { status: 400 });
    }

    // Get client info for audit
    const userAgent = req.headers.get('user-agent') || '';
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Update proposal status and audit info
    await updateProposal(proposalId, {
      status: 'accepted',
      audit: {
        ...proposal.audit,
        acceptedAt: new Date().toISOString(),
        acceptedByName: fullName.trim(),
        ip: clientIp,
        userAgent
      }
    });

    // Mark token as used
    await markTokenAsUsed(proposalId);

    // Log acceptance event
    await createProposalEvent({
      proposalId,
      type: 'ACCEPTED',
      timestamp: new Date().toISOString(),
      metadata: {
        customerName: fullName.trim(),
        ip: clientIp,
        userAgent,
        tokenUsed: claims.jti
      }
    });

    const response: AcceptProposalResponse = {
      status: 'accepted',
      depositRequired: proposal.computed.depositAmount > 0,
      depositAmount: proposal.computed.depositAmount > 0 ? proposal.computed.depositAmount : undefined
    };

    // Generate payment URL if deposit is required
    if (response.depositRequired && response.depositAmount) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://treeai.us';
      response.paymentUrl = `${baseUrl}/p/${proposalId}/payment?t=${token}`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Proposal acceptance error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}