'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProposal } from '@/lib/firestore/proposals';
import { ProposalTokenManager, isTokenUsed } from '@/lib/proposal-tokens';
import type { Proposal } from '@/types/proposals';

interface ProposalViewPageProps {
  params: Promise<{ proposalId: string }>;
}

export default function ProposalViewPage({ params }: ProposalViewPageProps) {
  const [proposalId, setProposalId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    async function loadProposal() {
      try {
        const resolvedParams = await params;
        const currentProposalId = resolvedParams.proposalId;
        setProposalId(currentProposalId);
        
        if (!token) {
          setError('Access token required');
          setLoading(false);
          return;
        }

        // Verify token
        const claims = await ProposalTokenManager.verifyApproveToken(token);
        if (!claims || claims.pid !== currentProposalId) {
          setError('Invalid or expired approval link');
          setLoading(false);
          return;
        }

        // Check if token is already used
        const used = await isTokenUsed(currentProposalId, claims.jti);
        if (used) {
          setError('This approval link has already been used');
          setLoading(false);
          return;
        }

        // Load proposal
        const proposalData = await getProposal(currentProposalId);
        if (!proposalData) {
          setError('Proposal not found');
          setLoading(false);
          return;
        }

        setProposal(proposalData);
        setTokenValid(true);
        setCustomerName(proposalData.customer.name);
        
        if (proposalData.status === 'accepted') {
          setAccepted(true);
        }

      } catch (err) {
        console.error('Error loading proposal:', err);
        setError('Failed to load proposal');
      } finally {
        setLoading(false);
      }
    }

    loadProposal();
  }, [params, token]);

  const handleAccept = async () => {
    if (!token || !proposal || !consent || !customerName.trim()) {
      return;
    }

    setAccepting(true);
    try {
      const response = await fetch('/api/proposals/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposalId,
          token,
          fullName: customerName.trim(),
          consent: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept proposal');
      }

      const result = await response.json();

      setAccepted(true);
      
      // If payment is required, store the payment URL
      if (result.depositRequired && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
      }
      
      // Refresh proposal to get updated status
      const updatedProposal = await getProposal(proposalId!);
      if (updatedProposal) {
        setProposal(updatedProposal);
      }

    } catch (err) {
      console.error('Error accepting proposal:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept proposal');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal || !tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact us at{' '}
            <a href="mailto:info@treeai.us" className="text-green-600 hover:underline">
              info@treeai.us
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposal Accepted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you, {proposal.customer.name}! Your project proposal has been accepted.
          </p>
          
          {paymentUrl ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Secure Your Project Date</h3>
              <p className="text-blue-800 mb-4">
                Complete your ${proposal.computed.depositAmount.toLocaleString()} deposit payment to reserve your project date.
              </p>
              <a
                href={paymentUrl}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors inline-block"
              >
                💳 Pay Deposit Now
              </a>
              <p className="text-xs text-blue-600 mt-2">Secure payment powered by Stripe</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Next Steps</h3>
              <ul className="text-left text-green-800 space-y-1">
                <li>• We'll contact you within 24 hours to schedule your project</li>
                {proposal.computed.depositAmount > 0 && (
                  <li>• A deposit of ${proposal.computed.depositAmount.toLocaleString()} will secure your date</li>
                )}
                <li>• Project completion typically takes 1-2 days</li>
              </ul>
            </div>
          )}

          <div className="text-gray-600">
            <p className="mb-2">Questions? Contact us:</p>
            <p className="font-medium">📞 (555) 123-4567</p>
            <p className="font-medium">📧 info@treeai.us</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <h1 className="text-2xl font-bold">TreeAI Project Proposal</h1>
            <p className="opacity-90">Professional Forestry Mulching Services</p>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {proposal.customer.name}</p>
                <p><strong>Email:</strong> {proposal.customer.email}</p>
                <p><strong>Phone:</strong> {proposal.customer.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
                <p><strong>Location:</strong> {proposal.inputs.address}</p>
                <p><strong>Size:</strong> {proposal.inputs.acreage} acres</p>
                <p><strong>Package:</strong> {proposal.computed.packageDbh} DBH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Services & Pricing</h3>
            
            <div className="space-y-4">
              {proposal.computed.breakdown.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.serviceName}</h4>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      {item.quantity > 1 && (
                        <p className="text-gray-500 text-xs mt-1">
                          {item.quantity} × ${item.rate.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${item.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${proposal.computed.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7%):</span>
                  <span>${proposal.computed.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>${proposal.computed.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Deposit Required (20%):</span>
                  <span>${proposal.computed.depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Balance Due on Completion:</span>
                  <span>${proposal.computed.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Approval */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
            
            <div className="prose prose-sm text-gray-600 mb-6">
              <ul>
                <li>A 20% deposit is required to secure your project date</li>
                <li>Final payment is due upon completion of work</li>
                <li>Weather conditions may affect scheduling</li>
                <li>Customer is responsible for marking utilities</li>
                <li>All work is guaranteed for 30 days</li>
                <li>This proposal is valid for 30 days from the date issued</li>
              </ul>
            </div>

            {/* Approval Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Approve This Proposal</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name (for signature)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    I agree to the terms and conditions above and approve this project proposal.
                    By checking this box, I authorize TreeAI to proceed with the quoted services.
                  </label>
                </div>

                <button
                  onClick={handleAccept}
                  disabled={accepting || !consent || !customerName.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {accepting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Accepting...
                    </span>
                  ) : (
                    '✅ Accept Proposal & Schedule Project'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}