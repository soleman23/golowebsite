import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.kicker}>LEGAL</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: July 16, 2026</p>

        <div className={styles.prose}>
          <p>
            GoLo Golf LLC (&ldquo;GoLo,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
            or &ldquo;our&rdquo;) provides the GoLo Golf mobile application, web
            application, website, and related services (collectively, the
            &ldquo;Service&rdquo;). GoLo helps golfers organize rounds, enter and
            share scores, track side games and agreed dollar stakes, calculate who
            owes whom, and record whether participants mark a settlement as sent or
            received.
          </p>
          <p>
            GoLo does <strong>not</strong> accept deposits, hold funds, transfer
            money, charge payment cards, provide a wallet, set betting odds, take a
            percentage of a wager, or verify that an off-platform payment occurred.
            Any settlement takes place directly between the participants outside
            GoLo.
          </p>
          <p>
            This Privacy Policy explains what information we collect, how we use and
            disclose it, how long we retain it, and the choices available to you.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Information you provide</h3>
          <p>
            We may collect the following information when you create an account, set
            up your profile, use the Service, or contact us:
          </p>
          <ul>
            <li>
              <strong>Account and contact information:</strong> email address,
              password or authentication credentials, phone number, account
              identifier, and authentication status. Passwords are processed through
              our authentication provider and are not visible to GoLo in readable
              form.
            </li>
            <li>
              <strong>Profile information:</strong> name, nickname or handle, profile
              photo, home golf club, handicap index, notification preferences, and
              saved game preferences.
            </li>
            <li>
              <strong>Golf association information:</strong> if you choose to connect
              an authorized golf-association service, information such as your GHIN
              number, handicap index, connection status, authorization tokens,
              synchronization dates, and eligible scores submitted at your direction.
            </li>
            <li>
              <strong>Round and scoring information:</strong> courses, tees, dates,
              formats, players, teams, handicaps, hole-by-hole scores, pars, stroke
              indexes, side-game selections, game events, invitations, leaderboards,
              round history, and shared round summaries.
            </li>
            <li>
              <strong>Side-game and settlement information:</strong> game rules,
              agreed dollar stakes, participant acceptance or rejection of game terms,
              calculated winnings and losses, who owes whom, settlement amounts,
              payment handles such as a Venmo username, payment-request status, and
              participant-entered sent or received confirmations and timestamps.
            </li>
            <li>
              <strong>Participant information entered by another user:</strong> a
              round organizer may enter another participant&rsquo;s name, email
              address, phone number, handicap, or payment handle to organize a round
              and match that participant to an account. Users should provide another
              person&rsquo;s information only when they have permission to do so.
            </li>
            <li>
              <strong>Communications:</strong> information included in support
              requests, emails, feedback, or other messages sent to us.
            </li>
            <li>
              <strong>Website download-link requests:</strong> the phone number you
              enter when you ask us to text you an app download link, together with
              delivery status and related technical records.
            </li>
          </ul>

          <h3>Location and course-search information</h3>
          <p>
            If you choose <strong>Nearby Courses</strong>, GoLo may request access to
            your device location and collect precise or approximate latitude and
            longitude to identify your city or region and find nearby golf courses.
            GoLo does not need location access for manual course search, and we do not
            use location for background tracking.
          </p>
          <p>
            The current app may cache location coordinates and the resulting city or
            state on your device for up to 24 hours. Coordinates or location search
            terms may be sent through GoLo&rsquo;s server provider to a geocoding
            service and course-data provider to return nearby results. Those providers
            may receive the coordinates, city or state, search query, IP address, and
            routine request metadata under their own privacy terms.
          </p>

          <h3>Device, usage, and diagnostic information</h3>
          <p>We and our service providers may automatically collect:</p>
          <ul>
            <li>
              IP address, device type, operating system, browser type, app version,
              language, and time zone;
            </li>
            <li>
              session, account, installation, and push-notification tokens or
              identifiers;
            </li>
            <li>
              app interactions, feature usage, notification delivery and interaction
              information, referring pages, and approximate timestamps;
            </li>
            <li>
              crash reports, error messages, performance information, server logs, and
              other diagnostic data; and
            </li>
            <li>
              information stored through cookies, browser storage, app storage, or
              similar technologies needed to keep you signed in, restore an active
              round, remember settings, cache course or location results, and prevent
              duplicate notifications.
            </li>
          </ul>
          <p>
            We do not use this information to track you across unaffiliated
            companies&rsquo; apps or websites for targeted advertising.
          </p>

          <h3>Information from third parties</h3>
          <p>We may receive information from:</p>
          <ul>
            <li>
              other players who add you to a round or submit information about the
              round;
            </li>
            <li>
              authentication, hosting, storage, notification, analytics,
              crash-reporting, email, and text-message providers;
            </li>
            <li>
              golf-course databases, geocoding services, and authorized
              golf-association services; and
            </li>
            <li>
              app stores and operating-system providers, such as Apple, when they
              provide installation, subscription, crash, or notification information.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
