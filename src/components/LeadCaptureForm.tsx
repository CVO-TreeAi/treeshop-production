'use client';

import { useState } from 'react';

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    acreage: '',
    selectedPackage: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send to Terminal's Convex backend
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'leads:createLead',
          args: {
            ...formData,
            source: 'treeshop.app',
            status: 'new',
            createdAt: Date.now()
          }
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        // Also track with Terminal analytics
        if (typeof window !== 'undefined' && (window as any).terminalTrack) {
          (window as any).terminalTrack('lead_submission', {
            source: 'treeshop.app',
            package: formData.selectedPackage,
            acreage: formData.acreage
          });
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          acreage: '',
          selectedPackage: '',
          message: ''
        });
        
        // Show success for 3 seconds
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Lead submission error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Get Your Free Estimate</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          ✅ Thank you! Your request has been received. We'll contact you within 24 hours.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          ❌ Something went wrong. Please try again or call us at (407) 555-8733.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Property Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="acreage" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Acreage
          </label>
          <input
            type="text"
            id="acreage"
            name="acreage"
            value={formData.acreage}
            onChange={handleChange}
            placeholder="e.g., 0.5, 1, 2.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label htmlFor="selectedPackage" className="block text-sm font-medium text-gray-700 mb-1">
            Service Package
          </label>
          <select
            id="selectedPackage"
            name="selectedPackage"
            value={formData.selectedPackage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a package</option>
            <option value="Small Package - 4 DBH">Small Package - 4" DBH & Under</option>
            <option value="Medium Package - 6 DBH">Medium Package - 6" DBH & Under</option>
            <option value="Large Package - 8 DBH">Large Package - 8" DBH & Under</option>
            <option value="Custom">Custom Quote Needed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Get Free Estimate'}
        </button>
      </form>
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        Your information is secure and will never be shared. 
        <br />
        Or call us directly: (407) 555-8733
      </p>
    </div>
  );
}