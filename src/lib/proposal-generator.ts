import jsPDF from 'jspdf';
import type {
  ProposalTemplate,
  ProposalInputs,
  ProposalComputed,
  SiteSettings,
  Service,
  PricingPackage
} from '@/types/proposals';

export interface ProposalGenerationContext {
  template: ProposalTemplate;
  siteSettings: SiteSettings;
  services: Record<string, Service>;
  packages: Record<string, PricingPackage>;
  inputs: ProposalInputs;
  computed: ProposalComputed;
}

export class ProposalGenerator {
  private context: ProposalGenerationContext;

  constructor(context: ProposalGenerationContext) {
    this.context = context;
  }

  // Calculate totals based on inputs
  static calculateTotals(
    inputs: ProposalInputs,
    packages: Record<string, PricingPackage>,
    services: Record<string, Service>
  ): ProposalComputed {
    const selectedPackage = packages[inputs.packageId];
    if (!selectedPackage) {
      throw new Error(`Package ${inputs.packageId} not found`);
    }

    const breakdown: ProposalComputed['breakdown'] = [];
    let subtotal = 0;

    // Add package-based mulching
    const mulchingTotal = inputs.acreage * selectedPackage.pricePerAcre;
    breakdown.push({
      serviceId: 'package-mulching',
      serviceName: selectedPackage.label + ' Forestry Mulching',
      description: selectedPackage.description + ` (${inputs.acreage} acres × $${selectedPackage.pricePerAcre}/acre)`,
      quantity: inputs.acreage,
      rate: selectedPackage.pricePerAcre,
      total: mulchingTotal
    });
    subtotal += mulchingTotal;

    // Add selected services
    for (const serviceId of inputs.selectedServices) {
      const service = services[serviceId];
      if (service) {
        let quantity = 1;
        const rate = service.defaultRate;
        let total = rate;

        // Adjust quantity/rate based on service unit type
        switch (service.unit) {
          case 'per_acre':
            quantity = inputs.acreage;
            total = quantity * rate;
            break;
          case 'flat_rate':
            quantity = 1;
            total = rate;
            break;
          // Other unit types can be handled as needed
        }

        breakdown.push({
          serviceId,
          serviceName: service.name,
          description: service.description,
          quantity,
          rate,
          total
        });
        subtotal += total;
      }
    }

    // Add custom services
    if (inputs.customServices) {
      for (const customService of inputs.customServices) {
        const total = customService.quantity * customService.rate;
        breakdown.push({
          serviceId: `custom-${Date.now()}`,
          serviceName: customService.name,
          description: customService.description,
          quantity: customService.quantity,
          rate: customService.rate,
          total
        });
        subtotal += total;
      }
    }

    // Calculate tax (assuming 7% Florida sales tax)
    const tax = subtotal * 0.07;
    const total = subtotal + tax;
    
    // Calculate deposit (20% as mentioned in spec)
    const depositAmount = total * 0.20;
    const balance = total - depositAmount;

    return {
      subtotal,
      tax,
      total,
      depositAmount,
      balance,
      pricePerAcre: selectedPackage.pricePerAcre,
      packageDbh: selectedPackage.dbh,
      breakdown
    };
  }

  // Generate PDF using jsPDF
  generatePDF(): ArrayBuffer {
    const doc = new jsPDF('p', 'mm', 'letter');
    const { template, siteSettings, inputs, computed } = this.context;

    // Configure fonts and colors - primaryColor available for future use
    // const primaryColor = siteSettings.branding.primaryColor || '#16a34a';

    // Page 1: Company Info & Project Summary
    this.addHeader(doc, siteSettings);
    this.addCustomerInfo(doc, inputs);
    this.addProjectSummary(doc, inputs, computed);
    this.addServicesBreakdown(doc, computed);

    // Page 2: Terms & Signature
    doc.addPage();
    this.addHeader(doc, siteSettings);
    this.addTermsAndConditions(doc, template);
    this.addSignatureSection(doc);

    return doc.output('arraybuffer');
  }

