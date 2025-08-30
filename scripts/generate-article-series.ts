// Script to generate technical article series using TreeAI agents
// Topic: Land Clearing vs Forestry Mulching Decision Guide

import { ConvexHttpClient } from "convex/browser";
import { ArticleAgentOrchestrator } from "../src/lib/agents/agent-orchestrator";

async function main() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const orchestrator = new ArticleAgentOrchestrator(convex);

  console.log('🌲 TreeAI Article Writing Agents - Technical Series Generation');
  console.log('📝 Topic: Land Clearing vs Forestry Mulching Decision Guide\n');

  // Define the 3-part technical series
  const articleSeries = [
    {
      topic: 'How to Assess Your Property: Land Clearing vs Forestry Mulching Decision Framework',
      keywords: ['land clearing assessment', 'forestry mulching evaluation', 'property analysis', 'TreeAI assessment'],
      category: 'Industry Insights',
      partNumber: 1
    },
    {
      topic: 'Technical Analysis: Soil Conditions, Vegetation Density, and Equipment Selection',
      keywords: ['soil conditions analysis', 'vegetation density measurement', 'forestry equipment selection', 'mulching vs clearing'],
      category: 'Equipment',
      partNumber: 2
    },
    {
      topic: 'Professional Implementation: Cost Analysis, Timeline, and Long-term Property Impact',
      keywords: ['land clearing cost analysis', 'forestry mulching ROI', 'professional implementation', 'TreeAI optimization'],
      category: 'Technology',
      partNumber: 3
    }
  ];

  console.log('Generating article series with TreeAI Hive Intelligence...\n');

  const results = [];

  for (const article of articleSeries) {
    console.log(`📄 Generating Part ${article.partNumber}: ${article.topic}`);
    console.log(`🎯 Keywords: ${article.keywords.join(', ')}`);
    console.log(`📁 Category: ${article.category}\n`);

    try {
      const result = await orchestrator.generateAndPublishArticle({
        topic: article.topic,
        category: article.category,
        targetKeywords: article.keywords,
        distributionChannels: ['web'],
        urgency: 'high'
      });

      if (result.success) {
        console.log(`✅ Part ${article.partNumber} generated successfully!`);
        console.log(`📄 Article ID: ${result.articleId}`);
        console.log(`🌐 Publish URL: ${result.publishUrl}`);
        console.log(`⏱️  Processing Time: ${(result.performance.totalTime / 1000).toFixed(2)}s`);
        console.log(`🔄 Workflow Stages: ${Object.values(result.workflow).filter(Boolean).length}/5 completed\n`);
        
        results.push({
          part: article.partNumber,
          success: true,
          ...result
        });
      } else {
        console.log(`❌ Part ${article.partNumber} generation failed:`);
        console.log(`🚨 Errors: ${result.errors?.join(', ')}\n`);
        
        results.push({
          part: article.partNumber,
          success: false,
          errors: result.errors
        });
      }

      // Add delay between articles to respect rate limits
      if (article.partNumber < articleSeries.length) {
        console.log('⏳ Waiting 10 seconds before next article...\n');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

    } catch (error) {
      console.log(`💥 Part ${article.partNumber} generation crashed:`, error);
      results.push({
        part: article.partNumber,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  }

  // Generate series summary
  console.log('\n🎯 SERIES GENERATION COMPLETE');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${articleSeries.length}`);
  console.log(`❌ Failed: ${failed.length}/${articleSeries.length}`);
  
  if (successful.length > 0) {
    console.log('\n📄 Successfully Generated Articles:');
    successful.forEach((result: any) => {
      console.log(`   Part ${result.part}: ${result.publishUrl}`);
    });
  }

  if (failed.length > 0) {
    console.log('\n🚨 Failed Articles:');
    failed.forEach((result: any) => {
      console.log(`   Part ${result.part}: ${result.errors?.join(', ')}`);
    });
  }

  // Display performance metrics
  if (successful.length > 0) {
    const totalTime = successful.reduce((sum: number, r: any) => sum + r.performance.totalTime, 0);
    const averageTime = totalTime / successful.length;
    
    console.log('\n📊 Performance Metrics:');
    console.log(`   Total Processing Time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   Average Per Article: ${(averageTime / 1000).toFixed(2)}s`);
    
    // Check hive coordination performance
    const performance = await orchestrator.monitorHivePerformance();
    console.log(`   Overall Success Rate: ${(performance.successRate * 100).toFixed(1)}%`);
    console.log(`   Active Domains: ${Object.keys(performance.domainActivity).length}`);
  }

  console.log('\n🌲 TreeAI Hive Intelligence article series generation complete!');
  console.log('🚀 Ready to establish TreeShop as the industry leader in forestry mulching\n');
}

// Run the script
main().catch(console.error);