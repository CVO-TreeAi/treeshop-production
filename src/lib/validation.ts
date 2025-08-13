import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number');
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods');

// Lead capture validation
export const leadSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string()
    .min(5, 'Please enter a complete address')
    .max(200, 'Address must be less than 200 characters'),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA'),
  source: z.string().optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
});

// Estimate request validation
export const estimateSchema = z.object({
  address: z.string()
    .min(5, 'Please enter a complete address')
    .max(200, 'Address must be less than 200 characters'),
  acreage: z.number()
    .min(0.1, 'Minimum acreage is 0.1')
    .max(1000, 'Maximum acreage is 1000'),
  obstacles: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  urgency: z.enum(['low', 'medium', 'high']).optional(),
  preferredContact: z.enum(['email', 'phone']).optional(),
});

// Proposal customer validation
export const proposalCustomerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string()
    .min(5, 'Please enter a complete address')
    .max(200, 'Address must be less than 200 characters')
    .optional(),
});

// Proposal inputs validation
export const proposalInputsSchema = z.object({
  acreage: z.number().min(0.1).max(1000),
  packageId: z.string().min(1, 'Package ID is required'),
  selectedServices: z.array(z.string()),
  obstacles: z.array(z.string()),
  address: z.string().min(5).max(200),
  customServices: z.array(z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500),
    quantity: z.number().min(1).max(1000),
    rate: z.number().min(0).max(100000),
  })).optional(),
  notes: z.string().max(1000).optional(),
});

// Proposal acceptance validation
export const acceptProposalSchema = z.object({
  proposalId: z.string().min(1, 'Proposal ID is required'),
  token: z.string().min(1, 'Token is required'),
  fullName: nameSchema,
  signature: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'You must consent to proceed'),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

// Admin authentication validation
export const adminAuthSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'File must be a JPEG, PNG, WebP image or PDF'
    ),
  purpose: z.enum(['proposal', 'estimate', 'profile']).optional(),
});

// Generic validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message);
    }
    throw error;
  }
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .substring(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d\+\-\(\)\s]/g, '').trim();
}

// Input validation middleware for API routes
export function withValidation<T extends z.ZodSchema>(
  schema: T,
  handler: (validatedData: z.infer<T>, ...args: any[]) => any
) {
  return async (req: Request, ...args: any[]) => {
    try {
      const body = await req.json();
      const validatedData = validateRequest(schema, body);
      return handler(validatedData, req, ...args);
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Validation Error',
        message: error instanceof Error ? error.message : 'Invalid request data',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

// Security validation helpers
export function validateRecaptcha(token: string): boolean {
  // This would integrate with Google reCAPTCHA API
  // For now, just check that token exists
  return typeof token === 'string' && token.length > 10;
}

export function validateCSRFToken(token: string, expected: string): boolean {
  // Simple constant-time comparison
  if (token.length !== expected.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  
  return result === 0;
}

// SQL injection prevention
export function escapeSqlString(input: string): string {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

// XSS prevention
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}