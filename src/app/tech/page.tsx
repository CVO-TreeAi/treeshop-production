'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const coreFeatures = [
  {
    feature: "TreeAI Automated Scoring",
    result: "Precise valuations in seconds, not hours",
    description: "Proprietary algorithms analyze property factors to generate accurate pricing automatically."
  },
  {
    feature: "Equipment ROI Calculator",
    result: "Know when gear pays for itself",
    description: "Track equipment performance and profitability across all jobs to optimize your fleet."
  },
  {
    feature: "Real-time Job Costing",
    result: "Track margins as work happens",
    description: "Live cost tracking and margin analysis ensures every job maintains profitability."
  },
  {
    feature: "Intelligent Route Optimization",
    result: "25% more jobs per day",
    description: "AI-powered scheduling maximizes crew efficiency and reduces travel time."
  },
  {
    feature: "Predictive Maintenance",
    result: "90% reduction in equipment downtime",
    description: "Prevent costly breakdowns with data-driven maintenance scheduling."
  },
  {
    feature: "Dynamic Pricing Engine",
    result: "Optimize profits on every estimate",
    description: "Market-aware pricing that adjusts based on demand, competition, and capacity."
  },
  {
    feature: "Crew Performance Analytics",
    result: "Identify top performers instantly",
    description: "Data-driven insights into crew productivity and efficiency metrics."
  },
  {
    feature: "Customer Lifecycle Management",
    result: "3x higher repeat business rates",
    description: "Automated follow-ups and relationship management for sustained growth."
  },
  {
    feature: "Regulatory Compliance Tracking",
    result: "Zero permit delays or violations",
    description: "Automated compliance monitoring for all local regulations and requirements."
  },
  {
    feature: "Financial Forecasting",
    result: "Plan growth with mathematical precision",
    description: "Predictive models for cash flow, capacity planning, and strategic decisions."
  }
]

const roleFeatures = [
  {
    role: "Field Crews",
    features: [
      "Real-time job updates and photo documentation",
      "Equipment check-in/out with GPS tracking",
      "Safety incident reporting with immediate alerts",
      "Time tracking with automated payroll integration"
    ]
  },
  {
    role: "Estimators",
    features: [
      "TreeAI scoring for instant accurate pricing",
      "Satellite imagery analysis for property assessment",
      "Automated proposal generation with photos",
      "Competitor analysis and market positioning"
    ]
  },
  {
    role: "Operations Managers",
    features: [
      "Crew scheduling optimization and dispatch",
      "Equipment utilization and ROI tracking",
      "Quality control workflows and inspections",
      "Performance dashboards and KPI monitoring"
    ]
  },
  {
    role: "Business Owners",
    features: [
      "Financial forecasting and profit optimization",
      "Strategic planning with market intelligence",
      "Growth analytics and expansion planning",
      "Automated compliance and risk management"
    ]
  }
]

