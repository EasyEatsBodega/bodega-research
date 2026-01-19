"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  LogOut,
  PlusCircle,
  Package,
  Users,
  BarChart3,
  Receipt,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { POSForm } from "./POSForm";
import { ReviewDetailModal } from "./ReviewDetailModal";
import type { Review, Lead } from "@/types";
import type { User } from "@supabase/supabase-js";

interface AdminDashboardProps {
  user: User;
  reviews: Review[];
  leads: Lead[];
}

type TabType = "new-review" | "inventory" | "leads" | "analytics";

export function AdminDashboard({ user, reviews, leads }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("new-review");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteReview = async (review: Review) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setDeleteConfirm(null);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const handleReviewSuccess = () => {
    router.refresh();
    setActiveTab("inventory");
  };

  const tabs = [
    { id: "new-review" as const, label: "New Review", icon: PlusCircle },
    { id: "inventory" as const, label: "Inventory", icon: Package },
    { id: "leads" as const, label: "Leads", icon: Users },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface-primary/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="p-2 bg-bodega-gold rounded-lg">
                <Store className="w-5 h-5 text-surface-primary" />
              </div>
              <div>
                <span className="font-mono font-bold text-foreground">
                  BODEGA POS
                </span>
                <span className="hidden sm:inline font-mono text-xs text-gray-500 ml-2">
                  Staff Dashboard
                </span>
              </div>
            </Link>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-400 font-mono">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Clock Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats & Navigation */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-surface-secondary border border-border rounded-xl p-6">
              <h3 className="font-mono text-sm text-gray-400 uppercase tracking-wider mb-4">
                Store Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">
                    Total Reviews
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {reviews.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">
                    Pending Leads
                  </span>
                  <span className="font-mono font-bold text-bodega-gold">
                    {leads.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-sm">
                    Avg Score
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {reviews.length > 0
                      ? (
                          reviews.reduce(
                            (acc, r) => acc + (r.rating_score || 0),
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-surface-secondary border border-border rounded-xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 font-mono text-sm
                    transition-all border-l-2
                    ${
                      activeTab === tab.id
                        ? "bg-surface-tertiary border-bodega-gold text-foreground"
                        : "border-transparent text-gray-400 hover:bg-surface-tertiary hover:text-foreground"
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {activeTab === "new-review" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Receipt className="w-6 h-6 text-bodega-gold" />
                  <h1 className="font-mono font-bold text-2xl text-foreground">
                    New Review Entry
                  </h1>
                </div>
                <POSForm onSuccess={handleReviewSuccess} />
              </motion.div>
            )}

            {activeTab === "inventory" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-bodega-gold" />
                  <h1 className="font-mono font-bold text-2xl text-foreground">
                    Inventory
                  </h1>
                </div>
                <div className="bg-surface-secondary border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 font-mono text-sm text-gray-400">
                            Project
                          </th>
                          <th className="text-left p-4 font-mono text-sm text-gray-400">
                            Score
                          </th>
                          <th className="text-left p-4 font-mono text-sm text-gray-400">
                            Date
                          </th>
                          <th className="text-left p-4 font-mono text-sm text-gray-400">
                            Status
                          </th>
                          <th className="text-right p-4 font-mono text-sm text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map((review) => (
                          <tr
                            key={review.id}
                            className="border-b border-border hover:bg-surface-tertiary transition-colors"
                          >
                            <td
                              className="p-4 font-mono text-foreground cursor-pointer"
                              onClick={() => setSelectedReview(review)}
                            >
                              {review.project_name}
                            </td>
                            <td
                              className="p-4 cursor-pointer"
                              onClick={() => setSelectedReview(review)}
                            >
                              <span
                                className={`font-mono font-bold ${
                                  (review.rating_score || 0) >= 8
                                    ? "text-bodega-gold"
                                    : (review.rating_score || 0) >= 6
                                      ? "text-bodega-orange"
                                      : "text-bodega-coral"
                                }`}
                              >
                                {review.rating_score?.toFixed(1) || "-"}
                              </span>
                            </td>
                            <td
                              className="p-4 font-mono text-sm text-gray-400 cursor-pointer"
                              onClick={() => setSelectedReview(review)}
                            >
                              {new Date(review.created_at).toLocaleDateString()}
                            </td>
                            <td
                              className="p-4 cursor-pointer"
                              onClick={() => setSelectedReview(review)}
                            >
                              <span
                                className={`inline-flex px-2 py-1 rounded text-xs font-mono ${
                                  review.infographic_url
                                    ? "bg-bodega-gold/20 text-bodega-gold"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {review.infographic_url ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(review);
                                }}
                                className="p-2 rounded-lg text-gray-500 hover:text-bodega-coral hover:bg-bodega-burgundy/20 transition-colors"
                                title="Delete review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {reviews.length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-gray-500 font-mono"
                            >
                              No reviews yet. Create your first one!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "leads" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-bodega-gold" />
                  <h1 className="font-mono font-bold text-2xl text-foreground">
                    Review Leads
                  </h1>
                </div>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-surface-secondary border border-border rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-mono font-bold text-foreground">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-bodega-gold font-mono">
                            {lead.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lead.telegram_username && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-bodega-navy/30 text-gray-300">
                            TG: {lead.telegram_username}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-bodega-gold/20 text-bodega-gold">
                          Contact via:{" "}
                          {lead.preferred_contact === "other"
                            ? lead.preferred_contact_other || "Other"
                            : lead.preferred_contact === "x_dms"
                              ? "X DMs"
                              : lead.preferred_contact === "telegram"
                                ? "Telegram"
                                : "Email"}
                        </span>
                      </div>
                      {lead.project_link && (
                        <a
                          href={lead.project_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-bodega-gold font-mono block mb-2"
                        >
                          {lead.project_link}
                        </a>
                      )}
                      {lead.message && (
                        <p className="text-sm text-gray-400 font-mono mt-3 p-3 bg-surface-tertiary rounded-lg border-l-2 border-bodega-gold">
                          {lead.message}
                        </p>
                      )}
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="bg-surface-secondary border border-border rounded-xl p-8 text-center">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-mono">
                        No leads yet. Share your page to get inquiries!
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-6 h-6 text-bodega-gold" />
                  <h1 className="font-mono font-bold text-2xl text-foreground">
                    Analytics
                  </h1>
                </div>
                <div className="bg-surface-secondary border border-border rounded-xl p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-mono">
                    Analytics coming soon. Track review performance and lead
                    conversion.
                  </p>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteConfirm(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-surface-secondary border border-border rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-bodega-burgundy/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-bodega-coral" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg text-foreground">
                  Delete Review
                </h3>
                <p className="text-sm text-gray-400 font-mono">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-300 font-mono text-sm mb-6">
              Are you sure you want to delete the review for{" "}
              <span className="text-bodega-gold font-bold">
                {deleteConfirm.project_name}
              </span>
              ? All associated data including images and reports will be
              permanently removed.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 !bg-bodega-burgundy hover:!bg-bodega-coral"
                onClick={() => handleDeleteReview(deleteConfirm)}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
