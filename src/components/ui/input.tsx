import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      error,
      type = "text",
      label,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      input
      w-full
      ${error ? "border-danger-color" : ""}
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon ? "pr-10" : ""}
      ${className}
    `.trim();

    const helperTextClasses = `text-xs mt-1 ${
      error
        ? "text-danger-color"
        : "text-text-light-secondary dark:text-text-dark-secondary"
    }`;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
              {leftIcon}
            </div>
          )}
          <input className={inputClasses} ref={ref} type={type} {...props} />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p className={helperTextClasses}>{error || helperText}</p>
        )}
      </div>
    );
  }
);
