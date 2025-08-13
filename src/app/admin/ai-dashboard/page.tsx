'use client';

import { useEffect, useState } from 'react';
// FIREBASE DISABLED
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function AIDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'scoring' | 'insights'>('overview');
  const [lighthouse, setLighthouse] = useState<{ scores: { performance: number; accessibility: number; bestPractices: number; seo: number }; actionable: { id: string; title: string; score: number; displayValue?: string }[] } | null>(null)
  const [lhUrl, setLhUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const authedFetch = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    try {
      const token = await auth?.currentUser?.getIdToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    } catch {}
    return fetch(url, { ...options, headers })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">🎯 TreeAI Analytics Dashboard</h1>
          <p className="text-gray-300">AI performance metrics and business intelligence for TreeShop</p>
        </header>

        {/* Tab Navigation */}
        <nav className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'overview', label: '📊 Overview', desc: 'Key metrics' },
            { key: 'pricing', label: '💰 Pricing AI', desc: 'Estimate accuracy' },
            { key: 'scoring', label: '🎯 Lead Scoring', desc: 'Conversion rates' },
            { key: 'insights', label: '🧠 Insights', desc: 'AI recommendations' }
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'overview' | 'pricing' | 'scoring' | 'insights')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.key 
                  ? 'bg-green-600 text-black font-semibold' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div>{tab.label}</div>
              <div className="text-xs opacity-70">{tab.desc}</div>
            </button>
          ))}
        </nav>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-600/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">127</div>
                <div className="text-green-300 font-medium">AI Estimates Generated</div>
                <div className="text-xs text-gray-400 mt-1">This month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-600/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
                <div className="text-blue-300 font-medium">Pricing Accuracy</div>
                <div className="text-xs text-gray-400 mt-1">vs. final quotes</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-600/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">78</div>
                <div className="text-purple-300 font-medium">Avg Lead Score</div>
                <div className="text-xs text-gray-400 mt-1">Quality improving</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border border-yellow-600/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">42%</div>
                <div className="text-yellow-300 font-medium">Hot Lead Conversion</div>
                <div className="text-xs text-gray-400 mt-1">AI scored 80+</div>
              </div>
            </div>

            {/* AI Performance Chart Placeholder */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">AI Performance Trends</h3>
              <div className="h-64 bg-gray-800/50 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <div className="text-gray-400">Performance charts coming soon</div>
                  <div className="text-sm text-gray-500 mt-2">Integration with analytics in progress</div>
                </div>
              </div>
            </div>

            {/* Recent AI Activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent AI Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-black font-bold text-sm">AI</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Generated estimate for 5.2 acre project</div>
                    <div className="text-xs text-gray-400">Contact: John Smith • $12,800 estimate • 94% confidence</div>
                  </div>
                  <div className="text-xs text-gray-500">2 min ago</div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">🎯</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Scored new lead as HOT (Score: 87)</div>
                    <div className="text-xs text-gray-400">Contact: Sarah Johnson • High budget match + immediate urgency</div>
                  </div>
                  <div className="text-xs text-gray-500">8 min ago</div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">📝</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Generated follow-up sequence</div>
                    <div className="text-xs text-gray-400">3 personalized messages for warm lead conversion</div>
                  </div>
                  <div className="text-xs text-gray-500">15 min ago</div>
                </div>
              </div>
            </div>

            {/* Lighthouse (PageSpeed) */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Lighthouse (Mobile)</h3>
              <div className="flex gap-2 mb-3">
                <input value={lhUrl} onChange={(e)=> setLhUrl(e.target.value)} placeholder="https://your-site-url" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm flex-1" />
                <button className="px-3 py-2 rounded bg-green-600 hover:bg-green-500 text-black text-sm" onClick={async ()=>{
                  setLoading(true)
                  try{
                    const params = lhUrl ? `?url=${encodeURIComponent(lhUrl)}` : ''
                    const res = await authedFetch(`/api/admin/seo/lighthouse${params}`)
                    const j = await res.json()
                    if(!res.ok) throw new Error(j?.error || 'Failed to fetch Lighthouse')
                    setLighthouse(j)
                  } catch(e){
                    setLighthouse(null)
                  } finally {
                    setLoading(false)
                  }
                }}>{loading ? 'Running…' : 'Run'}</button>
              </div>
              {lighthouse && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded bg-gray-800/50"><div className="text-xs text-gray-400">Performance</div><div className="text-2xl font-bold text-green-400">{lighthouse.scores.performance}</div></div>
                    <div className="p-3 rounded bg-gray-800/50"><div className="text-xs text-gray-400">Accessibility</div><div className="text-2xl font-bold text-green-400">{lighthouse.scores.accessibility}</div></div>
                    <div className="p-3 rounded bg-gray-800/50"><div className="text-xs text-gray-400">Best Practices</div><div className="text-2xl font-bold text-green-400">{lighthouse.scores.bestPractices}</div></div>
                    <div className="p-3 rounded bg-gray-800/50"><div className="text-xs text-gray-400">SEO</div><div className="text-2xl font-bold text-green-400">{lighthouse.scores.seo}</div></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Actionable Items</h4>
                    <ul className="space-y-2 text-sm">
                      {lighthouse.actionable.slice(0,8).map((a)=> (
                        <li key={a.id} className="p-2 bg-gray-800/40 rounded border border-gray-800 flex items-center justify-between">
                          <span className="text-gray-200">{a.title}</span>
                          <span className="text-xs text-gray-400">{a.displayValue || ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing AI Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">AI Pricing Engine Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">$1.2M</div>
                  <div className="text-sm text-gray-300">Total Estimates Generated</div>
                  <div className="text-xs text-gray-500 mt-1">Lifetime value</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">94%</div>
                  <div className="text-sm text-gray-300">Accuracy Rate</div>
                  <div className="text-xs text-gray-500 mt-1">Within 10% of final</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-2">12s</div>
                  <div className="text-sm text-gray-300">Avg Response Time</div>
                  <div className="text-xs text-gray-500 mt-1">AI processing speed</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Pricing Accuracy by Property Type</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Light vegetation (1-3 acres)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-[96%] h-full bg-green-500"></div>
                      </div>
                      <span className="text-green-400 font-medium">96%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Medium vegetation (3-10 acres)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-green-500"></div>
                      </div>
                      <span className="text-green-400 font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Heavy vegetation (10+ acres)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="w-[91%] h-full bg-yellow-500"></div>
                      </div>
                      <span className="text-yellow-400 font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">Recent Pricing Adjustments</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/30 rounded">
                  <div className="text-sm font-medium text-white">Slope difficulty factor updated</div>
                  <div className="text-xs text-gray-400 mt-1">15% increase for steep terrain based on crew feedback</div>
                </div>
                <div className="p-3 bg-gray-800/30 rounded">
                  <div className="text-sm font-medium text-white">Travel time calculation refined</div>
                  <div className="text-xs text-gray-400 mt-1">Improved accuracy for rural locations by 8%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lead Scoring Tab */}
        {activeTab === 'scoring' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Lead Scoring Performance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400 mb-2">42%</div>
                  <div className="text-red-300 font-medium">Hot Lead Conversion</div>
                  <div className="text-xs text-gray-400 mt-1">Score 80-100</div>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">28%</div>
                  <div className="text-yellow-300 font-medium">Warm Lead Conversion</div>
                  <div className="text-xs text-gray-400 mt-1">Score 50-79</div>
                </div>
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-2">12%</div>
                  <div className="text-blue-300 font-medium">Cold Lead Conversion</div>
                  <div className="text-xs text-gray-400 mt-1">Score 0-49</div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-white mb-3">Scoring Factor Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Budget Match</span>
                      <span className="text-green-400">Most predictive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Urgency Level</span>
                      <span className="text-green-400">High correlation</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Location Match</span>
                      <span className="text-yellow-400">Moderate correlation</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Project Complexity</span>
                      <span className="text-yellow-400">Moderate correlation</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Communication Quality</span>
                      <span className="text-blue-400">Low correlation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">🎯 AI Recommendations</h4>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-300">• Prioritize leads with budget mentions in initial contact</li>
                  <li className="text-gray-300">• Follow up with warm leads within 4 hours for 18% higher conversion</li>
                  <li className="text-gray-300">• Focus on immediate urgency projects during peak season</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">🧠 AI Business Insights</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-600/30 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-400 mb-4">💡 Revenue Optimization</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Increase day rates for 10+ acre projects</div>
                        <div className="text-gray-400">AI analysis shows 23% higher profit margin potential</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Target Hernando County more aggressively</div>
                        <div className="text-gray-400">Highest conversion rate (47%) with premium pricing acceptance</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/30 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-400 mb-4">⚡ Efficiency Gains</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Batch similar projects by area</div>
                        <div className="text-gray-400">Reduce travel costs by 31% with smart scheduling</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Automate follow-up for warm leads</div>
                        <div className="text-gray-400">Current manual process losing 15% conversion opportunity</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/30 rounded-lg p-6">
                  <h4 className="font-semibold text-green-400 mb-4">📈 Growth Opportunities</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Expand stump grinding upsells</div>
                        <div className="text-gray-400">64% of customers ask about stumps but only 31% get quotes</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Launch subscription maintenance plans</div>
                        <div className="text-gray-400">23% of customers request return visits within 18 months</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-600/30 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-400 mb-4">⚠️ Risk Mitigation</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Seasonal demand volatility</div>
                        <div className="text-gray-400">Build pipeline during slow months (June-August)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="text-white font-medium">Equipment utilization optimization</div>
                        <div className="text-gray-400">Current 73% utilization, target 85% for optimal ROI</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="font-semibold text-white mb-4">📊 Market Intelligence</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">$2,847</div>
                  <div className="text-sm text-gray-300">Avg Project Value</div>
                  <div className="text-xs text-gray-500 mt-1">+12% vs last quarter</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">4.2</div>
                  <div className="text-sm text-gray-300">Avg Project Size (acres)</div>
                  <div className="text-xs text-gray-500 mt-1">Trending larger</div>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-2">18 hrs</div>
                  <div className="text-sm text-gray-300">Avg Response Time</div>
                  <div className="text-xs text-gray-500 mt-1">Target: &lt;5 hrs</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}