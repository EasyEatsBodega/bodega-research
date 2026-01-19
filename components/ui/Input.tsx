"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-mono font-bold text-gray-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-surface-secondary border border-border rounded-lg
            text-foreground font-mono
            placeholder:text-gray-500
            focus:outline-none focus:border-bodega-gold focus:shadow-glow-gold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-bodega-coral focus:border-bodega-coral focus:shadow-glow-coral" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500 font-mono">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-bodega-coral font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-mono font-bold text-gray-400 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 min-h-[120px]
            bg-surface-secondary border border-border rounded-lg
            text-foreground font-mono
            placeholder:text-gray-500
            focus:outline-none focus:border-bodega-gold focus:shadow-glow-gold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y
            ${error ? "border-bodega-coral focus:border-bodega-coral" : ""}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500 font-mono">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-bodega-coral font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
