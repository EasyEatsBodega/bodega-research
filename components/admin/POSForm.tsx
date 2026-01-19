"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Palette,
  AppWindow,
  MessageSquare,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AisleInput } from "./AisleInput";
import { PrintAnimation } from "./PrintAnimation";
import type { ReviewFormData } from "@/types";

interface POSFormProps {
  onSuccess?: () => void;
}

export function POSForm({ onSuccess }: POSFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    projectName: "",
    aisle1_pmf: "",
    aisle2_uiux: "",
    aisle3_general: "",
    aisle4_sentiment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintComplete, setIsPrintComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsPrinting(true);
    setIsPrintComplete(false);

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.projectName,
          rawNotes: {
            aisle1_pmf: formData.aisle1_pmf,
            aisle2_uiux: formData.aisle2_uiux,
            aisle3_general: formData.aisle3_general,
            aisle4_sentiment: formData.aisle4_sentiment,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate report");
      }

      // Show complete animation
      setIsPrintComplete(true);

      // Wait for animation, then reset
      setTimeout(() => {
        setIsPrinting(false);
        setIsPrintComplete(false);
        setFormData({
          projectName: "",
          aisle1_pmf: "",
          aisle2_uiux: "",
          aisle3_general: "",
          aisle4_sentiment: "",
        });
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setIsPrinting(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      aisle1_pmf: "",
      aisle2_uiux: "",
      aisle3_general: "",
      aisle4_sentiment: "",
    });
    setError(null);
  };

  const isFormValid =
    formData.projectName.trim() &&
    formData.aisle1_pmf.trim() &&
    formData.aisle2_uiux.trim() &&
    formData.aisle3_general.trim() &&
    formData.aisle4_sentiment.trim();

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-secondary border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-bodega-gold rounded-full animate-pulse" />
            <span className="font-mono text-sm text-gray-400">
              NEW ITEM ENTRY
            </span>
          </div>
          <Input
            label="Project Name"
            placeholder="Enter the project name..."
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            className="text-xl font-bold"
            required
          />
        </motion.div>

        {/* Aisles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AisleInput
            aisleNumber={1}
            title="Product-Market Fit"
            description="Does the product solve a real problem? Is there demand?"
            icon={Target}
            value={formData.aisle1_pmf}
            onChange={(value) =>
              setFormData({ ...formData, aisle1_pmf: value })
            }
            placeholder="Notes on PMF, target audience, problem-solution fit..."
          />

          <AisleInput
            aisleNumber={2}
            title="UI/UX Quality"
            description="How's the user experience? Design quality? Ease of use?"
            icon={Palette}
            value={formData.aisle2_uiux}
            onChange={(value) =>
              setFormData({ ...formData, aisle2_uiux: value })
            }
            placeholder="Notes on design, usability, user flow..."
          />

          <AisleInput
            aisleNumber={3}
            title="General App Assessment"
            description="Technical quality, features, documentation, team?"
            icon={AppWindow}
            value={formData.aisle3_general}
            onChange={(value) =>
              setFormData({ ...formData, aisle3_general: value })
            }
            placeholder="Notes on tech stack, features, roadmap, team..."
          />

          <AisleInput
            aisleNumber={4}
            title="Social Sentiment"
            description="Community vibes, Twitter sentiment, Discord activity?"
            icon={MessageSquare}
            value={formData.aisle4_sentiment}
            onChange={(value) =>
              setFormData({ ...formData, aisle4_sentiment: value })
            }
            placeholder="Notes on community, social presence, sentiment..."
          />
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-bodega-burgundy/20 border border-bodega-burgundy rounded-lg"
          >
            <p className="text-sm text-bodega-coral font-mono">{error}</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={!isFormValid}
            isLoading={isSubmitting}
            leftIcon={<Receipt className="w-5 h-5" />}
          >
            PRINT RECEIPT
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            CLEAR
          </Button>
        </div>
      </form>

      {/* Print Animation Overlay */}
      <PrintAnimation
        isVisible={isPrinting}
        isComplete={isPrintComplete}
        projectName={formData.projectName}
      />
    </>
  );
}
