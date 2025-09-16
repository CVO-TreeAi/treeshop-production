// SEO Optimization Agent - Domain 6 (Security Intelligence)
// Ensures content security, compliance, and search optimization

interface SEOMetrics {
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  metaQuality: number;
  linkOpportunities: string[];
}

interface SEOOptimization {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  internalLinks: Array<{ anchor: string; url: string }>;
  imageAltTags: string[];
  schemaMarkup?: Record<string, any>;
}

export class SEOOptimizationAgent {
  private readonly IDEAL_KEYWORD_DENSITY = 0.015; // 1.5%
  private readonly MAX_TITLE_LENGTH = 60;
  private readonly MAX_DESCRIPTION_LENGTH = 160;

  async optimizeContent(
    title: string,
    content: string,
    excerpt: string,
    category: string,
    targetKeywords: string[]
  ): Promise<SEOOptimization> {
    // Analyze current content
    const metrics = this.analyzeContent(content, targetKeywords);
    
    // Generate optimized meta data
    const metaTitle = this.optimizeTitle(title, targetKeywords);
    const metaDescription = this.optimizeDescription(excerpt, targetKeywords);
    
    // Find internal linking opportunities
    const internalLinks = await this.findInternalLinks(content, category);
    
    // Generate image alt tags
    const imageAltTags = this.generateImageAltTags(content, targetKeywords);
    
    // Create schema markup
    const schemaMarkup = this.generateSchemaMarkup(title, excerpt, category);

    return {
      metaTitle,
      metaDescription,
      keywords: targetKeywords,
      internalLinks,
      imageAltTags,
      schemaMarkup
    };
  }

