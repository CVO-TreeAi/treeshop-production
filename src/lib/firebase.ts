// Firebase configuration removed - switching to Convex-only backend
// This is a placeholder file to prevent import errors during migration

// Mock types for compatibility during migration
export interface MockAuth {
  currentUser: any;
  signOut: () => Promise<void>;
}

export interface MockFirestore {
  collection: (name: string) => any;
}

export interface MockStorage {
  ref: (path: string) => any;
}

// Mock implementations for compatibility
export const auth: MockAuth = {
  currentUser: null,
  signOut: async () => {
    console.warn('Firebase auth removed - implement Convex auth');
  }
};

export const db: MockFirestore = {
  collection: (name: string) => {
    console.warn('Firebase Firestore removed - use Convex database');
    return null;
  }
};

export const storage: MockStorage = {
  ref: (path: string) => {
    console.warn('Firebase Storage removed - implement file upload with Convex');
    return null;
  }
};

export const analytics = null;
export const ai = null;
export const aiModel = null;
