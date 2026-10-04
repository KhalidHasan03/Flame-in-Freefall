import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { APP_NAME, APP_TAGLINE, BRAND, CHALLENGE_NAME, TEAM_NAME } from "@/lib/constants";
import { AppProviders } from "@/lib/context/AppProviders";
import AppShell from "@/components/shell/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face. Carries the wordmark, page titles and the large-format instrument numerals,
 * and nothing else — body copy stays in Inter so the technical register is not diluted.
 */
const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_NAME} is a prototype research interface for microgravity fire safety, built by ${TEAM_NAME} for the ${CHALLENGE_NAME}. All dataset records are synthetic demonstration data. ${BRAND.disclosure}`,
  applicationName: APP_NAME,
  authors: [{ name: TEAM_NAME }],
  keywords: ["microgravity", "fire safety", "combustion", "NASA Space Apps", "research prototype"],
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface text-ink">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
