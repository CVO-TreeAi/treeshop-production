'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProposal } from '@/lib/firestore/proposals';
import { ProposalTokenManager } from '@/lib/proposal-tokens';
import { getStripe } from '@/lib/stripe';
import type { Proposal } from '@/types/proposals';

interface PaymentPageProps {
  params: Promise<{ proposalId: string }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const [proposalId, setProposalId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('t');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

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
          setError('Invalid or expired payment link');
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

        // Check if proposal is in correct state for payment
        if (proposalData.status !== 'accepted' && proposalData.status !== 'paid') {
          setError('This proposal is not available for payment');
          setLoading(false);
          return;
        }

        if (proposalData.computed.depositAmount <= 0) {
          setError('No deposit required for this proposal');
          setLoading(false);
          return;
        }

        setProposal(proposalData);
        setTokenValid(true);

      } catch (err) {
        console.error('Error loading proposal:', err);
        setError('Failed to load proposal for payment');
      } finally {
        setLoading(false);
      }
    }

    loadProposal();
  }, [params, token]);

  const handlePayment = async () => {
    if (!token || !proposal || !tokenValid) {
      return;
    }

    setProcessingPayment(true);
    try {
      // Create checkout session
      const response = await fetch('/api/proposals/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposalId,
          token
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal || !tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h1>
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

  if (proposal.status === 'paid') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Completed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you, {proposal.customer.name}! Your deposit has been processed successfully.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Payment Details</h3>
            <div className="text-left text-green-800 space-y-1">
              <p>• Deposit Amount: ${proposal.computed.depositAmount.toLocaleString()}</p>
              <p>• Remaining Balance: ${proposal.computed.balance.toLocaleString()}</p>
              <p>• Project: {proposal.inputs.acreage} acres at {proposal.inputs.address}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-left text-blue-800 space-y-1">
              <li>• We'll contact you within 24 hours to schedule your project</li>
              <li>• Final payment of ${proposal.computed.balance.toLocaleString()} is due upon completion</li>
              <li>• You'll receive email updates throughout the process</li>
            </ul>
          </div>

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
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <h1 className="text-2xl font-bold">Secure Deposit Payment</h1>
            <p className="opacity-90">Complete your project reservation</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Project Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>Customer:</strong> {proposal.customer.name}</p>
                <p><strong>Location:</strong> {proposal.inputs.address}</p>
                <p><strong>Size:</strong> {proposal.inputs.acreage} acres</p>
                <p><strong>Services:</strong> {proposal.computed.breakdown.length} items</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Project Total:</span>
                  <span className="font-medium">${proposal.computed.total.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-b bg-green-50 px-4 rounded">
                  <span className="font-semibold text-green-900">Deposit Required (20%):</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${proposal.computed.depositAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Balance Due on Completion:</span>
                  <span className="font-medium">${proposal.computed.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Your Payment</h3>
          
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment powered by Stripe
            </div>
            
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Your deposit secures your project date</li>
              <li>✓ SSL encrypted and PCI compliant</li>
              <li>✓ Instant email confirmation</li>
              <li>✓ We'll contact you within 24 hours to schedule</li>
            </ul>
          </div>

          <button
            onClick={handlePayment}
            disabled={processingPayment}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            {processingPayment ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </span>
            ) : (
              `💳 Pay Deposit - $${proposal.computed.depositAmount.toLocaleString()}`
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By clicking "Pay Deposit", you agree to our terms of service and authorize this payment.
            No additional charges will be made without your explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}