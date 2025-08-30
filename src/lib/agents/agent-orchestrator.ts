// Agent Orchestrator - TreeAI Hive Intelligence Coordination
// Master coordinator for article writing agent system

import { ConvexHttpClient } from "convex/browser";
import { ArticleWritingSystem, ArticleSpec } from "./article-writing-system";
import { SEOOptimizationAgent } from "./seo-optimization-agent";
import { PublishingAgent } from "./publishing-agent";

interface ArticleGenerationRequest {
  topic?: string;
  category?: string;
  targetKeywords?: string[];
  scheduledDate?: Date;
  distributionChannels?: string[];
  urgency?: 'low' | 'medium' | 'high';
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
  errors?: string[];
  performance: {
    totalTime: number;
    stageTimings: Record<string, number>;
  };
}

interface HiveCoordinationLog {
  timestamp: Date;
  operation: string;
  domain: string;
  status: 'started' | 'completed' | 'failed';
  details: Record<string, any>;
}

export class ArticleAgentOrchestrator {
  private articleSystem: ArticleWritingSystem;
  private seoAgent: SEOOptimizationAgent;
  private publishingAgent: PublishingAgent;
  private coordinationLog: HiveCoordinationLog[] = [];

  constructor(private convex: ConvexHttpClient) {
    this.articleSystem = new ArticleWritingSystem(convex);
    this.seoAgent = new SEOOptimizationAgent();
    this.publishingAgent = new PublishingAgent(convex);
  }

