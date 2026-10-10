"use client";

/**
 * Mounted once in the root layout, so the landing is recorded on whatever
 * page the visit starts on — most pages have no lead form to do it for them.
 * Renders nothing. See lib/attribution.ts.
 */

import { useEffect } from "react";
import { captureLanding } from "@/lib/attribution";

export function LandingCapture() {
  useEffect(captureLanding, []);
  return null;
}
