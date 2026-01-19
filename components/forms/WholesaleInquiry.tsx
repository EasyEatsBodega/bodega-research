"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Package, CheckCircle2, ChevronDown } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { LeadFormData, ContactMethod } from "@/types";

const CONTACT_OPTIONS: { value: ContactMethod; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "x_dms", label: "X DMs" },
  { value: "telegram", label: "Telegram" },
  { value: "other", label: "Other" },
];

export function WholesaleInquiry() {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    projectLink: "",
    email: "",
    telegramUsername: "",
    preferredContact: "email",
    preferredContactOther: "",
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
      setFormData({
        name: "",
        projectLink: "",
        email: "",
        telegramUsername: "",
        preferredContact: "email",
        preferredContactOther: "",
        message: "",
      });
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
          REQUEST RECEIVED
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
              REVIEW INQUIRY
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Telegram Username"
                placeholder="@username"
                value={formData.telegramUsername}
                onChange={(e) =>
                  setFormData({ ...formData, telegramUsername: e.target.value })
                }
                hint="Optional"
              />
              <div className="space-y-2">
                <label className="block text-sm font-mono text-gray-400 uppercase tracking-wider">
                  Preferred Contact Method
                </label>
                <div className="relative">
                  <select
                    value={formData.preferredContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContact: e.target.value as ContactMethod,
                        preferredContactOther:
                          e.target.value !== "other"
                            ? ""
                            : formData.preferredContactOther,
                      })
                    }
                    className="w-full bg-surface-tertiary border border-border rounded-lg px-4 py-3 font-mono text-foreground appearance-none cursor-pointer hover:border-bodega-gold/50 focus:border-bodega-gold focus:outline-none focus:ring-1 focus:ring-bodega-gold transition-colors"
                  >
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {formData.preferredContact === "other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  label="Other Contact Method"
                  placeholder="Discord, Signal, etc."
                  value={formData.preferredContactOther}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactOther: e.target.value,
                    })
                  }
                  required
                />
              </motion.div>
            )}

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
              REQUEST REVIEW
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