  async generateAndPublishArticle(request: ArticleGenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
    const stageTimings: Record<string, number> = {};
    
    const workflow = {
      contentStrategy: false,
      research: false,
      writing: false,
      seoOptimization: false,
      publishing: false
    };

    try {
      // Log hive coordination start
      this.logHiveOperation('article-generation', 'AgentOs Orchestration', 'started', {
        request,
        timestamp: new Date()
      });

      // Stage 1: Content Strategy & Research & Writing (Domain 8, 5, 4)
      this.logHiveOperation('content-generation', 'TreeAI Core Intelligence', 'started', {
        topic: request.topic,
        category: request.category
      });

      const stageStart = Date.now();
      const { spec, research, draft } = await this.articleSystem.generateArticle(request.topic);
      stageTimings['content-generation'] = Date.now() - stageStart;
      
      workflow.contentStrategy = true;
      workflow.research = true;
      workflow.writing = true;

      this.logHiveOperation('content-generation', 'TreeAI Core Intelligence', 'completed', {
        spec,
        draftLength: draft.content.length,
        researchPoints: research.facts.length
      });

      // Stage 2: SEO Optimization (Domain 6 - Security Intelligence)
      this.logHiveOperation('seo-optimization', 'Security Intelligence', 'started', {
        keywords: request.targetKeywords || spec.keywords
      });

      const seoStart = Date.now();
      const seoOptimization = await this.seoAgent.optimizeContent(
        draft.title,
        draft.content,
        draft.excerpt,
        draft.category,
        request.targetKeywords || spec.keywords
      );
      stageTimings['seo-optimization'] = Date.now() - seoStart;
      
      workflow.seoOptimization = true;

      // Validate SEO compliance
      const seoValidation = this.seoAgent.validateSEOCompliance(seoOptimization);
      if (!seoValidation.isValid) {
        this.logHiveOperation('seo-optimization', 'Security Intelligence', 'failed', {
          issues: seoValidation.issues
        });
        
        return {
          success: false,
          workflow,
          errors: seoValidation.issues,
          performance: {
            totalTime: Date.now() - startTime,
            stageTimings
          }
        };
      }

      this.logHiveOperation('seo-optimization', 'Security Intelligence', 'completed', {
        metaTitle: seoOptimization.metaTitle,
        keywords: seoOptimization.keywords,
        internalLinks: seoOptimization.internalLinks.length
      });

      // Stage 3: Publishing & Distribution (Domain 2 - AgentOs Orchestration)
      this.logHiveOperation('publishing', 'AgentOs Orchestration', 'started', {
        scheduledDate: request.scheduledDate,
        channels: request.distributionChannels
      });

      const publishStart = Date.now();
      const publishResult = await this.publishingAgent.publishArticle(
        draft,
        seoOptimization,
        {
          scheduledDate: request.scheduledDate,
          distributionChannels: request.distributionChannels || ['web', 'social']
        }
      );
      stageTimings['publishing'] = Date.now() - publishStart;

      if (!publishResult.success) {
        this.logHiveOperation('publishing', 'AgentOs Orchestration', 'failed', {
          errors: publishResult.errors
        });
        
        return {
          success: false,
          workflow,
          errors: publishResult.errors,
          performance: {
            totalTime: Date.now() - startTime,
            stageTimings
          }
        };
      }

      workflow.publishing = true;

      this.logHiveOperation('publishing', 'AgentOs Orchestration', 'completed', {
        articleId: publishResult.articleId,
        publishUrl: publishResult.publishUrl,
        distributionResults: publishResult.distributionResults
      });

      // Log successful hive coordination completion
      this.logHiveOperation('article-generation', 'AgentOs Orchestration', 'completed', {
        articleId: publishResult.articleId,
        totalTime: Date.now() - startTime,
        domainsCoordinated: 5
      });

      return {
        success: true,
        articleId: publishResult.articleId,
        publishUrl: publishResult.publishUrl,
        workflow,
        performance: {
          totalTime: Date.now() - startTime,
          stageTimings
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown orchestration error';
      
      this.logHiveOperation('article-generation', 'AgentOs Orchestration', 'failed', {
        error: errorMessage,
        stage: this.getFailedStage(workflow)
      });

      return {
        success: false,
        workflow,
        errors: [errorMessage],
        performance: {
          totalTime: Date.now() - startTime,
          stageTimings
        }
      };
    }
  }

  async batchGenerateArticles(
    topics: string[], 
    baseRequest: Omit<ArticleGenerationRequest, 'topic'> = {}
  ): Promise<GenerationResult[]> {
    this.logHiveOperation('batch-generation', 'AgentOs Orchestration', 'started', {
      topicCount: topics.length,
      baseRequest
    });

    const results: GenerationResult[] = [];
    
    // Process articles in parallel but with rate limiting
    const batchSize = 3; // Process 3 articles at a time
    for (let i = 0; i < topics.length; i += batchSize) {
      const batch = topics.slice(i, i + batchSize);
      const batchPromises = batch.map(topic => 
        this.generateAndPublishArticle({
          ...baseRequest,
          topic
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < topics.length) {
        await this.delay(5000); // 5 second delay between batches
      }
    }

    this.logHiveOperation('batch-generation', 'AgentOs Orchestration', 'completed', {
      totalArticles: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });

    return results;
  }

  async getContentPlan(timeframe: 'weekly' | 'monthly' | 'quarterly' = 'monthly'): Promise<ArticleSpec[]> {
    this.logHiveOperation('content-planning', 'Business Intelligence', 'started', { timeframe });
    
    const plan = await this.articleSystem['contentStrategy'].planContent(timeframe);
    
    this.logHiveOperation('content-planning', 'Business Intelligence', 'completed', {
      articleCount: plan.length,
      categories: [...new Set(plan.map(p => p.category))]
    });

    return plan;
  }

  async monitorHivePerformance(): Promise<{
    totalOperations: number;
    successRate: number;
    averageProcessingTime: number;
    domainActivity: Record<string, number>;
    recentErrors: string[];
  }> {
    const recentLogs = this.coordinationLog.slice(-100); // Last 100 operations
    
    const totalOperations = recentLogs.filter(log => log.status === 'completed' || log.status === 'failed').length;
    const successfulOperations = recentLogs.filter(log => log.status === 'completed').length;
    const successRate = totalOperations > 0 ? successfulOperations / totalOperations : 0;

    const processingTimes = recentLogs
      .filter(log => log.details.totalTime)
      .map(log => log.details.totalTime);
    const averageProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
      : 0;

    const domainActivity = recentLogs.reduce((acc, log) => {
      acc[log.domain] = (acc[log.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentErrors = recentLogs
      .filter(log => log.status === 'failed')
      .slice(-5)
      .map(log => log.details.error || 'Unknown error');

    return {
      totalOperations,
      successRate,
      averageProcessingTime,
      domainActivity,
      recentErrors
    };
  }

  getCoordinationLog(): HiveCoordinationLog[] {
    return [...this.coordinationLog];
  }

  private logHiveOperation(
    operation: string, 
    domain: string, 
    status: 'started' | 'completed' | 'failed',
    details: Record<string, any>
  ): void {
    this.coordinationLog.push({
      timestamp: new Date(),
      operation,
      domain,
      status,
      details
    });

    // Keep only last 1000 log entries
    if (this.coordinationLog.length > 1000) {
      this.coordinationLog = this.coordinationLog.slice(-1000);
    }

    // Console log for development
    console.log(`[TreeAI Hive] ${operation} | ${domain} | ${status}`, details);
  }

  private getFailedStage(workflow: GenerationResult['workflow']): string {
    if (!workflow.contentStrategy) return 'content-strategy';
    if (!workflow.research) return 'research';
    if (!workflow.writing) return 'writing';
    if (!workflow.seoOptimization) return 'seo-optimization';
    if (!workflow.publishing) return 'publishing';
    return 'unknown';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Emergency protocols for hive coordination failures
  async emergencyRecovery(): Promise<{
    success: boolean;
    actions: string[];
    systemStatus: 'operational' | 'degraded' | 'critical';
  }> {
    const actions: string[] = [];
    let systemStatus: 'operational' | 'degraded' | 'critical' = 'operational';

    try {
      // Check Convex connection
      await this.convex.query("blog:getBlogPosts", { limit: 1 });
      actions.push('✓ Convex connection verified');

      // Clear coordination log if too large
      if (this.coordinationLog.length > 500) {
        this.coordinationLog = this.coordinationLog.slice(-100);
        actions.push('✓ Coordination log pruned');
      }

      // Test basic article generation capability
      const testResult = await this.articleSystem.generateArticle('test');
      if (testResult.draft.content.length > 100) {
        actions.push('✓ Article generation system operational');
      } else {
        actions.push('⚠ Article generation producing short content');
        systemStatus = 'degraded';
      }

      actions.push('✓ Emergency recovery completed successfully');
      
    } catch (error) {
      actions.push(`✗ Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      systemStatus = 'critical';
    }

    this.logHiveOperation('emergency-recovery', 'AgentOs Orchestration', 
      systemStatus === 'critical' ? 'failed' : 'completed', 
      { actions, systemStatus }
    );

    return {
      success: systemStatus !== 'critical',
      actions,
      systemStatus
    };
  }
}