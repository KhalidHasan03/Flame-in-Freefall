import { ArrowLeftRight } from "lucide-react";
import Panel from "@/components/shared/Panel";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SectionHeader from "@/components/shared/SectionHeader";
import Badge from "@/components/shared/Badge";
import { PROTOTYPE_LABELS } from "@/lib/constants";

/**
 * Side-by-side Moon and Mars comparison — the mission-design question the product exists for.
 *
 * Now rendered inside Mission Lab, which is where the destination selector and the per-mission
 * scoring live, so the self-link this panel used to carry is gone: it would have pointed at the
 * page it is already on.
 */
export default function MoonMarsPanel({ rows, moon, mars }) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Mission design"
        icon={ArrowLeftRight}
        title="Moon vs Mars conditions"
        description="Where the two partially-gravity destinations diverge, and which divergence changes fire-safety decisions."
      />

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] gap-x-3 gap-y-2.5 border-b border-line pb-2.5">
        <p className="fx-label">{moon?.name ?? "Moon"}</p>
        <p className="fx-label text-center">Factor</p>
        <p className="fx-label text-right">{mars?.name ?? "Mars"}</p>

        {rows.map((row) => {
          const differs = String(row.left).toLowerCase() !== String(row.right).toLowerCase();
          return (
            <div key={row.id} className="contents">
              <p className="text-[11px] leading-relaxed text-ink-muted">{row.left}</p>
              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-ink">
                {row.label}
                {differs ? <Badge tone="ember">differs</Badge> : null}
              </p>
              <p className="text-right text-[11px] leading-relaxed text-ink-muted">{row.right}</p>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] leading-relaxed text-ink-muted">
        The consequential difference is not gravity magnitude but what supplies the oxidiser. On the Moon the
        atmosphere is life support consumable, so fire suppression and crew survival compete for the same
        resource — which is why the loaded dataset contains no combustion data at 0.16g.
      </p>

      <PrototypeNotice compact label={PROTOTYPE_LABELS.dataset} message={PROTOTYPE_LABELS.dataPending} />
    </Panel>
  );
}