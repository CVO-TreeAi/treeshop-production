// Supabase configuration removed - switching to Convex-only backend
// This is a placeholder file to prevent import errors during migration

// Mock Supabase client interface for compatibility
interface MockSupabaseClient {
  from: (table: string) => MockSupabaseQuery;
  auth: {
    getUser: () => Promise<{ data: { user: null }, error: string }>;
    signOut: () => Promise<void>;
  };
}

interface MockSupabaseQuery {
  select: (columns?: string) => MockSupabaseQuery;
  insert: (data: any) => MockSupabaseQuery;
  update: (data: any) => MockSupabaseQuery;
  delete: () => MockSupabaseQuery;
  eq: (column: string, value: any) => MockSupabaseQuery;
  in: (column: string, values: any[]) => MockSupabaseQuery;
  gte: (column: string, value: any) => MockSupabaseQuery;
  order: (column: string, options?: any) => MockSupabaseQuery;
  single: () => Promise<{ data: null, error: string }>;
}

const createMockClient = (): MockSupabaseClient => ({
  from: (table: string) => createMockQuery(table),
  auth: {
    getUser: async () => ({ 
      data: { user: null }, 
      error: 'Supabase removed - use Convex auth' 
    }),
    signOut: async () => {
      console.warn('Supabase auth removed - implement Convex auth');
    }
  }
});

const createMockQuery = (table: string): MockSupabaseQuery => ({
  select: (columns?: string) => {
    console.warn(`Supabase query on table ${table} removed - use Convex queries`);
    return createMockQuery(table);
  },
  insert: (data: any) => {
    console.warn(`Supabase insert on table ${table} removed - use Convex mutations`);
    return createMockQuery(table);
  },
  update: (data: any) => {
    console.warn(`Supabase update on table ${table} removed - use Convex mutations`);
    return createMockQuery(table);
  },
  delete: () => {
    console.warn(`Supabase delete on table ${table} removed - use Convex mutations`);
    return createMockQuery(table);
  },
  eq: (column: string, value: any) => createMockQuery(table),
  in: (column: string, values: any[]) => createMockQuery(table),
  gte: (column: string, value: any) => createMockQuery(table),
  order: (column: string, options?: any) => createMockQuery(table),
  single: async () => ({ 
    data: null, 
    error: `Supabase query on table ${table} removed - use Convex queries` 
  })
});

// Mock client creators for compatibility
export const createClientComponentClient = () => {
  console.warn('Supabase client removed - use Convex client');
  return createMockClient();
};

export const createServerActionClient = async () => {
  console.warn('Supabase server client removed - use Convex server functions');
  return createMockClient();
};

export const createAdminClient = () => {
  console.warn('Supabase admin client removed - use Convex admin functions');
  return createMockClient();
};

// Database types for Tree Shop business
export interface TreeShopLead {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Contact Information
  name: string;
  email: string;
  phone: string;
  
  // Property Details
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  latitude?: number;
  longitude?: number;
  
  // Project Details
  acreage: number;
  vegetation_density: 'light' | 'moderate' | 'heavy' | 'very_heavy';
  slope_difficulty: 'flat' | 'slight' | 'moderate' | 'steep';
  access_difficulty: 'easy' | 'moderate' | 'difficult';
  timeline: 'asap' | 'within_month' | 'within_quarter' | 'flexible';
  budget_range: 'under_5k' | '5k_15k' | '15k_30k' | '30k_50k' | 'over_50k';
  
  // Services
  services_requested: string[];
  additional_notes?: string;
  
  // Lead Scoring and Status
  lead_score: number; // 0-100
  lead_temperature: 'hot' | 'warm' | 'cold';
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  
  // Assignment and Follow-up
  assigned_to?: string;
  next_follow_up?: string;
  
  // Source tracking
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
  
  // Attachments
  photo_urls: string[];
  
  // Integration flags
  firebase_synced: boolean;
  firebase_lead_id?: string;
}

export interface TreeShopProposal {
  id: string;
  lead_id: string;
  created_at: string;
  updated_at: string;
  
  // Proposal Details
  proposal_number: string;
  title: string;
  description: string;
  
  // Pricing
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  deposit_amount: number;
  
  // Line Items
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  
  // Timeline
  estimated_start_date?: string;
  estimated_completion_date?: string;
  valid_until: string;
  
  // Status
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  
  // PDF and sharing
  pdf_url?: string;
  public_url?: string;
  
  // Integration
  firebase_synced: boolean;
  firebase_proposal_id?: string;
}

export interface TreeShopUser {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Profile
  email: string;
  name: string;
  role: 'admin' | 'sales' | 'crew_leader' | 'crew_member';
  
  // Permissions
  can_view_leads: boolean;
  can_edit_leads: boolean;
  can_create_proposals: boolean;
  can_access_admin: boolean;
  
  // Contact
  phone?: string;
  
  // Status
  active: boolean;
  last_login_at?: string;
  
  // Firebase sync
  firebase_uid?: string;
  firebase_synced: boolean;
}

export interface TreeShopProject {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Project basics
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  
  // Relationships
  lead_id?: string;
  proposal_id?: string;
  assigned_crew: string[];
  
  // Location
  property_address: string;
  latitude?: number;
  longitude?: number;
  
  // Timeline
  scheduled_start_date?: string;
  actual_start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  
  // Documentation
  before_photos: string[];
  progress_photos: string[];
  after_photos: string[];
  
  // Equipment and resources
  equipment_used: string[];
  crew_hours: number;
  materials_used?: any;
  
  // Financial
  project_value: number;
  actual_cost?: number;
  profit_margin?: number;
  
  // Integration
  firebase_synced: boolean;
  firebase_project_id?: string;
}

// Database utilities removed - these will be replaced with Convex functions
// The TypeScript interfaces above are preserved for Convex schema migration

export default class TreeShopDatabase {
  constructor(client: any) {
    console.warn('TreeShopDatabase removed - use Convex queries and mutations instead');
  }
}