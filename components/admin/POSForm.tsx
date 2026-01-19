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
  ImagePlus,
  Lightbulb,
  X,
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
    brandImage: null,
    aisle1_pmf: "",
    aisle2_uiux: "",
    aisle3_general: "",
    aisle4_sentiment: "",
    my_recommendations: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintComplete, setIsPrintComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, brandImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, brandImage: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsPrinting(true);
    setIsPrintComplete(false);

    try {
      // Use FormData to handle both JSON and file upload
      const submitData = new FormData();
      submitData.append("projectName", formData.projectName);
      submitData.append("rawNotes", JSON.stringify({
        aisle1_pmf: formData.aisle1_pmf,
        aisle2_uiux: formData.aisle2_uiux,
        aisle3_general: formData.aisle3_general,
        aisle4_sentiment: formData.aisle4_sentiment,
        my_recommendations: formData.my_recommendations,
      }));
      if (formData.brandImage) {
        submitData.append("brandImage", formData.brandImage);
      }

      const response = await fetch("/api/generate-report", {
        method: "POST",
        body: submitData,
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
          brandImage: null,
          aisle1_pmf: "",
          aisle2_uiux: "",
          aisle3_general: "",
          aisle4_sentiment: "",
          my_recommendations: "",
        });
        setImagePreview(null);
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
      brandImage: null,
      aisle1_pmf: "",
      aisle2_uiux: "",
      aisle3_general: "",
      aisle4_sentiment: "",
      my_recommendations: "",
    });
    setImagePreview(null);
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
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
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
            </div>

            {/* Brand Image Upload */}
            <div className="lg:w-48">
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Brand Image
              </label>
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Brand preview"
                    className="w-full h-full object-contain bg-surface-tertiary"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-bodega-burgundy rounded-full hover:bg-bodega-coral transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-bodega-gold hover:bg-surface-tertiary/50 transition-colors">
                  <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500 font-mono">Upload logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
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

        {/* My Recommendations - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-secondary border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-bodega-gold/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-bodega-gold" />
            </div>
            <div>
              <span className="font-mono text-xs text-bodega-gold uppercase tracking-wider">
                YOUR TAKE
              </span>
              <h3 className="font-mono font-bold text-foreground">
                My Recommendations
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono mb-4 pl-12">
            Your personal recommendations and insights for the reader
          </p>
          <textarea
            value={formData.my_recommendations}
            onChange={(e) =>
              setFormData({ ...formData, my_recommendations: e.target.value })
            }
            placeholder="Share your specific recommendations, next steps, or personal insights..."
            className="w-full px-4 py-3 bg-surface-tertiary border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:border-bodega-gold focus:shadow-glow-gold transition-all min-h-[120px] resize-y"
          />
        </motion.div>

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
