import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "bordered" | "elevated" | "flat";
  className?: string;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  const variantClasses = {
    default:
      "card bg-background-light dark:bg-background-dark-secondary border border-border-light dark:border-border-dark shadow-md",
    bordered:
      "bg-background-light dark:bg-background-dark-secondary border-2 border-border-light dark:border-border-dark",
    elevated:
      "bg-background-light dark:bg-background-dark-secondary border border-border-light dark:border-border-dark shadow-lg hover:shadow-xl transition-shadow",
    flat: "bg-background-light-secondary dark:bg-background-dark-secondary",
  };

  const cardClass = `${variantClasses[variant]} rounded-lg ${className}`.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`p-6 pb-2 flex flex-col space-y-1.5 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={`text-sm text-text-light-secondary dark:text-text-dark-secondary ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div className={`p-6 pt-0 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
