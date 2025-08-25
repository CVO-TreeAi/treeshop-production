'use client';

import React, { useState, useEffect } from 'react';
import { agentOsCore, TreeAIDomain, TaskStatus, TaskPriority } from '@/lib/agentos/core';

/**
 * TreeAI Hive Intelligence Dashboard
 * 
 * Real-time monitoring and control center for the entire
 * 8-domain hive intelligence ecosystem.
 * 
 * @version 2.0.0
 */
export default function HiveDashboard() {
  const [hiveStatus, setHiveStatus] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<TreeAIDomain>(TreeAIDomain.AGENTOS_ORCHESTRATION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize real-time status updates
    const updateStatus = () => {
      try {
        const status = agentOsCore.getHiveStatus();
        setHiveStatus(status);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to get hive status:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getDomainDisplayName = (domain: TreeAIDomain): string => {
    const names = {
      [TreeAIDomain.CORE_INTELLIGENCE]: 'TreeAI Core Intelligence',
      [TreeAIDomain.AGENTOS_ORCHESTRATION]: 'AgentOs Orchestration',
      [TreeAIDomain.IOS_NATIVE]: 'iOS/Swift Native',
      [TreeAIDomain.SAAS_PLATFORM]: 'SaaS Platform',
      [TreeAIDomain.DATA_INTELLIGENCE]: 'Data Intelligence',
      [TreeAIDomain.SECURITY_INTELLIGENCE]: 'Security Intelligence',
      [TreeAIDomain.DEVOPS_INTELLIGENCE]: 'DevOps Intelligence',
      [TreeAIDomain.BUSINESS_INTELLIGENCE]: 'Business Intelligence'
    };
    return names[domain] || domain;
  };

  const getDomainIcon = (domain: TreeAIDomain): string => {
    const icons = {
      [TreeAIDomain.CORE_INTELLIGENCE]: '🌲',
      [TreeAIDomain.AGENTOS_ORCHESTRATION]: '🤖',
      [TreeAIDomain.IOS_NATIVE]: '📱',
      [TreeAIDomain.SAAS_PLATFORM]: '🌐',
      [TreeAIDomain.DATA_INTELLIGENCE]: '📊',
      [TreeAIDomain.SECURITY_INTELLIGENCE]: '🔒',
      [TreeAIDomain.DEVOPS_INTELLIGENCE]: '⚙️',
      [TreeAIDomain.BUSINESS_INTELLIGENCE]: '💼'
    };
    return icons[domain] || '🔧';
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl">🤖 Initializing Hive Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🧠 TreeAI Hive Intelligence Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time coordination across 8 specialized AI domains
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Last Update: {hiveStatus?.lastUpdate ? new Date(hiveStatus.lastUpdate).toLocaleTimeString() : 'N/A'}
        </div>
      </div>

      {/* Global Hive Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-green-400">🤖 Total Agents</h3>
          <p className="text-3xl font-bold">{hiveStatus?.totalAgents || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">📋 Active Tasks</h3>
          <p className="text-3xl font-bold">{hiveStatus?.totalTasks || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-purple-400">🗳️ Pending Decisions</h3>
          <p className="text-3xl font-bold">{hiveStatus?.pendingDecisions || 0}</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-yellow-400">🏥 System Health</h3>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <p className="text-2xl font-bold">Operational</p>
          </div>
        </div>
      </div>

      {/* Domain Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.values(TreeAIDomain).map(domain => {
          const stats = hiveStatus?.domainStats?.[domain];
          return (
            <div 
              key={domain}
              className={`bg-gray-800 rounded-lg p-6 border cursor-pointer transition-all hover:scale-105 ${ 
                selectedDomain === domain ? 'border-green-500 bg-gray-750' : 'border-gray-700'
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{getDomainIcon(domain)}</span>
                <h3 className="text-lg font-semibold">{getDomainDisplayName(domain)}</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Agents:</span>
                  <span className="font-semibold">{stats?.activeAgents || 0}/{stats?.agentCount || 0}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Tasks:</span>
                  <span className="font-semibold">{stats?.activeTasks || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Health:</span>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getHealthColor(stats?.avgHealthScore || 0)}`}></div>
                    <span className="font-semibold">{Math.round(stats?.avgHealthScore || 0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Domain Details */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="mr-3">{getDomainIcon(selectedDomain)}</span>
          {getDomainDisplayName(selectedDomain)} - Detailed View
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-750 rounded p-4">
            <h3 className="text-lg font-semibold mb-3 text-green-400">🤖 Agent Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-bold text-green-400">{hiveStatus?.domainStats?.[selectedDomain]?.activeAgents || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{hiveStatus?.domainStats?.[selectedDomain]?.agentCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Health:</span>
                <span className="font-bold">{Math.round(hiveStatus?.domainStats?.[selectedDomain]?.avgHealthScore || 0)}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">📋 Task Queue</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-bold text-yellow-400">{hiveStatus?.domainStats?.[selectedDomain]?.pendingTasks || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-bold text-blue-400">{hiveStatus?.domainStats?.[selectedDomain]?.activeTasks || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded p-4">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">🔄 Coordination</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-bold">Swarm Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          🚀 Deploy Swarm Task
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          🗳️ Propose Decision
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          🔧 System Maintenance
        </button>
      </div>

      {/* Hive Activity Log */}
      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">📡 Recent Hive Activity</h2>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-green-400 mr-2">✓</span>
            <span className="text-gray-400 mr-2">[{new Date().toLocaleTimeString()}]</span>
            <span>AgentOs Orchestration system initialized</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-blue-400 mr-2">📊</span>
            <span className="text-gray-400 mr-2">[{new Date().toLocaleTimeString()}]</span>
            <span>Hive dashboard activated - 8 domains monitoring</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-purple-400 mr-2">🤖</span>
            <span className="text-gray-400 mr-2">[{new Date().toLocaleTimeString()}]</span>
            <span>Swarm coordination protocols established</span>
          </div>
        </div>
      </div>
    </div>
  );
}