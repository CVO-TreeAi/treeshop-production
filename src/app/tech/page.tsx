'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const coreFeatures = [
  {
    feature: "TreeScore & StumpScore",
    result: "No more '$2,000 tree' guesswork",
    description: "Mathematical formulas that analyze height, diameter, and complexity for consistent, accurate pricing every time."
  },
  {
    feature: "AFISS Site Assessment",
    result: "Protect margins on difficult jobs",
    description: "Systematic complexity scoring across 5 categories ensures you're paid appropriately for challenging site conditions."
  },
  {
    feature: "Points per Hour (PpH) System",
    result: "Transform crew performance measurement",
    description: "Move beyond 'we worked 8 hours' to actionable business intelligence showing actual productivity."
  },
  {
    feature: "DOC Workflow Management",
    result: "Zero information loss from lead to invoice",
    description: "Document-Oriented Customer system captures details once, uses them everywhere - no more blind crews."
  },
  {
    feature: "Equipment Loadout Costing",
    result: "Know true hourly rates for every machine",
    description: "Track real equipment costs including maintenance, fuel, and depreciation for accurate job costing."
  },
  {
    feature: "Employee Cost Management",
    result: "1.7x burden rate precision",
    description: "Calculate true employee costs including taxes, benefits, and overhead for accurate labor pricing."
  },
  {
    feature: "Proposal Generation System",
    result: "2 hours → 15 minutes proposal creation",
    description: "Professional multi-service proposals automatically generated from TreeScore assessments."
  },
  {
    feature: "Business Intelligence Dashboard",
    result: "100+ metrics across 9 categories",
    description: "Complete visibility into operations, finances, marketing, safety, and performance."
  },
  {
    feature: "Mobile-First Field Operations",
    result: "Native iOS app with offline capability",
    description: "Field crews use devices they already have - no expensive proprietary hardware required."
  },
  {
    feature: "Systematic Quality Control",
    result: "96% first-time quality rate",
    description: "AFISS-driven protocols ensure consistent quality and safety across all crews and jobs."
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
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    currentRevenue: '',
    operationsChallenges: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage(result.message)
        setFormData({
          companyName: '',
          email: '',
          phone: '',
          currentRevenue: '',
          operationsChallenges: ''
        })
      } else {
        setSubmitMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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

          <div className="max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              Finally, Tree Service Math That Actually Works
            </h2>
            <p className="text-xl text-white mb-6 leading-relaxed">
              Tree Shop LLC has spent three years proving what the rest of the industry refuses to believe:
              <span className="text-green-400"> tree service can be systematic, profitable, and scalable</span> without
              sacrificing quality or safety.
            </p>
            <p className="text-lg text-white">
              <span className="text-green-500 font-bold">TreeAI</span> is that system—built by arborists,
              refined by 1,000+ jobs, and now available to tree service professionals who are tired of guessing.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <a
              href="#waitlist"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Join the Waitlist
            </a>
          </div>

          <p className="text-green-400 font-bold text-lg">
            Launch Q2 2026
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            The Problem <span className="text-green-500">TreeAI</span> Solves
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-red-400 mb-6">The Broken Cycle</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-white">Estimators guess at pricing and hope they're close</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-white">Time estimates wrong by 30-50%</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-white">Equipment costs eat margins - no one tracks true hourly rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-white">Profitable jobs and money-losers look identical until reconciliation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-white">Growth means hiring more people to do more guessing</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-green-400 mb-6">TreeAI Solution</h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-white">Mathematical precision in pricing - no more guesswork</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-white">Accurate time estimates within ±5%</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-white">Real-time equipment cost tracking and ROI calculation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-white">Know profit margins before you start, not after you finish</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-white">Systematic operations that scale without chaos</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-white mb-4">
              <span className="font-bold">Tree Shop LLC faced these exact problems.</span>
            </p>
            <p className="text-lg text-green-400">
              TreeAI was built to solve them.
            </p>
          </div>
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

      {/* Proven Results */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Real Results from <span className="text-green-500">Tree Shop LLC</span>
          </h2>
          <p className="text-xl text-center text-white mb-16">
            After 3 years and 1,000+ jobs, TreeAI delivers measurable business transformation
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">±5%</div>
              <div className="text-white font-medium mb-2">Estimating Accuracy</div>
              <div className="text-gray-400 text-sm">vs. ±40% traditional</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">15 min</div>
              <div className="text-white font-medium mb-2">Proposal Creation</div>
              <div className="text-gray-400 text-sm">vs. 2 hours traditional</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">+12%</div>
              <div className="text-white font-medium mb-2">Gross Profit Margin</div>
              <div className="text-gray-400 text-sm">systematic optimization</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">96%</div>
              <div className="text-white font-medium mb-2">First-Time Quality</div>
              <div className="text-gray-400 text-sm">AFISS-driven protocols</div>
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              These aren't projections. This is actual data from a real tree service company.
            </h3>
            <p className="text-lg text-green-400">
              Tree Shop LLC exists to prove TreeAI works in the real world.
            </p>
          </div>
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Join the <span className="text-green-400">TreeAI</span> Waitlist
            </h2>
            <p className="text-xl text-white mb-4">
              Launch Q2 2026 - Limited to first 100 tree service companies
            </p>
            <p className="text-green-400 font-bold text-lg">
              Stop guessing. Start systematizing. Scale profitably.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Founding Member Benefits
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white"><span className="text-green-400 font-bold">50% discount</span> for first year</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Lifetime priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Feature request influence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Free 30-day launch program <span className="text-green-400">($2,500 value)</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Beta access to new features</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-white">Founding member community access</span>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-yellow-400 mb-2">ROI Guarantee</h4>
                <p className="text-white text-sm">
                  If TreeAI doesn't improve your gross profit margin by at least the cost of your subscription
                  within 90 days, we'll refund your money.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Reserve Your Founding Member Spot</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
                <select
                  name="currentRevenue"
                  required
                  value={formData.currentRevenue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                >
                  <option value="">Current Annual Revenue</option>
                  <option value="under-250k">Under $250K</option>
                  <option value="250k-500k">$250K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-plus">$1M+</option>
                </select>
                <textarea
                  name="operationsChallenges"
                  value={formData.operationsChallenges}
                  onChange={handleChange}
                  placeholder="What's your biggest challenge with current operations? (Optional)"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white h-24 resize-none"
                />

                {submitMessage && (
                  <div className={`text-center p-4 rounded-lg text-sm ${
                    submitMessage.includes('Welcome') || submitMessage.includes('Founding Member')
                      ? 'bg-green-900/50 text-green-400 border border-green-700'
                      : 'bg-red-900/50 text-red-400 border border-red-700'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Joining Waitlist...
                    </span>
                  ) : (
                    'Join TreeAI Waitlist - Founding Member'
                  )}
                </button>
              </form>

              <p className="text-sm text-gray-400 mt-4 text-center">
                Tree Shop LLC took three years to prove this works.<br/>
                <span className="text-white">You can start using it in Q2 2026.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}