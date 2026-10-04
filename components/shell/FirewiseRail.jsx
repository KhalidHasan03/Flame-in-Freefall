"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelRightOpen } from "lucide-react";
import IconButton from "@/components/shared/IconButton";
import Drawer from "@/components/shared/Drawer";
import FirewisePanel from "@/components/firewise/FirewisePanel";

/**
 * The Firewise rail.
 *
 * Docked as a third column at >=1536px on routes listed in RAIL_DOCKED_ROUTES; everywhere else
 * it is an overlay drawer. The docked state is a stored preference rather than a route
 * behaviour, so the control stays reachable at every width — including while docked, so the
 * rail can be undocked again.
 */
export default function FirewiseRail({ docked, onToggle }) {
  const pathname = usePathname();
  const [overlay, setOverlay] = useState(false);
  const isRailRoute = pathname === "/firewise";
  const showToggle = !isRailRoute;

  if (docked) {
    return (
      <aside className="fx-panel fx-glass hidden w-[400px] shrink-0 flex-col border-l border-line 2xl:flex">
        <FirewisePanel
          docked
          headerAccessory={
            <IconButton
              icon={PanelRightOpen}
              label="Undock Firewise assistant"
              onClick={onToggle}
              size="sm"
            />
          }
        />
      </aside>
    );
  }

  return (
    <>
      {showToggle ? (
        <div className="p-3">
          <IconButton
            icon={PanelRightOpen}
            label="Open Firewise assistant"
            onClick={() => setOverlay(true)}
          />
        </div>
      ) : null}
      <Drawer
        open={overlay}
        onClose={() => setOverlay(false)}
        title="Firewise Assistant"
        description="Mock retrieval over the prototype dataset"
        side="right"
        width="w-[min(400px,92vw)]"
        headerAccessory={
          showToggle ? (
            <IconButton
              icon={PanelRightOpen}
              label="Dock Firewise on the dashboard"
              onClick={onToggle}
              size="sm"
            />
          ) : null
        }
      >
        <FirewisePanel inDrawer />
      </Drawer>
    </>
  );
}