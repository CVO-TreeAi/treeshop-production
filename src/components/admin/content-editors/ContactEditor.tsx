'use client'

import { ContactContent } from '@/types/cms'

interface ContactEditorProps {
  content: ContactContent
  onChange: (content: ContactContent) => void
  validationErrors?: Record<string, string[]>
  previewMode?: boolean
}

export default function ContactEditor({ 
  content, 
  onChange, 
  validationErrors = {}, 
  previewMode = false 
}: ContactEditorProps) {

  const updateField = (field: keyof ContactContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateBusinessHours = (day: string, hours: string) => {
    onChange({
      ...content,
      businessHours: {
        ...content.businessHours,
        [day]: hours
      }
    })
  }

  const addServiceArea = () => {
    const newArea = 'New County'
    onChange({
      ...content,
      serviceAreas: [...content.serviceAreas, newArea]
    })
  }

  const updateServiceArea = (index: number, value: string) => {
    const updatedAreas = [...content.serviceAreas]
    updatedAreas[index] = value
    onChange({ ...content, serviceAreas: updatedAreas })
  }

  const removeServiceArea = (index: number) => {
    const updatedAreas = content.serviceAreas.filter((_, i) => i !== index)
    onChange({ ...content, serviceAreas: updatedAreas })
  }

  const dayLabels = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Contact Information Preview</h3>
        <div className="bg-gray-800 p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Contact Details */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">📞</span>
                  <div>
                    <p className="text-white font-medium">{content.phoneNumber}</p>
                    <p className="text-gray-400 text-sm">Call or Text</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✉️</span>
                  <div>
                    <p className="text-white font-medium">{content.emailAddress}</p>
                    <p className="text-gray-400 text-sm">Email Us</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-green-400">📍</span>
                  <div>
                    <p className="text-white font-medium">{content.businessAddress}</p>
                    <p className="text-gray-400 text-sm">Service Location</p>
                  </div>
                </div>
                
                {content.emergencyAvailable && (
                  <div className="flex items-center gap-3">
                    <span className="text-red-400">🚨</span>
                    <div>
                      <p className="text-white font-medium">24/7 Emergency</p>
                      <p className="text-gray-400 text-sm">Storm Damage Response</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Service Areas */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Service Areas</h4>
              <div className="space-y-2">
                {content.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Business Hours */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Business Hours</h4>
              <div className="space-y-2">
                {Object.entries(dayLabels).map(([day, label]) => {
                  const hours = content.businessHours[day as keyof typeof content.businessHours]
                  if (!hours) return null
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-300">{label}:</span>
                      <span className="text-white">{hours}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Contact Information</h3>

      {/* Basic Contact Info */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h4 className="text-lg font-semibold text-white">Contact Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={content.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="(407) 555-TREE"
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.phoneNumber[0]}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={content.emailAddress}
              onChange={(e) => updateField('emailAddress', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="info@company.com"
            />
            {validationErrors.emailAddress && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.emailAddress[0]}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Address
          </label>
          <input
            type="text"
            value={content.businessAddress}
            onChange={(e) => updateField('businessAddress', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="City, State"
          />
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={content.emergencyAvailable}
              onChange={(e) => updateField('emergencyAvailable', e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-300">24/7 Emergency Services Available</span>
          </label>
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-white">Service Areas</h4>
          <button
            onClick={addServiceArea}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            + Add Area
          </button>
        </div>
        
        <div className="space-y-2">
          {content.serviceAreas.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-2">No service areas added yet</p>
              <button
                onClick={addServiceArea}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                Add First Service Area
              </button>
            </div>
          ) : (
            content.serviceAreas.map((area, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => updateServiceArea(index, e.target.value)}
                  className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="County or City Name"
                />
                <button
                  onClick={() => removeServiceArea(index)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h4 className="text-lg font-semibold text-white">Business Hours</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(dayLabels).map(([day, label]) => (
            <div key={day}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
              </label>
              <input
                type="text"
                value={content.businessHours[day as keyof typeof content.businessHours] || ''}
                onChange={(e) => updateBusinessHours(day, e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="e.g., 7:00 AM - 6:00 PM or Closed"
              />
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-400 mt-2">
          <p>💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Use "Closed" for days you don't work</li>
            <li>Use "Emergency Only" for limited availability</li>
            <li>Be consistent with time format (e.g., "7:00 AM - 6:00 PM")</li>
          </ul>
        </div>
      </div>
    </div>
  )
}