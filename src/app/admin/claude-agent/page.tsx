'use client';

import { useState, useRef, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  type: 'user' | 'claude' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export default function ClaudeAgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: '1',
        type: 'system',
        content: '🤖 Claude TreeShop Business Expert initialized. I have full access to your database and business operations. How can I help optimize your tree service business today?',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (isClient) {
      inputRef.current?.focus();
    }
  }, [isClient]);

  const addMessage = (type: Message['type'], content: string, metadata?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Send to Claude Agent API
      const response = await fetch('/api/claude-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude Agent');
      }

      const data = await response.json();
      addMessage('claude', data.response, data.metadata);

      // If Claude performed actions, show them
      if (data.actions && data.actions.length > 0) {
        addMessage('system', `✅ Actions completed: ${data.actions.join(', ')}`);
      }

    } catch (error) {
      console.error('Error communicating with Claude Agent:', error);
      addMessage('system', '❌ Error: Failed to communicate with Claude Agent. Using fallback response.');
      
      // Fallback business responses
      addMessage('claude', generateFallbackResponse(userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('lead') || message.includes('customer')) {
      return "I can help you analyze leads, score them, and generate follow-up strategies. What specific lead management task would you like assistance with?";
    }
    
    if (message.includes('price') || message.includes('estimate')) {
      return "I can generate accurate forestry mulching estimates based on acreage, terrain, and site conditions. Would you like me to create an estimate or analyze pricing trends?";
    }
    
    if (message.includes('job') || message.includes('work order')) {
      return "I can help schedule jobs, assign crews, and track project progress. What work order management task can I assist with?";
    }
    
    if (message.includes('analytics') || message.includes('metrics')) {
      return "I can provide insights on your business performance, lead conversion rates, and operational efficiency. What metrics would you like me to analyze?";
    }
    
    return "I'm your TreeShop business expert. I can help with leads, estimates, job scheduling, analytics, and operational optimization. What would you like to work on?";
  };

  const quickCommands = [
    { label: 'Analyze Recent Leads', command: 'Show me analysis of leads from the past week with conversion insights' },
    { label: 'Generate Estimate', command: 'Help me create an estimate for a 5-acre forestry mulching project' },
    { label: 'Schedule Jobs', command: 'Show me upcoming jobs and crew availability' },
    { label: 'Performance Report', command: 'Generate a business performance report with key metrics' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-400 mb-2">🤖 Claude TreeShop Business Expert</h1>
          <p className="text-gray-300">Your AI business partner with full database access and TreeShop expertise</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Terminal */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400 ml-2">claude-treeshop-agent@localhost</span>
              </div>

              {/* Messages */}
              <div 
                ref={terminalRef}
                className="h-96 overflow-y-auto p-4 space-y-3 font-mono text-sm"
              >
                {!isClient ? (
                  <div className="flex gap-3">
                    <span className="text-yellow-400 text-xs mt-1">⚡</span>
                    <div className="flex-1 text-yellow-300">
                      Initializing Claude TreeShop Business Expert...
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <span className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-400' :
                      message.type === 'claude' ? 'text-green-400' :
                      'text-yellow-400'
                    }`}>
                      {message.type === 'user' ? '❯' :
                       message.type === 'claude' ? '🤖' : '⚡'}
                    </span>
                    <div className="flex-1">
                      <div className={`${
                        message.type === 'user' ? 'text-blue-300' :
                        message.type === 'claude' ? 'text-green-300' :
                        'text-yellow-300'
                      }`}>
                        {message.content}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isClient ? message.timestamp.toLocaleTimeString() : '--:--:--'}
                      </div>
                    </div>
                  </div>
                )))}
                
                {isClient && isLoading && (
                  <div className="flex gap-3">
                    <span className="text-green-400 text-xs mt-1">🤖</span>
                    <div className="flex-1 text-green-300">
                      <div className="flex items-center gap-2">
                        Claude is thinking...
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-sm font-mono">❯</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your TreeShop business..."
                    className="flex-1 bg-transparent text-green-300 placeholder-gray-500 focus:outline-none font-mono"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-black rounded text-sm font-semibold transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Commands & Status */}
          <div className="space-y-6">
            {/* Quick Commands */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Commands</h3>
              <div className="space-y-2">
                {quickCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(cmd.command)}
                    className="w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">🔍 Agent Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Database Access:</span>
                  <span className="text-green-400">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Business Context:</span>
                  <span className="text-green-400">✓ TreeShop Expert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Capabilities:</span>
                  <span className="text-green-400">✓ Full Access</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Session Time:</span>
                  <span className="text-gray-300">Active</span>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">🛠 Capabilities</h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div>• Lead analysis & scoring</div>
                <div>• Estimate generation</div>
                <div>• Job scheduling</div>
                <div>• Performance analytics</div>
                <div>• Proposal creation</div>
                <div>• Invoice management</div>
                <div>• Database queries</div>
                <div>• Business optimization</div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-3">💡 How to Use Your Claude Agent</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-medium text-white mb-2">Natural Language Commands:</h4>
              <ul className="space-y-1">
                <li>• "Show me all hot leads from this week"</li>
                <li>• "Create an estimate for 3 acres in Brooksville"</li>
                <li>• "What's our conversion rate this month?"</li>
                <li>• "Schedule a job for next Tuesday"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Business Intelligence:</h4>
              <ul className="space-y-1">
                <li>• Ask for performance insights</li>
                <li>• Request pricing recommendations</li>
                <li>• Get operational optimization tips</li>
                <li>• Analyze customer trends</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}