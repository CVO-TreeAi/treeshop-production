import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Trigger the Convex seeding function
    await convex.mutation(api.projects.seedProjects, {});
    
    return NextResponse.json({
      message: 'Projects seeded successfully with new image URLs',
      success: true
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed projects', details: error },
      { status: 500 }
    );
  }
}