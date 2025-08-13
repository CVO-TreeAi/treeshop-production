import { NextRequest, NextResponse } from 'next/server';
import { 
  PDFGenerator, 
  defaultBusinessInfo, 
  EstimateData, 
  ProposalData, 
  WorkOrderData, 
  InvoiceData 
} from '@/lib/pdf-generator';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data parameter' },
        { status: 400 }
      );
    }

    const pdfGenerator = new PDFGenerator(defaultBusinessInfo);
    let pdf;
    let filename;

    switch (type) {
      case 'estimate':
        pdf = pdfGenerator.generateEstimate(data as EstimateData);
        filename = `estimate-${data.id}.pdf`;
        break;
        
      case 'proposal':
        pdf = pdfGenerator.generateProposal(data as ProposalData);
        filename = `proposal-${data.id}.pdf`;
        break;
        
      case 'work-order':
        pdf = pdfGenerator.generateWorkOrder(data as WorkOrderData);
        filename = `work-order-${data.id}.pdf`;
        break;
        
      case 'invoice':
        pdf = pdfGenerator.generateInvoice(data as InvoiceData);
        filename = `invoice-${data.id}.pdf`;
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid PDF type. Supported types: estimate, proposal, work-order, invoice' },
          { status: 400 }
        );
    }

    // Generate PDF blob
    const pdfBlob = pdfGenerator.getBlob();
    
    // Convert blob to buffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as downloadable response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PDF Generator API',
    supportedTypes: ['estimate', 'proposal', 'work-order', 'invoice'],
    usage: {
      method: 'POST',
      body: {
        type: 'string (estimate|proposal|work-order|invoice)',
        data: 'object (document data)'
      }
    },
    examples: {
      estimate: {
        type: 'estimate',
        data: {
          id: 'EST-001',
          customerName: 'John Doe',
          customerAddress: '123 Main St, City, FL 12345',
          customerPhone: '(555) 123-4567',
          customerEmail: 'john@example.com',
          propertyAddress: '456 Oak Ave, City, FL 12345',
          acreage: 2.5,
          terrain: 'flat',
          density: 'medium',
          accessibility: 'easy',
          obstacles: ['fence', 'power lines'],
          stumpRemoval: true,
          services: [
            {
              name: 'Forestry Mulching',
              description: 'Clear and mulch overgrown vegetation',
              quantity: 2.5,
              unit: 'acres',
              rate: 800,
              total: 2000
            }
          ],
          subtotal: 2000,
          tax: 140,
          total: 2140,
          validFor: 30,
          notes: 'Access road needs to be cleared first',
          createdAt: new Date()
        }
      }
    }
  });
}