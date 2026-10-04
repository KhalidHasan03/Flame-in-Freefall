import { redirect } from "next/navigation";

/**
 * The Explorer lives at /explore. This redirect keeps older bookmarks and any external links
 * pointing at /experiments working while the detail route continues to live at
 * /experiments/[id].
 */
export default function ExperimentsIndexPage() {
  redirect("/explore");
}