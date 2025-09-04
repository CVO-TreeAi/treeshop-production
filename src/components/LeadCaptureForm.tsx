'use client';

import { useState } from 'react';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
}

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Submit to Convex Terminal Sync - SIMPLE PATH
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'terminalSync:createLead', // UPDATED to terminalSync
          args: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address || undefined,
            message: formData.message || undefined,
            source: 'treeshop.app', // MUST BE treeshop.app
            status: 'complete',
            createdAt: Date.now()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }

      // Track with Terminal if available
      if (typeof window !== 'undefined' && (window as any).terminalTrack) {
        (window as any).terminalTrack('lead_submission', {
          source: 'treeshop.app'
        });
      }

      // Track with GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'USD'
        });
      }

      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Get Your Free Proposal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-200 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-200 mb-2">
            Property Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="123 Main St, Orlando, FL"
          />
        </div>


        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-2">
            Additional Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="Tell us more about your project..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Get Free Proposal'}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
            ✓ Thank you! Your proposal request has been submitted. We'll contact you within 24 hours.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            ✗ There was an error submitting your request. Please try again or call us directly.
          </div>
        )}
      </form>
    </div>
  );
}