  private analyzeContent(content: string, keywords: string[]): SEOMetrics {
    const wordCount = content.split(/\s+/).length;
    const keywordDensity: Record<string, number> = {};
    
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex) || [];
      keywordDensity[keyword] = matches.length / wordCount;
    });

    const readabilityScore = this.calculateReadabilityScore(content);
    const metaQuality = this.assessMetaQuality(content);
    const linkOpportunities = this.identifyLinkOpportunities(content);

    return {
      keywordDensity,
      readabilityScore,
      metaQuality,
      linkOpportunities
    };
  }

  private optimizeTitle(originalTitle: string, keywords: string[]): string {
    // Include primary keyword in title if not present
    const primaryKeyword = keywords[0];
    let optimizedTitle = originalTitle;

    if (!originalTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      optimizedTitle = `${primaryKeyword}: ${originalTitle}`;
    }

    // Ensure title is within length limits
    if (optimizedTitle.length > this.MAX_TITLE_LENGTH) {
      optimizedTitle = optimizedTitle.substring(0, this.MAX_TITLE_LENGTH - 3) + '...';
    }

    return optimizedTitle;
  }

  private optimizeDescription(originalExcerpt: string, keywords: string[]): string {
    const primaryKeyword = keywords[0];
    let description = originalExcerpt;

    // Ensure primary keyword is in description
    if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      description = `${primaryKeyword} expertise: ${description}`;
    }

    // Add call-to-action
    const cta = ' Contact TreeShop for professional service.';
    if (description.length + cta.length <= this.MAX_DESCRIPTION_LENGTH) {
      description += cta;
    }

    // Trim to length limits
    if (description.length > this.MAX_DESCRIPTION_LENGTH) {
      description = description.substring(0, this.MAX_DESCRIPTION_LENGTH - 3) + '...';
    }

    return description;
  }

  private async findInternalLinks(content: string, category: string): Promise<Array<{ anchor: string; url: string }>> {
    // Define internal linking opportunities based on content analysis
    const linkOpportunities = [
      {
        triggers: ['forestry mulching', 'land clearing'],
        anchor: 'professional forestry mulching services',
        url: '/services/forestry-mulching'
      },
      {
        triggers: ['stump grinding', 'stump removal'],
        anchor: 'stump grinding services',
        url: '/services/stump-grinding'
      },
      {
        triggers: ['estimate', 'quote', 'pricing'],
        anchor: 'get a free estimate',
        url: '/estimate'
      },
      {
        triggers: ['TreeAI', 'technology', 'AI'],
        anchor: 'TreeAI technology platform',
        url: '/articles/tree-shop-invents-treeai-revolutionary-technology'
      },
      {
        triggers: ['equipment', 'mulcher', 'machinery'],
        anchor: 'our professional equipment',
        url: '/articles/florida-forestry-mulching-cat-skid-steer-professional-mulcher'
      }
    ];

    const foundLinks: Array<{ anchor: string; url: string }> = [];
    const contentLower = content.toLowerCase();

    linkOpportunities.forEach(opportunity => {
      const hasMatch = opportunity.triggers.some(trigger => 
        contentLower.includes(trigger.toLowerCase())
      );
      
      if (hasMatch && foundLinks.length < 3) { // Limit internal links
        foundLinks.push({
          anchor: opportunity.anchor,
          url: opportunity.url
        });
      }
    });

    return foundLinks;
  }

  private generateImageAltTags(content: string, keywords: string[]): string[] {
    const primaryKeyword = keywords[0];
    
    // Generate contextual alt tags based on content themes
    const altTags = [
      `${primaryKeyword} demonstration by TreeShop professionals`,
      `TreeAI technology interface showing ${primaryKeyword} optimization`,
      `Before and after results of professional ${primaryKeyword}`,
      `TreeShop equipment performing ${primaryKeyword} operations`,
      `Florida landscape after professional ${primaryKeyword} service`
    ];

    return altTags.slice(0, 3); // Return top 3 most relevant
  }

  private generateSchemaMarkup(title: string, excerpt: string, category: string): Record<string, any> {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": excerpt,
      "author": {
        "@type": "Organization",
        "name": "TreeShop",
        "url": "https://treeshop.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "TreeShop",
        "logo": {
          "@type": "ImageObject",
          "url": "https://treeshop.app/images/TreeShopLogo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://treeshop.app"
      },
      "articleSection": category,
      "keywords": "forestry, land clearing, tree service, TreeAI, Florida",
      "about": {
        "@type": "Service",
        "name": "Professional Tree and Land Clearing Services",
        "provider": {
          "@type": "Organization",
          "name": "TreeShop"
        }
      }
    };
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease calculation
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);

    if (sentences === 0 || words === 0) return 0;

    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.reduce((total, word) => {
      const vowels = word.match(/[aeiouy]+/g) || [];
      let syllables = vowels.length;
      
      // Adjust for silent 'e'
      if (word.endsWith('e') && syllables > 1) {
        syllables--;
      }
      
      return total + Math.max(1, syllables);
    }, 0);
  }

  private assessMetaQuality(content: string): number {
    // Simple quality assessment based on content structure
    let score = 0;
    
    // Check for headings
    if (content.includes('##')) score += 20;
    if (content.includes('###')) score += 10;
    
    // Check for lists
    if (content.includes('- ') || content.includes('1. ')) score += 15;
    
    // Check for length
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 500) score += 25;
    if (wordCount > 1000) score += 15;
    
    // Check for external elements
    if (content.includes('](')) score += 10; // Links
    if (content.includes('**') || content.includes('_')) score += 5; // Formatting
    
    return Math.min(100, score);
  }

  private identifyLinkOpportunities(content: string): string[] {
    const opportunities = [];
    
    // Look for competitor mentions that could be internal links
    if (content.includes('traditional') && !content.includes('[traditional')) {
      opportunities.push('Link "traditional methods" to comparison article');
    }
    
    // Look for service mentions
    if (content.includes('equipment') && !content.includes('[equipment')) {
      opportunities.push('Link "equipment" to equipment showcase page');
    }
    
    // Look for location mentions
    if (content.includes('Florida') && !content.includes('[Florida')) {
      opportunities.push('Link "Florida" to service areas page');
    }

    return opportunities;
  }

  // Validation methods for content quality
  validateSEOCompliance(optimization: SEOOptimization): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (optimization.metaTitle.length > this.MAX_TITLE_LENGTH) {
      issues.push(`Meta title too long (${optimization.metaTitle.length} > ${this.MAX_TITLE_LENGTH})`);
    }

    if (optimization.metaDescription.length > this.MAX_DESCRIPTION_LENGTH) {
      issues.push(`Meta description too long (${optimization.metaDescription.length} > ${this.MAX_DESCRIPTION_LENGTH})`);
    }

    if (optimization.keywords.length < 3) {
      issues.push('Insufficient target keywords (minimum 3 required)');
    }

    if (optimization.internalLinks.length === 0) {
      issues.push('No internal linking opportunities identified');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}