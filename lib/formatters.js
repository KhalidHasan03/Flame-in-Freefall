export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toFixed(decimals);
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Number(value).toFixed(decimals)}%`;
}

export function formatOxygen(value) {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(1)}% O₂`;
}

export function formatPressure(value) {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(1)} kPa`;
}

export function formatTemperature(value) {
  if (value === null || value === undefined) return "—";
  return `${Math.round(Number(value))} °C`;
}

export function formatGravity(value) {
  if (value === null || value === undefined) return "—";
  const g = Number(value);
  if (g < 0.001) return "μg";
  if (g >= 1) return `${g.toFixed(2).replace(/\.00$/, "")}g`;
  return `${g.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}g`;
}

export function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${Math.round(Number(value))}%`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short" });
}

export function formatSigned(value, decimals = 1, unit = "") {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(Number(value)).toFixed(decimals)}${unit}`;
}

export function truncate(value, maxLength = 140) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function titleCase(value) {
  if (!value) return "";
  return value
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
