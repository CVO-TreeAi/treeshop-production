import { NextRequest } from 'next/server';

interface RateLimitAttempt {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static attempts = new Map<string, RateLimitAttempt>();
  
  static async checkLimit(
    identifier: string, 
    maxAttempts: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
  ): Promise<boolean> {
    const now = Date.now();
    const key = identifier;
    const attempt = this.attempts.get(key);
    
    // Clean up expired entries periodically
    if (Math.random() < 0.1) {
      this.cleanupExpired(now);
    }
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (attempt.count >= maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  private static cleanupExpired(now: number) {
    for (const [key, attempt] of this.attempts.entries()) {
      if (now > attempt.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
  
  static getIdentifier(req: NextRequest): string {
    // Try to get real IP from various headers
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    
    return cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  }
  
  static getRemainingAttempts(identifier: string, maxAttempts: number = 100): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - attempt.count);
  }
  
  static getResetTime(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt || Date.now() > attempt.resetTime) {
      return Date.now();
    }
    return attempt.resetTime;
  }
}

// Middleware for API routes
export function withRateLimit<T extends (...args: any[]) => any>(
  handler: T,
  maxAttempts?: number,
  windowMs?: number
): T {
  return (async (req: NextRequest, ...args: any[]) => {
    const identifier = RateLimiter.getIdentifier(req);
    const allowed = await RateLimiter.checkLimit(identifier, maxAttempts, windowMs);
    
    if (!allowed) {
      const resetTime = RateLimiter.getResetTime(identifier);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      
      return new Response(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': maxAttempts?.toString() || '100',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString()
        }
      });
    }
    
    const remaining = RateLimiter.getRemainingAttempts(identifier, maxAttempts);
    const response = await handler(req, ...args);
    
    // Add rate limit headers to successful responses
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', maxAttempts?.toString() || '100');
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', RateLimiter.getResetTime(identifier).toString());
    }
    
    return response;
  }) as T;
}