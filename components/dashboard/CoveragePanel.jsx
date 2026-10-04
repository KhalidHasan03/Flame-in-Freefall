"use client";

import { Layers } from "lucide-react";
import BaseBarChart from "@/components/charts/BaseBarChart";
import Panel from "@/components/shared/Panel";
import SectionHeader from "@/components/shared/SectionHeader";

export default function CoveragePanel({ programs, sampleSize }) {
  return (
    <Panel className="flex flex-col gap-4 p-5">
      <SectionHeader
        eyebrow="Dataset"
        icon={Layers}
        title="Coverage by research programme"
        description={`${sampleSize} synthetic records distributed across ${programs.length} programmes.`}
      />

      <BaseBarChart
        data={programs}
        xKey="program"
        series={[{ key: "count", name: "Records", color: "fx-brand" }]}
        yLabel="records"
        height={200}
        caption="Distribution of the loaded demonstration sample, not of the real literature."
      />

      <p className="text-[11px] leading-relaxed text-ink-faint">
        Saffire and SOFIE carry the largest share of the sample. Keeping programme identity on every record is
        what makes it possible to reason about how evidence differs by test facility and scale rather than
        treating the dataset as uniform.
      </p>
    </Panel>
  );
}