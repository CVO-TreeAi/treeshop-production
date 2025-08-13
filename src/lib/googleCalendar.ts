// Google Calendar API utilities for TreeAI scheduling

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: { email: string; displayName?: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: 'email' | 'popup'; minutes: number }[];
  };
}

export interface ICSEvent {
  uid: string;
  dtstart: string;
  dtend: string;
  summary: string;
  description?: string;
  location?: string;
  organizer?: { name: string; email: string };
  attendee?: { name: string; email: string };
}

export class GoogleCalendarManager {
  private serviceAccount: any;
  private calendarId: string;

  constructor(serviceAccountKey: string, calendarId: string) {
    this.serviceAccount = JSON.parse(serviceAccountKey);
    this.calendarId = calendarId;
  }

  // Get OAuth access token using service account
  private async getAccessToken(): Promise<string> {
    const { GoogleAuth } = require('google-auth-library');
    
    const auth = new GoogleAuth({
      credentials: this.serviceAccount,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token');
    }

    return accessToken.token;
  }

  // Create calendar event
  async createEvent(event: CalendarEvent): Promise<{ id: string; htmlLink: string }> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sendNotifications: true,
          sendUpdates: 'all'
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Calendar API error: ${response.status} ${error}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      htmlLink: result.htmlLink
    };
  }

  // Update calendar event
  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sendNotifications: true,
          sendUpdates: 'all'
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Calendar API error: ${response.status} ${error}`);
    }
  }

  // Delete calendar event
  async deleteEvent(eventId: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId)}/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok && response.status !== 404) {
      const error = await response.text();
      throw new Error(`Calendar API error: ${response.status} ${error}`);
    }
  }

  // Generate ICS file content
  static generateICS(event: ICSEvent): string {
    const formatDate = (date: string) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const escapeString = (str: string) => {
      return str.replace(/[\\;,\n]/g, (match) => {
        switch (match) {
          case '\\': return '\\\\';
          case ';': return '\\;';
          case ',': return '\\,';
          case '\n': return '\\n';
          default: return match;
        }
      });
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TreeAI//TreeAI Scheduling//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.uid}`,
      `DTSTART:${formatDate(event.dtstart)}`,
      `DTEND:${formatDate(event.dtend)}`,
      `SUMMARY:${escapeString(event.summary)}`
    ];

    if (event.description) {
      icsContent.push(`DESCRIPTION:${escapeString(event.description)}`);
    }

    if (event.location) {
      icsContent.push(`LOCATION:${escapeString(event.location)}`);
    }

    if (event.organizer) {
      icsContent.push(`ORGANIZER;CN=${escapeString(event.organizer.name)}:mailto:${event.organizer.email}`);
    }

    if (event.attendee) {
      icsContent.push(`ATTENDEE;CN=${escapeString(event.attendee.name)}:mailto:${event.attendee.email}`);
    }

    icsContent.push(
      `CREATED:${formatDate(new Date().toISOString())}`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR'
    );

    return icsContent.join('\r\n');
  }

  // Create scheduling event for proposal
  async createProposalSchedulingEvent(
    proposalId: string,
    customerName: string,
    customerEmail: string,
    propertyAddress: string,
    scheduledStart: Date,
    duration: number = 120, // minutes
    notes?: string
  ): Promise<{ calendarEventId: string; icsContent: string; htmlLink: string }> {
    const endTime = new Date(scheduledStart.getTime() + duration * 60 * 1000);
    
    const event: CalendarEvent = {
      summary: `Land Clearing - ${customerName}`,
      description: `TreeAI Land Clearing Service\n\nCustomer: ${customerName}\nProperty: ${propertyAddress}\nProposal ID: ${proposalId}\n\n${notes || 'Professional forestry mulching and land clearing services.'}`,
      start: {
        dateTime: scheduledStart.toISOString(),
        timeZone: 'America/New_York'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/New_York'
      },
      location: propertyAddress,
      attendees: [
        {
          email: customerEmail,
          displayName: customerName
        }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 }       // 1 hour before
        ]
      }
    };

    const result = await this.createEvent(event);

    // Generate ICS file for customer
    const icsEvent: ICSEvent = {
      uid: `treeshop-${proposalId}@treeai.us`,
      dtstart: scheduledStart.toISOString(),
      dtend: endTime.toISOString(),
      summary: `TreeAI Land Clearing - ${customerName}`,
      description: event.description,
      location: propertyAddress,
      organizer: { name: 'TreeAI Operations', email: 'ops@treeai.us' },
      attendee: { name: customerName, email: customerEmail }
    };

    const icsContent = GoogleCalendarManager.generateICS(icsEvent);

    return {
      calendarEventId: result.id,
      icsContent,
      htmlLink: result.htmlLink
    };
  }
}

// Utility function to create GoogleCalendarManager from environment
export function createGoogleCalendarManager(): GoogleCalendarManager | null {
  const serviceAccountJson = process.env.GOOGLE_CALENDAR_SERVICE_ACCOUNT;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'ops@treeai.us';

  if (!serviceAccountJson) {
    console.warn('Google Calendar service account not configured');
    return null;
  }

  try {
    return new GoogleCalendarManager(serviceAccountJson, calendarId);
  } catch (error) {
    console.error('Failed to create Google Calendar manager:', error);
    return null;
  }
}

// Utility functions for scheduling
export class SchedulingHelper {
  // Get available time slots for a given date
  static getAvailableTimeSlots(
    date: Date,
    startHour: number = 7,
    endHour: number = 17,
    slotDuration: number = 120 // minutes
  ): Date[] {
    const slots: Date[] = [];
    const day = new Date(date);
    day.setHours(startHour, 0, 0, 0);

    // Skip weekends
    if (day.getDay() === 0 || day.getDay() === 6) {
      return slots;
    }

    while (day.getHours() < endHour - (slotDuration / 60)) {
      slots.push(new Date(day));
      day.setMinutes(day.getMinutes() + slotDuration);
    }

    return slots;
  }

  // Check if a time slot is during business hours
  static isBusinessHours(date: Date): boolean {
    const hour = date.getHours();
    const day = date.getDay();
    
    // Monday-Friday, 7 AM - 5 PM
    return day >= 1 && day <= 5 && hour >= 7 && hour < 17;
  }

  // Calculate estimated service duration based on acreage
  static estimateServiceDuration(acreage: number): number {
    // Base time: 1 hour per acre + setup time
    const baseMinutes = Math.max(120, acreage * 60); // Minimum 2 hours
    const setupTime = 30; // 30 minutes setup/cleanup
    
    return baseMinutes + setupTime;
  }
}