import type { IconName } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/siteConfig";

export const notFoundContent = {
  kicker: "ERROR 404 · OUT OF BOUNDS",
  title: "That one's out of bounds.",
  accentTitle: "Take a drop and play on.",
  lead: "The page you were looking for isn't on this scorecard. Nothing lost but a stroke — here's where everyone else is playing.",
  destinations: [
    { icon: "star", name: "Features", desc: "Live scoring, auto bet math, one number per player at the end.", cta: "See the features", href: "/features" },
    { icon: "target", name: "Games", desc: "Skins, Nassau, Wolf, Bingo Bango Bongo and every side pot.", cta: "Browse all 8", href: "/games" },
    { icon: "card", name: "Blog", desc: "Bet math, group etiquette, and the rules nobody agrees on.", cta: "Read the latest", href: "/blog" },
    { icon: "chat", name: "FAQ", desc: "Handicaps, payouts, privacy, and what GoLo will never do.", cta: "Get answers", href: "/faq" },
  ] satisfies { icon: IconName; name: string; desc: string; cta: string; href: string }[],
} as const;

const deletionSubject = "GoLo account deletion request";
const deletionBody = `Hi GoLo,

Please help me delete the account associated with:

Email or phone:
GoLo handle (if known):
A recent course or playing partner for verification:

I understand shared rounds may remain in de-identified form for other participants.`;

export const deleteAccountContent = {
  kicker: "ACCOUNT & PRIVACY",
  title: "Delete your account",
  lead: "Use the in-app control when you can. If you are locked out, email us and a person will verify the account and handle the same request.",
  inAppSteps: [
    "Open GoLo and choose You.",
    "Open Account.",
    "Choose Delete Account and review the confirmation.",
    "Confirm the request. GoLo clears active systems within 30 days.",
  ],
  exportSteps: [
    `Email ${siteConfig.supportEmail} before deleting.`,
    "Ask for a portable copy of your account data.",
    "We will prepare your rounds, scores, and settlement history, then send instructions to the verified address.",
  ],
  deleted: [
    "Profile details, contact information, handicap, home club, and golf-association identifiers",
    "Profile photo and saved payment handle",
    "Push-notification devices and account memberships",
    "Solo rounds that no other player participated in",
  ],
  retained: [
    "Shared round history needed by the other participants, with your identity replaced or removed",
    "De-identified scoring, game-result, and settlement records tied to those shared rounds",
    "Information required for fraud prevention, dispute resolution, security, or legal compliance",
    "Residual encrypted or access-restricted backups for up to 90 days",
  ],
  timing: [
    { title: "Active systems", body: "Deletion is completed within 30 days unless law, fraud prevention, or a live dispute requires longer." },
    { title: "Backups", body: "Residual copies may remain for up to 90 days and are not restored to active use except for disaster recovery, security, or legal purposes." },
    { title: "Shared rounds", body: "Other players keep an accurate round history, but your account identifiers, contact details, photo, and payment handle are removed." },
  ],
  mailto: `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(deletionSubject)}&body=${encodeURIComponent(deletionBody)}`,
} as const;
