import React, { useId } from "react";

export const Input = React.forwardRef(
  ({ label, error, helperText, className = "", id: customId, required, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          required={required}
          className={`flex h-10 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-error focus-visible:ring-error" : "border-border"
          } ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <p className={`mt-1.5 text-xs ${error ? "text-error" : "text-muted-foreground"}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
