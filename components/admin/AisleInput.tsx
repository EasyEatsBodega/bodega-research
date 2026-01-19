"use client";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/Input";
import { LucideIcon } from "lucide-react";

interface AisleInputProps {
  aisleNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AisleInput({
  aisleNumber,
  title,
  description,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: AisleInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: aisleNumber * 0.1 }}
      className="bg-surface-tertiary border border-border rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-bodega-gold/20 rounded-lg">
          <Icon className="w-5 h-5 text-bodega-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-bodega-gold font-bold">
              AISLE {aisleNumber}
            </span>
          </div>
          <h3 className="font-mono font-bold text-foreground">{title}</h3>
          <p className="text-sm text-gray-500 font-mono mt-1">{description}</p>
        </div>
      </div>

      {/* Input */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="bg-surface-secondary"
      />
    </motion.div>
  );
}
