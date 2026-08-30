import React from "react";

const variants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

export const Badge = ({ className = "", variant = "default", children, ...props }) => {
  const variantStyles = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
