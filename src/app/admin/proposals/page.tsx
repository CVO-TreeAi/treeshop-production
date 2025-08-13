'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getAllProposals } from '@/lib/firestore/proposals';
import type { Proposal } from '@/types/proposals';

// Interface for future use when needed
// interface ProposalViewProps {
//   proposals: Proposal[];
//   onRefresh: () => void;
// }

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [, setShowNewForm] = useState(false);
  const [showSeedButton, setShowSeedButton] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'expired' | 'cancelled'>('all');
  const [error, setError] = useState<string | null>(null);

  // Load proposals from Firestore
  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProposals(100);
      setProposals(data);
      
      // Show seed button if no proposals found (likely first time setup)
      if (data.length === 0) {
        setShowSeedButton(true);
      }
    } catch (err) {
      console.error('Error loading proposals:', err);
      setError('Failed to load proposals. Check console for details.');
      setShowSeedButton(true); // Allow seeding if load fails
    } finally {
      setLoading(false);
    }
  };

  const seedSampleData = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/admin/proposals/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: process.env.NODE_ENV === 'production' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Seeding failed');
      }

      const result = await response.json();
      console.log('Seeding result:', result);
      
      // Reload proposals after seeding
      await loadProposals();
      setShowSeedButton(false);
      
    } catch (err) {
      console.error('Error seeding data:', err);
      setError(`Seeding failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSeeding(false);
    }
  };

  const generateSampleProposal = async () => {
    try {
      const sampleRequest = {
        templateId: 'standard-template-v1',
        customer: {
          name: 'Demo Customer',
          email: 'demo@example.com',
          phone: '(555) 123-4567'
        },
        inputs: {
          acreage: 2.5,
          packageId: 'medium',
          selectedServices: ['stump-grinding', 'site-cleanup'],
          obstacles: ['fence', 'driveway'],
          address: '123 Demo Street, Orlando, FL 32801'
        }
      };

      const response = await fetch('/api/admin/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const result = await response.json();
      console.log('Generated proposal:', result);
      
      // Reload proposals to show the new one
      await loadProposals();
      
    } catch (err) {
      console.error('Error generating sample proposal:', err);
      setError(`Failed to generate proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      case 'sent': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'viewed': return 'bg-purple-600/20 text-purple-300 border-purple-600/30';
      case 'accepted': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'paid': return 'bg-emerald-600/20 text-emerald-300 border-emerald-600/30';
      case 'expired': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      case 'cancelled': return 'bg-red-600/20 text-red-300 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const downloadPDF = (proposal: Proposal) => {
    if (proposal.assets?.signedPdfUrl) {
      window.open(proposal.assets.signedPdfUrl, '_blank');
    } else {
      alert('PDF not available for this proposal');
    }
  };

  const sendProposal = async (proposal: Proposal) => {
    if (proposal.status !== 'draft') {
      alert('Only draft proposals can be sent');
      return;
    }

    try {
      const response = await fetch('/api/admin/proposals/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: proposal.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Send failed');
      }

      const result = await response.json();
      console.log('Sent proposal:', result);
      
      // Reload proposals to show updated status
      await loadProposals();
      alert('Proposal sent successfully!');
      
    } catch (err) {
      console.error('Error sending proposal:', err);
      alert(`Failed to send proposal: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const getProjectTitle = (proposal: Proposal) => {
    return `${proposal.customer.name} - ${proposal.inputs.acreage} Acres`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">📋 Proposals</h1>
            <p className="text-gray-300">Generate and manage project proposals and contracts</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNewForm(true)}
              className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              + New Proposal
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-300">{proposals.length}</div>
            <div className="text-sm text-gray-400">Total Proposals</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{proposals.filter(p => p.status === 'sent').length}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{proposals.filter(p => p.status === 'accepted').length}</div>
            <div className="text-sm text-gray-400">Accepted</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">
              ${proposals.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Value</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {proposals.length > 0 ? Math.round(proposals.filter(p => p.status === 'accepted').length / proposals.length * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Proposals List */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {/* Filter Tabs */}
              <div className="border-b border-gray-800 p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {(['all', 'draft', 'sent', 'viewed', 'accepted', 'paid', 'expired', 'cancelled'] as const).map(status => (
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
                      {status !== 'all' && ` (${proposals.filter(p => p.status === status).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposals List */}
              <div className="divide-y divide-gray-800">
                {filteredProposals.map(proposal => (
                  <div
                    key={proposal.id}
                    className={`p-6 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                      selectedProposal?.id === proposal.id ? 'bg-gray-800/50 border-l-4 border-green-600' : ''
                    }`}
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{getProjectTitle(proposal)}</h3>
                        <p className="text-sm text-gray-400">{proposal.customer.email}</p>
                        <p className="text-xs text-gray-500">{proposal.inputs.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-400 text-lg">
                          ${proposal.computed.total.toLocaleString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
                      <span>{proposal.computed.breakdown.length} services</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Proposal Details */}
          <div>
            {selectedProposal ? (
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white">Proposal Details</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadPDF(selectedProposal)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
                    >
                      📄 View PDF
                    </button>
                    {selectedProposal.status === 'draft' && (
                      <button
                        onClick={() => sendProposal(selectedProposal)}
                        className="bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded text-sm font-semibold"
                      >
                        📧 Send
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Customer Name</label>
                      <div className="text-white font-medium">{selectedProposal.customer.name}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <div className="text-white">{selectedProposal.customer.email}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      <div className="text-white">{selectedProposal.customer.phone}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Project Size</label>
                      <div className="text-white">{selectedProposal.inputs.acreage} acres</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Property Address</label>
                    <div className="text-white">{selectedProposal.inputs.address}</div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(selectedProposal.status)}`}>
                      {selectedProposal.status.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Services Breakdown</label>
                    <div className="space-y-2 mt-2">
                      {selectedProposal.computed.breakdown.map((service, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white">{service.serviceName}</span>
                            <span className="text-green-400 font-bold">${service.total.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">{service.description}</p>
                          {service.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              {service.quantity} × ${service.rate.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Subtotal</label>
                      <div className="text-white font-semibold">${selectedProposal.computed.subtotal.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Tax (7%)</label>
                      <div className="text-white font-semibold">${selectedProposal.computed.tax.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Total Amount</label>
                    <div className="text-2xl font-bold text-green-400">
                      ${selectedProposal.computed.total.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Deposit Required (20%)</label>
                      <div className="text-green-400 font-semibold">${selectedProposal.computed.depositAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Balance Due</label>
                      <div className="text-white font-semibold">${selectedProposal.computed.balance.toLocaleString()}</div>
                    </div>
                  </div>

                  {selectedProposal.inputs.obstacles && selectedProposal.inputs.obstacles.length > 0 && (
                    <div>
                      <label className="text-sm text-gray-400">Special Considerations</label>
                      <div className="text-sm text-gray-300 bg-gray-800/30 p-3 rounded mt-1">
                        {selectedProposal.inputs.obstacles.join(', ')}
                      </div>
                    </div>
                  )}

                  {selectedProposal.audit.sentAt && (
                    <div>
                      <label className="text-sm text-gray-400">Sent Date</label>
                      <div className="text-white">{new Date(selectedProposal.audit.sentAt).toLocaleString()}</div>
                    </div>
                  )}

                  {selectedProposal.audit.acceptedAt && (
                    <div>
                      <label className="text-sm text-gray-400">Accepted Date</label>
                      <div className="text-white">{new Date(selectedProposal.audit.acceptedAt).toLocaleString()}</div>
                      {selectedProposal.audit.acceptedByName && (
                        <div className="text-sm text-gray-400">by {selectedProposal.audit.acceptedByName}</div>
                      )}
                    </div>
                  )}

                  {selectedProposal.audit.paidAt && (
                    <div>
                      <label className="text-sm text-gray-400">Payment Date</label>
                      <div className="text-emerald-400 font-semibold">{new Date(selectedProposal.audit.paidAt).toLocaleString()}</div>
                      {selectedProposal.audit.paymentAmount && (
                        <div className="text-sm text-gray-400">Amount: ${(selectedProposal.audit.paymentAmount / 100).toLocaleString()}</div>
                      )}
                      {selectedProposal.audit.stripePaymentIntentId && (
                        <div className="text-xs text-gray-500">Stripe ID: {selectedProposal.audit.stripePaymentIntentId}</div>
                      )}
                    </div>
                  )}

                  {selectedProposal.status === 'accepted' && selectedProposal.computed.depositAmount > 0 && !selectedProposal.audit.paidAt && (
                    <div className="bg-blue-900/50 border border-blue-600 p-3 rounded">
                      <label className="text-sm text-blue-300">Payment Status</label>
                      <div className="text-blue-200">Awaiting deposit payment of ${selectedProposal.computed.depositAmount.toLocaleString()}</div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-6">
                    <button 
                      onClick={() => window.open(`/p/${selectedProposal.id}?t=preview`, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-semibold"
                    >
                      Preview Customer View
                    </button>
                    {selectedProposal.assets?.webUrl && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedProposal.assets!.webUrl)}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded font-semibold"
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <p>Select a proposal to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}