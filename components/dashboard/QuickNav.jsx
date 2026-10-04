import Link from "next/link";
import { ArrowUpRight, Compass, Flame, GitCompareArrows, MessageSquareQuote } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

/**
 * The four places worth going next.
 *
 * Replaces a set of destination panels that each duplicated their route's own page header. The
 * dashboard's job is to route the reader, and a link with one sentence saying what is behind it
 * does that in one line where a preview panel took a screen.
 *
 * Every figure is passed in from the server component that renders this, so each card's number
 * comes from the same loaded response as the rest of the page and from the same constants the
 * destination route itself uses. Nothing here recounts anything locally.
 */
const DESTINATIONS = [
  {
    id: "explore",
    href: "/explore",
    icon: Compass,
    label: "Explore",
    title: "The full evidence base",
    detail: "Every record, filterable by destination, program, fuel, evidence grade and gravity.",
    metric: "records",
  },
  {
    id: "flame-lab",
    href: "/flame-lab",
    icon: Flame,
    label: "Flame Lab",
    title: "Interactive combustion model",
    detail: "Drive gravity, oxygen, pressure, temperature, airflow and fuel, and watch the envelope respond.",
    metric: "controls",
  },
  {
    id: "compare",
    href: "/compare",
    icon: GitCompareArrows,
    label: "Compare",
    title: "Side-by-side matrix",
    detail: "Hold records against each other on any measured variable and score them for a mission.",
    metric: "fields",
  },
  {
    id: "firewise",
    href: "/firewise",
    icon: MessageSquareQuote,
    label: "Firewise",
    title: "Evidence-first assistant",
    detail: "Ask about the loaded records and get an answer with its sources attached.",
    metric: null,
  },
];

export default function QuickNav({ recordCount, variableCount, controlCount, fieldCount }) {
  const metrics = {
    records: [
      { value: recordCount, unit: "records loaded" },
      { value: variableCount, unit: "variables per record" },
    ],
    controls: [{ value: controlCount, unit: "live controls" }],
    fields: [{ value: fieldCount, unit: "comparison fields" }],
  };

  return (
    <section aria-labelledby="quick-nav-heading" className="space-y-4">
      <SectionHeader
        id="quick-nav-heading"
        eyebrow="Continue"
        title="Where to go next"
        description="Four routes into the product. Nothing on this page duplicates them."
      />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DESTINATIONS.map((destination) => {
          const Icon = destination.icon;
          const figures = destination.metric ? metrics[destination.metric] : null;

          return (
            <li key={destination.id}>
              <Link
                href={destination.href}
                className="fx-panel fx-panel-hover group flex h-full flex-col gap-2 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="fx-label flex items-center gap-1.5 text-ink">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {destination.label}
                  </span>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm font-semibold leading-snug text-ink">{destination.title}</p>
                <p className="text-xs leading-relaxed text-ink-muted">{destination.detail}</p>

                {figures ? (
                  <p className="fx-telemetry mt-auto flex-wrap gap-x-3 pt-2 text-ink-faint">
                    {figures.map((figure) => (
                      <span key={figure.unit} className="fx-telemetry">
                        <span className="fx-numeric font-bold text-ink">{figure.value}</span>
                        <span className="fx-telemetry-label">{figure.unit}</span>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="fx-telemetry mt-auto pt-2 text-ink-faint">
                    <span className="fx-telemetry-label">Sources attached to every claim</span>
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}