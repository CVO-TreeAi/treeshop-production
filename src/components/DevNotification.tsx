'use client'

import { useState, useEffect } from 'react'

export default function DevNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Show popup after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true)
      setIsAnimating(true)
    }, 2000)

    return () => clearTimeout(showTimer)
  }, [])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 300) // Allow fade out animation
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div 
        className={`bg-gray-900 border border-green-500/30 rounded-xl p-6 mx-4 max-w-md shadow-2xl transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(34, 197, 94, 0.2)'
        }}
      >
        {/* Header with TreeAI branding */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">AI</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">TreeAI Development</h3>
            <p className="text-green-400 text-xs">Industry-First Technology</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-200 text-sm leading-relaxed mb-5">
          This platform is built entirely in-house using cutting-edge technology. 
          As we continue developing the industry's most advanced forestry service platform, 
          you may encounter minor improvements in progress. Thank you for your patience as we deliver innovation.
        </p>

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}