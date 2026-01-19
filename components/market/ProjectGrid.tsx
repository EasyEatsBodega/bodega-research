"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import type { Review } from "@/types";
import { InventoryTag } from "./InventoryTag";
import { ReceiptModal } from "./ReceiptModal";
import { Input } from "@/components/ui/Input";

interface ProjectGridProps {
  reviews: Review[];
}

export function ProjectGrid({ reviews }: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  const filteredReviews = reviews
    .filter((review) =>
      review.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "score") {
        return (b.rating_score || 0) - (a.rating_score || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Package className="w-6 h-6 text-bodega-gold" />
          <h2 className="font-mono font-bold text-2xl text-foreground">
            THE STOCK
          </h2>
        </motion.div>
        <p className="text-gray-400 font-mono text-sm">
          Browse our inventory of Web3 project reviews
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("date")}
            className={`px-4 py-2 font-mono text-sm rounded-lg border transition-all ${
              sortBy === "date"
                ? "border-bodega-gold text-bodega-gold"
                : "border-border text-gray-400 hover:border-gray-500"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy("score")}
            className={`px-4 py-2 font-mono text-sm rounded-lg border transition-all ${
              sortBy === "score"
                ? "border-bodega-gold text-bodega-gold"
                : "border-border text-gray-400 hover:border-gray-500"
            }`}
          >
            Top Rated
          </button>
          <button className="p-2 border border-border rounded-lg text-gray-400 hover:border-bodega-gold hover:text-bodega-gold transition-all">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review, index) => (
            <InventoryTag
              key={review.id}
              review={review}
              onClick={() => setSelectedReview(review)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="font-mono text-lg text-gray-400 mb-2">
            {searchQuery ? "No matching products" : "Shelves are empty"}
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            {searchQuery
              ? "Try a different search term"
              : "Check back soon for new inventory"}
          </p>
        </motion.div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </section>
  );
}
