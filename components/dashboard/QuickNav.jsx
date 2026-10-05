import Link from "next/link";
import { ArrowUpRight, Compass, Flame, GitCompareArrows, ShieldCheck } from "lucide-react";

/**
 * The four routes worth leaving this page for.
 *
 * These were four cards, each with a label, a title and a sentence of prose — four sentences of
 * marketing copy standing between a reader and the thing being described. On a page that is now
 * little more than six numbers, that was the largest remaining block and the least load-bearing,
 * so each card is reduced to what is needed to click it: a name, one counted figure, an arrow.
 *
 * The sentences are not lost, they are demoted. Every route states what it contains in its own
 * page header, one navigation step away, and a reader who needs the pitch is going there anyway.
 * Repeating it here meant maintaining the same sentence in two places and being wrong in one.
 *
 * Each figure is passed in from the server component that renders this, so the numbers come from
 * the same loaded response as the tiles above and from the same constants the destination route
 * itself uses. Nothing is recounted locally.
 *
 * `/insights` rather than `/firewise` in the fourth slot. Every other route is a tool for working
 * with the data; this one is where the evidence behind that data is graded, where the conflicts
 * are stated and where the five open problems from the tile above are written out in full. A
 * reader who counts five problems on the way in should be able to leave this page to read them
 * without passing through a fourth tool first.
 */
const DESTINATIONS = [
  {
    id: "explore",
    href: "/explore",
    icon: Compass,
    label: "Explore",
    figure: "records",
  },
  {
    id: "flame-lab",
    href: "/flame-lab",
    icon: Flame,
    label: "Flame Lab",
    figure: "controls",
  },
  {
    id: "compare",
    href: "/compare",
    icon: GitCompareArrows,
    label: "Compare",
    figure: "fields",
  },
  {
    id: "insights",
    href: "/insights",
    icon: ShieldCheck,
    label: "Safety & evidence",
    figure: "problems",
  },
];

export default function QuickNav({ recordCount, variableCount, controlCount, fieldCount, problemCount }) {
  const figures = {
    records: `${recordCount} records`,
    controls: `${controlCount} controls`,
    fields: `${fieldCount} fields`,
    problems: `${problemCount} open`,
  };

  return (
    <nav aria-label="Primary routes" className="space-y-2">
      <p className="fx-label">Continue</p>

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map((destination) => {
          const Icon = destination.icon;

          return (
            <li key={destination.id}>
              <Link
                href={destination.href}
                className="fx-panel fx-panel-hover group flex items-center gap-2 px-3 py-2.5"
              >
                <Icon className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="text-xs font-semibold text-ink">{destination.label}</span>
                <span className="fx-telemetry-value ml-auto text-ink-faint">
                  {figures[destination.figure]}
                </span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}