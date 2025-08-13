import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let jobs;
    
    if (status) {
      jobs = await jobService.getJobsByStatus(status as any);
    } else {
      jobs = await jobService.getAll('jobs', 'scheduledDate');
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const jobData = await req.json();
    
    const id = await jobService.createJob({
      estimateId: jobData.estimateId,
      leadId: jobData.leadId,
      scheduledDate: new Date(jobData.scheduledDate),
      crew: jobData.crew,
      siteNotes: jobData.siteNotes || '',
      status: 'scheduled',
      workLog: [],
      completionPhotos: []
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}