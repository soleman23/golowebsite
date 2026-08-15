import type { Metadata } from "next";
import { privacyDoc } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { LegalPage } from "@/components/sections/legal/LegalPage";

/**
 * The policy text itself lives in lib/content/legal.ts — it was migrated out
 * of this file mechanically and diffed, so the words are unchanged. This page
 * is now just the route.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacyDoc} />;
}
