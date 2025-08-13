import type { DocumentData } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { PDFGenerator, defaultBusinessInfo } from '@/lib/pdf-generator';
import { buildProposalDataFromLead, buildProposalEmail } from '@/lib/proposal-template';

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  // If not configured, allow submissions (temporary until keys are set)
  if (!secret) return true;
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return Boolean(data.success) && (data.score ?? 0) > 0.3;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body?.recaptchaToken as string | undefined;
    if (!token || !(await verifyRecaptcha(token))) {
      return NextResponse.json({ error: 'recaptcha_failed' }, { status: 400 });
    }

    const lead = {
      createdAt: new Date(),
      status: 'New',
      score: 'Pending AI Score',
      contact: { name: body.name, phone: body.phone, email: body.email },
      address: body.address,
      inputs: body.inputs,
      attribution: body.attribution,
      needsAiScoring: true
    };

    const docRef = await adminDb.collection('leads').add(lead as DocumentData);
    
    // Trigger AI scoring asynchronously (don't wait for it to complete)
    try {
      const leadData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        propertyAssessment: body.inputs || {},
        urgency: body.inputs?.urgency || 'planning',
        budget: body.inputs?.budget,
        additionalNotes: body.inputs?.additionalNotes
      };

      // Call AI scoring endpoint asynchronously
      fetch(`${req.url.replace('/api/lead', '/api/ai/score-lead')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: docRef.id, leadData })
      }).catch(err => console.warn('AI scoring failed:', err));
      
    } catch (scoringError) {
      console.warn('Failed to trigger AI scoring:', scoringError);
    }

    // Attempt to generate and send a preliminary proposal via Resend (non-blocking)
    ;(async () => {
      try {
        const proposal = buildProposalDataFromLead({
          id: docRef.id,
          contact: { name: body.name, email: body.email, phone: body.phone },
          address: body.address,
          inputs: body.inputs,
        });

        const pdfGen = new PDFGenerator(defaultBusinessInfo);
        const pdfDoc = pdfGen.generateProposal(proposal);
        const blob = pdfGen.getBlob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { subject, text, html } = buildProposalEmail(proposal);

        const apiUrl = new URL(req.url);
        apiUrl.pathname = apiUrl.pathname.replace('/api/lead', '/api/admin/proposals/send');

        await fetch(apiUrl.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Note: This route enforces admin auth in prod. In dev, set AUTH_DEV_BYPASS=true to test.
          body: JSON.stringify({
            to: body.email,
            subject,
            text,
            html,
            attachments: [{ filename: `proposal-${proposal.id}.pdf`, content: buffer }]
          })
        }).catch(() => {});
      } catch (e) {
        console.warn('Proposal send skipped:', e);
      }
    })();

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
}