export default function TechPage() {
  const [activeTab, setActiveTab] = useState('features')
  const [heroVariant, setHeroVariant] = useState('A')

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Hero Section - A/B Test */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          {heroVariant === 'A' ? (
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              The <span className="text-green-500">TreeShop</span> Era Has Begun
            </h1>
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              Run <span className="text-green-500">TreeShop</span>. Or Run Traditional.
            </h1>
          )}

          <p className="text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
            TreeShop represents the complete transformation of tree care operations through
            <span className="text-green-400"> TreeAI technology</span> and
            <span className="text-green-400"> mathematical precision</span>.
            This is the future of profitable tree care.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="#waitlist"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Join the Waitlist
            </a>
            <button
              onClick={() => setHeroVariant(heroVariant === 'A' ? 'B' : 'A')}
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all"
            >
              Test Variant {heroVariant === 'A' ? 'B' : 'A'}
            </button>
          </div>

          <p className="text-green-400 text-sm">
            The choice is simple: evolve or become obsolete.
          </p>
        </div>
      </section>

      {/* Functions List */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            TreeShop <span className="text-green-500">Capabilities</span>
          </h2>
          <p className="text-xl text-center text-white mb-12 max-w-3xl mx-auto">
            Revolutionary technology that transforms every aspect of tree care operations
          </p>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('features')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'features'
                    ? 'bg-green-500 text-black'
                    : 'text-white hover:text-green-400'
                }`}
              >
                Feature → Result
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'roles'
                    ? 'bg-green-500 text-black'
                    : 'text-white hover:text-green-400'
                }`}
              >
                By Role
              </button>
            </div>
          </div>

          {/* Feature → Result Tab */}
          {activeTab === 'features' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {coreFeatures.map((item, index) => (
                <div key={index} className="bg-black/50 border border-gray-800 rounded-lg p-6 hover:border-green-800/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-400 mb-2">
                        {item.feature}
                      </h3>
                      <p className="text-xl font-bold text-white mb-3">
                        {item.result}
                      </p>
                    </div>
                    <div className="text-green-500 text-2xl">→</div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* By Role Tab */}
          {activeTab === 'roles' && (
            <div className="grid md:grid-cols-2 gap-8">
              {roleFeatures.map((roleData, index) => (
                <div key={index} className="bg-black/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-green-500 mb-6">
                    {roleData.role}
                  </h3>
                  <ul className="space-y-3">
                    {roleData.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TreeAI Advantage */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">
                The <span className="text-green-500">TreeAI</span> Advantage
              </h2>

              <div className="space-y-6 mb-8">
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-3">The Founder Story</h3>
                  <p className="text-white leading-relaxed">
                    Founded by Jeremiah, whose mathematical precision and systematic approach revolutionized
                    tree care operations. What others see as complexity, we see as solvable problems
                    requiring data-driven solutions.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-3">Proprietary Mathematics</h3>
                  <p className="text-white leading-relaxed mb-4">
                    TreeAI represents years of mathematical modeling applied to tree care operations.
                    Our algorithms consider dozens of variables traditional companies ignore:
                  </p>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Tree density calculations and DBH analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Equipment depreciation and utilization optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Labor efficiency patterns and productivity modeling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Market dynamics and competitive positioning algorithms
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-white">
                Traditional vs <span className="text-green-500">TreeShop</span>
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Pricing Method</span>
                  <div className="text-right">
                    <div className="text-red-400 text-sm">Traditional: Guesswork</div>
                    <div className="text-green-400 font-bold">TreeShop: Mathematical precision</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Job Tracking</span>
                  <div className="text-right">
                    <div className="text-red-400 text-sm">Traditional: Manual logs</div>
                    <div className="text-green-400 font-bold">TreeShop: Real-time analytics</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Equipment Management</span>
                  <div className="text-right">
                    <div className="text-red-400 text-sm">Traditional: Hope it works</div>
                    <div className="text-green-400 font-bold">TreeShop: Predictive maintenance</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Growth Strategy</span>
                  <div className="text-right">
                    <div className="text-red-400 text-sm">Traditional: Trial and error</div>
                    <div className="text-green-400 font-bold">TreeShop: Data-driven decisions</div>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Profit Optimization</span>
                  <div className="text-right">
                    <div className="text-red-400 text-sm">Traditional: Survive on volume</div>
                    <div className="text-green-400 font-bold">TreeShop: Precision profitability</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-green-400 text-lg font-bold mb-2">The Result:</div>
                <div className="text-white">Making tree care profitable through precision, not just removals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            TreeShop <span className="text-green-500">Platform</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Built for the Tree Care Professional
              </h3>
              <p className="text-white leading-relaxed">
                Every feature designed by tree care professionals, for tree care professionals.
                No generic business software - this is purpose-built for our industry.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Native mobile apps for iOS and Android</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Real-time synchronization across all devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Offline functionality for remote job sites</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Integration with existing accounting systems</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center">
                <div className="text-6xl text-green-500 mb-4">📱</div>
                <h3 className="text-xl font-bold text-white mb-4">Platform Screenshots</h3>
                <p className="text-gray-300 mb-6">
                  Coming soon - Revolutionary interface designed specifically for tree care operations
                </p>
                <a
                  href="#waitlist"
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg transition-all"
                >
                  Get Early Access
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Movement - Social Proof */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            The <span className="text-green-500">Movement</span>
          </h2>
          <p className="text-xl text-center text-white mb-16 max-w-3xl mx-auto">
            Tree care professionals are choosing precision over tradition
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
              <p className="text-white italic mb-4">
                "In my 25 years in business, I have never experienced such a great service..."
              </p>
              <div className="text-green-500 font-bold">- Cajina</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
              <p className="text-white italic mb-4">
                "The Tree Shop is one of the best businesses I have ever dealt with"
              </p>
              <div className="text-green-500 font-bold">- Snowden</div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
              <p className="text-white italic mb-4">
                "I would give 10 stars if I could... Excellent company, excellent staff"
              </p>
              <div className="text-green-500 font-bold">- Millos</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-green-400 font-bold text-xl mb-4">
              Those who run TreeShop vs those who don't
            </p>
            <p className="text-white max-w-2xl mx-auto">
              Join the professionals who have chosen mathematical precision over traditional guesswork.
              The future of tree care is here.
            </p>
          </div>
        </div>
      </section>

      {/* Final Waitlist CTA */}
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-r from-green-900/50 to-green-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to <span className="text-green-400">Transform</span> Your Operations?
          </h2>
          <p className="text-xl text-white mb-8">
            Join the waitlist and be among the first tree care professionals to access TreeShop technology.
          </p>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
              <select className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white">
                <option value="">Company Size</option>
                <option value="1-5">1-5 employees</option>
                <option value="6-20">6-20 employees</option>
                <option value="21-50">21-50 employees</option>
                <option value="50+">50+ employees</option>
              </select>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
              >
                Join the TreeShop Revolution
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-4 text-center">
              Early access includes free training and implementation support
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}