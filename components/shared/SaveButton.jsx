"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSaved } from "@/lib/context/SavedProvider";
import { useState } from "react";
import IconButton from "./IconButton";

/**
 * Persists a record to the saved workspace. `item[labelKey]` provides the accessible name and
 * the visible announcement, so screen-reader output stays meaningful.
 */
export default function SaveButton({
  bucket,
  item,
  labelKey = "title",
  size = "md",
  showLabel = false,
  className = "",
}) {
  const { isSaved, toggle } = useSaved();
  const [announce, setAnnounce] = useState("");

  const name = item[labelKey] ?? item.id;
  const saved = isSaved(bucket, item.id);

  const handleClick = () => {
    toggle(bucket, item);
    setAnnounce(saved ? `Removed ${name} from saved` : `Saved ${name}`);
  };

  return (
    <>
      <IconButton
        icon={saved ? BookmarkCheck : Bookmark}
        label={saved ? `Remove ${name} from saved` : `Save ${name}`}
        size={size}
        tone={saved ? "brand" : "ghost"}
        aria-pressed={saved}
        onClick={handleClick}
        className={className}
      >
        {showLabel ? (
          <span className="ml-1.5 text-xs font-semibold">{saved ? "Saved" : "Save"}</span>
        ) : null}
      </IconButton>
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>
    </>
  );
}