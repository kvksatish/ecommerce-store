import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "outline"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass =
    size === "sm"
      ? "text-xs py-1.5 px-3"
      : size === "lg"
      ? "text-base py-3 px-6"
      : "text-sm py-2 px-4";

  const baseClass =
    "btn flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-color/20";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
    success: "btn-success",
    outline:
      "bg-transparent border border-border-light hover:bg-primary-color/5 text-text-light dark:border-border-dark dark:text-text-dark dark:hover:bg-primary-color/10",
    ghost:
      "bg-transparent hover:bg-primary-color/5 text-text-light dark:text-text-dark dark:hover:bg-primary-color/10",
    link: "bg-transparent p-0 h-auto shadow-none text-primary-color hover:underline dark:text-primary-color",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || loading ? "opacity-60 cursor-not-allowed" : "";

  const buttonClass =
    `${baseClass} ${variantClasses[variant]} ${sizeClass} ${widthClass} ${disabledClass} ${className}`.trim();

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
