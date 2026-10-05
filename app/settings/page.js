import PageHeader from "@/components/shell/PageHeader";
import SettingsContent from "@/components/settings/SettingsContent";

export const metadata = {
  title: "Settings",
  description: "Motion, display and data preferences for FlareNexus.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
          variant="compact"
        eyebrow="Configuration"
        title="Settings"
        description="Motion, display and data preferences. FlareNexus renders in a single space-dark display profile."
      />
      <SettingsContent />
    </div>
  );
}