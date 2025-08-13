'use client'

import { useState } from 'react'
import { 
  DEMO_PROPOSAL_DATA, 
  generateCustomerProposal, 
  generateBusinessVerification,
  calculateProposal,
  type ProposalData 
} from '@/lib/proposal-templates'

export default function ProposalDemoPage() {
  const [activeView, setActiveView] = useState<'customer' | 'business'>('customer')
  const [proposalData, setProposalData] = useState<ProposalData>(DEMO_PROPOSAL_DATA)

  const customerHTML = generateCustomerProposal(proposalData)
  const businessHTML = generateBusinessVerification(proposalData)

  const handleFieldChange = (field: keyof ProposalData, value: any) => {
    const updatedData = { ...proposalData, [field]: value }
    const recalculated = calculateProposal(updatedData)
    setProposalData(recalculated)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Proposal Template Demo
          </h1>
          <p className="text-gray-600">
            Realistic forestry mulching proposal generator with customer and business views
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('customer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'customer'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer View
              </button>
              <button
                onClick={() => setActiveView('business')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'business'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Business Verification
              </button>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-800 font-semibold">
                Total: ${proposalData.totalCost.toLocaleString()}
              </span>
              <span className="text-green-600 ml-2">
                (${Math.round(proposalData.pricePerAcre)}/acre)
              </span>
            </div>
          </div>

          {/* Quick Edit Form */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={proposalData.customerName}
                onChange={(e) => handleFieldChange('customerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acreage
              </label>
              <input
                type="number"
                step="0.1"
                value={proposalData.acreage}
                onChange={(e) => handleFieldChange('acreage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Size
              </label>
              <select
                value={proposalData.packageSize}
                onChange={(e) => handleFieldChange('packageSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="small">Small (4" DBH)</option>
                <option value="medium">Medium (6" DBH)</option>
                <option value="large">Large (8" DBH)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travel Time (hours)
              </label>
              <input
                type="number"
                step="0.25"
                value={proposalData.travelTimeHours}
                onChange={(e) => handleFieldChange('travelTimeHours', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeView === 'customer' ? 'Customer Proposal' : 'Business Verification'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const htmlContent = activeView === 'customer' ? customerHTML : businessHTML
                  const blob = new Blob([htmlContent], { type: 'text/html' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${activeView}-proposal-${proposalData.customerName.replace(/\s+/g, '-').toLowerCase()}.html`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Download HTML
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div 
              className="w-full border border-gray-200 rounded-lg"
              style={{ height: '800px' }}
            >
              <iframe
                srcDoc={activeView === 'customer' ? customerHTML : businessHTML}
                className="w-full h-full rounded-lg"
                title={`${activeView} proposal preview`}
              />
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Implementation Notes
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p><strong>Customer View:</strong> Clean, professional proposal with pricing breakdown and value proposition</p>
            <p><strong>Business View:</strong> Internal verification with profitability analysis, QA checklist, and approval workflow</p>
            <p><strong>Integration:</strong> Ready to connect with lead management system and email automation</p>
            <p><strong>Customization:</strong> Templates can be modified for different service types and business rules</p>
          </div>
        </div>
      </div>
    </div>
  )
}