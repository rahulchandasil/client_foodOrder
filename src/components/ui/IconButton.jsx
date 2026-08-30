import React from "react";

const variants = {
  default: "bg-transparent text-foreground hover:bg-muted focus-visible:ring-primary",
  outline: "bg-transparent border border-border text-foreground hover:bg-muted focus-visible:ring-primary",
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary",
};

const sizes = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

export const IconButton = React.forwardRef(
  ({ className = "", variant = "default", size = "md", "aria-label": ariaLabel, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = variants[variant] || variants.default;
    const sizeStyles = sizes[size] || sizes.md;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
