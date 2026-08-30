import React from "react";
import { Button } from "./Button";

export const EmptyState = ({ icon, title, description, actionText, onAction, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-16 text-center shadow-sm ${className}`}>
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
          {icon}
        </div>
      )}
      <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionText}</Button>
        </div>
      )}
    </div>
  );
};
