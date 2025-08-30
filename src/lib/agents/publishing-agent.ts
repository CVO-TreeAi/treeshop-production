// Publishing Agent - Domain 2 (AgentOs Orchestration)
// Coordinates final publication and cross-channel distribution

import { ConvexHttpClient } from "convex/browser";
import type { ArticleDraft } from "./article-writing-system";
import type { SEOOptimization } from "./seo-optimization-agent";

interface PublishingWorkflow {
  articleId?: string;
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'failed';
  scheduledDate?: Date;
  publishedDate?: Date;
  distributionChannels: string[];
  errors?: string[];
}

interface PublicationResult {
  success: boolean;
  articleId?: string;
  publishUrl?: string;
  errors?: string[];
  distributionResults?: Record<string, boolean>;
}

export class PublishingAgent {
  constructor(private convex: ConvexHttpClient) {}

  async publishArticle(
    draft: ArticleDraft,
    seoOptimization: SEOOptimization,
    workflow: Partial<PublishingWorkflow> = {}
  ): Promise<PublicationResult> {
    try {
      // Create MDX-formatted content
      const mdxContent = this.formatForMDX(draft, seoOptimization);
      
      // Publish to Convex blog system
      const articleId = await this.publishToConvex(draft, seoOptimization);
      
      // Generate supporting content
      const socialContent = this.generateSocialContent(draft, seoOptimization);
      const newsletterContent = this.generateNewsletterContent(draft);
      
      // Schedule distribution across channels
      const distributionResults = await this.distributeContent(
        articleId,
        socialContent,
        newsletterContent,
        workflow.distributionChannels || ['web', 'social']
      );

      const publishUrl = `https://treeshop.app/articles/${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      return {
        success: true,
        articleId,
        publishUrl,
        distributionResults
      };

    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown publication error']
      };
    }
  }

  private formatForMDX(draft: ArticleDraft, seo: SEOOptimization): string {
    const frontmatter = this.generateFrontmatter(draft, seo);
    const processedContent = this.processContentForMDX(draft.content, seo);
    
    return `---
${frontmatter}
---

${processedContent}`;
  }

  private generateFrontmatter(draft: ArticleDraft, seo: SEOOptimization): string {
    const publishDate = new Date().toISOString().split('T')[0];
    
    return `title: "${seo.metaTitle}"
slug: "${this.generateSlug(draft.title)}"
excerpt: "${seo.metaDescription}"
metaTitle: "${seo.metaTitle}"
metaDescription: "${seo.metaDescription}"
keywords: [${seo.keywords.map(k => `"${k}"`).join(', ')}]
category: "${draft.category}"
tags: [${draft.tags.map(t => `"${t}"`).join(', ')}]
author: "TreeShop Team"
authorImage: "/images/team/treeshop-team.jpg"
publishDate: "${publishDate}"
featuredImage: "${this.selectFeaturedImage(draft.category, draft.tags)}"
featuredImageAlt: "${seo.imageAltTags[0] || 'TreeShop professional forestry services'}"
readTime: ${draft.estimatedReadTime}
status: "published"`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private selectFeaturedImage(category: string, tags: string[]): string {
    const imageMap: Record<string, string> = {
      'Technology': '/images/blog/treeai-technology-hero.jpg',
      'Equipment': '/images/blog/forestry-equipment-hero.jpg',
      'Industry Insights': '/images/blog/industry-insights-hero.jpg'
    };

    // Check for specific tag-based images
    if (tags.includes('forestry mulching')) {
      return '/images/hero/forestry-mulcher-in-action-hero.jpg';
    }
    
    if (tags.includes('land clearing')) {
      return '/images/hero/land-clearing-equipment-hero.jpg';
    }

    return imageMap[category] || '/images/blog/treeshop-default-hero.jpg';
  }

  private processContentForMDX(content: string, seo: SEOOptimization): string {
    let processedContent = content;

    // Add internal links
    seo.internalLinks.forEach(link => {
      const regex = new RegExp(`\\b${link.anchor}\\b`, 'gi');
      processedContent = processedContent.replace(
        regex, 
        `[${link.anchor}](${link.url})`
      );
    });

    // Add schema markup as HTML comment for Next.js processing
    if (seo.schemaMarkup) {
      const schemaScript = `<script type="application/ld+json">
${JSON.stringify(seo.schemaMarkup, null, 2)}
</script>`;
      
      processedContent = `${schemaScript}\n\n${processedContent}`;
    }

    // Add call-to-action section
    processedContent += `\n\n## Get Professional TreeShop Service Today

Ready to experience the TreeAI difference? Contact TreeShop for expert ${seo.keywords[0]} services that deliver consistent, professional results.

[Get Your Free Estimate](/estimate){.cta-button}`;

    return processedContent;
  }

  private async publishToConvex(draft: ArticleDraft, seo: SEOOptimization): Promise<string> {
    const blogPostData = {
      title: seo.metaTitle,
      slug: this.generateSlug(draft.title),
      content: this.processContentForMDX(draft.content, seo),
      excerpt: seo.metaDescription,
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: seo.keywords,
      featuredImage: this.selectFeaturedImage(draft.category, draft.tags),
      featuredImageAlt: seo.imageAltTags[0],
      category: draft.category,
      tags: draft.tags,
      authorName: "TreeShop Team",
      status: "published"
    };

    // Use Convex mutation to create blog post
    const articleId = await this.convex.mutation("blog:createBlogPost", blogPostData);
    
    if (!articleId) {
      throw new Error('Failed to create blog post in Convex');
    }

    return articleId;
  }

  private generateSocialContent(draft: ArticleDraft, seo: SEOOptimization): Record<string, string> {
    const baseContent = {
      twitter: `🌲 New Article: ${draft.title}

${seo.metaDescription}

Read more: https://treeshop.app/articles/${this.generateSlug(draft.title)}

#TreeAI #Forestry #LandClearing #Florida`,

      facebook: `📰 Latest from TreeShop: ${draft.title}

${seo.metaDescription}

Our team combines decades of field experience with cutting-edge TreeAI technology to deliver results that exceed expectations.

👉 Read the full article: https://treeshop.app/articles/${this.generateSlug(draft.title)}

#ProfessionalTreeService #TreeAI #Florida #LandClearing`,

      linkedin: `Professional Insights: ${draft.title}

${seo.metaDescription}

At TreeShop, we believe in sharing knowledge that elevates the entire industry. This article combines our field expertise with TreeAI technology insights.

Key takeaways:
${this.extractKeyTakeaways(draft.content)}

Read the complete analysis: https://treeshop.app/articles/${this.generateSlug(draft.title)}

#TreeService #ProfessionalForestry #TreeAI #Innovation`
    };

    return baseContent;
  }

