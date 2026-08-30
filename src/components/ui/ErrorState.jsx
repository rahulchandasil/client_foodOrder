import React from "react";
import { Button } from "./Button";

export const ErrorState = ({ title = "Something went wrong", description, onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-error/20 bg-error/5 px-6 py-12 text-center ${className}`}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-3xl text-error">
        ⚠️
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
