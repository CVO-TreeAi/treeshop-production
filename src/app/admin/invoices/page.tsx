'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerName: string;
  customerEmail: string;
  projectTitle: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  services: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  payments: {
    id: string;
    amount: number;
    method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
    date: string;
    reference?: string;
  }[];
  notes?: string;
  terms: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'check' | 'credit_card' | 'bank_transfer'>('check');

  // Mock data for demonstration
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: 'INV-001',
        invoiceNumber: 'TS-2024-001',
        workOrderId: 'WO-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        projectTitle: 'Residential Forestry Mulching - 5 Acres',
        status: 'sent',
        issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        services: [
          { description: 'Forestry Mulching - 5 acres', quantity: 5, rate: 1500, total: 7500 },
          { description: 'Site Cleanup', quantity: 1, rate: 750, total: 750 },
          { description: 'Travel Surcharge', quantity: 1, rate: 500, total: 500 }
        ],
        subtotal: 8750,
        tax: 656.25,
        taxRate: 0.075,
        total: 9406.25,
        payments: [],
        terms: 'Payment due within 30 days. Late fees apply after due date.',
        notes: 'Thank you for choosing TreeShop for your land clearing needs!'
      },
      {
        id: 'INV-002',
        invoiceNumber: 'TS-2024-002',
        workOrderId: 'WO-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@devcompany.com',
        projectTitle: 'Commercial Land Clearing - 12 Acres',
        status: 'partial',
        issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        services: [
          { description: 'Heavy Forestry Mulching - 12 acres', quantity: 12, rate: 1450, total: 17400 },
          { description: 'Stump Grinding - 15 stumps', quantity: 15, rate: 80, total: 1200 }
        ],
        subtotal: 18600,
        tax: 1395,
        taxRate: 0.075,
        total: 19995,
        payments: [
          {
            id: 'PMT-001',
            amount: 10000,
            method: 'check',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            reference: 'Check #2045'
          }
        ],
        terms: 'Payment due within 30 days. 50% deposit received.',
        notes: 'Commercial project - Net 30 terms as agreed.'
      },
      {
        id: 'INV-003',
        invoiceNumber: 'TS-2024-003',
        workOrderId: 'WO-003',
        customerName: 'Mike Davis',
        customerEmail: 'mike.davis@email.com',
        projectTitle: 'Residential Lot Preparation - 2 Acres',
        status: 'paid',
        issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        services: [
          { description: 'Light Forestry Mulching - 2 acres', quantity: 2, rate: 1200, total: 2400 },
          { description: 'Selective Tree Removal - 8 trees', quantity: 8, rate: 150, total: 1200 },
          { description: 'Final Grading', quantity: 1, rate: 600, total: 600 }
        ],
        subtotal: 4200,
        tax: 315,
        taxRate: 0.075,
        total: 4515,
        payments: [
          {
            id: 'PMT-002',
            amount: 4515,
            method: 'credit_card',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            reference: '****1234'
          }
        ],
        terms: 'Payment due within 30 days.',
        notes: 'Excellent customer - paid early!'
      },
      {
        id: 'INV-004',
        invoiceNumber: 'TS-2024-004',
        workOrderId: 'WO-004',
        customerName: 'Robert Wilson',
        customerEmail: 'rwilson@email.com',
        projectTitle: 'Emergency Storm Cleanup - 3 Acres',
        status: 'overdue',
        issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        services: [
          { description: 'Emergency Tree Removal', quantity: 1, rate: 2500, total: 2500 },
          { description: 'Storm Debris Cleanup - 3 acres', quantity: 3, rate: 800, total: 2400 },
          { description: 'Weekend Emergency Rate', quantity: 1, rate: 500, total: 500 }
        ],
        subtotal: 5400,
        tax: 405,
        taxRate: 0.075,
        total: 5805,
        payments: [],
        terms: 'Payment due within 30 days. Late fees apply after due date.',
        notes: 'Emergency storm damage cleanup after Hurricane.'
      }
    ];

    setInvoices(mockInvoices);
    setLoading(false);
  }, []);

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      case 'sent': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'partial': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      case 'paid': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'overdue': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'cancelled': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const getRemainingBalance = (invoice: Invoice) => {
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return invoice.total - totalPaid;
  };

  const addPayment = () => {
    if (!selectedInvoice || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    const newPayment = {
      id: `PMT-${Date.now()}`,
      amount,
      method: paymentMethod,
      date: new Date().toISOString(),
      reference: paymentMethod === 'check' ? 'Check #' : paymentMethod === 'credit_card' ? '****' : ''
    };

    const updatedInvoice = {
      ...selectedInvoice,
      payments: [...selectedInvoice.payments, newPayment]
    };

    const remainingBalance = getRemainingBalance(updatedInvoice);
    if (remainingBalance <= 0) {
      updatedInvoice.status = 'paid';
      updatedInvoice.paidDate = new Date().toISOString();
    } else if (updatedInvoice.payments.length > 0) {
      updatedInvoice.status = 'partial';
    }

    setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
    setSelectedInvoice(updatedInvoice);
    setShowPaymentForm(false);
    setPaymentAmount('');
  };

  const generateInvoicePDF = (invoice: Invoice) => {
    console.log('Generating PDF for invoice:', invoice.id);
    alert(`PDF generation for invoice ${invoice.invoiceNumber} would be implemented here.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }

  const totalReceivables = invoices.reduce((sum, inv) => sum + getRemainingBalance(inv), 0);
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">💰 Invoices</h1>
            <p className="text-gray-300">Invoice generation, payment tracking, and financial reports</p>
          </div>
          <button className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
            + New Invoice
          </button>
        </header>

        {/* Financial Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">${totalReceivables.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Receivables</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{paidInvoices.length}</div>
            <div className="text-sm text-gray-400">Paid</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{overdueInvoices.length}</div>
            <div className="text-sm text-gray-400">Overdue</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {invoices.length > 0 ? Math.round(paidInvoices.length / invoices.length * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400">Collection Rate</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Invoices List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {/* Filter Tabs */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        filter === status 
                          ? 'bg-green-600 text-black font-semibold' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)} 
                      {status !== 'all' && ` (${invoices.filter(inv => inv.status === status).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoices List */}
              <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                {filteredInvoices.map(invoice => (
                  <div
                    key={invoice.id}
                    className={`p-6 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                      selectedInvoice?.id === invoice.id ? 'bg-gray-800/50 border-l-4 border-green-600' : ''
                    }`}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-mono text-sm text-gray-400 mb-1">{invoice.invoiceNumber}</div>
                        <h3 className="font-semibold text-white mb-1">{invoice.projectTitle}</h3>
                        <p className="text-sm text-gray-400">{invoice.customerName}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400 text-lg">
                          ${invoice.total.toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(invoice.status)}`}>
                          {invoice.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                      {getRemainingBalance(invoice) > 0 ? (
                        <span className="text-yellow-400">
                          Balance: ${getRemainingBalance(invoice).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-400">✓ Paid in Full</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            {selectedInvoice ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white">Invoice Details</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateInvoicePDF(selectedInvoice)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="bg-green-600 hover:bg-green-500 text-black px-3 py-1 rounded text-sm font-semibold"
                    >
                      + Payment
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Invoice #</label>
                      <div className="font-mono text-white">{selectedInvoice.invoiceNumber}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Status</label>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Customer</label>
                    <div className="text-white font-medium">{selectedInvoice.customerName}</div>
                    <div className="text-sm text-gray-300">{selectedInvoice.customerEmail}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Issue Date</label>
                      <div className="text-white">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Due Date</label>
                      <div className={`${new Date(selectedInvoice.dueDate) < new Date() && selectedInvoice.status !== 'paid' ? 'text-red-400' : 'text-white'}`}>
                        {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Services</label>
                    <div className="space-y-2 mt-2">
                      {selectedInvoice.services.map((service, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-white">{service.description}</span>
                            <span className="text-green-400 font-bold">${service.total.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {service.quantity} × ${service.rate.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white">${selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Tax ({(selectedInvoice.taxRate * 100)}%):</span>
                      <span className="text-white">${selectedInvoice.tax.toLocaleString()}</span>
                    </div>
                    <hr className="border-gray-700 my-2" />
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-green-400">${selectedInvoice.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedInvoice.payments.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-400">Payments</label>
                      <div className="space-y-2 mt-2">
                        {selectedInvoice.payments.map((payment) => (
                          <div key={payment.id} className="bg-green-900/20 p-3 rounded flex justify-between">
                            <div>
                              <div className="text-green-300 font-medium">${payment.amount.toLocaleString()}</div>
                              <div className="text-xs text-gray-400">
                                {payment.method.replace('_', ' ')} • {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </div>
                            {payment.reference && (
                              <div className="text-xs text-gray-400">{payment.reference}</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 p-2 bg-yellow-900/20 rounded">
                        <div className="flex justify-between font-bold">
                          <span className="text-yellow-300">Remaining Balance:</span>
                          <span className="text-yellow-400">${getRemainingBalance(selectedInvoice).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {showPaymentForm && (
                    <div className="bg-gray-800/50 p-4 rounded">
                      <h4 className="font-semibold text-white mb-3">Record Payment</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Amount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                          >
                            <option value="check">Check</option>
                            <option value="cash">Cash</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addPayment}
                            className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded font-semibold"
                          >
                            Record Payment
                          </button>
                          <button
                            onClick={() => setShowPaymentForm(false)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
                <div className="text-4xl mb-4">💰</div>
                <p>Select an invoice to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}