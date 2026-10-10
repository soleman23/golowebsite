/**
 * The /how-it-works timeline's phone screens: one per moment of the round,
 * drawn from the page's own example (strokeExample, betExample, hiwScreens)
 * so the phone never contradicts the copy beside it. Decorative — the step
 * copy carries the meaning — and always rendered `framed` inside the
 * timeline's device frame.
 *
 * Swap a moment for a real screenshot by giving its step a `screen.src`.
 */

import {
  betExample,
  hiwPlayerColor,
  hiwScreens,
  strokeExample,
  type HiwPlayerName,
  type TimelineFallback,
} from "@/lib/content";
import { PhoneShell } from "./PhoneShell";
import styles from "./HiwScreen.module.css";

const strokesFor = (name: HiwPlayerName) =>
  strokeExample.players.find((p) => p.name === name)?.strokes ?? 0;

const siOf = (hole: number) => strokeExample.strokeIndex[hole - 1];

function Avatar({ name }: { name: HiwPlayerName }) {
  return (
    <span
      className={styles.avatar}
      style={{ background: `var(--avatar-${hiwPlayerColor[name]})` }}
    >
      {name[0]}
    </span>
  );
}

function Head({ kicker, title }: { kicker: string; title?: string }) {
  return (
    <div className={styles.head}>
      <span className={styles.kicker}>{kicker}</span>
      {title ? <span className={styles.title}>{title}</span> : null}
    </div>
  );
}

function SetupScreen() {
  const s = hiwScreens.setup;
  return (
    <>
      <div className={styles.rowBetween}>
        <span className={styles.kicker}>{s.kicker}</span>
        <span className={styles.meta}>{s.when}</span>
      </div>
      <div className={styles.course}>
        <span className={styles.courseBadge}>18</span>
        <span>
          <span className={styles.courseName}>{s.course}</span>
          <span className={styles.meta}>{s.courseMeta}</span>
        </span>
      </div>
      <span className={styles.label}>{s.teamsLabel}</span>
      {s.teams.map((team) => (
        <div key={team.join()} className={styles.team}>
          {team.map((name) => {
            const p = strokeExample.players.find((x) => x.name === name);
            return (
              <span key={name} className={styles.teamPlayer}>
                <Avatar name={name} />
                <span className={styles.name}>
                  {name}
                  {p?.guest ? <span className={styles.tag}>GUEST</span> : null}
                </span>
                <span className={styles.meta}>{p?.index}</span>
              </span>
            );
          })}
        </div>
      ))}
      <span className={styles.label}>{s.gamesLabel}</span>
      <div className={styles.chips}>
        {s.games.map((g) => (
          <span key={g} className={`${styles.chip} ${styles.chipOn}`}>
            {g}
          </span>
        ))}
        <span className={styles.chip}>{s.addGame}</span>
      </div>
      <span className={styles.button}>{s.start}</span>
    </>
  );
}

