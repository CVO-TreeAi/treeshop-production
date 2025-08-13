import { NextRequest, NextResponse } from 'next/server';
import { createGoogleCalendarManager, SchedulingHelper } from '@/lib/googleCalendar';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface CalendarEventRequest {
  proposalId: string;
  scheduledDateTime: string; // ISO string
  duration?: number; // minutes
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CalendarEventRequest = await request.json();
    const { proposalId, scheduledDateTime, duration = 120, notes } = body;

    // Validate input
    if (!proposalId || !scheduledDateTime) {
      return NextResponse.json(
        { error: 'proposalId and scheduledDateTime are required' },
        { status: 400 }
      );
    }

    // Get proposal data
    const proposalRef = doc(db, 'proposals', proposalId);
    const proposalSnap = await getDoc(proposalRef);

    if (!proposalSnap.exists()) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const proposal = proposalSnap.data();
    const customer = proposal.customer;
    const propertyAddress = proposal.inputs.address;

    if (!customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Customer information incomplete' },
        { status: 400 }
      );
    }

    // Validate scheduling time
    const scheduledStart = new Date(scheduledDateTime);
    if (isNaN(scheduledStart.getTime())) {
      return NextResponse.json(
        { error: 'Invalid scheduledDateTime format' },
        { status: 400 }
      );
    }

    if (!SchedulingHelper.isBusinessHours(scheduledStart)) {
      return NextResponse.json(
        { error: 'Scheduled time must be during business hours (Mon-Fri, 7 AM - 5 PM)' },
        { status: 400 }
      );
    }

    // Check if Google Calendar is configured
    const integrationsRef = doc(db, 'integrations', 'google');
    const integrationsSnap = await getDoc(integrationsRef);

    const calendarEnabled = integrationsSnap.exists() && 
      integrationsSnap.data().calendar?.enabled;

    let calendarResult: any = null;

    if (calendarEnabled) {
      // Create calendar manager
      const calendarManager = createGoogleCalendarManager();
      if (!calendarManager) {
        return NextResponse.json(
          { error: 'Google Calendar not configured' },
          { status: 503 }
        );
      }

      // Create calendar event
      try {
        calendarResult = await calendarManager.createProposalSchedulingEvent(
          proposalId,
          customer.name,
          customer.email,
          propertyAddress,
          scheduledStart,
          duration,
          notes
        );
      } catch (calendarError) {
        console.error('Calendar creation error:', calendarError);
        return NextResponse.json(
          { error: 'Failed to create calendar event' },
          { status: 500 }
        );
      }
    }

    // Update proposal with scheduling information
    const schedulingData = {
      scheduledAt: scheduledStart.toISOString(),
      scheduledDuration: duration,
      schedulingNotes: notes,
      ...(calendarResult && {
        calendarEventId: calendarResult.calendarEventId,
        calendarHtmlLink: calendarResult.htmlLink
      }),
      'audit.scheduledAt': serverTimestamp(),
      'audit.scheduledBy': 'admin' // TODO: Get actual user ID from auth
    };

    await updateDoc(proposalRef, schedulingData);

    // Prepare response
    const response: any = {
      success: true,
      proposalId,
      scheduledDateTime: scheduledStart.toISOString(),
      duration
    };

    if (calendarResult) {
      response.calendar = {
        eventId: calendarResult.calendarEventId,
        htmlLink: calendarResult.htmlLink
      };
      response.icsFile = {
        content: calendarResult.icsContent,
        filename: `treeshop-${proposalId}-appointment.ics`,
        mimeType: 'text/calendar'
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Calendar creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}

// GET endpoint to check calendar availability
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const acreage = parseFloat(url.searchParams.get('acreage') || '1');

    if (!date) {
      return NextResponse.json(
        { error: 'date parameter is required (YYYY-MM-DD format)' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date + 'T00:00:00');
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format, use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Get available time slots
    const duration = SchedulingHelper.estimateServiceDuration(acreage);
    const slots = SchedulingHelper.getAvailableTimeSlots(targetDate, 7, 17, duration);

    // TODO: Check against existing calendar events to filter out booked slots
    // For now, return all available slots
    const availableSlots = slots.map(slot => ({
      dateTime: slot.toISOString(),
      displayTime: slot.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      }),
      duration,
      available: true
    }));

    return NextResponse.json({
      date: date,
      estimatedDuration: duration,
      slots: availableSlots,
      businessHours: {
        start: '07:00',
        end: '17:00',
        timezone: 'America/New_York',
        daysOfWeek: [1, 2, 3, 4, 5] // Monday-Friday
      }
    });

  } catch (error) {
    console.error('Calendar availability error:', error);
    return NextResponse.json(
      { error: 'Failed to get availability' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to cancel/update calendar event
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const proposalId = url.searchParams.get('proposalId');

    if (!proposalId) {
      return NextResponse.json(
        { error: 'proposalId parameter is required' },
        { status: 400 }
      );
    }

    // Get proposal data
    const proposalRef = doc(db, 'proposals', proposalId);
    const proposalSnap = await getDoc(proposalRef);

    if (!proposalSnap.exists()) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const proposal = proposalSnap.data();
    const calendarEventId = proposal.calendarEventId;

    if (calendarEventId) {
      const calendarManager = createGoogleCalendarManager();
      if (calendarManager) {
        try {
          await calendarManager.deleteEvent(calendarEventId);
        } catch (error) {
          console.error('Failed to delete calendar event:', error);
          // Continue with proposal update even if calendar deletion fails
        }
      }
    }

    // Clear scheduling data from proposal
    await updateDoc(proposalRef, {
      scheduledAt: null,
      scheduledDuration: null,
      schedulingNotes: null,
      calendarEventId: null,
      calendarHtmlLink: null,
      'audit.cancelledAt': serverTimestamp(),
      'audit.cancelledBy': 'admin' // TODO: Get actual user ID from auth
    });

    return NextResponse.json({
      success: true,
      message: 'Calendar event cancelled and proposal updated'
    });

  } catch (error) {
    console.error('Calendar cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel calendar event' },
      { status: 500 }
    );
  }
}