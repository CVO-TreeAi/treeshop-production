// Convex hooks that gracefully handle frontend-only mode
import { useQuery } from "convex/react";

export function useSafeQuery(query: any, args?: any) {
  try {
    return useQuery(query, args);
  } catch (error) {
    // If Convex is not configured, return null instead of throwing
    console.warn('Convex query failed - running in frontend-only mode:', error);
    return null;
  }
}

export function useSafeMutation(mutation: any) {
  try {
    return useMutation(mutation);
  } catch (error) {
    // If Convex is not configured, return a no-op function
    console.warn('Convex mutation failed - running in frontend-only mode:', error);
    return () => Promise.resolve(null);
  }
}

// Import useMutation if needed
import { useMutation } from "convex/react";