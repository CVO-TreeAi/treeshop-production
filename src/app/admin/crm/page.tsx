'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Lead = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zipCode?: string;
  acreage: number;
  selectedPackage: string;
  obstacles: string[];
  leadScore: string;
  leadSource: string;
  leadPage: string;
  status: string;
  notes?: string;
  contactedAt?: number;
  followUpDate?: number;
  estimatedTotal?: number;
  pricePerAcre?: number;
  travelSurcharge?: number;
  assumptions?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  createdAt: number;
  updatedAt: number;
};

function uid() { return Math.random().toString(36).slice(2,10); }

export default function CRMPage(){
  // Load recent leads from Convex
  const leads = useQuery(api.leads.getLeads) || [];
  const partialLeads = useQuery(api.leads.getPartialLeads) || [];
  const createLead = useMutation(api.leads.createLead);
  const updateLead = useMutation(api.leads.updateLead);

  // Derived helpers
  const leadMap = useMemo(()=>Object.fromEntries(leads.map(l=>[l._id,l])),[leads]);

  const addLead = async (data: {name: string, phone: string, email: string, zip: string, source?: string, notes?: string}) => {
    try {
      await createLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: '',
        zipCode: data.zip,
        acreage: 0,
        selectedPackage: 'small',
        obstacles: [],
        leadSource: data.source || 'website',
        leadPage: 'admin-crm',
        status: 'new',
        notes: data.notes || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const markLeadAsWorking = async (leadId: string) => {
    await updateLead({ id: leadId, status: 'working', updatedAt: Date.now() });
  };

  const markLeadAsWon = async (leadId: string) => {
    await updateLead({ id: leadId, status: 'won', updatedAt: Date.now() });
  };

  const markLeadAsLost = async (leadId: string) => {
    await updateLead({ id: leadId, status: 'lost', updatedAt: Date.now() });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-gray-400 text-sm mt-1">AI-enhanced lead tracking and prioritization</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/proposals" className="px-3 py-1.5 rounded border border-gray-700 text-gray-300 hover:border-green-600 text-sm">
              View Proposals →
            </Link>
            <Link href="/admin/work-orders" className="px-3 py-1.5 rounded border border-gray-700 text-gray-300 hover:border-green-600 text-sm">
              Work Orders →
            </Link>
          </div>
        </header>

        <section className="space-y-6">
            {/* AI Insights Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-600/20 to-green-400/10 border border-green-600/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{leads.filter(l => l.leadScore === 'hot').length}</div>
                <div className="text-sm text-green-300">Hot Leads (🔥)</div>
                <div className="text-xs text-gray-400 mt-1">Ready to buy</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border border-yellow-600/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{leads.filter(l => l.leadScore === 'warm').length}</div>
                <div className="text-sm text-yellow-300">Warm Leads</div>
                <div className="text-xs text-gray-400 mt-1">Need nurturing</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/10 border border-blue-600/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{leads.filter(l => l.leadScore === 'cold').length}</div>
                <div className="text-sm text-blue-300">Cold Leads</div>
                <div className="text-xs text-gray-400 mt-1">Low priority</div>
              </div>
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-400/10 border border-purple-600/30 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">{leads.length}</div>
                <div className="text-sm text-purple-300">Total Leads</div>
                <div className="text-xs text-gray-400 mt-1">All submissions</div>
              </div>
            </div>

            {/* Partial Leads Section */}
            {partialLeads.length > 0 && (
              <div className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-400">⚠️ Partial Lead Alerts ({partialLeads.length})</h3>
                  <span className="text-xs text-gray-400">Visitors who started but didn't complete forms</span>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partialLeads.slice(0, 6).map(partial => (
                    <div key={partial._id} className="bg-orange-900/20 border border-orange-700/50 rounded p-3">
                      <div className="text-sm font-medium text-orange-300">
                        {partial.formData?.name || 'Anonymous Visitor'}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        Step: {partial.step} • {new Date(partial.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-300">
                        {partial.formData?.email && `📧 ${partial.formData.email}`}
                        {partial.formData?.phone && ` • 📱 ${partial.formData.phone}`}
                        {partial.formData?.acreage && ` • 🌲 ${partial.formData.acreage}ac`}
                      </div>
                      <div className="mt-2">
                        <button className="px-2 py-1 rounded text-xs bg-orange-600 text-black hover:bg-orange-500">
                          Follow Up
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              <form className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3" onSubmit={(e)=>{e.preventDefault();
                const f = (e.target as HTMLFormElement);
                const fd = new FormData(f);
                addLead({
                  name: String(fd.get('name')||''),
                  phone: String(fd.get('phone')||''),
                  email: String(fd.get('email')||''),
                  zip: String(fd.get('zip')||''),
                  source: String(fd.get('source')||''),
                  notes: String(fd.get('notes')||''),
                });
                f.reset();
              }}>
                <div className="text-lg font-semibold text-green-400">🤖 AI-Enhanced Lead Entry</div>
                <input name="name" placeholder="Name" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" required />
                <input name="phone" placeholder="Phone" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" required />
                <input name="email" placeholder="Email" type="email" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" required />
                <input name="zip" placeholder="ZIP Code" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" required />
                <input name="source" placeholder="Source (website, referral, etc.)" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                <textarea name="notes" placeholder="Project notes (acreage, urgency, budget, etc.)" rows={3} className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
                <button className="w-full bg-green-600 hover:bg-green-500 text-black font-semibold px-3 py-2 rounded">Add Lead + AI Analysis</button>
                <div className="text-xs text-gray-400 mt-2">
                  💡 AI will automatically score and categorize this lead
                </div>
              </form>

              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-800/50 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Smart Lead Pipeline</h3>
                  <p className="text-sm text-gray-400">AI-scored and prioritized for maximum conversion</p>
                </div>
               <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800 text-gray-300 sticky top-0">
                      <tr>
                        <th className="text-left p-2">Lead</th>
                        <th className="text-left p-2">AI Score</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Contact</th>
                        <th className="text-right p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                       {leads
                        .sort((a, b) => b.createdAt - a.createdAt) // Sort by creation time desc
                        .map(l => (
                        <tr key={l._id} className="border-t border-gray-800 hover:bg-gray-800/30">
                          <td className="p-2">
                            <div className="font-medium">{l.name}</div>
                            <div className="text-xs text-gray-400">{l.zipCode} • {l.leadSource}</div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                l.leadScore === 'hot' ? 'bg-green-600 text-black' :
                                l.leadScore === 'warm' ? 'bg-yellow-600 text-black' :
                                'bg-blue-600 text-white'
                              }`}>
                                {l.leadScore === 'hot' ? '🔥' : l.leadScore === 'warm' ? '⚡' : '❄️'}
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              l.leadScore === 'hot' ? 'bg-red-600/20 text-red-300 border border-red-600/30' :
                              l.leadScore === 'warm' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/30' :
                              'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                            }`}>
                              {l.leadScore === 'hot' ? '🔥 HOT' : 
                               l.leadScore === 'warm' ? '⚡ WARM' : 
                               '❄️ COLD'}
                            </span>
                          </td>
                          <td className="p-2 text-gray-300">
                            <div className="text-xs">{l.phone}</div>
                            <div className="text-xs">{l.email}</div>
                          </td>
                          <td className="p-2 text-right space-x-1">
                            <div className="flex gap-1">
                              {l.status === 'new' && (
                                <button 
                                  onClick={()=>markLeadAsWorking(l._id)} 
                                  className="px-2 py-1 rounded text-xs border border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
                                >
                                  Start Working
                                </button>
                              )}
                              {l.status === 'working' && (
                                <>
                                  <button 
                                    onClick={()=>markLeadAsWon(l._id)} 
                                    className="px-2 py-1 rounded text-xs bg-green-600 text-black hover:bg-green-500"
                                  >
                                    Won
                                  </button>
                                  <button 
                                    onClick={()=>markLeadAsLost(l._id)} 
                                    className="px-2 py-1 rounded text-xs border border-red-600 text-red-400 hover:bg-red-600/10"
                                  >
                                    Lost
                                  </button>
                                </>
                              )}
                              {l.leadScore === 'hot' && l.status === 'new' && (
                                <Link 
                                  href={`/admin/proposals?leadId=${l._id}`} 
                                  className="px-2 py-1 rounded text-xs bg-green-600 text-black font-bold hover:bg-green-500"
                                >
                                  🚀 Create Proposal
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                            No leads yet. Add your first lead above to see AI scoring in action.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


