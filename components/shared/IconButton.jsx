export default function IconButton({
  icon: Icon,
  label,
  size = "md",
  tone: name = "ghost",
  className = "",
  children,
  ...props
}) {
  const height = size === "sm" ? "h-7" : size === "lg" ? "h-10" : "h-8";
  const width = children ? "w-auto px-2.5" : size === "sm" ? "w-7" : size === "lg" ? "w-10" : "w-8";
  const colouring =
    name === "brand" ? "text-brand" : name === "ember" ? "text-ember" : "text-ink-muted";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`fx-btn ${height} ${width} ${colouring} hover:bg-elevated/70 ${className}`}
      {...props}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </button>
  );
}