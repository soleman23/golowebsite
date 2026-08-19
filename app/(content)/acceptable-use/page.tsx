import type { Metadata } from "next";
import { acceptableUseDoc } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";
import { LegalPage } from "@/components/sections/legal/LegalPage";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "Rules for lawful, honest, and respectful use of the GoLo Service.",
  alternates: { canonical: "/acceptable-use" },
  ...(siteConfig.acceptableUsePublished
    ? {}
    : { robots: { index: false, follow: false } }),
};

export default function AcceptableUsePage() {
  return <LegalPage doc={acceptableUseDoc} />;
}
