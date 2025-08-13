'use client';

import dynamic from 'next/dynamic';

// Dynamically import Stripe payment components to reduce initial bundle size
const StripeCheckout = dynamic(() => import('./StripeCheckout'), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <span className="ml-2 text-gray-600">Loading payment form...</span>
    </div>
  ),
  ssr: false
});

interface DynamicStripePaymentProps {
  proposalId: string;
  amount: number;
  customerEmail: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function DynamicStripePayment(props: DynamicStripePaymentProps) {
  return <StripeCheckout {...props} />;
}