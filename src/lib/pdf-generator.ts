import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  license?: string;
}

export interface EstimateData {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  propertyAddress: string;
  acreage: number;
  terrain: 'flat' | 'sloped' | 'steep';
  density: 'light' | 'medium' | 'heavy';
  accessibility: 'easy' | 'moderate' | 'difficult';
  obstacles: string[];
  stumpRemoval: boolean;
  services: Array<{
    name: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  validFor: number;
  notes?: string;
  createdAt: Date;
}

export interface ProposalData extends EstimateData {
  terms: string;
  timeline: string;
  warranty: string;
}

export interface WorkOrderData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyAddress: string;
  scheduledDate: Date;
  estimatedDuration: string;
  crewSize: number;
  equipmentNeeded: string[];
  services: Array<{
    name: string;
    description: string;
    specifications: string;
  }>;
  specialInstructions: string;
  safetyRequirements: string[];
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

export interface InvoiceData {
  id: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  propertyAddress: string;
  workOrderId: string;
  completionDate: Date;
  services: Array<{
    name: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentTerms: string;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
}

// Marketing links (with sensible defaults)
const BLOG_URL = process.env.NEXT_PUBLIC_BLOG_URL || 'https://treeai.us/treeshop';
const YOUTUBE_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://www.youtube.com/@TreeAI';

export class PDFGenerator {
  private businessInfo: BusinessInfo;
  private pdf: jsPDF;
  private pageFormat: any;

  constructor(businessInfo: BusinessInfo, options?: { format?: any }) {
    this.businessInfo = businessInfo;
    this.pageFormat = options?.format || 'letter';
    this.initPdf();
  }

  private initPdf() {
    // Use mm so dimensions are predictable; A5 is more mobile-friendly
    this.pdf = new jsPDF({ unit: 'mm', format: this.pageFormat, orientation: 'portrait' });
  }

  private addHeader(title: string, documentId: string) {
    const pdf = this.pdf;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = 65;
    const margin = 15;
    
    // Background
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Left accent bar
    pdf.setFillColor(34, 139, 34);
    pdf.rect(0, 0, 4, headerHeight, 'F');
    
    // Title (centered) to avoid overlap with company name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 139, 34);
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 18);

    // Company name and tagline
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(33, 37, 41);
    pdf.text(this.businessInfo.name, margin, 32);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(108, 117, 125);
    pdf.text('Professional Tree Services & Land Clearing', margin, 38);

    // Company info
    pdf.setFontSize(9);
    pdf.text(this.businessInfo.address, margin, 48);
    pdf.text(this.businessInfo.phone, margin, 54);
    pdf.text(this.businessInfo.email, margin, 60);
    if (this.businessInfo.website) {
      const websiteWidth = pdf.getTextWidth(this.businessInfo.website);
      pdf.text(this.businessInfo.website, pageWidth - margin - websiteWidth, 60);
    }

    // Document meta (right)
    pdf.setFontSize(10);
    pdf.setTextColor(108, 117, 125);
    const idText = `#${documentId}`;
    const dateText = new Date().toLocaleDateString();
    const idWidth = pdf.getTextWidth(idText);
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(idText, pageWidth - margin - idWidth, 24);
    pdf.text(dateText, pageWidth - margin - dateWidth, 30);

    // Separator
    pdf.setTextColor(0, 0, 0);
    pdf.setLineWidth(1);
    pdf.setDrawColor(34, 139, 34);
    pdf.line(margin, headerHeight + 3, pageWidth - margin, headerHeight + 3);
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    
    return headerHeight + 10; // content start Y
  }

  private addFooter() {
    const pdf = this.pdf;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    
    // Subtle footer
    pdf.setFillColor(248, 249, 250);
    pdf.rect(0, pageHeight - 22, pageWidth, 22, 'F');
    pdf.setFillColor(34, 139, 34);
    pdf.rect(0, pageHeight - 22, 3, 22, 'F');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(108, 117, 125);
    pdf.text('TreeAI • Licensed & Insured • Financing Available • Emergency Services', margin, pageHeight - 10);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(0, 0, 0);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  private formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  }

