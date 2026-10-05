import type { Metadata } from "next";
import { acceptableUseDoc } from "@/lib/content";
import { pageMetadata } from "@/lib/pageMetadata";
import { siteConfig } from "@/lib/siteConfig";
import { LegalPage } from "@/components/sections/legal/LegalPage";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/acceptable-use",
    title: "Acceptable Use Policy",
    description:
      "Rules for lawful, honest, and respectful use of the GoLo Service.",
  }),
  ...(siteConfig.acceptableUsePublished
    ? {}
    : { robots: { index: false, follow: false } }),
};

export default function AcceptableUsePage() {
  return <LegalPage doc={acceptableUseDoc} />;
}