  private generateNewsletterContent(draft: ArticleDraft): string {
    return `Subject: New Article: ${draft.title}

Hi TreeShop Community,

We've published a new article that we think you'll find valuable: "${draft.title}"

${draft.excerpt}

This article is part of our ongoing commitment to share professional insights that help property owners make informed decisions about their land management needs.

Read the full article: https://treeshop.app/articles/${this.generateSlug(draft.title)}

Have questions about your property? Reply to this email or contact us directly for a personalized consultation.

Best regards,
The TreeShop Team

P.S. Don't forget to follow us on social media for daily tips and project updates!`;
  }

  private extractKeyTakeaways(content: string): string {
    // Extract bullet points or numbered items as key takeaways
    const bullets = content.match(/^[-•]\s+(.+)$/gm);
    const numbered = content.match(/^\d+\.\s+(.+)$/gm);
    
    const takeaways = [...(bullets || []), ...(numbered || [])]
      .slice(0, 3)
      .map(item => `• ${item.replace(/^[-•]\s*|\d+\.\s*/, '')}`);

    return takeaways.join('\n') || '• Professional expertise matters\n• TreeAI technology delivers superior results\n• Proper planning saves time and money';
  }

  private async distributeContent(
    articleId: string,
    socialContent: Record<string, string>,
    newsletterContent: string,
    channels: string[]
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'web':
            results[channel] = true; // Already published to web
            break;
            
          case 'social':
            results[channel] = await this.publishToSocialMedia(socialContent);
            break;
            
          case 'newsletter':
            results[channel] = await this.sendNewsletter(newsletterContent);
            break;
            
          case 'rss':
            results[channel] = await this.updateRSSFeed(articleId);
            break;
            
          default:
            results[channel] = false;
        }
      } catch (error) {
        console.error(`Failed to distribute to ${channel}:`, error);
        results[channel] = false;
      }
    }

    return results;
  }

  private async publishToSocialMedia(content: Record<string, string>): Promise<boolean> {
    // In production, this would integrate with social media APIs
    // For now, return success and log the content
    console.log('Social media content prepared:', content);
    return true;
  }

  private async sendNewsletter(content: string): Promise<boolean> {
    // In production, this would integrate with email service
    console.log('Newsletter content prepared:', content);
    return true;
  }

  private async updateRSSFeed(articleId: string): Promise<boolean> {
    // In production, this would trigger RSS feed regeneration
    console.log('RSS feed update triggered for article:', articleId);
    return true;
  }

  // Workflow management methods
  async schedulePublication(
    draft: ArticleDraft,
    seo: SEOOptimization,
    scheduledDate: Date,
    channels: string[] = ['web', 'social']
  ): Promise<PublishingWorkflow> {
    // In production, this would integrate with a job scheduler
    return {
      status: 'scheduled',
      scheduledDate,
      distributionChannels: channels
    };
  }

  async getPublicationStatus(articleId: string): Promise<PublishingWorkflow | null> {
    try {
      const post = await this.convex.query("blog:getPostById", { id: articleId });
      
      if (!post) return null;

      return {
        articleId,
        status: post.status,
        publishedDate: post.publishedAt ? new Date(post.publishedAt) : undefined,
        distributionChannels: ['web'] // Default channels
      };
    } catch (error) {
      return null;
    }
  }

  async retryPublication(workflow: PublishingWorkflow): Promise<PublicationResult> {
    if (!workflow.articleId) {
      return {
        success: false,
        errors: ['No article ID provided for retry']
      };
    }

    // Implement retry logic here
    return {
      success: true,
      articleId: workflow.articleId
    };
  }
}