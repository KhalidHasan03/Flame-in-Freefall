"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_PRIMARY, NAV_SECONDARY, isRouteActive } from "@/lib/navigation";
import { BRAND } from "@/lib/constants";
import { DEPTH } from "@/components/space/depth";
import { Menu, PanelRightClose, PanelRightOpen } from "lucide-react";
import IconButton from "@/components/shared/IconButton";
import { useState } from "react";
import Drawer from "@/components/shared/Drawer";

/**
 * The research console rail.
 *
 * Width behaviour is unchanged from the previous rail, because the responsive strategy was
 * already correct and there is no reason to trade it away:
 *   <768px    no rail — navigation lives in a drawer opened from the mission bar
 *   768–1023  navigation drawer
 *   1024–1279 68px icon rail (labels revealed at xl, never stored)
 *   >=1280    expanded by default, honouring the user's collapse preference
 *
 * What changed is the treatment. This is a spacecraft console, not an app sidebar: no filled
 * card behind it, corner brackets instead of a full border, and an active item that reads as an
 * engaged instrument switch rather than as a selected list row.
 */

/**
 * Labels are hidden when collapsed and below xl, so `title` is always present to give
 * icon-only links an accessible name and a hover hint. The active state is lit on the leading
 * edge by `.fx-nav-link`, which draws it as a pseudo-element so it cannot affect layout.
 */
function NavLink({ item, active, onClick, collapsed = false }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={item.label}
      data-active={active ? "true" : undefined}
      className={`fx-nav-link group relative flex items-center rounded-[var(--radius-hud)] py-2 pr-3 transition-colors ${
        collapsed ? "justify-center pl-0" : "gap-3 pl-3"
      } ${collapsed ? "w-full" : ""} ${
        active ? "bg-brand/12 text-brand" : "text-ink-muted hover:bg-elevated/50 hover:text-ink"
      }`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span
        className={`${collapsed ? "hidden" : "hidden xl:block"} min-w-0 flex-1 leading-tight`}
      >
        <span className="block truncate text-[13px] font-semibold tracking-tight">
          {item.label}
        </span>
        {/* The channel name doubles as the accessible description of the destination. */}
        {item.hint ? (
          <span className="fx-telemetry-label block truncate text-[9px] opacity-70">
            {item.hint}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/** Declared outside ConsoleRail so its identity is stable across renders. */
function RailNav({ collapsed, onNavigate }) {
  const pathname = usePathname();
  const link = (item) => (
    <NavLink
      key={item.id}
      item={item}
      collapsed={collapsed}
      active={isRouteActive(pathname, item.href)}
      onClick={onNavigate}
    />
  );

  return (
    <nav className="flex flex-1 flex-col gap-6 px-3 py-3.5">
      <section>
        <p className={`${collapsed ? "hidden" : "hidden xl:block"} fx-label px-2.5 pb-2`}>
          Navigation
        </p>
        <div className="flex flex-col gap-1">{NAV_PRIMARY.map(link)}</div>
      </section>

      <section>
        <p className={`${collapsed ? "hidden" : "hidden xl:block"} fx-label px-2.5 pb-2`}>
          Workspace
        </p>
        <div className="flex flex-col gap-1">{NAV_SECONDARY.map(link)}</div>
      </section>

      {!collapsed ? (
        <div className="mt-auto hidden space-y-1.5 px-2.5 xl:block">
          {BRAND.status.map((item) => (
            <p key={item.id} className="fx-telemetry justify-between">
              <span className="fx-telemetry-label">{item.label}</span>
              <span className="fx-telemetry-value text-ink-faint">{item.detail}</span>
            </p>
          ))}
          <p className="pt-1 text-[10px] leading-relaxed text-ink-faint">
            {BRAND.attribution}
          </p>
        </div>
      ) : null}
    </nav>
  );
}

export default function ConsoleRail({ collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const ToggleIcon = collapsed ? PanelRightOpen : PanelRightClose;

  return (
    <>
      {/*
        `fx-frame` rather than a filled panel: the rail floats over the environment on corner
        brackets alone, so the atmosphere stays visible behind it down the full height.
      */}
      <aside
        className={`fx-frame relative hidden shrink-0 flex-col border-r border-line bg-deep/40 backdrop-blur-md transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[68px]" : "w-[68px] xl:w-[264px]"
        }`}
        style={{ "--fx-frame-arm": "18px", zIndex: DEPTH.ui }}
      >
        <div className="flex h-14 items-center justify-between gap-1 border-b border-line px-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 px-1">
            <span className="fx-mark relative flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-hud)]">
              {/*
                One white disc, not two tinted layers. The mark used to be a violet-to-cyan core
                under an amber shell, which read as a small coloured planet. Monochrome, the
                identity is carried by the ring in `.fx-mark` and by a solid white centre, and
                the second layer is dropped rather than restyled — a second disc at a different
                value would only read as a highlight nobody asked for.
              */}
              <span className="absolute inset-[8px] rounded-full bg-ink" />
            </span>
            <span className={`${collapsed ? "hidden" : "hidden xl:block"} min-w-0`}>
              <span className="block truncate font-display text-[15px] font-semibold tracking-tight text-ink">
                {BRAND.lockup.wordmark}
              </span>
              <span className="-mt-0.5 block truncate text-[10px] text-ink-faint">
                {BRAND.lockup.team}
              </span>
            </span>
          </Link>
          <IconButton
            icon={ToggleIcon}
            label={collapsed ? "Expand rail" : "Collapse rail"}
            onClick={onToggleCollapse}
            size="sm"
            className="hidden xl:inline-flex"
          />
        </div>

        <RailNav collapsed={collapsed} />

        {/*
          The disclosure lives here permanently rather than only in Settings. This is an
          independent challenge entry built on synthetic data, and that has to be visible from
          every route, not just the one where the user went looking for it.
        */}
        {!collapsed ? (
          <div className="hidden border-t border-line px-3.5 py-2.5 xl:block">
            <p className="fx-label text-[9px] text-ember">{BRAND.prototypeWordmark}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
              {BRAND.disclosure}
            </p>
          </div>
        ) : null}
      </aside>

      <div className="lg:hidden">
        <IconButton icon={Menu} label="Open navigation" onClick={() => setMobileOpen(true)} size="sm" />
        <Drawer
          open={mobileOpen}
          onClose={closeMobile}
          title={BRAND.lockup.wordmark}
          description={BRAND.lockup.team}
          side="left"
          width="w-[min(280px,88vw)]"
        >
          <RailNav collapsed={false} onNavigate={closeMobile} />
          <div className="border-t border-line px-4 py-3.5">
            <p className="text-[10px] leading-relaxed text-ink-faint">
              {BRAND.attribution}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-faint">
              {BRAND.disclosure}
            </p>
          </div>
        </Drawer>
      </div>
    </>
  );
}
