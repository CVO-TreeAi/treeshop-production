'use client';

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Conditional Convex client - only initialize if URL is provided
let convex: ConvexReactClient | null = null;

if (process.env.NEXT_PUBLIC_CONVEX_URL) {
  convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no Convex URL is provided, just return children without provider
  if (!convex) {
    console.warn('Convex not configured - running in frontend-only mode');
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}