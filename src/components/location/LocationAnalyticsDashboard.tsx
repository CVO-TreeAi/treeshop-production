'use client';

// Location Analytics Dashboard - Business Intelligence Domain
// Domain Coordination: Business Intelligence + Data Intelligence + TreeAI Core

import React, { useState, useEffect } from 'react';

interface LocationAnalytics {
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalLeads: number;
    averageProjectValue: number;
    conversionRate: number;
  };
  geographic: {
    topPerformingZips: Array<{
      zipCode: string;
      leadCount: number;
      averageValue: number;
      conversionRate: number;
    }>;
  };
  marketSegmentation: {
    premium: { count: number; avgValue: number };
    standard: { count: number; avgValue: number };
    budget: { count: number; avgValue: number };
  };
  riskTrends: {
    lowRisk: number;
    moderateRisk: number;
    highRisk: number;
  };
  propertyTypeMetrics: {
    residential: { count: number; avgValue: number };
    commercial: { count: number; avgValue: number };
    agricultural: { count: number; avgValue: number };
    industrial: { count: number; avgValue: number };
  };
  treeAIMetrics: {
    averageConfidence: number;
    pricingAccuracy: number;
    costSavingsGenerated: number;
    usageRate: number;
  };
}

interface LocationAnalyticsDashboardProps {
  className?: string;
}

export default function LocationAnalyticsDashboard({ className = '' }: LocationAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<LocationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data
  const loadAnalytics = async (period = selectedPeriod) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/location/analytics?period=${period}&includeGeographic=true&includeMarketSegmentation=true&includeRiskTrends=true&includePropertyTypes=true&includeTreeAIMetrics=true`);
      
      if (!response.ok) {
        throw new Error(`Analytics fetch failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load analytics');
      }
      
      setAnalytics(data.data);
    } catch (error) {
      console.error('Analytics loading failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Handle period change
  const handlePeriodChange = (newPeriod: typeof selectedPeriod) => {
    setSelectedPeriod(newPeriod);
    loadAnalytics(newPeriod);
  };

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-xl font-bold">Location Intelligence Dashboard</h2>
              <p className="text-blue-100 text-sm">
                TreeAI Hive Analytics • {analytics.dateRange.start} to {analytics.dateRange.end}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-400 bg-opacity-30 text-white px-3 py-1 rounded-lg hover:bg-opacity-50 transition-colors text-sm"
            >
              {refreshing ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>
        
        {/* Period selector */}
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-blue-600'
                  : 'text-blue-100 hover:text-white hover:bg-blue-400 bg-opacity-20'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-green-800">
                  {analytics.summary.totalLeads.toLocaleString()}
                </p>
              </div>
              <div className="text-green-500 text-2xl">👥</div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Avg Project Value</p>
                <p className="text-2xl font-bold text-blue-800">
                  ${analytics.summary.averageProjectValue.toLocaleString()}
                </p>
              </div>
              <div className="text-blue-500 text-2xl">💰</div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-800">
                  {(analytics.summary.conversionRate * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-purple-500 text-2xl">📈</div>
            </div>
          </div>
        </div>

        {/* TreeAI Performance */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🌲</span>
            TreeAI Hive Intelligence Performance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(analytics.treeAIMetrics.averageConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Average Confidence</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(analytics.treeAIMetrics.pricingAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Pricing Accuracy</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${analytics.treeAIMetrics.costSavingsGenerated.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Cost Savings</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(analytics.treeAIMetrics.usageRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">AI Usage Rate</div>
            </div>
          </div>
        </div>

        {/* Geographic Performance */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📍</span>
            Top Performing Locations
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-600">
                <tr>
                  <th className="text-left py-2">Zip Code</th>
                  <th className="text-right py-2">Leads</th>
                  <th className="text-right py-2">Avg Value</th>
                  <th className="text-right py-2">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {analytics.geographic.topPerformingZips.slice(0, 5).map((zip, index) => (
                  <tr key={zip.zipCode} className="border-t border-gray-200">
                    <td className="py-2 font-medium">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-purple-500' : 'bg-gray-400'
                        }`}></span>
                        {zip.zipCode}
                      </div>
                    </td>
                    <td className="text-right py-2">{zip.leadCount}</td>
                    <td className="text-right py-2">${zip.averageValue.toLocaleString()}</td>
                    <td className="text-right py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        zip.conversionRate > 0.3 ? 'bg-green-100 text-green-700' :
                        zip.conversionRate > 0.15 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {(zip.conversionRate * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Segmentation & Property Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Segmentation */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Market Segmentation
            </h3>
            
            <div className="space-y-3">
              {Object.entries(analytics.marketSegmentation).map(([segment, data]) => (
                <div key={segment} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      segment === 'premium' ? 'bg-yellow-500' :
                      segment === 'standard' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className="font-medium capitalize">{segment}</span>
                    <span className="text-sm text-gray-600">({data.count} leads)</span>
                  </div>
                  <span className="font-semibold">${data.avgValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Types */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Property Type Performance
            </h3>
            
            <div className="space-y-3">
              {Object.entries(analytics.propertyTypeMetrics).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {type === 'residential' ? '🏠' :
                       type === 'commercial' ? '🏢' :
                       type === 'agricultural' ? '🚜' : '🏭'}
                    </div>
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-sm text-gray-600">({data.count} leads)</span>
                  </div>
                  <span className="font-semibold">${data.avgValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Assessment Trends */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Risk Assessment Distribution
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.riskTrends.lowRisk}
              </div>
              <div className="text-sm text-green-700">Low Risk</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(analytics.riskTrends.lowRisk / analytics.summary.totalLeads) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {analytics.riskTrends.moderateRisk}
              </div>
              <div className="text-sm text-yellow-700">Moderate Risk</div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(analytics.riskTrends.moderateRisk / analytics.summary.totalLeads) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {analytics.riskTrends.highRisk}
              </div>
              <div className="text-sm text-red-700">High Risk</div>
              <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(analytics.riskTrends.highRisk / analytics.summary.totalLeads) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>
            🌲 TreeAI Hive Intelligence Dashboard • 
            Last updated: {new Date().toLocaleString()} • 
            Data points: {analytics.summary.totalLeads.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}