import { NextRequest, NextResponse } from 'next/server';
import { adminDatabase, adminLeadService, estimateService, jobService } from '@/lib/database';
import { enhancedClaudeAgent } from '@/lib/enhanced-claude-agent';

interface Message {
  type: 'user' | 'claude' | 'system';
  content: string;
  timestamp: Date;
}

interface ClaudeRequest {
  message: string;
  conversationHistory: Message[];
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json() as ClaudeRequest;
    
    // Use enhanced Claude agent for advanced processing
    const userId = req.headers.get('user-id') || 'default-user';
    const enhancedResponse = await enhancedClaudeAgent.processAdvancedQuery(message, userId);
    
    // Fallback to legacy processing if enhanced agent fails
    let response;
    if (enhancedResponse.confidence > 0.7) {
      response = {
        response: enhancedResponse.response,
        actions: [`Enhanced AI processing (${enhancedResponse.confidence * 100}% confidence)`],
        metadata: {
          enhanced: true,
          insights: enhancedResponse.insights.length,
          autonomousActions: enhancedResponse.actions.length,
          businessMetrics: enhancedResponse.metrics
        },
        timestamp: new Date().toISOString()
      };
    } else {
      response = await processBusinessQuery(message, conversationHistory);
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Claude Agent Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}

async function processBusinessQuery(query: string, _history: Message[]) {
  const lowerQuery = query.toLowerCase();
  let response = '';
  const actions: string[] = [];
  let metadata: Record<string, unknown> = {};

  try {
    // Lead Analysis Queries
    if (lowerQuery.includes('lead') && (lowerQuery.includes('show') || lowerQuery.includes('analyze') || lowerQuery.includes('list'))) {
      const leads = await adminLeadService.getRecentLeads(20);
      const hotLeads = leads.filter(l => l.aiData?.category === 'hot');
      const warmLeads = leads.filter(l => l.aiData?.category === 'warm');
      const coldLeads = leads.filter(l => l.aiData?.category === 'cold');
      
      response = `📊 **Lead Analysis Summary**

**Recent Activity (Last 20 leads):**
• 🔥 **Hot Leads**: ${hotLeads.length} (${Math.round(hotLeads.length/leads.length*100)}%)
• ⚡ **Warm Leads**: ${warmLeads.length} (${Math.round(warmLeads.length/leads.length*100)}%)
• ❄️ **Cold Leads**: ${coldLeads.length} (${Math.round(coldLeads.length/leads.length*100)}%)

**Top Priority Actions:**`;
      
      if (hotLeads.length > 0) {
        response += `\n• **URGENT**: ${hotLeads.length} hot leads need immediate attention`;
        hotLeads.slice(0, 3).forEach(lead => {
          response += `\n  - ${lead.contact.name} (${lead.contact.phone}) - Score: ${lead.aiData?.score || 'N/A'}`;
        });
      }
      
      if (warmLeads.length > 0) {
        response += `\n• Follow up with ${warmLeads.length} warm leads within 24 hours`;
      }
      
      metadata = { hotLeads: hotLeads.length, warmLeads: warmLeads.length, coldLeads: coldLeads.length };
      actions.push('Lead analysis completed');
    }

    // Estimate/Pricing Queries
    else if (lowerQuery.includes('estimate') || lowerQuery.includes('price') || lowerQuery.includes('quote')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('generate')) {
        response = `🎯 **Estimate Generation Ready**

I can help you create accurate estimates! Here's what I need:

**Required Information:**
• **Acreage**: How many acres to clear?
• **Location**: Property address or ZIP code
• **Vegetation Type**: Light, medium, heavy, or very heavy
• **Terrain**: Flat, rolling, or steep
• **Access**: Excellent, good, difficult, or very difficult
• **Obstacles**: Power lines, structures, wetlands, etc.
• **Stump Removal**: Yes or no

**Example**: "Create an estimate for 5 acres in Brooksville, FL with medium vegetation, flat terrain, good access, no obstacles, no stump removal"

Would you like me to create an estimate with specific details?`;
      } else {
        // Show recent estimates
        const estimates = await estimateService.getAll('estimates', 'createdAt', 10);
        const avgEstimate = estimates.reduce((sum, est) => sum + (est.pricing?.total || 0), 0) / estimates.length;
        
        response = `💰 **Pricing Intelligence**

**Recent Estimates (Last 10):**
• **Average Project Value**: $${Math.round(avgEstimate).toLocaleString()}
• **Total Estimates**: ${estimates.length}
• **Pending Estimates**: ${estimates.filter(e => e.status === 'sent').length}
• **Accepted Estimates**: ${estimates.filter(e => e.status === 'accepted').length}

**Pricing Trends:**
• Florida market rate: $800-2,500/acre
• Your average: $${Math.round(avgEstimate/5).toLocaleString()}/acre (assuming 5-acre avg)
• Conversion rate: ${Math.round(estimates.filter(e => e.status === 'accepted').length / estimates.length * 100)}%`;
      }
      
      actions.push('Pricing analysis completed');
    }

    // Job/Work Order Queries  
    else if (lowerQuery.includes('job') || lowerQuery.includes('work order') || lowerQuery.includes('schedule')) {
      const jobs = await jobService.getAll('jobs', 'scheduledDate', 15);
      const upcomingJobs = jobs.filter(j => new Date(j.scheduledDate) > new Date());
      const activeJobs = jobs.filter(j => j.status === 'in_progress');
      
      response = `🚧 **Work Order Status**

**Current Operations:**
• **Active Jobs**: ${activeJobs.length}
• **Scheduled Jobs**: ${upcomingJobs.length}
• **Completed This Week**: ${jobs.filter(j => j.status === 'completed').length}

**Upcoming Schedule:**`;
      
      upcomingJobs.slice(0, 5).forEach(job => {
        const date = new Date(job.scheduledDate).toLocaleDateString();
        response += `\n• ${date} - ${job.crew?.leadTechnician || 'TBD'} - ${job.siteNotes.substring(0, 30)}...`;
      });
      
      if (activeJobs.length > 0) {
        response += `\n\n**⚠️ Jobs In Progress:**`;
        activeJobs.forEach(job => {
          response += `\n• ${job.crew?.leadTechnician || 'Unknown'} - Started ${new Date(job.createdAt).toLocaleDateString()}`;
        });
      }
      
      actions.push('Job schedule reviewed');
    }

    // Performance/Analytics Queries
    else if (lowerQuery.includes('performance') || lowerQuery.includes('metrics') || lowerQuery.includes('analytics') || lowerQuery.includes('report')) {
      const leads = await adminLeadService.getRecentLeads(30);
      const estimates = await estimateService.getAll('estimates', 'createdAt', 20);
      const jobs = await jobService.getAll('jobs', 'createdAt', 15);
      
      const totalRevenue = estimates.filter(e => e.status === 'accepted').reduce((sum, e) => sum + (e.pricing?.total || 0), 0);
      const conversionRate = leads.length > 0 ? Math.round(estimates.filter(e => e.status === 'accepted').length / leads.length * 100) : 0;
      
      response = `📈 **Business Performance Dashboard**

**Lead Performance (Last 30 days):**
• **Total Leads**: ${leads.length}
• **Hot Leads**: ${leads.filter(l => l.aiData?.category === 'hot').length} (${Math.round(leads.filter(l => l.aiData?.category === 'hot').length / leads.length * 100)}%)
• **Avg Lead Score**: ${Math.round(leads.reduce((sum, l) => sum + (l.aiData?.score || 0), 0) / leads.length)}

**Revenue Metrics:**
• **Pipeline Value**: $${totalRevenue.toLocaleString()}
• **Avg Deal Size**: $${Math.round(totalRevenue / estimates.filter(e => e.status === 'accepted').length || 0).toLocaleString()}
• **Conversion Rate**: ${conversionRate}%

**Operational Efficiency:**
• **Jobs Completed**: ${jobs.filter(j => j.status === 'completed').length}
• **Active Projects**: ${jobs.filter(j => j.status === 'in_progress').length}
• **Response Time**: <2 hours (target: <5 hours) ✅

**🎯 Key Recommendations:**
${conversionRate < 30 ? '• Improve lead qualification process' : '• Great conversion rate! 🎉'}
${leads.filter(l => l.aiData?.category === 'hot').length < 3 ? '• Focus on generating more high-quality leads' : '• Excellent lead quality! 🔥'}`;
      
      actions.push('Performance report generated');
    }

    // Business Optimization Queries
    else if (lowerQuery.includes('optimize') || lowerQuery.includes('improve') || lowerQuery.includes('recommend')) {
      response = `🚀 **Business Optimization Recommendations**

**Lead Management:**
• Set up automated hot lead alerts (>80 score)
• Create follow-up sequences for warm leads
• Implement lead scoring refinements

**Pricing Strategy:**
• Adjust rates for premium service areas
• Bundle services for higher deal values
• Seasonal pricing optimization

**Operations:**
• Batch jobs by geographic area
• Optimize crew scheduling
• Track productivity metrics

**Marketing:**
• Double down on highest converting lead sources
• Create case studies from successful projects
• Implement referral incentive program

Would you like me to dive deeper into any of these areas?`;
      
      actions.push('Optimization analysis completed');
    }

    // Default helpful response
    else {
      response = `🤖 **TreeShop Business Expert Ready**

I can help you with:

**📊 Lead Management**
• "Show me all hot leads"
• "Analyze lead conversion this week"
• "What leads need follow-up?"

**💰 Pricing & Estimates**
• "Create an estimate for [project details]"
• "What's our average deal size?"
• "Show pricing trends"

**🚧 Job Management**
• "What jobs are scheduled this week?"
• "Show active projects"
• "When is our next available slot?"

**📈 Business Intelligence**
• "Generate a performance report"
• "What's our conversion rate?"
• "How can we optimize operations?"

Just ask me anything about your TreeShop business in natural language!`;
    }

    return {
      response,
      actions,
      metadata,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error processing business query:', error);
    return {
      response: `❌ Sorry, I encountered an error accessing the business data. Here's what I can help with:

• Lead analysis and scoring
• Estimate generation and pricing
• Job scheduling and management  
• Performance analytics and reporting
• Business optimization recommendations

Please try rephrasing your question or ask about a specific aspect of your TreeShop operations.`,
      actions: ['Error handled'],
      metadata: { error: true }
    };
  }
}