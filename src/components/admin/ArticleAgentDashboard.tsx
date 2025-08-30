'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ArticleSpec {
  topic: string;
  keywords: string[];
  category: string;
  targetAudience: string;
  businessObjective: string;
}

interface GenerationResult {
  success: boolean;
  articleId?: string;
  publishUrl?: string;
  workflow: {
    contentStrategy: boolean;
    research: boolean;
    writing: boolean;
    seoOptimization: boolean;
    publishing: boolean;
  };
  performance: {
    totalTime: number;
    stageTimings: Record<string, number>;
  };
  errors?: string[];
}

interface HivePerformance {
  totalOperations: number;
  successRate: number;
  averageProcessingTime: number;
  domainActivity: Record<string, number>;
  recentErrors: string[];
}

export default function ArticleAgentDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPlan, setContentPlan] = useState<ArticleSpec[]>([]);
  const [performance, setPerformance] = useState<HivePerformance | null>(null);
  const [recentResults, setRecentResults] = useState<GenerationResult[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchTopics, setBatchTopics] = useState<string[]>([]);

  useEffect(() => {
    loadContentPlan();
    loadPerformance();
  }, []);

  const loadContentPlan = async () => {
    try {
      const response = await fetch('/api/agents/article-writer?action=content-plan&timeframe=monthly');
      const data = await response.json();
      if (data.success) {
        setContentPlan(data.plan);
      }
    } catch (error) {
      console.error('Failed to load content plan:', error);
    }
  };

  const loadPerformance = async () => {
    try {
      const response = await fetch('/api/agents/article-writer?action=performance');
      const data = await response.json();
      if (data.success) {
        setPerformance(data.performance);
      }
    } catch (error) {
      console.error('Failed to load performance:', error);
    }
  };

  const generateSingleArticle = async () => {
    if (!selectedTopic) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/agents/article-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          distributionChannels: ['web', 'social']
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRecentResults(prev => [result, ...prev].slice(0, 10));
        await loadPerformance(); // Refresh performance metrics
      }
    } catch (error) {
      console.error('Failed to generate article:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBatchArticles = async () => {
    if (batchTopics.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/agents/article-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch: true,
          topics: batchTopics,
          distributionChannels: ['web', 'social']
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRecentResults(prev => [...result.results, ...prev].slice(0, 20));
        await loadPerformance(); // Refresh performance metrics
      }
    } catch (error) {
      console.error('Failed to generate batch articles:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const executePlannedContent = async () => {
    const topicNames = contentPlan.slice(0, 5).map(spec => spec.topic);
    setBatchTopics(topicNames);
    setBatchMode(true);
  };

  const emergencyRecovery = async () => {
    try {
      const response = await fetch('/api/agents/article-writer', {
        method: 'DELETE'
      });
      const result = await response.json();
      console.log('Emergency recovery result:', result);
      await loadPerformance();
    } catch (error) {
      console.error('Emergency recovery failed:', error);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const formatSuccessRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">TreeAI Article Writing Agents</h1>
          <p className="text-gray-600 mt-2">Hive Intelligence coordination across 6 specialized domains</p>
        </div>
        <Button 
          onClick={emergencyRecovery}
          variant="outline"
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
        >
          🚨 Emergency Recovery
        </Button>
      </div>

      {/* Hive Performance Overview */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-sm text-gray-600">Total Operations</h3>
            <p className="text-2xl font-bold text-green-600">{performance.totalOperations}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-sm text-gray-600">Success Rate</h3>
            <p className="text-2xl font-bold text-blue-600">{formatSuccessRate(performance.successRate)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-sm text-gray-600">Avg Processing</h3>
            <p className="text-2xl font-bold text-purple-600">{formatDuration(performance.averageProcessingTime)}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold text-sm text-gray-600">Domain Activity</h3>
            <p className="text-sm text-gray-500">
              {Object.entries(performance.domainActivity).length} active domains
            </p>
          </Card>
        </div>
      )}

      {/* Generation Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Single Article Generation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Single Article Generation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g., Forestry Mulching Best Practices"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isGenerating}
              />
            </div>
            <Button
              onClick={generateSingleArticle}
              disabled={isGenerating || !selectedTopic}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isGenerating ? 'Generating Article...' : 'Generate Article'}
            </Button>
          </div>
        </Card>

        {/* Batch Generation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Batch Generation</h2>
          <div className="space-y-4">
            {!batchMode ? (
              <Button
                onClick={executePlannedContent}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isGenerating || contentPlan.length === 0}
              >
                Execute Content Plan ({contentPlan.length} articles)
              </Button>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Topics ({batchTopics.length})
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {batchTopics.map((topic, index) => (
                      <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={generateBatchArticles}
                    disabled={isGenerating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? 'Generating Batch...' : `Generate ${batchTopics.length} Articles`}
                  </Button>
                  <Button
                    onClick={() => setBatchMode(false)}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Content Plan Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Content Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentPlan.slice(0, 6).map((spec, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-green-700">{spec.topic}</h3>
              <p className="text-sm text-gray-600 mt-1">Category: {spec.category}</p>
              <p className="text-sm text-gray-500 mt-1">
                Keywords: {spec.keywords.slice(0, 3).join(', ')}
              </p>
              <Button
                onClick={() => {
                  setSelectedTopic(spec.topic);
                  setBatchMode(false);
                }}
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                disabled={isGenerating}
              >
                Select Topic
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Results */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Generation Results</h2>
        <div className="space-y-4">
          {recentResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent results</p>
          ) : (
            recentResults.map((result, index) => (
              <div key={index} className={`p-4 border-l-4 rounded-lg ${
                result.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {result.success ? '✅ Article Generated' : '❌ Generation Failed'}
                    </h3>
                    {result.publishUrl && (
                      <a 
                        href={result.publishUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Published Article →
                      </a>
                    )}
                    {result.errors && result.errors.length > 0 && (
                      <div className="text-red-600 text-sm mt-1">
                        {result.errors.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Total: {formatDuration(result.performance.totalTime)}</div>
                    <div className="text-xs">
                      Workflow: {Object.values(result.workflow).filter(Boolean).length}/5 stages
                    </div>
                  </div>
                </div>
                
                {/* Workflow Status */}
                <div className="mt-3 flex space-x-2 text-xs">
                  {Object.entries(result.workflow).map(([stage, completed]) => (
                    <span key={stage} className={`px-2 py-1 rounded ${
                      completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stage.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Domain Activity */}
      {performance && performance.domainActivity && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Domain Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(performance.domainActivity).map(([domain, count]) => (
              <div key={domain} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-sm text-gray-700">{domain}</div>
                <div className="text-lg font-bold text-blue-600">{count} ops</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}