import { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1"
      : "text-xs px-2.5 py-0.5";

  const variants = {
    primary: "bg-primary-color/10 text-primary-color",
    secondary: "bg-secondary-color/10 text-secondary-color",
    success: "bg-success-color/10 text-success-color",
    danger: "bg-danger-color/10 text-danger-color",
    warning: "bg-warning-color/10 text-warning-color",
    outline:
      "bg-transparent border border-border-light dark:border-border-dark",
  };

  const baseClass =
    "inline-flex items-center justify-center font-medium rounded-full";

  const badgeClass =
    `${baseClass} ${variants[variant]} ${sizeClass} ${className}`.trim();

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
}
