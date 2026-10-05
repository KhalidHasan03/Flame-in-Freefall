import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getExperimentDetail } from "@/lib/api/experiments";
import { getMissions } from "@/lib/api/missions";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import PageHeader from "@/components/shell/PageHeader";
import Panel from "@/components/shared/Panel";
import Badge from "@/components/shared/Badge";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import SaveButton from "@/components/shared/SaveButton";
import CompareToggle from "@/components/shared/CompareToggle";
import { EvidenceBadge } from "@/components/shared/StatusBadges";
import SectionHeader from "@/components/shared/SectionHeader";
import VariablesPanel from "@/components/experiments/VariablesPanel";
import SourcesPanel from "@/components/experiments/SourcesPanel";
import TimelinePanel from "@/components/experiments/TimelinePanel";
import RelatedPanel from "@/components/experiments/RelatedPanel";
import MissionRelevancePanel from "@/components/experiments/MissionRelevancePanel";
import ExperimentFlamePanel from "@/components/experiments/ExperimentFlamePanel";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const detail = await getExperimentDetail(id);
  if (!detail) return { title: "Experiment not found" };
  return {
    title: `${detail.experiment.id} — ${detail.experiment.title}`,
    description: detail.experiment.keyFinding,
  };
}

export default async function ExperimentDetailPage({ params }) {
  const { id } = await params;
  const [detail, missions] = await Promise.all([getExperimentDetail(id), getMissions()]);

  if (!detail) notFound();

  const { experiment, sources, timeline, related } = detail;

  return (
    <div className="space-y-6">
      <Link
        href="/explore"
        className="fx-btn fx-btn-ghost h-7 px-2 text-[11px]"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to Explore
      </Link>

      <PageHeader
          variant="compact"
        eyebrow={`${experiment.program} • ${formatDate(experiment.date)}`}
        title={experiment.title}
        description={experiment.abstract}
        actions={
          <>
            <CompareToggle id={experiment.id} />
            <SaveButton
              bucket="experiments"
              showLabel
              item={{
                id: experiment.id,
                title: experiment.title,
                program: experiment.program,
                topic: experiment.topic,
              }}
            />
          </>
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge tone="brand">{experiment.id}</Badge>
          <Badge tone="neutral">{experiment.program}</Badge>
          <Badge tone="neutral">{experiment.type}</Badge>
          <Badge tone="info">{experiment.topic}</Badge>
          <EvidenceBadge level={experiment.evidenceLevel} />
          <Badge tone="neutral">Evidence {experiment.evidenceScore}%</Badge>
        </div>
      </PageHeader>

      <PrototypeNotice label={PROTOTYPE_LABELS.dataset} message={PROTOTYPE_LABELS.notValidated} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel className="p-5">
            <SectionHeader eyebrow="Summary" title="Key finding" />
            <p className="mt-2.5 text-xs leading-relaxed text-ink">{experiment.keyFinding}</p>
            {experiment.findings?.length ? (
              <ul className="mt-3.5 space-y-2 border-t border-line pt-3.5">
                {experiment.findings.map((finding) => (
                  <li key={finding} className="flex gap-2.5">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <span className="text-xs leading-relaxed text-ink-muted">{finding}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {experiment.aiReading ? (
              <div className="mt-3.5 flex gap-2.5 rounded-lg border border-brand/25 bg-brand/[0.07] px-3 py-2.5">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <p className="fx-label text-brand">Prototype reading</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{experiment.aiReading}</p>
                </div>
              </div>
            ) : null}
            {experiment.tags?.length ? (
              <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-line pt-3.5">
                {experiment.tags.map((tag) => (
                  <Badge key={tag} tone="neutral">
                    #{tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Panel>

          <VariablesPanel experiment={experiment} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel className="flex flex-col gap-4 p-5">
              <SectionHeader eyebrow="Provenance" title="Source documents" />
              <SourcesPanel sources={sources} />
            </Panel>

            <Panel className="flex flex-col gap-4 p-5">
              <SectionHeader
                eyebrow="Provenance"
                title="Evidence timeline"
                description="How this result became available, and how strongly each stage grounds it."
              />
              <TimelinePanel entries={timeline} />
            </Panel>
          </div>

          <Panel className="flex flex-col gap-4 p-5">
            <SectionHeader eyebrow="Dataset" title="Related experiments" />
            <RelatedPanel experiments={related} />
          </Panel>
        </div>

        <div className="space-y-4">
          <ExperimentFlamePanel experiment={experiment} />
          <MissionRelevancePanel experiment={experiment} missions={missions} />
        </div>
      </div>
    </div>
  );
}