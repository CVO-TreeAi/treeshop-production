import { NextRequest, NextResponse } from 'next/server';
import { treeShopAI, LeadData } from '@/lib/aiServices';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { leadId, leadData } = body;
    
    if (!leadId || !leadData) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, leadData' }, 
        { status: 400 }
      );
    }

    // Score the lead using AI
    const leadScore = await treeShopAI.scoreAndCategorizeLead(leadData as LeadData);

    // Update the lead in Firestore with AI score and category
    await adminDb.collection('leads').doc(leadId).update({
      aiScore: leadScore.score,
      category: leadScore.category,
      scoringFactors: leadScore.factors,
      scoringReasoning: leadScore.reasoning,
      nextSteps: leadScore.nextSteps,
      lastScored: new Date(),
      status: leadScore.category === 'hot' ? 'Hot' : 
              leadScore.category === 'warm' ? 'Warm' : 'Cold'
    });

    // Generate follow-up sequence
    const followUpSequence = await treeShopAI.generateFollowUpSequence(leadScore, leadData);

    // Store follow-up sequence in Firestore
    await adminDb.collection('leads').doc(leadId).collection('followUps').add({
      sequence: followUpSequence,
      createdAt: new Date(),
      status: 'pending'
    });

    return NextResponse.json({
      success: true,
      leadScore,
      followUpSequence,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Lead Scoring Error:', error);
    
    // Return fallback scoring
    const fallbackScore = {
      score: 50,
      category: 'warm' as const,
      factors: {
        budgetMatch: 15,
        urgency: 10,
        locationMatch: 15,
        projectComplexity: 10,
        communicationQuality: 0
      },
      reasoning: 'AI scoring unavailable, using default warm lead classification',
      nextSteps: [
        'Call within 24 hours to qualify budget and timeline',
        'Schedule property assessment',
        'Send detailed service information packet'
      ]
    };

    return NextResponse.json({
      success: true,
      leadScore: fallbackScore,
      followUpSequence: [
        "Thanks for your interest in TreeShop's forestry mulching services. I'll call you within 24 hours to discuss your project.",
        "Following up on your land clearing inquiry. When would be a good time to schedule a property assessment?",
        "I've prepared a detailed proposal for your project. Let's schedule a time to review the options together."
      ],
      fallback: true,
      error: 'AI service unavailable, using fallback scoring'
    });
  }
}