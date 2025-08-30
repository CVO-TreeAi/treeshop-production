// API Route for Article Writing Agent System
// Provides HTTP interface for TreeAI Hive Intelligence coordination

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { ArticleAgentOrchestrator } from '@/lib/agents/agent-orchestrator';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ArticleGenerationRequest {
  topic?: string;
  category?: string;
  targetKeywords?: string[];
  scheduledDate?: string;
  distributionChannels?: string[];
  urgency?: 'low' | 'medium' | 'high';
  batch?: boolean;
  topics?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ArticleGenerationRequest = await request.json();
    
    // Validate request
    if (!body.topic && !body.batch && !body.topics) {
      return NextResponse.json(
        { error: 'Either topic or batch with topics array is required' },
        { status: 400 }
      );
    }

    const orchestrator = new ArticleAgentOrchestrator(convex);

    // Handle batch generation
    if (body.batch && body.topics) {
      const results = await orchestrator.batchGenerateArticles(
        body.topics,
        {
          category: body.category,
          targetKeywords: body.targetKeywords,
          scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
          distributionChannels: body.distributionChannels,
          urgency: body.urgency
        }
      );

      return NextResponse.json({
        success: true,
        type: 'batch',
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          totalTime: results.reduce((sum, r) => sum + r.performance.totalTime, 0)
        }
      });
    }

    // Handle single article generation
    const result = await orchestrator.generateAndPublishArticle({
      topic: body.topic,
      category: body.category,
      targetKeywords: body.targetKeywords,
      scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : undefined,
      distributionChannels: body.distributionChannels,
      urgency: body.urgency
    });

    return NextResponse.json({
      success: result.success,
      type: 'single',
      ...result
    });

  } catch (error) {
    console.error('Article generation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const timeframe = url.searchParams.get('timeframe') as 'weekly' | 'monthly' | 'quarterly';

    const orchestrator = new ArticleAgentOrchestrator(convex);

    switch (action) {
      case 'content-plan':
        const plan = await orchestrator.getContentPlan(timeframe || 'monthly');
        return NextResponse.json({
          success: true,
          plan,
          timeframe: timeframe || 'monthly',
          count: plan.length
        });

      case 'performance':
        const performance = await orchestrator.monitorHivePerformance();
        return NextResponse.json({
          success: true,
          performance
        });

      case 'logs':
        const logs = orchestrator.getCoordinationLog();
        const limit = parseInt(url.searchParams.get('limit') || '50');
        return NextResponse.json({
          success: true,
          logs: logs.slice(-limit),
          total: logs.length
        });

      case 'status':
        return NextResponse.json({
          success: true,
          status: 'operational',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          domains: [
            'TreeAI Core Intelligence',
            'AgentOs Orchestration',
            'SaaS Platform',
            'Data Intelligence', 
            'Security Intelligence',
            'Business Intelligence'
          ]
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Article agent GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const orchestrator = new ArticleAgentOrchestrator(convex);
    const recovery = await orchestrator.emergencyRecovery();

    return NextResponse.json({
      success: recovery.success,
      recovery,
      message: 'Emergency recovery protocol executed'
    });

  } catch (error) {
    console.error('Emergency recovery error:', error);
    return NextResponse.json(
      { 
        error: 'Emergency recovery failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}