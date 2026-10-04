const VARIANTS = {
  primary: "fx-btn-primary",
  outline: "fx-btn-outline",
  ghost: "fx-btn-ghost",
};

const SIZES = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "",
  lg: "px-4 py-2.5 text-sm",
};

export default function Button({
  children,
  variant = "outline",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`fx-btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      {children}
      {IconRight ? <IconRight className="size-4 shrink-0" aria-hidden="true" /> : null}
    </button>
  );
}