  generateEstimate(data: EstimateData): jsPDF {
    this.pdf = new jsPDF();
    let yPos = this.addHeader('ESTIMATE', data.id);

    // Customer info
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Customer Information:', 20, yPos);
    
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Name: ${data.customerName}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Address: ${data.customerAddress}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Phone: ${data.customerPhone}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Email: ${data.customerEmail}`, 20, yPos);
    yPos += 10;

    // Property info
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Property Information:', 20, yPos);
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Property Address: ${data.propertyAddress}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Acreage: ${data.acreage} acres`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Terrain: ${data.terrain}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Density: ${data.density}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Accessibility: ${data.accessibility}`, 20, yPos);
    if (data.obstacles.length > 0) {
      yPos += 6;
      this.pdf.text(`Obstacles: ${data.obstacles.join(', ')}`, 20, yPos);
    }
    yPos += 6;
    this.pdf.text(`Stump Removal: ${data.stumpRemoval ? 'Yes' : 'No'}`, 20, yPos);
    yPos += 15;

    // Services table
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Services:', 20, yPos);
    yPos += 10;

    // Table headers
    this.pdf.setFontSize(10);
    this.pdf.text('Service', 20, yPos);
    this.pdf.text('Qty', 100, yPos);
    this.pdf.text('Unit', 120, yPos);
    this.pdf.text('Rate', 140, yPos);
    this.pdf.text('Total', 170, yPos);
    
    yPos += 3;
    this.pdf.line(20, yPos, 190, yPos);
    yPos += 5;

    // Services
    this.pdf.setFont('helvetica', 'normal');
    data.services.forEach(service => {
      this.pdf.text(service.name, 20, yPos);
      this.pdf.text(service.quantity.toString(), 100, yPos);
      this.pdf.text(service.unit, 120, yPos);
      this.pdf.text(this.formatCurrency(service.rate), 140, yPos);
      this.pdf.text(this.formatCurrency(service.total), 170, yPos);
      yPos += 6;
      
      if (service.description) {
        this.pdf.setFontSize(8);
        this.pdf.text(service.description, 25, yPos);
        yPos += 4;
        this.pdf.setFontSize(10);
      }
    });

    yPos += 5;
    this.pdf.line(140, yPos, 190, yPos);
    yPos += 8;

    // Totals
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Subtotal:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.subtotal), 170, yPos);
    yPos += 6;
    this.pdf.text('Tax:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.tax), 170, yPos);
    yPos += 6;
    this.pdf.setFontSize(12);
    this.pdf.text('TOTAL:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.total), 170, yPos);
    yPos += 15;

    // Terms
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`This estimate is valid for ${data.validFor} days from the date above.`, 20, yPos);
    yPos += 6;
    this.pdf.text('All work will be performed by licensed and insured professionals.', 20, yPos);

    if (data.notes) {
      yPos += 10;
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Notes:', 20, yPos);
      yPos += 6;
      this.pdf.setFont('helvetica', 'normal');
      const noteLines = this.pdf.splitTextToSize(data.notes, 170);
      this.pdf.text(noteLines, 20, yPos);
    }

    this.addFooter();
    return this.pdf;
  }

  generateProposal(data: ProposalData): jsPDF {
    this.initPdf();

    // Two-page layout: Left = Company, Right = Project one-pager
    this.generateCompanyOverviewPage(data);
    this.pdf.addPage();
    this.generateProjectOnePager(data);

    return this.pdf;
  }

  private generateCompanyOverviewPage(data: ProposalData): void {
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = this.addHeader('ABOUT TREEAI', data.id);

    // Brand block
    yPos += 6;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(20);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Tree Shop (TreeAI)', margin, yPos);
    
    yPos += 8;
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    const intro = 'Professional forestry mulching and land management. Licensed, insured, and equipped to deliver fast, predictable results with minimal disturbance to your property.';
    this.pdf.text(this.pdf.splitTextToSize(intro, pageWidth - margin * 2), margin, yPos);
    yPos += 18;

    // Value props
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Why TreeAI', margin, yPos);
    yPos += 6;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    const bullets = [
      'Licensed & Insured • Florida-focused',
      'Forestry Mulching & Stump Grinding experts',
      'Modern compact track loaders and forestry heads',
      'Financing available • Clear, written proposals',
      'Rapid scheduling • 24/7 emergency response',
    ];
    bullets.forEach(b => { this.pdf.text(`• ${b}`, margin, yPos); yPos += 6; });
    yPos += 4;

    // Process strip
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Our Process', margin, yPos);
    yPos += 6;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    const process = [
      '1) Site review and scope confirmation',
      '2) Mobilize equipment and protect access/edges',
      '3) Mulch to package spec (DBH limits) and grade rough areas',
      '4) Walkthrough and cleanup',
    ];
    process.forEach(p => { this.pdf.text(p, margin, yPos); yPos += 6; });
    yPos += 6;

    // Coverage & contact
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Service Area & Contact', margin, yPos);
    yPos += 6;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Serving Central Florida • office@fltreeshop.com • (352) 555‑TREE', margin, yPos);
    yPos += 12;

    // Resources / marketing
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Resources', margin, yPos);
    yPos += 6;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
    const blogText = `Blog: ${BLOG_URL}`;
    const ytText = `YouTube: ${YOUTUBE_URL}`;
    this.pdf.text(blogText, margin, yPos);
    yPos += 6;
    this.pdf.text(ytText, margin, yPos);
    // Link annotations
    this.pdf.link(margin, yPos - 6 - 3, this.pdf.getTextWidth(blogText), 6, { url: BLOG_URL });
    this.pdf.link(margin, yPos - 3, this.pdf.getTextWidth(ytText), 6, { url: YOUTUBE_URL });

    this.addFooter();
  }

  private generateProjectOnePager(data: ProposalData): void {
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const pageHeight = this.pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = this.addHeader('PROJECT PROPOSAL', data.id);

    // Customer + property summary (condensed)
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Project Summary', margin, yPos);
    yPos += 7;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Customer: ${data.customerName}  •  ${data.customerPhone}`, margin, yPos);
    yPos += 6;
    this.pdf.text(`Email: ${data.customerEmail}`, margin, yPos);
    yPos += 6;
    const addrLines = this.pdf.splitTextToSize(`Service Address: ${data.propertyAddress}`, pageWidth - margin * 2);
    this.pdf.text(addrLines, margin, yPos);
    yPos += Math.min(addrLines.length, 2) * 6 + 2;
    this.pdf.text(`Acreage: ${data.acreage} acres  •  Duration: ${data.timeline}`, margin, yPos);
    yPos += 10;

