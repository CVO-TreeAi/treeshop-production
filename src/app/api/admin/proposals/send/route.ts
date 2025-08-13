import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyAuthFromRequest } from '@/lib/auth-middleware';
import { getProposal, updateProposal, createProposalEvent } from '@/lib/firestore/proposals';
import { ProposalTokenManager } from '@/lib/proposal-tokens';
import type { SendProposalRequest, SendProposalResponse } from '@/types/proposals';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAuthFromRequest(req);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData: SendProposalRequest = await req.json();
    const { proposalId } = requestData;

    if (!proposalId) {
      return NextResponse.json({ error: 'Missing proposalId' }, { status: 400 });
    }

    // Get proposal
    const proposal = await getProposal(proposalId);
    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'draft') {
      return NextResponse.json({ error: 'Proposal already sent' }, { status: 400 });
    }

    // Generate approve token
    const { token, jti, expiresAt } = await ProposalTokenManager.createApproveToken(
      proposalId, 
      proposal.assets.pdfVersion
    );

    const tokenHash = ProposalTokenManager.hashTokenId(jti);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://treeai.us';
    const approveUrl = `${baseUrl}/p/${proposalId}?t=${token}`;

    // Setup Resend
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.PROPOSAL_FROM_EMAIL || 'TreeAI <proposals@treeai.us>';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // Create email content
    const subject = `Project Proposal - ${proposal.customer.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 28px;">TreeAI Project Proposal</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Professional Forestry Mulching Services</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #16a34a; margin-top: 0;">Hello ${proposal.customer.name}!</h2>
            <p>Thank you for considering our services. We've prepared a detailed proposal for your ${proposal.inputs.acreage}-acre project at ${proposal.inputs.address}.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #16a34a;">Project Summary</h3>
              <p><strong>Total Investment:</strong> $${proposal.computed.total.toLocaleString()}</p>
              <p><strong>Deposit Required:</strong> $${proposal.computed.depositAmount.toLocaleString()} (20%)</p>
              <p><strong>Property Size:</strong> ${proposal.inputs.acreage} acres</p>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${approveUrl}" 
               style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px; display: inline-block;">
              📋 Review & Approve Proposal
            </a>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>⏰ This proposal expires in 30 days.</strong> Click the button above to review the full details and approve your project.</p>
          </div>

          <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6b7280;">
            <p><strong>Questions?</strong> Reply to this email or call us directly.</p>
            <p>
              📞 <strong>Phone:</strong> (555) 123-4567<br>
              📧 <strong>Email:</strong> info@treeai.us<br>
              🌐 <strong>Website:</strong> treeai.us
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
              TreeAI Professional Services<br>
              Licensed & Insured in Florida
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
TreeAI Project Proposal

Hello ${proposal.customer.name}!

Thank you for considering our services. We've prepared a detailed proposal for your ${proposal.inputs.acreage}-acre project at ${proposal.inputs.address}.

Project Summary:
- Total Investment: $${proposal.computed.total.toLocaleString()}
- Deposit Required: $${proposal.computed.depositAmount.toLocaleString()} (20%)
- Property Size: ${proposal.inputs.acreage} acres

To review and approve your proposal, visit: ${approveUrl}

This proposal expires in 30 days.

Questions? Reply to this email or call us at (555) 123-4567.

TreeAI Professional Services
Licensed & Insured in Florida
    `;

    // Send email
    const result = await resend.emails.send({
      from,
      to: proposal.customer.email,
      subject,
      html,
      text
    });

    // Update proposal with token and sent status
    await updateProposal(proposalId, {
      status: 'sent',
      tokens: {
        approveTokenHash: tokenHash,
        expiresAt: expiresAt.toISOString(),
        isUsed: false
      },
      audit: {
        sentAt: new Date().toISOString(),
        sentBy: auth.user.uid
      }
    });

    // Log sent event
    await createProposalEvent({
      proposalId,
      type: 'SENT',
      timestamp: new Date().toISOString(),
      metadata: {
        userId: auth.user.uid,
        emailId: result.data?.id,
        recipient: proposal.customer.email
      }
    });

    const response: SendProposalResponse = {
      emailId: result.data?.id || '',
      approveUrl
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Send proposal error:', error);
    return NextResponse.json({ 
      error: 'Send failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}


