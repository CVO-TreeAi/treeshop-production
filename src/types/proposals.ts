// Proposal System Types based on FP-001 specification

export interface SiteSettings {
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    licenseNumber?: string;
  };
  branding: {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  marketing: {
    tagline: string;
    description: string;
    socialProof: string[];
  };
  pdfStyles: {
    format: 'letter' | 'a4';
    margins: { top: number; right: number; bottom: number; left: number };
    typeScale: {
      h1: number;
      h2: number;
      h3: number;
      body: number;
      small: number;
    };
    accentColor: string;
    fonts: {
      primary: string;
      secondary: string;
    };
  };
  flags: {
    enableDeposits: boolean;
    requireSignature: boolean;
    defaultTTL: number; // days
  };
}

export interface PricingPackage {
  id: string;
  label: string;
  dbh: string; // diameter at breast height description
  pricePerAcre: number;
  description: string;
  isDefault: boolean;
  inclusions: string[];
  exclusions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
  unit: 'per_acre' | 'per_hour' | 'flat_rate' | 'per_tree' | 'per_stump';
  category: 'clearing' | 'mulching' | 'removal' | 'grinding' | 'grading' | 'other';
  inclusions: string[];
  exclusions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LegalTerms {
  id: string;
  title: string;
  bodyRich: string; // HTML content
  shortDisclosure: string;
  disclaimers: string[];
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalTemplateBlock {
  id: string;
  type: 'header' | 'about' | 'services' | 'pricing' | 'terms' | 'signature' | 'custom';
  title: string;
  content: Record<string, unknown>; // flexible content structure
  order: number;
  isRequired: boolean;
  isVisible: boolean;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  version: number;
  blocks: Record<string, ProposalTemplateBlock>;
  history: {
    version: number;
    blocks: Record<string, ProposalTemplateBlock>;
    pdfStyles: SiteSettings['pdfStyles'];
    createdAt: string;
    createdBy: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProposalInputs {
  acreage: number;
  packageId: string;
  selectedServices: string[];
  obstacles: string[];
  address: string;
  customServices?: {
    name: string;
    description: string;
    quantity: number;
    rate: number;
  }[];
  notes?: string;
}

export interface ProposalCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ProposalComputed {
  subtotal: number;
  tax: number;
  total: number;
  depositAmount: number;
  balance: number;
  pricePerAcre: number;
  packageDbh: string;
  breakdown: {
    serviceId: string;
    serviceName: string;
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
}

export interface ProposalTokens {
  approveTokenHash?: string;
  expiresAt?: string;
  isUsed?: boolean;
}

export interface ProposalAssets {
  pdfPath: string;
  pdfVersion: number;
  webUrl: string;
  signedPdfUrl?: string;
}

export interface ProposalAttribution {
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  firstTouchTs?: number;
  lastTouchTs?: number;
  touchpoints?: number;
  referrer?: string;
  landingPage?: string;
  savedAt?: number;
}

export interface ProposalPlace {
  placeId?: string | null;
  lat?: number | null;
  lng?: number | null;
  formattedAddress?: string;
  components?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
  };
  savedAt?: number;
}

export interface ProposalAudit {
  sentAt?: string;
  sentBy?: string;
  viewedAt?: string;
  acceptedAt?: string;
  acceptedByName?: string;
  acceptedBySignature?: string;
  paidAt?: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentAmount?: number;
  ip?: string;
  userAgent?: string;
}

export interface ProposalSnapshotRef {
  templateId: string;
  version: number;
  siteSettingsSnapshot: SiteSettings;
  servicesSnapshot: Record<string, Service>;
  packagesSnapshot: Record<string, PricingPackage>;
}

export interface Proposal {
  id: string;
  customer: ProposalCustomer;
  inputs: ProposalInputs;
  computed: ProposalComputed;
  snapshotRef: ProposalSnapshotRef;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'expired' | 'cancelled';
  tokens: ProposalTokens;
  assets: ProposalAssets;
  audit: ProposalAudit;
  attribution?: ProposalAttribution;
  place?: ProposalPlace;
  leadRef?: string; // reference to lead if created from lead
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type ProposalEventType = 
  // Core proposal events
  | 'CREATED' | 'UPDATED' | 'SENT' | 'OPENED' | 'VIEWED' 
  | 'ACCEPTED' | 'REJECTED' | 'PAID' | 'EXPIRED' | 'CANCELLED'
  
  // Payment events
  | 'PAYMENT_FAILED' | 'PAYMENT_EXPIRED' | 'PAYMENT_CANCELLED' 
  | 'PAYMENT_ACTION_REQUIRED' | 'PAYMENT_REFUNDED' | 'PAYMENT_DISPUTED'
  
  // Charge events
  | 'CHARGE_SUCCEEDED' | 'CHARGE_FAILED'
  
  // Dispute events
  | 'DISPUTE_UPDATED' | 'DISPUTE_CLOSED'
  
  // Refund events
  | 'REFUND_CREATED' | 'REFUND_UPDATED' | 'REFUND_FAILED'
  
  // Customer events
  | 'CUSTOMER_CREATED' | 'CUSTOMER_UPDATED' | 'CUSTOMER_DELETED'
  | 'PAYMENT_METHOD_ATTACHED'
  
  // System events
  | 'BALANCE_UPDATED' | 'PAYOUT_CREATED' | 'PAYOUT_FAILED' | 'PAYOUT_PAID'
  | 'FRAUD_WARNING' | 'UNHANDLED_EVENT' | 'WEBHOOK_ERROR';

export interface ProposalEvent {
  id: string;
  proposalId: string;
  type: ProposalEventType;
  timestamp: string;
  metadata: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    emailId?: string;
    amount?: number;
    [key: string]: unknown;
  };
}

export interface GoogleEvent {
  id: string;
  proposalId?: string;
  type: 'ADS_OCI' | 'GBP_POST' | 'SITEMAP_PING' | 'GA4_EVENT';
  payload: Record<string, any>;
  ts: number;
  success?: boolean;
  error?: string;
  retryCount?: number;
}

// API Request/Response types
export interface GenerateProposalRequest {
  templateId: string;
  customer: ProposalCustomer;
  inputs: ProposalInputs;
  leadId?: string;
}

export interface GenerateProposalResponse {
  proposalId: string;
  version: number;
  pdfSignedUrl: string;
  snapshot: {
    templateId: string;
    version: number;
  };
}

export interface SendProposalRequest {
  proposalId: string;
}

export interface SendProposalResponse {
  emailId: string;
  approveUrl: string;
}

export interface AcceptProposalRequest {
  proposalId: string;
  token: string;
  fullName: string;
  signature?: string;
  consent: boolean;
}

export interface AcceptProposalResponse {
  status: 'accepted';
  depositRequired: boolean;
  depositAmount?: number;
  paymentUrl?: string;
}

// JWT Token Claims
export interface ApproveTokenClaims {
  pid: string; // proposal ID
  v: number;   // version
  exp: number; // expiration
  jti: string; // unique ID for single-use
}