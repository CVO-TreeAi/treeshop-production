'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProposal } from '@/lib/firestore/proposals';
import type { Proposal } from '@/types/proposals';

interface PaymentSuccessPageProps {
  params: Promise<{ proposalId: string }>;
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const [proposalId, setProposalId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProposal() {
      try {
        const resolvedParams = await params;
        const currentProposalId = resolvedParams.proposalId;
        setProposalId(currentProposalId);
        
        if (!sessionId) {
          setError('Invalid payment session');
          setLoading(false);
          return;
        }

        // Load proposal to get details for confirmation
        const proposalData = await getProposal(currentProposalId);
        if (!proposalData) {
          setError('Proposal not found');
          setLoading(false);
          return;
        }

        setProposal(proposalData);

      } catch (err) {
        console.error('Error loading proposal:', err);
        setError('Failed to load payment confirmation');
      } finally {
        setLoading(false);
      }
    }

    loadProposal();
  }, [params, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
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

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100 text-lg">Your project is now scheduled</p>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Thank you, {proposal.customer.name}!
            </h2>
            <p className="text-gray-600">
              Your deposit has been processed successfully and your project date is secured.
            </p>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Project Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Location:</strong> {proposal.inputs.address}</p>
                  <p><strong>Size:</strong> {proposal.inputs.acreage} acres</p>
                  <p><strong>Services:</strong> {proposal.computed.breakdown.length} items</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Deposit Paid:</strong> ${proposal.computed.depositAmount.toLocaleString()}</p>
                  <p><strong>Project Total:</strong> ${proposal.computed.total.toLocaleString()}</p>
                  <p><strong>Balance Due:</strong> ${proposal.computed.balance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-2">Balance due upon project completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">What Happens Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</div>
                <div>
                  <p className="font-medium text-blue-900">Scheduling Confirmation</p>
                  <p className="text-blue-700 text-sm">We'll contact you within 24 hours to schedule your project and confirm all details.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</div>
                <div>
                  <p className="font-medium text-blue-900">Pre-Project Preparation</p>
                  <p className="text-blue-700 text-sm">Please mark all utilities and remove any valuable items from the work area before our arrival.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</div>
                <div>
                  <p className="font-medium text-blue-900">Project Completion</p>
                  <p className="text-blue-700 text-sm">Final payment of ${proposal.computed.balance.toLocaleString()} will be due upon satisfactory completion.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Guarantee */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-2">Our Service Guarantee</h3>
            <div className="text-green-800 text-sm space-y-1">
              <p>✓ Professional equipment and experienced operators</p>
              <p>✓ Complete site cleanup and final grading</p>
              <p>✓ 30-day satisfaction guarantee</p>
              <p>✓ Fully licensed and insured in Florida</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Questions or Concerns?</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">📞 Phone:</span>{' '}
                <a href="tel:+15551234567" className="text-green-600 hover:underline font-medium">
                  (555) 123-4567
                </a>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">📧 Email:</span>{' '}
                <a href="mailto:info@treeai.us" className="text-green-600 hover:underline font-medium">
                  info@treeai.us
                </a>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">🌐 Website:</span>{' '}
                <a href="https://treeai.us" className="text-green-600 hover:underline font-medium">
                  treeai.us
                </a>
              </p>
            </div>
          </div>

          {/* Email Confirmation Note */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              📧 A confirmation email with your receipt and project details has been sent to{' '}
              <strong>{proposal.customer.email}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}