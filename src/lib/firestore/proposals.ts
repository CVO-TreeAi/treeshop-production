// import { 
//   collection, 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc, 
//   deleteDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   writeBatch,
//   serverTimestamp,
//   type DocumentReference,
//   type CollectionReference
// } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
import type {
  Proposal,
  ProposalTemplate,
  PricingPackage,
  Service,
  LegalTerms,
  SiteSettings,
  ProposalEvent
} from '@/types/proposals';

// Collection references
export const siteSettingsRef = doc(db, 'siteSettings', 'default');
export const proposalTemplatesRef = collection(db, 'proposalTemplates') as CollectionReference<ProposalTemplate>;
export const pricingPackagesRef = collection(db, 'pricingPackages') as CollectionReference<PricingPackage>;
export const servicesRef = collection(db, 'services') as CollectionReference<Service>;
export const legalTermsRef = collection(db, 'legalTerms') as CollectionReference<LegalTerms>;
export const proposalsRef = collection(db, 'proposals') as CollectionReference<Proposal>;
export const proposalEventsRef = collection(db, 'proposalEvents') as CollectionReference<ProposalEvent>;

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const doc = await getDoc(siteSettingsRef);
    return doc.exists() ? doc.data() as SiteSettings : null;
  } catch (error) {
    console.error('Error getting site settings:', error);
    return null;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  await updateDoc(siteSettingsRef, {
    ...settings,
    updatedAt: serverTimestamp()
  });
}

// Proposal Templates
export async function getActiveProposalTemplate(): Promise<ProposalTemplate | null> {
  try {
    const q = query(
      proposalTemplatesRef,
      where('status', '==', 'active'),
      orderBy('version', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  } catch (error) {
    console.error('Error getting active proposal template:', error);
    return null;
  }
}

export async function getProposalTemplate(id: string): Promise<ProposalTemplate | null> {
  try {
    const docRef = doc(proposalTemplatesRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting proposal template:', error);
    return null;
  }
}

export async function createProposalTemplate(template: Omit<ProposalTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = doc(proposalTemplatesRef);
  const now = new Date().toISOString();
  
  const templateData: ProposalTemplate = {
    ...template,
    id: docRef.id,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(docRef, templateData);
  return docRef.id;
}

export async function publishProposalTemplate(templateId: string): Promise<void> {
  const batch = writeBatch(db);

  // First, set all active templates to archived
  const activeTemplates = await getDocs(
    query(proposalTemplatesRef, where('status', '==', 'active'))
  );
  
  activeTemplates.docs.forEach(doc => {
    batch.update(doc.ref, { status: 'archived', updatedAt: serverTimestamp() });
  });

  // Then activate the new template
  const templateRef = doc(proposalTemplatesRef, templateId);
  batch.update(templateRef, { 
    status: 'active', 
    updatedAt: serverTimestamp() 
  });

  await batch.commit();
}

// Pricing Packages
export async function getPricingPackages(): Promise<PricingPackage[]> {
  try {
    const q = query(pricingPackagesRef, orderBy('pricePerAcre', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting pricing packages:', error);
    return [];
  }
}

export async function getPricingPackage(id: string): Promise<PricingPackage | null> {
  try {
    const docRef = doc(pricingPackagesRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting pricing package:', error);
    return null;
  }
}

export async function createPricingPackage(pkg: Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = doc(pricingPackagesRef);
  const now = new Date().toISOString();
  
  const packageData: PricingPackage = {
    ...pkg,
    id: docRef.id,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(docRef, packageData);
  return docRef.id;
}

// Services
export async function getServices(): Promise<Service[]> {
  try {
    const q = query(servicesRef, where('isActive', '==', true), orderBy('category'), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const docRef = doc(servicesRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting service:', error);
    return null;
  }
}

export async function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = doc(servicesRef);
  const now = new Date().toISOString();
  
  const serviceData: Service = {
    ...service,
    id: docRef.id,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(docRef, serviceData);
  return docRef.id;
}

// Proposals
export async function getProposal(id: string): Promise<Proposal | null> {
  try {
    const docRef = doc(proposalsRef, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting proposal:', error);
    return null;
  }
}

export async function createProposal(proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = doc(proposalsRef);
  const now = new Date().toISOString();
  
  const proposalData: Proposal = {
    ...proposal,
    id: docRef.id,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(docRef, proposalData);
  return docRef.id;
}

export async function updateProposal(id: string, updates: Partial<Proposal>): Promise<void> {
  const docRef = doc(proposalsRef, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function getProposalsByStatus(status: Proposal['status']): Promise<Proposal[]> {
  try {
    const q = query(
      proposalsRef,
      where('status', '==', status),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting proposals by status:', error);
    return [];
  }
}

export async function getAllProposals(limitCount = 50): Promise<Proposal[]> {
  try {
    const q = query(
      proposalsRef,
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting all proposals:', error);
    return [];
  }
}

// Proposal Events
export async function createProposalEvent(event: Omit<ProposalEvent, 'id'>): Promise<string> {
  const docRef = doc(proposalEventsRef);
  const eventData: ProposalEvent = {
    ...event,
    id: docRef.id
  };

  await setDoc(docRef, eventData);
  return docRef.id;
}

export async function getProposalEvents(proposalId: string): Promise<ProposalEvent[]> {
  try {
    const q = query(
      proposalEventsRef,
      where('proposalId', '==', proposalId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting proposal events:', error);
    return [];
  }
}

// Utility function to create immutable snapshot for proposals
export async function createProposalSnapshot(templateId: string) {
  const [template, siteSettings, services, packages] = await Promise.all([
    getProposalTemplate(templateId),
    getSiteSettings(),
    getServices(),
    getPricingPackages()
  ]);

  if (!template || !siteSettings) {
    throw new Error('Required template or site settings not found');
  }

  const servicesSnapshot = services.reduce((acc, service) => {
    acc[service.id] = service;
    return acc;
  }, {} as Record<string, Service>);

  const packagesSnapshot = packages.reduce((acc, pkg) => {
    acc[pkg.id] = pkg;
    return acc;
  }, {} as Record<string, PricingPackage>);

  return {
    templateId: template.id,
    version: template.version,
    siteSettingsSnapshot: siteSettings,
    servicesSnapshot,
    packagesSnapshot
  };
}