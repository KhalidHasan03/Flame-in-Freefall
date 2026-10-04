import {
  Bookmark,
  Compass,
  Flame,
  GitCompareArrows,
  Home,
  LineChart,
  MessageSquareQuote,
  Orbit,
  Settings,
} from "lucide-react";

/**
 * Navigation.
 *
 * `hint` is the channel name shown under the label in the expanded console rail. It exists so
 * the rail reads as a research console with named channels rather than as an app menu — and it
 * doubles as a plain-language description of each destination for anyone who cannot see it.
 */
export const NAV_PRIMARY = [
  { id: "home", label: "Home", href: "/", icon: Home, hint: "Dashboard" },
  { id: "explore", label: "Explore", href: "/explore", icon: Compass, hint: "Archive" },
  { id: "flame-lab", label: "Flame Lab", href: "/flame-lab", icon: Flame, hint: "Combustion model" },
  { id: "mission-lab", label: "Mission Lab", href: "/mission-lab", icon: Orbit, hint: "Destinations" },
  { id: "firewise", label: "Firewise AI", href: "/firewise", icon: MessageSquareQuote, hint: "Intelligence" },
  { id: "insights", label: "Insights", href: "/insights", icon: LineChart, hint: "Telemetry" },
  { id: "compare", label: "Compare", href: "/compare", icon: GitCompareArrows, hint: "Analysis" },
];

export const NAV_SECONDARY = [
  { id: "saved", label: "Saved", href: "/saved", icon: Bookmark, hint: "Workspace" },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, hint: "Preferences" },
];

/**
 * Routes where the Firewise rail is docked rather than opened as an overlay.
 *
 * Empty. The rail used to be docked on the dashboard, which meant the home route carried a
 * permanently open conversational panel competing with the page's own content for the right
 * column. Docking is now left entirely to the overlay, which the user opens when they want it,
 * and Firewise remains reachable from the primary nav and from the dashboard's own links. The
 * array is kept rather than deleted so the docking rule still has exactly one home if a future
 * route genuinely needs a persistent assistant.
 */
export const RAIL_DOCKED_ROUTES = [];

export function isRouteActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
