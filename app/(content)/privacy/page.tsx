import type { Metadata } from "next";
import { siteConfig } from "@/lib/siteConfig";
import styles from "../content.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

const CONTACT_EMAIL = "info@golo.golf";

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

          {/* ---------------- 1 ---------------- */}
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

          {/* ---------------- 2 ---------------- */}
          <h2>2. How We Use Information</h2>
          <p>We use information to:</p>
          <ul>
            <li>create, secure, and manage accounts;</li>
            <li>identify players across rounds and devices;</li>
            <li>organize rounds and match players to invitations;</li>
            <li>
              calculate scores, handicaps, leaderboards, side-game results, and
              settlements;
            </li>
            <li>
              record participant acceptance of side-game terms and participant-entered
              payment statuses;
            </li>
            <li>
              synchronize live rounds, scores, events, and history across authorized
              devices;
            </li>
            <li>
              provide nearby-course search, course details, tees, ratings, slopes,
              pars, and stroke indexes;
            </li>
            <li>
              send account, live-scoring, agreement, settlement, support, and other
              requested notifications;
            </li>
            <li>
              send a download link or respond to a support request you initiated;
            </li>
            <li>
              provide optional golf-association connections and submit an eligible
              score only when you direct us to do so;
            </li>
            <li>personalize settings and restore unfinished activity;</li>
            <li>
              analyze performance, troubleshoot problems, prevent fraud or misuse, and
              improve the Service;
            </li>
            <li>
              enforce our agreements and protect GoLo, our users, and others; and
            </li>
            <li>comply with legal obligations and respond to lawful requests.</li>
          </ul>

          {/* ---------------- 3 ---------------- */}
          <h2>3. Side Games, Dollar Stakes, and Payments</h2>
          <p>
            GoLo is a scorekeeping and recordkeeping tool. Users may enter private
            side-game terms and dollar stakes, and GoLo may calculate a suggested
            settlement and record participant-entered sent or received statuses.
          </p>
          <p>GoLo does not:</p>
          <ul>
            <li>accept, store, custody, or transfer money;</li>
            <li>
              process debit cards, credit cards, bank accounts, or payment
              credentials;
            </li>
            <li>sell wagering credits or virtual currency;</li>
            <li>set odds, match bettors, take a rake, or award prizes; or</li>
            <li>guarantee, verify, collect, or enforce any payment.</li>
          </ul>
          <p>
            Payment handles are displayed or copied only to help participants settle
            directly using a service they choose. A &ldquo;sent,&rdquo;
            &ldquo;received,&rdquo; or &ldquo;settled&rdquo; status reflects
            information entered by users and is not independent confirmation from a
            bank or payment service.
          </p>

          {/* ---------------- 4 ---------------- */}
          <h2>4. When We Disclose Information</h2>

          <h3>Other round participants</h3>
          <p>
            People participating in or invited to a round may see information needed
            for the shared experience, including your display name, profile photo,
            handicap, team, scores, game selections, agreed stakes, acceptance status,
            calculated results, settlement amount, and participant-entered sent or
            received status.
          </p>
          <p>
            GoLo is not intended to expose your account email address, phone number,
            authentication credentials, or private golf-association tokens to other
            players. A payment handle may be displayed to relevant settlement
            participants when you choose to add one.
          </p>

          <h3>Service providers</h3>
          <p>
            We disclose information to vendors that perform services for us, such as:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong>, for authentication, database hosting, file
              storage, real-time synchronization, and server functions;
            </li>
            <li>
              <strong>Apple and operating-system providers</strong>, for app
              distribution, device permissions, and native push notifications;
            </li>
            <li>
              <strong>Netlify or other hosting providers</strong>, for website or
              web-app hosting and delivery;
            </li>
            <li>
              <strong>
                OpenStreetMap&rsquo;s Nominatim service or another geocoding provider
              </strong>
              , for converting a location or search term into a city, region, or
              coordinates;
            </li>
            <li>
              <strong>golf-course and golf-association data providers</strong>,
              including authorized USGA/GHIN services when enabled, for course, tee,
              rating, handicap, and score-posting functions;
            </li>
            <li>
              <strong>email, text-message, and push-delivery providers</strong>, for
              messages requested by you or needed to operate the Service; and
            </li>
            <li>
              <strong>analytics, logging, and crash-reporting providers</strong>, for
              performance measurement, diagnostics, security, and troubleshooting.
            </li>
          </ul>
          <p>
            These providers may process information only for the services they provide
            to GoLo or as otherwise permitted by their own terms and applicable law.
          </p>

          <h3>Legal, safety, and business disclosures</h3>
          <p>
            We may disclose information when reasonably necessary to comply with law,
            legal process, or government requests; investigate fraud, security issues,
            or violations; protect rights, safety, or property; or complete a merger,
            financing, acquisition, reorganization, or sale of assets. If ownership
            changes, the recipient may continue to use information as described in
            this policy unless you are notified otherwise.
          </p>

          {/* ---------------- 5 ---------------- */}
          <h2>5. Selling, Sharing, and Advertising</h2>
          <p>
            GoLo does not sell personal information. GoLo does not share personal
            information for cross-context behavioral advertising and does not use
            personal information to track you across unaffiliated apps or websites for
            targeted advertising.
          </p>
          <p>
            If these practices change, we will update this policy and provide any
            notice, consent, or opt-out required by law before beginning the new
            practice.
          </p>

          {/* ---------------- 6 ---------------- */}
          <h2>6. Data Retention</h2>
          <p>
            We retain information only for as long as reasonably necessary for the
            purposes described in this policy:
          </p>
          <ul>
            <li>
              <strong>
                Account, profile, round, scoring, side-game, agreement, settlement, and
                notification records:
              </strong>{" "}
              generally until you delete the information or your account, subject to
              shared-round records and legal obligations described below.
            </li>
            <li>
              <strong>Precise device location:</strong> cached by the current app on
              the device for up to 24 hours. GoLo does not intentionally build a
              long-term precise-location history. Routine server or provider logs may
              retain request data for a limited period.
            </li>
            <li>
              <strong>Push tokens:</strong> while notifications are enabled or until
              the token is revoked, expires, or the account is deleted.
            </li>
            <li>
              <strong>Support, download-link, email, and text-message records:</strong>{" "}
              generally up to 24 months after the communication, unless a longer period
              is needed to resolve an issue or comply with law.
            </li>
            <li>
              <strong>Analytics, logs, and crash diagnostics:</strong> generally up to
              24 months, unless a shorter provider setting is available and
              appropriate.
            </li>
            <li>
              <strong>Backups:</strong> deleted information may remain in encrypted or
              access-restricted backups for up to 90 days before it is overwritten.
            </li>
          </ul>
          <p>
            We may retain information longer when reasonably necessary for security,
            fraud prevention, dispute resolution, enforcing agreements, or legal
            compliance. When full deletion would affect another user&rsquo;s
            legitimate round history, GoLo may retain a de-identified version of shared
            scoring or settlement records after removing your account identifiers,
            contact details, profile photo, payment handle, and golf-association
            information.
          </p>

          {/* ---------------- 7 ---------------- */}
          <h2>7. Your Choices and Privacy Rights</h2>
          <p>
            Depending on where you live and subject to applicable law, you may have the
            right to request access to, correction of, deletion of, or a portable copy
            of personal information, and to appeal a denied privacy request. You may
            also have the right to obtain information about the categories of personal
            information we collect and disclose.
          </p>
          <p>You can exercise many choices directly in the Service:</p>
          <ul>
            <li>update profile and payment-handle information;</li>
            <li>
              disable location access in device settings and use manual course search;
            </li>
            <li>
              change notification preferences or disable notifications in device
              settings;
            </li>
            <li>disconnect an optional golf-association connection;</li>
            <li>delete individual round-history items where available; and</li>
            <li>
              initiate account deletion under{" "}
              <strong>You &rarr; Account &rarr; Delete Account</strong>.
            </li>
          </ul>
          <p>
            If you cannot access your account, or to make another privacy request,
            email{" "}
            <strong>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </strong>
            . We may need to verify your identity before completing a request. We will
            not discriminate against you for exercising a privacy right.
          </p>

          {/* ---------------- 8 ---------------- */}
          <h2>8. Account Deletion</h2>
          <p>
            You may initiate deletion in the app under{" "}
            <strong>You &rarr; Account &rarr; Delete Account</strong>. You may also
            request deletion by emailing{" "}
            <strong>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </strong>{" "}
            if you cannot access the app.
          </p>
          <p>
            Unless a longer period is required by law or needed to prevent fraud or
            resolve a dispute, GoLo will complete deletion from active systems within
            30 days. Account deletion is intended to remove or de-identify:
          </p>
          <ul>
            <li>your authentication account and profile;</li>
            <li>
              contact information, profile photo, payment handle, and notification
              devices;
            </li>
            <li>
              private notification and agreement records associated only with your
              account;
            </li>
            <li>
              rounds you own, where deletion does not unlawfully impair another
              person&rsquo;s rights; and
            </li>
            <li>your personal identifiers contained in rounds created by other users.</li>
          </ul>
          <p>
            Shared scores, game results, or settlement totals may remain in
            de-identified form so other participants can retain an accurate round
            history. Residual copies may remain in backups for up to 90 days and will
            not be restored to active use except for disaster recovery, security, or
            legal purposes.
          </p>

          {/* ---------------- 9 ---------------- */}
          <h2>9. Security</h2>
          <p>
            We use administrative, technical, and organizational safeguards designed to
            protect information, including authenticated access, encrypted network
            connections, database access controls, and restricted server credentials.
            No system is completely secure, and we cannot guarantee that unauthorized
            access, loss, or misuse will never occur.
          </p>
          <p>
            You are responsible for protecting your password, device, invitation codes,
            and account access. Contact us promptly if you believe your account has
            been compromised.
          </p>

          {/* ---------------- 10 ---------------- */}
          <h2>10. Children&rsquo;s Privacy</h2>
          <p>
            The Service is not directed to children under 13, and GoLo does not
            knowingly collect personal information from a child under 13. Dollar-stakes
            and settlement features may be used only by people legally permitted to
            participate in that activity in their location.
          </p>
          <p>
            If you believe a child provided personal information to GoLo, contact{" "}
            <strong>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </strong>{" "}
            so we can investigate and delete it as required.
          </p>

          {/* ---------------- 11 ---------------- */}
          <h2>11. United States Service</h2>
          <p>
            GoLo is currently offered in the United States. Information may be stored
            and processed in the United States and in other locations where our service
            providers operate, subject to appropriate protections and applicable law.
          </p>

          {/* ---------------- 12 ---------------- */}
          <h2>12. Third-Party Services and Links</h2>
          <p>
            The Service may link to or interoperate with services not controlled by
            GoLo, such as a payment app, golf association, app store, or course-data
            provider. Your use of those services is governed by their own terms and
            privacy policies. GoLo is not responsible for the independent privacy
            practices of third parties.
          </p>

          {/* ---------------- 13 ---------------- */}
          <h2>13. Changes to This Policy</h2>
          <p>
            We may update this policy as the Service, providers, or legal requirements
            change. We will post the updated policy at this page and revise the
            &ldquo;Last updated&rdquo; date. If a change materially affects your
            privacy, we will provide additional notice when required.
          </p>

          {/* ---------------- 14 ---------------- */}
          <h2>14. Contact Us</h2>
          <address className={styles.address}>
            <strong>GoLo Golf LLC</strong>
            <br />
            21196 Anne Lane
            <br />
            Bend, Oregon 97702
            <br />
            United States
            <br />
            Email:{" "}
            <strong>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </strong>
          </address>
        </div>
      </div>
    </div>
  );
}