  private addHeader(doc: jsPDF, settings: SiteSettings) {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Company name
    doc.setFontSize(24);
    doc.setTextColor(34, 197, 94); // green-500
    doc.text(settings.business.name, 20, 25);

    // Contact info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(settings.business.address, 20, 35);
    doc.text(`Phone: ${settings.business.phone}`, 20, 42);
    doc.text(`Email: ${settings.business.email}`, 20, 49);
    
    if (settings.business.licenseNumber) {
      doc.text(`License: ${settings.business.licenseNumber}`, 20, 56);
    }

    // Proposal title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    const proposalTitle = 'PROJECT PROPOSAL';
    const titleWidth = doc.getTextWidth(proposalTitle);
    doc.text(proposalTitle, pageWidth - titleWidth - 20, 25);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const currentDate = new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(currentDate);
    doc.text(currentDate, pageWidth - dateWidth - 20, 35);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 65, pageWidth - 20, 65);
  }

  private addCustomerInfo(doc: jsPDF, inputs: ProposalInputs) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Customer Information', 20, 80);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Property Address: ${inputs.address}`, 20, 95);
    doc.text(`Project Size: ${inputs.acreage} acres`, 20, 102);
    
    if (inputs.obstacles && inputs.obstacles.length > 0) {
      doc.text(`Special Considerations: ${inputs.obstacles.join(', ')}`, 20, 109);
    }
  }

  private addProjectSummary(doc: jsPDF, inputs: ProposalInputs, computed: ProposalComputed) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Project Summary', 20, 125);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Land clearing and forestry mulching for ${inputs.acreage} acres`, 20, 140);
    doc.text(`Trees up to ${computed.packageDbh} DBH included`, 20, 147);
    doc.text('Professional equipment and experienced operators', 20, 154);
    doc.text('Site cleanup and final grading included', 20, 161);
  }

  private addServicesBreakdown(doc: jsPDF, computed: ProposalComputed) {
    let yPosition = 180;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Services & Pricing', 20, yPosition);
    
    yPosition += 15;

    // Services breakdown
    doc.setFontSize(10);
    computed.breakdown.forEach(item => {
      doc.setTextColor(50, 50, 50);
      doc.text(item.serviceName, 20, yPosition);
      doc.text(`$${item.total.toLocaleString()}`, 160, yPosition);
      
      if (item.description) {
        yPosition += 7;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(item.description, 25, yPosition);
        doc.setFontSize(10);
      }
      
      yPosition += 10;
    });

    // Totals
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 180, yPosition);
    
    yPosition += 10;
    doc.setTextColor(50, 50, 50);
    doc.text(`Subtotal: $${computed.subtotal.toLocaleString()}`, 130, yPosition);
    
    yPosition += 7;
    doc.text(`Tax (7%): $${computed.tax.toLocaleString()}`, 130, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: $${computed.total.toLocaleString()}`, 130, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // green-500
    doc.text(`Deposit (20%): $${computed.depositAmount.toLocaleString()}`, 130, yPosition);
    
    yPosition += 7;
    doc.text(`Balance: $${computed.balance.toLocaleString()}`, 130, yPosition);
  }

  private addTermsAndConditions(doc: jsPDF, _template: ProposalTemplate) {
    let yPosition = 80;
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Terms & Conditions', 20, yPosition);
    
    yPosition += 15;

    const terms = [
      '1. A 20% deposit is required to secure your project date.',
      '2. Final payment is due upon completion of work.',
      '3. Weather conditions may affect scheduling.',
      '4. Customer is responsible for marking utilities.',
      '5. All work is guaranteed for 30 days.',
      '6. Proposal valid for 30 days from date issued.'
    ];

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    terms.forEach(term => {
      doc.text(term, 20, yPosition);
      yPosition += 8;
    });
  }

  private addSignatureSection(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const yPosition = pageHeight - 60;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Customer Approval', 20, yPosition);

    // Signature line
    doc.setDrawColor(150, 150, 150);
    doc.line(20, yPosition + 25, 100, yPosition + 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Customer Signature', 20, yPosition + 32);
    
    // Date line
    doc.line(120, yPosition + 25, 180, yPosition + 25);
    doc.text('Date', 120, yPosition + 32);

    // Approval instructions
    doc.setFontSize(9);
    doc.setTextColor(34, 197, 94); // green-500
    doc.text('To approve this proposal, visit the link provided in your email', 20, yPosition + 45);
    doc.text('or sign above and return this document.', 20, yPosition + 52);
  }
}