// FIREBASE DISABLED
// FIREBASE DISABLED
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  Timestamp,
  DocumentData,
  QueryConstraint
} // FIREBASE DISABLED

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface SiteSettings {
  id?: string;
  businessName: string;
  phone: string;
  email: string;
  address: string;
  serviceAreas: string[];
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  updatedAt: Date;
}

export interface Service {
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  priceUnit: 'per_acre' | 'per_day' | 'flat_rate';
  category: 'forestry_mulching' | 'stump_grinding' | 'land_clearing' | 'consultation';
  features: string[];
  faqs: { question: string; answer: string }[];
  gallery: string[];
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingProfile {
  id?: string;
  name: string;
  serviceId: string;
  region: string;
  pricingTiers: {
    name: string;
    minAcreage: number;
    maxAcreage?: number;
    baseRate: number;
    description: string;
  }[];
  modifiers: {
    terrainDifficulty: { flat: number; rolling: number; steep: number };
    accessDifficulty: { excellent: number; good: number; difficult: number };
    vegetationDensity: { light: number; medium: number; heavy: number };
    obstacles: { none: number; few: number; many: number };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  property: {
    address: string;
    zipCode: string;
    parcelId?: string;
  };
  projectDetails: {
    acreage: number;
    services: string[];
    urgency: 'immediate' | 'within_month' | 'within_3months' | 'planning';
    budget?: string;
    description?: string;
  };
  source: 'website' | 'referral' | 'social_media' | 'google_ads' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
  aiData?: {
    score: number;
    category: 'hot' | 'warm' | 'cold';
    factors: {
      budgetMatch: number;
      urgency: number;
      locationMatch: number;
      projectComplexity: number;
      communicationQuality: number;
    };
    reasoning: string;
    nextSteps: string[];
    lastScored: Date;
  };
  assignedTo?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Estimate {
  id?: string;
  leadId: string;
  serviceDetails: {
    serviceId: string;
    packageType: string;
    acreage: number;
    terrain: 'flat' | 'rolling' | 'steep';
    access: 'excellent' | 'good' | 'difficult';
    obstacles: string[];
    stumpRemoval: boolean;
  };
  pricing: {
    basePrice: number;
    modifiers: { name: string; amount: number }[];
    subtotal: number;
    tax: number;
    total: number;
  };
  timeline: {
    estimatedDays: number;
    startDate?: Date;
    completionDate?: Date;
  };
  assumptions: string[];
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  aiGenerated: boolean;
  confidence?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id?: string;
  estimateId: string;
  leadId: string;
  scheduledDate: Date;
  crew: {
    leadTechnician: string;
    assistants: string[];
    equipment: string[];
  };
  siteNotes: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  workLog: {
    startTime?: Date;
    endTime?: Date;
    hoursWorked?: number;
    notes: string;
    photos: string[];
  }[];
  completionPhotos: string[];
  customerSignature?: string;
  invoice?: {
    invoiceId: string;
    amount: number;
    status: 'pending' | 'sent' | 'paid' | 'overdue';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionMetric {
  id?: string;
  jobId: string;
  serviceType: string;
  acreageCompleted: number;
  hoursWorked: number;
  equipmentUsed: string[];
  terrainType: 'flat' | 'rolling' | 'steep';
  vegetationDensity: 'light' | 'medium' | 'heavy';
  obstaclesEncountered: string[];
  productivityRate: number; // acres per hour
  fuelConsumption?: number;
  issues: string[];
  weatherConditions: string;
  crewSize: number;
  createdAt: Date;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  publishDate?: Date;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// GENERIC CRUD OPERATIONS
// =============================================================================

export class DatabaseService {
  private useAdmin: boolean;

  constructor(useAdmin = false) {
    this.useAdmin = useAdmin;
  }

  private get database() {
    return this.useAdmin ? adminDb : db;
  }

  // CREATE
  async create<T extends DocumentData>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(collection(this.database, collectionName), docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  }

  // READ (single document)
  async read<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(this.database, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // READ (multiple documents with query)
  async query<T>(
    collectionName: string, 
    constraints: QueryConstraint[] = [],
    limit?: number
  ): Promise<T[]> {
    try {
      const queryConstraints = [...constraints];
      if (limit) queryConstraints.push(firestoreLimit(limit));
      
      const q = query(collection(this.database, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      throw error;
    }
  }

  // UPDATE
  async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(this.database, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: new Date()
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Error updating ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // DELETE
  async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(this.database, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  // BATCH OPERATIONS
  async getAll<T>(collectionName: string, orderByField?: string, limitCount?: number): Promise<T[]> {
    const constraints: QueryConstraint[] = [];
    if (orderByField) constraints.push(orderBy(orderByField, 'desc'));
    if (limitCount) constraints.push(firestoreLimit(limitCount));
    
    return this.query<T>(collectionName, constraints);
  }

  async findWhere<T>(
    collectionName: string, 
    field: string, 
    operator: any, 
    value: any,
    limitCount?: number
  ): Promise<T[]> {
    const constraints = [where(field, operator, value)];
    if (limitCount) constraints.push(firestoreLimit(limitCount));
    
    return this.query<T>(collectionName, constraints);
  }
}

// =============================================================================
// SPECIALIZED SERVICES
// =============================================================================

export class LeadService extends DatabaseService {
  private collectionName = 'leads';

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<Lead>(this.collectionName, leadData);
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return this.read<Lead>(this.collectionName, id);
  }

  async updateLeadAI(id: string, aiData: Lead['aiData']): Promise<void> {
    return this.update<Lead>(this.collectionName, id, { aiData });
  }

  async getLeadsByStatus(status: Lead['status']): Promise<Lead[]> {
    return this.findWhere<Lead>(this.collectionName, 'status', '==', status);
  }

  async getLeadsByCategory(category: 'hot' | 'warm' | 'cold'): Promise<Lead[]> {
    return this.findWhere<Lead>(this.collectionName, 'aiData.category', '==', category);
  }

  async getRecentLeads(limit = 50): Promise<Lead[]> {
    return this.getAll<Lead>(this.collectionName, 'createdAt', limit);
  }
}

export class EstimateService extends DatabaseService {
  private collectionName = 'estimates';

  async createEstimate(estimateData: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<Estimate>(this.collectionName, estimateData);
  }

  async getEstimatesByLead(leadId: string): Promise<Estimate[]> {
    return this.findWhere<Estimate>(this.collectionName, 'leadId', '==', leadId);
  }

  async updateEstimateStatus(id: string, status: Estimate['status']): Promise<void> {
    return this.update<Estimate>(this.collectionName, id, { status });
  }
}

export class ServiceService extends DatabaseService {
  private collectionName = 'services';

  async getAllActiveServices(): Promise<Service[]> {
    return this.findWhere<Service>(this.collectionName, 'isActive', '==', true);
  }

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await this.findWhere<Service>(this.collectionName, 'slug', '==', slug, 1);
    return services.length > 0 ? services[0] : null;
  }
}

export class JobService extends DatabaseService {
  private collectionName = 'jobs';

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<Job>(this.collectionName, jobData);
  }

  async getJobsByStatus(status: Job['status']): Promise<Job[]> {
    return this.findWhere<Job>(this.collectionName, 'status', '==', status);
  }

  async updateJobStatus(id: string, status: Job['status']): Promise<void> {
    return this.update<Job>(this.collectionName, id, { status });
  }

  async addWorkLog(id: string, logEntry: Job['workLog'][0]): Promise<void> {
    const job = await this.read<Job>(this.collectionName, id);
    if (job) {
      const updatedWorkLog = [...(job.workLog || []), logEntry];
      await this.update<Job>(this.collectionName, id, { workLog: updatedWorkLog });
    }
  }
}

export class BlogService extends DatabaseService {
  private collectionName = 'blogPosts';

  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create<BlogPost>(this.collectionName, postData);
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    const posts = await this.findWhere<BlogPost>(this.collectionName, 'published', '==', true);
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.findWhere<BlogPost>(this.collectionName, 'slug', '==', slug, 1);
    return posts.length > 0 ? posts[0] : null;
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    return this.findWhere<BlogPost>(this.collectionName, 'category', '==', category);
  }
}

// =============================================================================
// SINGLETON INSTANCES
// =============================================================================

export const leadService = new LeadService();
export const adminLeadService = new LeadService(true);
export const estimateService = new EstimateService();
export const serviceService = new ServiceService();
export const jobService = new JobService();
export const blogService = new BlogService();
export const database = new DatabaseService();
export const adminDatabase = new DatabaseService(true);