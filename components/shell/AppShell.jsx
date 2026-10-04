"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ConsoleRail from "./ConsoleRail";
import MissionBar from "./MissionBar";
import FirewiseRail from "./FirewiseRail";
import SpaceEnvironment from "@/components/space/SpaceEnvironment";

/**
 * Deferred at the shell rather than at the page, because the shell is the only place that knows
 * which route is mounted. Every other route keeps this out of its bundle entirely, not merely out
 * of its first paint.
 */
const EarthBackdrop = dynamic(() => import("@/components/three/EarthBackdrop"), { ssr: false });
import { DEPTH } from "@/components/space/depth";
import { RAIL_DOCKED_ROUTES } from "@/lib/navigation";
import { STORAGE_KEYS } from "@/lib/storage";
import usePersistentState from "@/lib/usePersistentState";

/**
 * Which environment each route gets.
 *
 * The point of this table is that decoration is never competing with dense data. A route
 * carrying 26 research records, a comparison matrix or a chart wall gets `quiet`; the routes
 * whose subject *is* the environment get the full treatment. One lookup here replaces any
 * per-page knowledge of how many layers exist.
 */
const ENVIRONMENT = {
  "/": { density: "cinematic", mission: "iss" },
  "/mission-lab": { density: "cinematic", mission: "moon" },
  "/explore": { density: "quiet", mission: "earth" },
  "/compare": { density: "quiet", mission: "earth" },
  "/insights": { density: "quiet", mission: "earth" },
  "/saved": { density: "quiet", mission: "earth" },
  "/settings": { density: "quiet", mission: "earth" },
  "/firewise": { density: "standard", mission: "iss" },
  "/flame-lab": { density: "standard", mission: "iss" },
};

const DEFAULT_ENVIRONMENT = { density: "standard", mission: "iss" };

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [railDocked, setRailDocked] = usePersistentState(STORAGE_KEYS.railDocked, true);
  const railAllowed = RAIL_DOCKED_ROUTES.includes(pathname);

  const toggleRail = () => setRailDocked((current) => !current);
  const docked = railAllowed && railDocked;

  // Longest-prefix match, so /experiments/FLAME-01 resolves to the /experiments entry.
  const routeKey = Object.keys(ENVIRONMENT)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];
  const environment = (routeKey && ENVIRONMENT[routeKey]) || DEFAULT_ENVIRONMENT;

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      {/* One atmosphere for the whole application, painted behind the shell. */}
      <SpaceEnvironment density={environment.density} mission={environment.mission} />
      {/*
        The live planet. Environment rather than page content, so it belongs beside
        SpaceEnvironment and renders on every route — the globe is dim and sits low in the frame,
        and the panel transparency is what keeps it subordinate to data rather than competing.
      */}
      <EarthBackdrop />
      {/* Keyboard users land here first, so the nav is not a trap on every route. */}
      <a href="#main-content" className="fx-btn-primary sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90]">
        Skip to main content
      </a>
      {/*
        The UI plane, declared explicitly. The environment is a positioned element with a
        positive z-index, so anything in normal flow would be painted underneath it — the rail
        and the main column both opt into DEPTH.ui to stay above it.
      */}
      <ConsoleRail collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      <div
        className="relative flex min-w-0 flex-1 flex-col"
        style={{ zIndex: DEPTH.ui }}
      >
        <MissionBar />
        <div className="flex min-h-0 flex-1">
          <main id="main-content" tabIndex={-1} className="fx-scrollbar min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
          <FirewiseRail docked={docked} onToggle={toggleRail} />
        </div>
      </div>
    </div>
  );
}
