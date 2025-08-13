import { createHash, randomUUID } from 'crypto';
import type { ApproveTokenClaims } from '@/types/proposals';

// JWT implementation using Web Crypto API for edge runtime compatibility
export class ProposalTokenManager {
  private static readonly SECRET_KEY = process.env.PROPOSAL_JWT_SECRET || 'your-secret-key-change-in-production';
  private static readonly DEFAULT_TTL_DAYS = 14;

  // Create approval token
  static async createApproveToken(proposalId: string, version: number, ttlDays = this.DEFAULT_TTL_DAYS): Promise<{
    token: string;
    jti: string;
    expiresAt: Date;
  }> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);
    const jti = randomUUID();

    const claims: ApproveTokenClaims = {
      pid: proposalId,
      v: version,
      exp: Math.floor(expiresAt.getTime() / 1000),
      jti
    };

    const token = await this.signJWT(claims);
    
    return {
      token,
      jti,
      expiresAt
    };
  }

  // Verify and decode approval token
  static async verifyApproveToken(token: string): Promise<ApproveTokenClaims | null> {
    try {
      const claims = await this.verifyJWT<ApproveTokenClaims>(token);
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (claims.exp < now) {
        console.warn('Token expired');
        return null;
      }

      return claims;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Create token hash for storage (to enable single-use tokens)
  static hashTokenId(jti: string): string {
    return createHash('sha256').update(jti).digest('hex');
  }

  // Simple JWT implementation using HMAC-SHA256
  private static async signJWT(payload: unknown): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = await this.hmacSign(data, this.SECRET_KEY);
    const encodedSignature = this.base64UrlEncode(signature);

    return `${data}.${encodedSignature}`;
  }

  private static async verifyJWT<T>(token: string): Promise<T> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    
    // Verify signature
    const expectedSignature = await this.hmacSign(data, this.SECRET_KEY);
    const expectedEncodedSignature = this.base64UrlEncode(expectedSignature);
    
    if (encodedSignature !== expectedEncodedSignature) {
      throw new Error('Invalid signature');
    }

    // Decode payload
    const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
    return payload as T;
  }

  private static async hmacSign(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
    return Array.from(new Uint8Array(signature))
      .map(b => String.fromCharCode(b))
      .join('');
  }

  private static base64UrlEncode(str: string): string {
    const base64 = btoa(str);
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private static base64UrlDecode(str: string): string {
    let base64 = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    while (base64.length % 4) {
      base64 += '=';
    }
    
    return atob(base64);
  }
}

// Helper function to check if token is used (check against Firestore)
export async function isTokenUsed(proposalId: string, jti: string): Promise<boolean> {
  try {
    const { getProposal } = await import('@/lib/firestore/proposals');
    const proposal = await getProposal(proposalId);
    
    if (!proposal || !proposal.tokens.approveTokenHash) {
      return true; // Treat missing proposal or token as used
    }

    const tokenHash = ProposalTokenManager.hashTokenId(jti);
    return proposal.tokens.approveTokenHash !== tokenHash || proposal.tokens.isUsed === true;
  } catch (error) {
    console.error('Error checking token usage:', error);
    return true; // Fail safe - treat as used if we can't verify
  }
}

// Helper function to mark token as used
export async function markTokenAsUsed(proposalId: string): Promise<void> {
  try {
    const { updateProposal } = await import('@/lib/firestore/proposals');
    await updateProposal(proposalId, {
      tokens: {
        isUsed: true
      }
    });
  } catch (error) {
    console.error('Error marking token as used:', error);
    throw error;
  }
}