    // Services (single-page fit): clamp description lines
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Scope of Work', margin, yPos);
    yPos += 7;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(0, 0, 0);

    const cardPadding = 4;
    data.services.forEach((s) => {
      const descLines = this.pdf.splitTextToSize(s.description || '', pageWidth - margin * 2 - 20);
      const clamped = (descLines as string[]).slice(0, 6); // keep to ~6 lines max
      const cardHeight = 10 + clamped.length * 5 + 10;
      this.pdf.setFillColor(248, 249, 250);
      this.pdf.rect(margin, yPos - 6, pageWidth - margin * 2, cardHeight, 'F');
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(12);
      this.pdf.text(s.name, margin + cardPadding, yPos);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10.5);
      this.pdf.text(clamped, margin + cardPadding, yPos + 6);
      // price on right
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(34, 139, 34);
      const price = this.formatCurrency(s.total);
      const pw = this.pdf.getTextWidth(price);
      this.pdf.text(price, pageWidth - margin - pw, yPos);
      yPos += cardHeight + 6;
    });

    // Totals
    if (yPos > pageHeight - 60) yPos = pageHeight - 60; // ensure space for terms/signature
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0,0,0);
    this.pdf.text('Subtotal:', pageWidth - margin - 60, yPos);
    this.pdf.text(this.formatCurrency(data.subtotal), pageWidth - margin - 10, yPos, { align: 'right' as any });
    yPos += 6;
    this.pdf.text('Tax:', pageWidth - margin - 60, yPos);
    this.pdf.text(this.formatCurrency(data.tax), pageWidth - margin - 10, yPos, { align: 'right' as any });
    yPos += 6;
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Total:', pageWidth - margin - 60, yPos);
    this.pdf.text(this.formatCurrency(data.total), pageWidth - margin - 10, yPos, { align: 'right' as any });
    yPos += 10;

    // Terms (one-liner)
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10.5);
    this.pdf.setTextColor(0, 0, 0);
    const briefTerms = 'Only 20% deposit to schedule. Balance due on completion. Financing available with approved credit.';
    const tLines = this.pdf.splitTextToSize(briefTerms, pageWidth - margin * 2);
    this.pdf.text(tLines, margin, yPos);
    yPos += Math.min((tLines as string[]).length, 3) * 5 + 6;

    // Signature lines
    this.pdf.setLineWidth(0.7);
    this.pdf.setDrawColor(0,0,0);
    this.pdf.line(margin, yPos, margin + 70, yPos);
    this.pdf.line(pageWidth - margin - 40, yPos, pageWidth - margin, yPos);
    yPos += 5;
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(108,117,125);
    this.pdf.text('Customer Signature', margin, yPos);
    this.pdf.text('Date', pageWidth - margin - 35, yPos);

    this.addFooter();
  }

  private generateProposalCoverPage(data: ProposalData): void {
    let yPos = this.addHeader('PROPOSAL', data.id);
    yPos += 20;

    // Hero section with large project value
    this.pdf.setFillColor(34, 139, 34, 0.1);
    this.pdf.rect(15, yPos - 10, 180, 60, 'F');
    
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    const totalText = this.formatCurrency(data.total);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, (210 - totalWidth) / 2, yPos + 10);
    
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(108, 117, 125);
    this.pdf.setFont('helvetica', 'normal');
    const subtitleText = 'Professional Forestry Mulching Services';
    const subtitleWidth = this.pdf.getTextWidth(subtitleText);
    this.pdf.text(subtitleText, (210 - subtitleWidth) / 2, yPos + 20);
    
    this.pdf.setFontSize(12);
    const acreageText = `${data.acreage} acres • ${data.timeline}`;
    const acreageWidth = this.pdf.getTextWidth(acreageText);
    this.pdf.text(acreageText, (210 - acreageWidth) / 2, yPos + 30);
    
    yPos += 80;

    // Customer Information Card
    this.pdf.setFillColor(248, 249, 250);
    this.pdf.rect(20, yPos, 170, 50, 'F');
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Customer Information', 30, yPos + 15);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`${data.customerName}`, 30, yPos + 25);
    this.pdf.text(`${data.customerPhone}`, 30, yPos + 32);
    this.pdf.text(`${data.customerEmail}`, 30, yPos + 39);
    
    yPos += 70;

    // Project Details Card
    this.pdf.setFillColor(248, 249, 250);
    this.pdf.rect(20, yPos, 170, 60, 'F');
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Project Details', 30, yPos + 15);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Property Address:', 30, yPos + 25);
    const addressLines = this.pdf.splitTextToSize(data.propertyAddress, 140);
    this.pdf.text(addressLines, 30, yPos + 32);
    
    this.pdf.text(`Acreage: ${data.acreage} acres`, 30, yPos + 45);
    this.pdf.text(`Estimated Duration: ${data.timeline}`, 30, yPos + 52);

    this.addFooter();
  }

  private generateProposalServicesPage(data: ProposalData): void {
    let yPos = this.addHeader('SERVICES & PRICING', data.id);
    yPos += 10;

    // Services section with better mobile spacing
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Proposed Services', 20, yPos);
    
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(34, 139, 34);
    this.pdf.line(20, yPos + 3, 190, yPos + 3);
    
    yPos += 20;

    data.services.forEach(service => {
      // Service card background
      this.pdf.setFillColor(248, 249, 250);
      const cardHeight = 80;
      this.pdf.rect(15, yPos - 5, 180, cardHeight, 'F');
      
      // Service name
      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(service.name, 25, yPos + 5);
      
      // Service description with better line spacing
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(108, 117, 125);
      const descLines = this.pdf.splitTextToSize(service.description, 160);
      this.pdf.text(descLines, 25, yPos + 15);
      
      // Pricing on the right
      this.pdf.setFontSize(18);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(34, 139, 34);
      const priceText = this.formatCurrency(service.total);
      const priceWidth = this.pdf.getTextWidth(priceText);
      this.pdf.text(priceText, 190 - priceWidth, yPos + 5);
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(108, 117, 125);
      const unitText = `${service.quantity} ${service.unit} × ${this.formatCurrency(service.rate)}`;
      const unitWidth = this.pdf.getTextWidth(unitText);
      this.pdf.text(unitText, 190 - unitWidth, yPos + 15);
      
      yPos += cardHeight + 10;
    });

    // Total section
    yPos += 10;
    this.pdf.setFillColor(34, 139, 34, 0.1);
    this.pdf.rect(15, yPos - 5, 180, 40, 'F');
    
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Total Project Value', 25, yPos + 10);
    
    const totalText = this.formatCurrency(data.total);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, 190 - totalWidth, yPos + 10);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(108, 117, 125);
    this.pdf.text('Only 20% deposit required • Financing available', 25, yPos + 22);

    this.addFooter();
  }

  private generateProposalTermsPage(data: ProposalData): void {
    let yPos = this.addHeader('TERMS & AUTHORIZATION', data.id);
    yPos += 10;

    // Terms section
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Terms and Conditions', 20, yPos);
    
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(34, 139, 34);
    this.pdf.line(20, yPos + 3, 190, yPos + 3);
    
    yPos += 20;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    const termLines = this.pdf.splitTextToSize(data.terms, 170);
    this.pdf.text(termLines, 20, yPos);
    yPos += termLines.length * 6 + 20;

    // Warranty section
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Warranty & Guarantee', 20, yPos);
    
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(34, 139, 34);
    this.pdf.line(20, yPos + 3, 190, yPos + 3);
    
    yPos += 20;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    const warrantyLines = this.pdf.splitTextToSize(data.warranty, 170);
    this.pdf.text(warrantyLines, 20, yPos);
    yPos += warrantyLines.length * 6 + 30;

    // Signature section with mobile-friendly layout
    this.pdf.setFillColor(248, 249, 250);
    this.pdf.rect(15, yPos - 10, 180, 80, 'F');
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(34, 139, 34);
    this.pdf.text('Client Authorization', 25, yPos);
    
    yPos += 20;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('I authorize TreeAI to proceed with the services outlined above:', 25, yPos);
    
    yPos += 20;
    this.pdf.setLineWidth(1);
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(25, yPos, 120, yPos);
    this.pdf.line(130, yPos, 180, yPos);
    
    yPos += 8;
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(108, 117, 125);
    this.pdf.text('Customer Signature', 25, yPos);
    this.pdf.text('Date', 130, yPos);

    this.addFooter();
  }

  generateWorkOrder(data: WorkOrderData): jsPDF {
    this.pdf = new jsPDF();
    let yPos = this.addHeader('WORK ORDER', data.id);

    // Customer info
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Customer Information:', 20, yPos);
    
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Name: ${data.customerName}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Phone: ${data.customerPhone}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Email: ${data.customerEmail}`, 20, yPos);
    yPos += 10;

    // Job details
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Job Details:', 20, yPos);
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Property Address: ${data.propertyAddress}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Scheduled Date: ${this.formatDate(data.scheduledDate)}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Estimated Duration: ${data.estimatedDuration}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Crew Size: ${data.crewSize}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Status: ${data.status.toUpperCase()}`, 20, yPos);
    yPos += 15;

    // Equipment needed
    if (data.equipmentNeeded.length > 0) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Equipment Needed:', 20, yPos);
      yPos += 8;
      this.pdf.setFont('helvetica', 'normal');
      data.equipmentNeeded.forEach(equipment => {
        this.pdf.text(`• ${equipment}`, 25, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Services to perform
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Services to Perform:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    data.services.forEach(service => {
      this.pdf.text(`• ${service.name}`, 25, yPos);
      yPos += 6;
      if (service.description) {
        const descLines = this.pdf.splitTextToSize(service.description, 160);
        this.pdf.text(descLines, 30, yPos);
        yPos += descLines.length * 4;
      }
      if (service.specifications) {
        this.pdf.setFontSize(9);
        this.pdf.text(`Specifications: ${service.specifications}`, 30, yPos);
        yPos += 4;
        this.pdf.setFontSize(10);
      }
      yPos += 3;
    });

    yPos += 10;

    // Special instructions
    if (data.specialInstructions) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Special Instructions:', 20, yPos);
      yPos += 8;
      this.pdf.setFont('helvetica', 'normal');
      const instructionLines = this.pdf.splitTextToSize(data.specialInstructions, 170);
      this.pdf.text(instructionLines, 20, yPos);
      yPos += instructionLines.length * 4 + 10;
    }

    // Safety requirements
    if (data.safetyRequirements.length > 0) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Safety Requirements:', 20, yPos);
      yPos += 8;
      this.pdf.setFont('helvetica', 'normal');
      data.safetyRequirements.forEach(requirement => {
        this.pdf.text(`• ${requirement}`, 25, yPos);
        yPos += 6;
      });
    }

    this.addFooter();
    return this.pdf;
  }

  generateInvoice(data: InvoiceData): jsPDF {
    this.pdf = new jsPDF();
    let yPos = this.addHeader('INVOICE', data.id);

    // Customer info
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Bill To:', 20, yPos);
    
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(data.customerName, 20, yPos);
    yPos += 6;
    this.pdf.text(data.customerAddress, 20, yPos);
    yPos += 6;
    this.pdf.text(`Phone: ${data.customerPhone}`, 20, yPos);
    yPos += 6;
    this.pdf.text(`Email: ${data.customerEmail}`, 20, yPos);

    // Invoice details (right side)
    this.pdf.text(`Work Order: #${data.workOrderId}`, 140, yPos - 18);
    this.pdf.text(`Completion Date: ${this.formatDate(data.completionDate)}`, 140, yPos - 12);
    this.pdf.text(`Due Date: ${this.formatDate(data.dueDate)}`, 140, yPos - 6);
    this.pdf.text(`Payment Terms: ${data.paymentTerms}`, 140, yPos);

    yPos += 15;

    // Property address
    this.pdf.text(`Service Address: ${data.propertyAddress}`, 20, yPos);
    yPos += 15;

    // Services table
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Services Provided:', 20, yPos);
    yPos += 10;

    // Table headers
    this.pdf.setFontSize(10);
    this.pdf.text('Service', 20, yPos);
    this.pdf.text('Qty', 100, yPos);
    this.pdf.text('Unit', 120, yPos);
    this.pdf.text('Rate', 140, yPos);
    this.pdf.text('Total', 170, yPos);
    
    yPos += 3;
    this.pdf.line(20, yPos, 190, yPos);
    yPos += 5;

    // Services
    this.pdf.setFont('helvetica', 'normal');
    data.services.forEach(service => {
      this.pdf.text(service.name, 20, yPos);
      this.pdf.text(service.quantity.toString(), 100, yPos);
      this.pdf.text(service.unit, 120, yPos);
      this.pdf.text(this.formatCurrency(service.rate), 140, yPos);
      this.pdf.text(this.formatCurrency(service.total), 170, yPos);
      yPos += 6;
      
      if (service.description) {
        this.pdf.setFontSize(8);
        this.pdf.text(service.description, 25, yPos);
        yPos += 4;
        this.pdf.setFontSize(10);
      }
    });

    yPos += 5;
    this.pdf.line(140, yPos, 190, yPos);
    yPos += 8;

    // Totals
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Subtotal:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.subtotal), 170, yPos);
    yPos += 6;
    this.pdf.text('Tax:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.tax), 170, yPos);
    yPos += 6;
    this.pdf.setFontSize(12);
    this.pdf.text('AMOUNT DUE:', 140, yPos);
    this.pdf.text(this.formatCurrency(data.total), 170, yPos);
    yPos += 15;

    // Payment terms
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Payment due within ${data.paymentTerms}.`, 20, yPos);
    yPos += 6;
    this.pdf.text('Thank you for your business!', 20, yPos);

    if (data.notes) {
      yPos += 10;
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Notes:', 20, yPos);
      yPos += 6;
      this.pdf.setFont('helvetica', 'normal');
      const noteLines = this.pdf.splitTextToSize(data.notes, 170);
      this.pdf.text(noteLines, 20, yPos);
    }

    this.addFooter();
    return this.pdf;
  }

  async generateFromHTML(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }

  save(filename: string): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }

  getBase64(): string {
    return this.pdf.output('datauristring');
  }
}

// Default business info for TreeShop
export const defaultBusinessInfo: BusinessInfo = {
  name: 'Tree Shop (TreeAI)',
  address: 'Serving Central Florida',
  phone: '(352) 555-TREE',
  email: 'office@fltreeshop.com',
  website: 'treeai.us/treeshop',
  license: 'Licensed & Insured Florida Contractors'
};