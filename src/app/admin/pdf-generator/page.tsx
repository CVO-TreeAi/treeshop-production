'use client';

import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface SampleData {
  estimate: any;
  proposal: any;
  workOrder: any;
  invoice: any;
}

export default function PDFGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'estimate' | 'proposal' | 'work-order' | 'invoice'>('estimate');

  // Sample data for testing
  const sampleData: SampleData = {
    estimate: {
      id: 'EST-001',
      customerName: 'John Doe',
      customerAddress: '123 Main Street, Brooksville, FL 34601',
      customerPhone: '(352) 555-0123',
      customerEmail: 'john.doe@email.com',
      propertyAddress: '456 Oak Avenue, Brooksville, FL 34602',
      acreage: 3.5,
      terrain: 'sloped',
      density: 'heavy',
      accessibility: 'moderate',
      obstacles: ['fence', 'power lines', 'septic system'],
      stumpRemoval: true,
      services: [
        {
          name: 'Forestry Mulching',
          description: 'Clear and mulch heavy undergrowth and small trees',
          quantity: 3.5,
          unit: 'acres',
          rate: 950,
          total: 3325
        },
        {
          name: 'Stump Grinding',
          description: 'Grind existing stumps below ground level',
          quantity: 12,
          unit: 'stumps',
          rate: 85,
          total: 1020
        }
      ],
      subtotal: 4345,
      tax: 304.15,
      total: 4649.15,
      validFor: 30,
      notes: 'Property access requires key from customer. Power lines present - extra caution required.',
      createdAt: new Date()
    },
    proposal: {
      id: 'PROP-001',
      customerName: 'Jane Smith',
      customerAddress: '789 Pine Street, Spring Hill, FL 34609',
      customerPhone: '(352) 555-0456',
      customerEmail: 'jane.smith@email.com',
      propertyAddress: '321 Maple Drive, Spring Hill, FL 34608',
      acreage: 5.0,
      terrain: 'flat',
      density: 'medium',
      accessibility: 'easy',
      obstacles: ['decorative trees to preserve'],
      stumpRemoval: false,
      services: [
        {
          name: 'Land Clearing',
          description: 'Complete land clearing for new construction',
          quantity: 5,
          unit: 'acres',
          rate: 1200,
          total: 6000
        },
        {
          name: 'Debris Removal',
          description: 'Haul away all cleared debris',
          quantity: 1,
          unit: 'lot',
          rate: 1500,
          total: 1500
        }
      ],
      subtotal: 7500,
      tax: 525,
      total: 8025,
      validFor: 45,
      timeline: '5-7 business days from contract signing',
      terms: 'Payment terms: 50% deposit required, remaining balance due upon completion. All work guaranteed for 1 year. Customer responsible for obtaining any required permits. Work includes cleanup of all debris.',
      warranty: 'We guarantee our workmanship for 12 months from completion date. This includes proper stump grinding depth and complete debris removal as specified.',
      createdAt: new Date()
    },
    workOrder: {
      id: 'WO-001',
      customerName: 'Mike Johnson',
      customerPhone: '(352) 555-0789',
      customerEmail: 'mike.johnson@email.com',
      propertyAddress: '654 Cedar Lane, Hernando, FL 34442',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      estimatedDuration: '2 days',
      crewSize: 3,
      equipmentNeeded: ['Track Mulcher', 'Stump Grinder', 'Dump Truck', 'Chainsaw'],
      services: [
        {
          name: 'Forestry Mulching',
          description: 'Clear 2 acres of mixed vegetation',
          specifications: 'Mulch to 4-inch depth, preserve marked oak trees'
        },
        {
          name: 'Access Road Creation',
          description: 'Create 20-foot wide access road through property',
          specifications: 'Grade smooth, compact surface suitable for emergency vehicles'
        }
      ],
      specialInstructions: 'Customer has dogs - ensure all gates are secured. Irrigation system present in southeast corner - mark and avoid. Customer wants wood chips left on property.',
      safetyRequirements: ['Hard hats required', 'Safety glasses mandatory', 'Watch for overhead power lines', 'First aid kit on site'],
      status: 'pending',
      createdAt: new Date()
    },
    invoice: {
      id: 'INV-001',
      customerName: 'Sarah Wilson',
      customerAddress: '987 Birch Road, Weeki Wachee, FL 34607',
      customerPhone: '(352) 555-0321',
      customerEmail: 'sarah.wilson@email.com',
      propertyAddress: '111 Elm Street, Weeki Wachee, FL 34607',
      workOrderId: 'WO-095',
      completionDate: new Date(),
      services: [
        {
          name: 'Tree Removal',
          description: 'Remove 3 large oak trees (safety hazard)',
          quantity: 3,
          unit: 'trees',
          rate: 450,
          total: 1350
        },
        {
          name: 'Stump Grinding',
          description: 'Grind stumps to 6 inches below grade',
          quantity: 3,
          unit: 'stumps',
          rate: 95,
          total: 285
        },
        {
          name: 'Cleanup & Hauling',
          description: 'Complete debris removal and site cleanup',
          quantity: 1,
          unit: 'job',
          rate: 400,
          total: 400
        }
      ],
      subtotal: 2035,
      tax: 142.45,
      total: 2177.45,
      paymentTerms: '30 days',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: 'Thank you for choosing TreeShop Pro Services! Please remit payment within 30 days.',
      createdAt: new Date()
    }
  };

  const generatePDF = async (type: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data: sampleData[type as keyof SampleData]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${sampleData[type as keyof SampleData].id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const documentTypes = [
    {
      id: 'estimate',
      title: 'Estimate',
      description: 'Professional service estimates with detailed breakdowns',
      icon: '📋',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'proposal',
      title: 'Proposal',
      description: 'Comprehensive proposals with terms and conditions',
      icon: '📄',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'work-order',
      title: 'Work Order',
      description: 'Detailed work orders for crew coordination',
      icon: '🔧',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'invoice',
      title: 'Invoice',
      description: 'Professional invoices for completed work',
      icon: '💰',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 PDF Generator</h1>
          <p className="text-gray-600">Generate professional business documents for TreeShop operations</p>
        </header>

        {/* Document Type Selector */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {documentTypes.map((docType) => (
            <div
              key={docType.id}
              className={`${
                selectedType === docType.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              } bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer`}
              onClick={() => setSelectedType(docType.id as any)}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{docType.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{docType.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{docType.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generatePDF(docType.id);
                  }}
                  disabled={isGenerating}
                  className={`w-full px-4 py-2 ${docType.color} text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isGenerating ? 'Generating...' : 'Generate PDF'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Data Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sample Data Preview - {documentTypes.find(t => t.id === selectedType)?.title}
          </h2>
          <div className="bg-gray-50 rounded-md p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(sampleData[selectedType], null, 2)}
            </pre>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🔗 API Usage</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-blue-800">Endpoint:</span>
              <code className="ml-2 px-2 py-1 bg-blue-100 rounded">POST /api/generate-pdf</code>
            </div>
            <div>
              <span className="font-medium text-blue-800">Request Body:</span>
              <pre className="mt-2 p-3 bg-blue-100 rounded text-xs">
{`{
  "type": "estimate|proposal|work-order|invoice",
  "data": {
    // Document data object
  }
}`}
              </pre>
            </div>
            <div>
              <span className="font-medium text-blue-800">Response:</span>
              <span className="ml-2 text-blue-700">PDF file download</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Professional TreeShop branding
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Detailed service breakdowns
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Automatic calculations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Terms and conditions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Digital signatures ready
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Use Cases</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Customer estimates & quotes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Project proposals
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Crew work orders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Billing & invoicing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Record keeping
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}