function StrokesScreen() {
  const s = hiwScreens.strokes;
  const si = siOf(s.hole);
  return (
    <>
      <Head kicker={s.kicker} title={s.title} />
      <span className={styles.meta}>
        {strokeExample.course.split(" · ").slice(0, 2).join(" · ")} ·{" "}
        {s.allowance}
      </span>
      <div className={styles.list}>
        {strokeExample.players.map((p) => (
          <div key={p.name} className={styles.row}>
            <Avatar name={p.name} />
            <span className={styles.name}>{p.name}</span>
            <span className={styles.meta}>{p.course}</span>
            <span className={styles.big}>
              {p.strokes === null ? (
                <span className={styles.lowMan}>LOW</span>
              ) : (
                p.strokes
              )}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.panel}>
        <span className={styles.label}>
          {s.holeLabel} · SI {si}
        </span>
        <div className={styles.dots}>
          {strokeExample.players.map((p) => {
            const gets = si <= strokesFor(p.name);
            return (
              <span
                key={p.name}
                className={`${styles.dotChip} ${gets ? styles.dotChipOn : ""}`}
              >
                {gets ? "● " : ""}
                {p.name}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ScoringScreen() {
  const s = hiwScreens.scoring;
  const si = siOf(s.hole);
  return (
    <>
      <div className={styles.holeHead}>
        <span className={styles.kicker}>{s.kicker}</span>
        <span className={styles.holeNum}>{s.hole}</span>
        <span className={styles.meta}>
          Par {s.par} · SI {si}
        </span>
      </div>
      <div className={styles.list}>
        {strokeExample.players.map((p) => {
          const gross = s.scores[p.name];
          const stroke = si <= strokesFor(p.name);
          return (
            <div key={p.name} className={styles.row}>
              <Avatar name={p.name} />
              <span className={styles.name}>
                {p.name}
                {stroke ? <span className={styles.strokeDot}>●</span> : null}
              </span>
              <span className={styles.meta}>net {gross - (stroke ? 1 : 0)}</span>
              <span className={styles.big}>{gross}</span>
            </div>
          );
        })}
      </div>
      <div className={`${styles.panel} ${styles.panelOn}`}>{s.skin}</div>
      <span className={styles.foot}>{s.match}</span>
    </>
  );
}

function TurnScreen() {
  const s = hiwScreens.turn;
  return (
    <>
      <Head kicker={s.kicker} />
      <div className={styles.list}>
        {s.rungs.map((r) => (
          <div
            key={r.holes}
            className={`${styles.row} ${r.tone === "live" ? styles.rowLive : ""}`}
          >
            <span className={styles.rungHoles}>{r.holes}</span>
            <span className={styles.rungBody}>
              <span className={styles.name}>{r.title}</span>
              <span className={styles.meta}>{r.state}</span>
            </span>
            <span
              className={`${styles.amount} ${r.tone === "negative" ? styles.negative : ""}`}
            >
              {r.amount}
            </span>
          </div>
        ))}
      </div>
      <div className={`${styles.panel} ${styles.panelOn}`}>
        <span className={styles.label}>{s.pressLabel}</span>
        {s.press}
      </div>
    </>
  );
}

function FinalScreen() {
  const s = hiwScreens.final;
  return (
    <>
      <Head kicker={s.kicker} title={s.title} />
      <div className={styles.chips}>
        {betExample.results.map((r) => (
          <span
            key={r.label}
            className={`${styles.chip} ${r.highlight ? styles.chipOn : ""}`}
          >
            {r.label}
          </span>
        ))}
      </div>
      <span className={styles.label}>{s.standingsLabel}</span>
      <div className={styles.list}>
        {betExample.rows.map((r) => (
          <div key={r.name} className={styles.row}>
            <Avatar name={r.name} />
            <span className={styles.name}>{r.name}</span>
            <span
              className={`${styles.big} ${r.net.startsWith("−") ? styles.negative : styles.positive}`}
            >
              {r.net}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function SettleScreen() {
  const s = hiwScreens.settle;
  return (
    <>
      <Head kicker={s.kicker} title={s.title} />
      <div className={styles.list}>
        {betExample.payments.map((p) => (
          <div key={p.from} className={styles.row}>
            <Avatar name={p.from} />
            <span className={styles.payName}>{p.from}</span>
            <span className={styles.arrow}>→</span>
            <Avatar name={p.to} />
            <span className={`${styles.payName} ${styles.grow}`}>{p.to}</span>
            <span className={styles.big}>{p.amount}</span>
          </div>
        ))}
      </div>
      <span className={styles.foot}>{betExample.settleFooter}</span>
      <span className={styles.button}>{s.share}</span>
    </>
  );
}

const SCREENS: Record<
  TimelineFallback,
  { render: () => React.ReactNode; bg: "course" | "turf"; label: string }
> = {
  setup: {
    render: SetupScreen,
    bg: "turf",
    label: "GoLo round setup: Pinehurst No. 8, Mike and Tom against Sarah and Jess, Tom as a guest, team Nassau and skins on the card.",
  },
  strokes: {
    render: StrokesScreen,
    bg: "turf",
    label: "GoLo strokes screen: Mike is the low man, Jess gets 3, Sarah 7 and Tom 16; Sarah and Tom get a stroke on the 1st.",
  },
  scoring: {
    render: ScoringScreen,
    bg: "turf",
    label: "GoLo scoring the 3rd hole: Mike, Jess and Sarah all net 4, so the skin carries.",
  },
  turn: {
    render: TurnScreen,
    bg: "course",
    label: "GoLo Nassau at the turn: Mike and Tom lost the front, the back and the 18 are live, auto-press set for 2 down.",
  },
  final: {
    render: FinalScreen,
    bg: "course",
    label: "GoLo final standings: Tom up $14, Sarah up $2, Mike down $2, Jess down $14.",
  },
  settle: {
    render: SettleScreen,
    bg: "course",
    label: "GoLo settle-up: Jess pays Tom $14, Mike pays Sarah $2.",
  },
};

export function HiwScreen({ moment }: { moment: TimelineFallback }) {
  const { render: Screen, bg, label } = SCREENS[moment];
  return (
    <PhoneShell framed bg={bg} label={label}>
      <div className={styles.screen}>
        <Screen />
      </div>
    </PhoneShell>
  );
}
