"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "elevated" | "inventory";
  hoverable?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-lg overflow-hidden";

  const variantStyles = {
    default: "bg-surface-secondary border border-border",
    elevated: "bg-surface-tertiary border border-border-light shadow-lg",
    inventory: "inventory-tag", // Uses custom class from globals.css
  };

  return (
    <motion.div
      whileHover={
        hoverable
          ? {
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
}
