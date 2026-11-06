"use client";

/**
 * A page's polite status region, for one-off messages from client leaves
 * that sit far from it in the tree (a copy-link button's confirmation). The
 * page's provider supplies it; a leaf with no provider above it falls back
 * to a region of its own.
 */

import { createContext, useContext } from "react";

export const AnnounceContext = createContext<((message: string) => void) | null>(null);

export function useAnnounce(): ((message: string) => void) | null {
  return useContext(AnnounceContext);
}
