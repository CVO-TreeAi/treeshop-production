import { NextRequest, NextResponse } from 'next/server';
import { setDoc } from 'firebase/firestore';
import { verifyAuthFromRequest } from '@/lib/auth-middleware';
import { 
  siteSettingsRef, 
  proposalTemplatesRef, 
  pricingPackagesRef, 
  servicesRef, 
  legalTermsRef 
} from '@/lib/firestore/proposals';
import {
  sampleSiteSettings,
  samplePricingPackages,
  sampleServices,
  sampleLegalTerms,
  sampleProposalTemplate
} from '@/lib/sample-data/proposals';
import { doc } from 'firebase/firestore';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAuthFromRequest(req);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow in development or with explicit confirmation
    const { force } = await req.json();
    if (process.env.NODE_ENV === 'production' && !force) {
      return NextResponse.json({ 
        error: 'Seeding disabled in production. Use force=true if you are sure.' 
      }, { status: 403 });
    }

    const results = {
      siteSettings: false,
      proposalTemplate: false,
      pricingPackages: 0,
      services: 0,
      legalTerms: 0
    };

    // Seed site settings
    try {
      await setDoc(siteSettingsRef, sampleSiteSettings);
      results.siteSettings = true;
    } catch (error) {
      console.error('Error seeding site settings:', error);
    }

    // Seed proposal template
    try {
      const templateRef = doc(proposalTemplatesRef, sampleProposalTemplate.id);
      await setDoc(templateRef, sampleProposalTemplate);
      results.proposalTemplate = true;
    } catch (error) {
      console.error('Error seeding proposal template:', error);
    }

    // Seed pricing packages
    for (const pkg of samplePricingPackages) {
      try {
        const pkgRef = doc(pricingPackagesRef, pkg.id);
        await setDoc(pkgRef, pkg);
        results.pricingPackages++;
      } catch (error) {
        console.error(`Error seeding pricing package ${pkg.id}:`, error);
      }
    }

    // Seed services
    for (const service of sampleServices) {
      try {
        const serviceRef = doc(servicesRef, service.id);
        await setDoc(serviceRef, service);
        results.services++;
      } catch (error) {
        console.error(`Error seeding service ${service.id}:`, error);
      }
    }

    // Seed legal terms
    for (const terms of sampleLegalTerms) {
      try {
        const termsRef = doc(legalTermsRef, terms.id);
        await setDoc(termsRef, terms);
        results.legalTerms++;
      } catch (error) {
        console.error(`Error seeding legal terms ${terms.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data seeded successfully',
      results
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      error: 'Seeding failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}