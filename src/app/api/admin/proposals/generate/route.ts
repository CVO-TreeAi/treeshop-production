import { NextRequest, NextResponse } from 'next/server';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { verifyAuthFromRequest } from '@/lib/auth-middleware';
import { 
  createProposal, 
  createProposalEvent, 
  createProposalSnapshot,
  getSiteSettings,
  getServices,
  getPricingPackages
} from '@/lib/firestore/proposals';
import { ProposalGenerator } from '@/lib/proposal-generator';
import { storage } from '@/lib/firebase';
import type { GenerateProposalRequest, GenerateProposalResponse } from '@/types/proposals';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAuthFromRequest(req);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData: GenerateProposalRequest = await req.json();
    const { templateId, customer, inputs, leadId } = requestData;

    // Validate required fields
    if (!templateId || !customer || !inputs) {
      return NextResponse.json({ 
        error: 'Missing required fields: templateId, customer, inputs' 
      }, { status: 400 });
    }

    // Create immutable snapshot
    const snapshot = await createProposalSnapshot(templateId);
    
    // Get current site settings, services, and packages
    const [siteSettings, services, packages] = await Promise.all([
      getSiteSettings(),
      getServices(),
      getPricingPackages()
    ]);

    if (!siteSettings) {
      return NextResponse.json({ error: 'Site settings not configured' }, { status: 500 });
    }

    // Convert arrays to objects for easier lookup
    const servicesMap = services.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {} as Record<string, any>);

    const packagesMap = packages.reduce((acc, pkg) => {
      acc[pkg.id] = pkg;
      return acc;
    }, {} as Record<string, any>);

    // Calculate totals
    const computed = ProposalGenerator.calculateTotals(inputs, packagesMap, servicesMap);

    // Create proposal record
    const proposalId = await createProposal({
      customer,
      inputs,
      computed,
      snapshotRef: snapshot,
      status: 'draft',
      tokens: {},
      assets: {
        pdfPath: '',
        pdfVersion: 1,
        webUrl: ''
      },
      audit: {},
      leadRef: leadId,
      createdBy: auth.user.uid
    });

    // Generate PDF
    const generator = new ProposalGenerator({
      template: snapshot as any, // Will be properly typed when template system is complete
      siteSettings,
      services: servicesMap,
      packages: packagesMap,
      inputs,
      computed
    });

    const pdfBuffer = generator.generatePDF();

    // Upload PDF to Firebase Storage
    const pdfPath = `proposals/${proposalId}/v1.pdf`;
    const pdfRef = ref(storage, pdfPath);
    
    await uploadBytes(pdfRef, pdfBuffer, {
      contentType: 'application/pdf'
    });

    // Get signed URL for PDF
    const pdfSignedUrl = await getDownloadURL(pdfRef);

    // Update proposal with PDF info
    const { updateProposal } = await import('@/lib/firestore/proposals');
    await updateProposal(proposalId, {
      assets: {
        pdfPath,
        pdfVersion: 1,
        webUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${proposalId}`,
        signedPdfUrl: pdfSignedUrl
      }
    });

    // Log creation event
    await createProposalEvent({
      proposalId,
      type: 'CREATED',
      timestamp: new Date().toISOString(),
      metadata: {
        userId: auth.user.uid,
        templateId: snapshot.templateId,
        version: snapshot.version
      }
    });

    const response: GenerateProposalResponse = {
      proposalId,
      version: 1,
      pdfSignedUrl,
      snapshot: {
        templateId: snapshot.templateId,
        version: snapshot.version
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Proposal generation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}