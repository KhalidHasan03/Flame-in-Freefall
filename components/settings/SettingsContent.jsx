"use client";

import { useSettings } from "@/lib/context/SettingsProvider";
import { PROTOTYPE_LABELS } from "@/lib/constants";
import Panel from "@/components/shared/Panel";
import SectionHeader from "@/components/shared/SectionHeader";
import { Toggle } from "@/components/shared/Form";
import Button from "@/components/shared/Button";

export default function SettingsContent() {
  const { settings, update, reset } = useSettings();

  return (
    <div className="space-y-4">
      <Panel className="space-y-5 p-5">
        <SectionHeader
          eyebrow="Preferences"
          title="Interface"
          description="Stored locally in your browser and applied immediately."
        />
        <Toggle
          label="Show prototype labels"
          description="Display the prototype disclaimer next to generated figures and models."
          checked={settings.showPrototypeLabels}
          onChange={(value) => update({ showPrototypeLabels: value })}
        />
        <Toggle
          label="Show evidence levels by default"
          description="Show evidence grades in grids and tables. Detail pages always show them regardless of this setting."
          checked={settings.showEvidenceByDefault}
          onChange={(value) => update({ showEvidenceByDefault: value })}
        />
        <Toggle
          label="Compact mode"
          description="Tighten padding across cards and panels."
          checked={settings.compactMode}
          onChange={(value) => update({ compactMode: value })}
        />
        <Toggle
          label="Reduce flame motion"
          description="Disable flame animation, in both the 2D and 3D visualisations. The operating-system reduced-motion setting is respected regardless."
          checked={settings.reduceFlameMotion}
          onChange={(value) => update({ reduceFlameMotion: value })}
        />
      </Panel>

      <Panel className="space-y-3 p-5">
        <SectionHeader
          eyebrow="Appearance"
          title="Space-dark display"
          description="FlareNexus runs a single deep-space palette. The depth between the background, the atmosphere and the data layers is what makes the interface read as a research console rather than a flat dashboard, so there is no light mode to switch to."
        />
      </Panel>

      <Panel className="space-y-3 p-5">
        <SectionHeader
          eyebrow="Data"
          title="Local storage"
          description="Settings, saved items and Firewise conversations live in this browser only. Nothing is sent to a server."
        />
        <p className="text-xs leading-relaxed text-ink-muted">{PROTOTYPE_LABELS.dataset}</p>
        <Button variant="outline" size="sm" onClick={reset}>
          Reset settings
        </Button>
      </Panel>
    </div>
  );
}