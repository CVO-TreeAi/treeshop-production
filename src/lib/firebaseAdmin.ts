import { initializeApp, applicationDefault, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize Firebase Admin with proper error handling
let app;
let adminDb: any;
let adminAuth: any;
let initializationError: string | null = null;

try {
  if (getApps().length) {
    app = getApp();
    console.log('Using existing Firebase Admin app');
  } else if (privateKey && clientEmail && projectId) {
    // Production configuration with service account
    app = initializeApp({
      credential: cert({ 
        projectId, 
        clientEmail, 
        privateKey 
      }),
      projectId
    });
    console.log('Firebase Admin initialized with service account credentials');
  } else if (projectId) {
    // Try application default credentials (works in Google Cloud environments)
    try {
      app = initializeApp({
        credential: applicationDefault(),
        projectId
      });
      console.log('Firebase Admin initialized with application default credentials');
    } catch (adcError) {
      console.warn('Application default credentials failed, trying project-only initialization');
      // Last resort - project ID only (limited functionality)
      app = initializeApp({
        projectId
      });
      console.log('Firebase Admin initialized with project ID only');
    }
  } else {
    throw new Error('No Firebase Admin configuration found. Please set FIREBASE_ADMIN_PROJECT_ID at minimum.');
  }
  
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
  
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Firebase Admin initialization error:', errorMessage);
  initializationError = errorMessage;
  
  // Throw error instead of creating mock services for production
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Firebase Admin initialization failed: ${errorMessage}`);
  }
  
  // For development only - create limited mock services that throw errors
  console.warn('Creating mock Firebase services for development');
  adminDb = {
    collection: () => ({
      add: async () => { throw new Error('Firebase Admin not properly configured'); },
      get: async () => { throw new Error('Firebase Admin not properly configured'); },
      doc: () => ({
        get: async () => { throw new Error('Firebase Admin not properly configured'); },
        set: async () => { throw new Error('Firebase Admin not properly configured'); },
        update: async () => { throw new Error('Firebase Admin not properly configured'); },
        delete: async () => { throw new Error('Firebase Admin not properly configured'); }
      })
    }),
    doc: () => ({
      get: async () => { throw new Error('Firebase Admin not properly configured'); },
      set: async () => { throw new Error('Firebase Admin not properly configured'); },
      update: async () => { throw new Error('Firebase Admin not properly configured'); },
      delete: async () => { throw new Error('Firebase Admin not properly configured'); }
    })
  };
  
  adminAuth = {
    verifyIdToken: async () => { throw new Error('Firebase Admin not properly configured'); },
    getUser: async () => { throw new Error('Firebase Admin not properly configured'); },
    createCustomToken: async () => { throw new Error('Firebase Admin not properly configured'); }
  };
}

// Helper function to check if admin is properly initialized
export function isAdminInitialized(): boolean {
  return initializationError === null;
}

// Helper function to get initialization error
export function getAdminInitError(): string | null {
  return initializationError;
}

export { adminDb, adminAuth };
