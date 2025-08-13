import { adminDb } from './firebaseAdmin';

export type SecurityEventType = 
  | 'AUTH_FAILURE'
  | 'RATE_LIMIT_HIT'
  | 'INVALID_TOKEN'
  | 'SUSPICIOUS_ACTIVITY'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED_ACCESS'
  | 'PAYMENT_FRAUD'
  | 'DATA_BREACH_ATTEMPT'
  | 'ADMIN_LOGIN'
  | 'ADMIN_ACTION';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ip: string;
  userAgent: string;
  userId?: string;
  email?: string;
  endpoint?: string;
  method?: string;
  details: Record<string, any>;
  timestamp: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export class SecurityMonitor {
  private static readonly COLLECTION_NAME = 'security_events';
  private static readonly ALERT_THRESHOLDS = {
    AUTH_FAILURE: 5,          // 5 failed auth attempts
    RATE_LIMIT_HIT: 10,       // 10 rate limit hits
    SUSPICIOUS_ACTIVITY: 3,   // 3 suspicious activities
    PAYMENT_FRAUD: 1,         // Any payment fraud attempt
  };

  static async logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
    try {
      const securityEvent: SecurityEvent = {
        ...event,
        timestamp: new Date().toISOString()
      };

      // Log to Firestore
      await adminDb.collection(this.COLLECTION_NAME).add(securityEvent);

      // Check if we need to send alerts
      await this.checkAlertThresholds(event.type, event.ip);

      // Console log for immediate visibility
      console.warn(`🚨 Security Event [${event.severity}]:`, {
        type: event.type,
        ip: event.ip,
        details: event.details
      });

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private static async checkAlertThresholds(
    eventType: SecurityEventType, 
    ip: string
  ): Promise<void> {
    const threshold = this.ALERT_THRESHOLDS[eventType];
    if (!threshold) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentEvents = await adminDb
      .collection(this.COLLECTION_NAME)
      .where('type', '==', eventType)
      .where('ip', '==', ip)
      .where('timestamp', '>=', oneHourAgo.toISOString())
      .get();

    if (recentEvents.size >= threshold) {
      await this.sendSecurityAlert(eventType, ip, recentEvents.size);
    }
  }

  private static async sendSecurityAlert(
    eventType: SecurityEventType,
    ip: string,
    count: number
  ): Promise<void> {
    console.error(`🚨 SECURITY ALERT: ${eventType} threshold exceeded`, {
      ip,
      count,
      threshold: this.ALERT_THRESHOLDS[eventType]
    });

    // Log the alert itself as a security event
    await this.logSecurityEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      ip,
      userAgent: 'Security Monitor',
      details: {
        alertType: eventType,
        eventCount: count,
        threshold: this.ALERT_THRESHOLDS[eventType],
        message: `Security threshold exceeded for ${eventType}`
      }
    });

    // TODO: Integrate with external alerting service (email, Slack, PagerDuty, etc.)
    // await this.sendExternalAlert(eventType, ip, count);
  }

  // Helper methods for common security events
  static async logAuthFailure(
    ip: string,
    userAgent: string,
    email?: string,
    reason?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'AUTH_FAILURE',
      severity: 'MEDIUM',
      ip,
      userAgent,
      email,
      details: {
        reason: reason || 'Authentication failed',
        attemptedEmail: email
      }
    });
  }

  static async logRateLimitHit(
    ip: string,
    userAgent: string,
    endpoint: string,
    limit: number
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'RATE_LIMIT_HIT',
      severity: 'MEDIUM',
      ip,
      userAgent,
      endpoint,
      details: {
        endpoint,
        limit,
        message: 'Rate limit exceeded'
      }
    });
  }

  static async logValidationError(
    ip: string,
    userAgent: string,
    endpoint: string,
    validationErrors: string[]
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'VALIDATION_ERROR',
      severity: 'LOW',
      ip,
      userAgent,
      endpoint,
      details: {
        endpoint,
        errors: validationErrors,
        message: 'Request validation failed'
      }
    });
  }

  static async logUnauthorizedAccess(
    ip: string,
    userAgent: string,
    endpoint: string,
    userId?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'HIGH',
      ip,
      userAgent,
      userId,
      endpoint,
      details: {
        endpoint,
        userId,
        message: 'Unauthorized access attempt'
      }
    });
  }

  static async logPaymentFraud(
    ip: string,
    userAgent: string,
    details: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'PAYMENT_FRAUD',
      severity: 'CRITICAL',
      ip,
      userAgent,
      details: {
        ...details,
        message: 'Potential payment fraud detected'
      }
    });
  }

  static async logAdminAction(
    ip: string,
    userAgent: string,
    userId: string,
    email: string,
    action: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    await this.logSecurityEvent({
      type: 'ADMIN_ACTION',
      severity: 'MEDIUM',
      ip,
      userAgent,
      userId,
      email,
      details: {
        action,
        ...details,
        message: `Admin action: ${action}`
      }
    });
  }

  // Analytics and reporting methods
  static async getSecurityEvents(
    filters?: {
      type?: SecurityEventType;
      severity?: SecurityEvent['severity'];
      ip?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<SecurityEvent[]> {
    let query = adminDb.collection(this.COLLECTION_NAME) as any;

    if (filters?.type) {
      query = query.where('type', '==', filters.type);
    }
    if (filters?.severity) {
      query = query.where('severity', '==', filters.severity);
    }
    if (filters?.ip) {
      query = query.where('ip', '==', filters.ip);
    }
    if (filters?.userId) {
      query = query.where('userId', '==', filters.userId);
    }
    if (filters?.startDate) {
      query = query.where('timestamp', '>=', filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      query = query.where('timestamp', '<=', filters.endDate.toISOString());
    }

    query = query.orderBy('timestamp', 'desc');

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityEvent));
  }

  static async getSecuritySummary(days: number = 7): Promise<{
    totalEvents: number;
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<SecurityEvent['severity'], number>;
    topIPs: Array<{ ip: string; count: number }>;
  }> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const events = await this.getSecurityEvents({
      startDate,
      limit: 1000
    });

    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEventType, number>);

    const eventsBySeverity = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEvent['severity'], number>);

    const ipCounts = events.reduce((acc, event) => {
      acc[event.ip] = (acc[event.ip] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIPs = Object.entries(ipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    return {
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      topIPs
    };
  }

  // IP blocking functionality
  static async isIPBlocked(ip: string): Promise<boolean> {
    const blockedIP = await adminDb
      .collection('blocked_ips')
      .doc(ip)
      .get();

    return blockedIP.exists;
  }

  static async blockIP(
    ip: string, 
    reason: string, 
    expiresAt?: Date,
    blockedBy?: string
  ): Promise<void> {
    await adminDb
      .collection('blocked_ips')
      .doc(ip)
      .set({
        ip,
        reason,
        blockedAt: new Date().toISOString(),
        blockedBy: blockedBy || 'Security Monitor',
        expiresAt: expiresAt?.toISOString() || null,
        isActive: true
      });

    await this.logSecurityEvent({
      type: 'ADMIN_ACTION',
      severity: 'HIGH',
      ip,
      userAgent: 'Security Monitor',
      details: {
        action: 'IP_BLOCKED',
        reason,
        expiresAt: expiresAt?.toISOString()
      }
    });
  }

  static async unblockIP(ip: string, unblockedBy?: string): Promise<void> {
    await adminDb
      .collection('blocked_ips')
      .doc(ip)
      .update({
        isActive: false,
        unblockedAt: new Date().toISOString(),
        unblockedBy: unblockedBy || 'Security Monitor'
      });

    await this.logSecurityEvent({
      type: 'ADMIN_ACTION',
      severity: 'MEDIUM',
      ip,
      userAgent: 'Security Monitor',
      details: {
        action: 'IP_UNBLOCKED',
        unblockedBy
      }
    });
  }
}