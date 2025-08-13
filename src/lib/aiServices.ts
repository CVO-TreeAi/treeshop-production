// FIREBASE DISABLED

export interface PropertyAssessment {
  acreage: number;
  vegetationDensity: 'light' | 'medium' | 'heavy' | 'very-heavy';
  terrain: 'flat' | 'rolling' | 'steep';
  access: 'excellent' | 'good' | 'difficult' | 'very-difficult';
  obstacles: string[];
  stumpRemoval: boolean;
  photos?: File[];
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  address: string;
  propertyAssessment: PropertyAssessment;
  urgency: 'immediate' | 'within-month' | 'within-3months' | 'planning';
  budget?: string;
  additionalNotes?: string;
}

export interface PricingEstimate {
  basePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  breakdown: {
    clearing: number;
    stumpRemoval?: number;
    accessDifficulty: number;
    disposal: number;
  };
  timeEstimate: {
    days: number;
    range: string;
  };
  confidence: number;
  assumptions: string[];
}

export interface LeadScore {
  score: number; // 0-100
  category: 'hot' | 'warm' | 'cold';
  factors: {
    budgetMatch: number;
    urgency: number;
    locationMatch: number;
    projectComplexity: number;
    communicationQuality: number;
  };
  reasoning: string;
  nextSteps: string[];
}

export class TreeShopAI {
  
  async generatePricingEstimate(assessment: PropertyAssessment): Promise<PricingEstimate> {
    if (!aiModel) {
      throw new Error('AI model not initialized');
    }

    const prompt = `
As an expert tree service estimator for forestry mulching and land clearing in Florida, provide a detailed pricing estimate based on these property details:

Property Assessment:
- Acreage: ${assessment.acreage}
- Vegetation Density: ${assessment.vegetationDensity}
- Terrain: ${assessment.terrain}
- Access Difficulty: ${assessment.access}
- Obstacles: ${assessment.obstacles.join(', ') || 'None specified'}
- Stump Removal Required: ${assessment.stumpRemoval ? 'Yes' : 'No'}

Consider these factors:
- Florida market rates for forestry mulching ($800-2500/acre typical range)
- Equipment mobilization costs
- Terrain and access impact on productivity
- Obstacle complexity (structures, utilities, wetlands)
- Stump grinding rates ($75-200 per stump or $500-1500/acre)
- Disposal and cleanup costs

Provide a JSON response with realistic pricing that includes base price, range (min/max), detailed breakdown, time estimate, confidence level (0-100), and key assumptions.

Return ONLY valid JSON in this exact format:
{
  "basePrice": number,
  "priceRange": {"min": number, "max": number},
  "breakdown": {
    "clearing": number,
    "stumpRemoval": number,
    "accessDifficulty": number,
    "disposal": number
  },
  "timeEstimate": {"days": number, "range": "X-Y days"},
  "confidence": number,
  "assumptions": ["assumption1", "assumption2"]
}`;

    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]) as PricingEstimate;
    } catch (error) {
      console.error('Error generating pricing estimate:', error);
      throw new Error('Failed to generate pricing estimate');
    }
  }

  async scoreAndCategorizeLead(leadData: LeadData): Promise<LeadScore> {
    if (!aiModel) {
      throw new Error('AI model not initialized');
    }

    const prompt = `
As TreeShop's lead qualification specialist, analyze this potential customer and provide a comprehensive lead score (0-100) and categorization.

Lead Information:
- Name: ${leadData.name}
- Contact: ${leadData.email}, ${leadData.phone}
- Property: ${leadData.address}
- Project: ${leadData.propertyAssessment.acreage} acres, ${leadData.propertyAssessment.vegetationDensity} vegetation
- Urgency: ${leadData.urgency}
- Budget: ${leadData.budget || 'Not specified'}
- Notes: ${leadData.additionalNotes || 'None'}

Scoring Criteria:
1. Budget Match (0-25 points): Realistic budget expectations for project scope
2. Urgency (0-20 points): Timeline urgency (immediate=20, planning=5)
3. Location Match (0-20 points): Within TreeShop's Florida service area
4. Project Complexity (0-20 points): Complexity and profitability potential
5. Communication Quality (0-15 points): Completeness and clarity of information provided

Categories:
- HOT (80-100): Ready to buy, good fit, high value
- WARM (50-79): Interested, some qualification needed
- COLD (0-49): Low priority, major obstacles

Return ONLY valid JSON:
{
  "score": number,
  "category": "hot|warm|cold",
  "factors": {
    "budgetMatch": number,
    "urgency": number,
    "locationMatch": number,
    "projectComplexity": number,
    "communicationQuality": number
  },
  "reasoning": "brief explanation of score",
  "nextSteps": ["action1", "action2", "action3"]
}`;

    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]) as LeadScore;
    } catch (error) {
      console.error('Error scoring lead:', error);
      throw new Error('Failed to score lead');
    }
  }

  async generateFollowUpSequence(leadScore: LeadScore, leadData: LeadData): Promise<string[]> {
    if (!aiModel) {
      throw new Error('AI model not initialized');
    }

    const prompt = `
Generate a 3-step follow-up sequence for this TreeShop lead:

Lead Score: ${leadScore.score}/100 (${leadScore.category.toUpperCase()})
Customer: ${leadData.name}
Project: ${leadData.propertyAssessment.acreage} acres forestry mulching/land clearing
Urgency: ${leadData.urgency}

Create personalized follow-up messages that:
- Address the customer by name
- Reference their specific project details
- Match the urgency level and lead temperature
- Include next steps and calls to action
- Maintain TreeShop's professional, helpful tone

Return exactly 3 follow-up messages as a JSON array of strings:
["message1", "message2", "message3"]`;

    try {
      const result = await aiModel.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]) as string[];
    } catch (error) {
      console.error('Error generating follow-up sequence:', error);
      throw new Error('Failed to generate follow-up sequence');
    }
  }

  async analyzeProjectPhotos(photos: File[]): Promise<{
    vegetationAssessment: string;
    obstacleIdentification: string[];
    accessibilityNotes: string;
    recommendedApproach: string;
  }> {
    if (!aiModel || photos.length === 0) {
      throw new Error('AI model not initialized or no photos provided');
    }

    // Convert images to base64 for AI analysis
    const imagePromises = photos.map(async (photo) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(photo);
      });
    });

    const base64Images = await Promise.all(imagePromises);

    const prompt = `
As TreeShop's expert forestry analyst, analyze these property photos for land clearing assessment:

Identify:
1. Vegetation type and density (pine, hardwood, mixed, understory)
2. Obstacles (structures, utilities, wetlands, slopes)
3. Site accessibility for equipment
4. Recommended clearing approach

Provide specific, actionable insights for pricing and project planning.

Return ONLY valid JSON:
{
  "vegetationAssessment": "detailed description",
  "obstacleIdentification": ["obstacle1", "obstacle2"],
  "accessibilityNotes": "access assessment",
  "recommendedApproach": "clearing strategy recommendation"
}`;

    try {
      // Note: This would require multimodal prompt support
      // For now, return a placeholder response
      return {
        vegetationAssessment: "Photo analysis requires multimodal AI capability",
        obstacleIdentification: ["Manual photo review recommended"],
        accessibilityNotes: "Visual inspection needed",
        recommendedApproach: "Standard forestry mulching approach"
      };
    } catch (error) {
      console.error('Error analyzing photos:', error);
      throw new Error('Failed to analyze project photos');
    }
  }
}

export const treeShopAI = new TreeShopAI();