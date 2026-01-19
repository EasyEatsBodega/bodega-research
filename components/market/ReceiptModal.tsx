"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
} from "lucide-react";
import type { Review } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ReceiptModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ review, isOpen, onClose }: ReceiptModalProps) {
  if (!review) return null;

  const receipt = review.ai_data?.publicReceipt;
  const score = review.rating_score || 0;

  const handleDownload = () => {
    if (review.infographic_url) {
      window.open(review.infographic_url, "_blank");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bodega Research: ${review.project_name}`,
          text: `Check out this Web3 project review for ${review.project_name}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="receipt-paper min-h-[600px]">
        {/* Receipt Header */}
        <div className="text-center py-6 border-b-2 border-dashed border-gray-300">
          <h2 className="text-2xl font-bold tracking-tight">BODEGA RESEARCH</h2>
          <p className="text-xs text-gray-500 mt-1">
            *** WEB3 DUE DILIGENCE ***
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(review.created_at).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Project Name & Score */}
        <div className="py-6 text-center border-b-2 border-dashed border-gray-300">
          <h3 className="text-xl font-bold uppercase">{review.project_name}</h3>
          <div className="mt-4 flex justify-center">
            <div className="bg-black text-white px-6 py-3 rounded-lg">
              <div className="text-xs text-gray-400">OVERALL SCORE</div>
              <div className="text-3xl font-bold">{score.toFixed(1)}/10</div>
            </div>
          </div>
        </div>

        {/* Scores Breakdown */}
        {receipt && (
          <>
            <div className="py-6 border-b-2 border-dashed border-gray-300">
              <div className="px-6">
                <div className="text-xs text-gray-500 mb-3">ITEM BREAKDOWN</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product-Market Fit</span>
                    <span className="font-bold">{receipt.scores.pmf}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UI/UX Quality</span>
                    <span className="font-bold">{receipt.scores.ui}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Sentiment</span>
                    <span className="font-bold">
                      {receipt.scores.sentiment}/10
                    </span>
                  </div>
                  <div className="h-px bg-gray-300 my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL</span>
                    <span>{receipt.scores.overall}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Alpha */}
            <div className="py-6 border-b-2 border-dashed border-gray-300">
              <div className="px-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-bold text-gray-500">
                    THE ALPHA
                  </span>
                </div>
                <ul className="space-y-2">
                  {receipt.theAlpha.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Friction */}
            <div className="py-6 border-b-2 border-dashed border-gray-300">
              <div className="px-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-gray-500">
                    THE FRICTION
                  </span>
                </div>
                <ul className="space-y-2">
                  {receipt.theFriction.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-600">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="py-6 border-b-2 border-dashed border-gray-300">
              <div className="px-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-gray-500">
                    RECOMMENDATIONS
                  </span>
                </div>
                <ul className="space-y-2">
                  {receipt.recommendations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600">&gt;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-xs text-gray-400">
            ********************************
          </p>
          <p className="text-xs text-gray-500 mt-2">THANK YOU FOR SHOPPING</p>
          <p className="text-xs text-gray-500">AT BODEGA RESEARCH</p>
          <p className="text-xs text-gray-400 mt-2">
            ********************************
          </p>

          {/* Verified Stamp */}
          {score >= 8 && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mt-4 inline-block border-4 border-green-600 rounded-lg px-4 py-2"
            >
              <span className="font-bold text-green-600 text-lg">
                BODEGA VERIFIED
              </span>
            </motion.div>
          )}
        </div>

        {/* Actions (outside receipt styling) */}
        <div className="bg-surface-secondary p-4 flex gap-3 justify-center border-t border-border">
          {review.infographic_url && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Tear edge effect */}
      <div className="receipt-tear-edge h-5 bg-[#f5f5dc]" />
    </Modal>
  );
}
