"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Package, CheckCircle2 } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { LeadFormData } from "@/types";

export function WholesaleInquiry() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    projectLink: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setIsSubmitted(true);
      setFormData({ name: "", projectLink: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-bodega-gold rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-8 h-8 text-surface-primary" />
        </motion.div>
        <h3 className="font-mono font-bold text-2xl text-foreground mb-2">
          ORDER RECEIVED
        </h3>
        <p className="text-gray-400 font-mono max-w-md mx-auto">
          Thanks for your interest! We&apos;ll review your project and get back
          to you within 48 hours.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setIsSubmitted(false)}
        >
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <section id="inquiry" className="py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-8 h-8 text-bodega-gold" />
            <h2 className="font-mono font-bold text-3xl text-foreground">
              WHOLESALE INQUIRY
            </h2>
          </div>
          <p className="text-gray-400 font-mono max-w-lg mx-auto">
            Got a project that needs a thorough review? Submit your details and
            we&apos;ll add it to our inventory checklist.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-surface-secondary border border-border rounded-xl p-8"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Project Link"
              placeholder="https://yourproject.xyz"
              value={formData.projectLink}
              onChange={(e) =>
                setFormData({ ...formData, projectLink: e.target.value })
              }
              hint="Website, Twitter, or any relevant link"
            />

            <Textarea
              label="Tell us about the project"
              placeholder="What should we focus on? Any specific concerns?"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
            />

            {error && (
              <div className="p-3 bg-bodega-burgundy/20 border border-bodega-burgundy rounded-lg">
                <p className="text-sm text-bodega-coral font-mono">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              REQUEST RESTOCK
            </Button>
          </div>
        </motion.form>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-mono">
          <span>48h Response Time</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>Confidential Process</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>No Strings Attached</span>
        </div>
      </div>
    </section>
  );
}
