"use client";

import { motion } from "framer-motion";
import { Receipt, CheckCircle2 } from "lucide-react";

interface PrintAnimationProps {
  isVisible: boolean;
  isComplete: boolean;
  projectName: string;
}

export function PrintAnimation({
  isVisible,
  isComplete,
  projectName,
}: PrintAnimationProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="text-center">
        {!isComplete ? (
          <>
            {/* Printing Animation */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="relative"
            >
              {/* Receipt Paper */}
              <motion.div
                animate={{
                  height: ["100px", "200px", "300px", "400px"],
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
                className="w-64 bg-[#f5f5dc] rounded-t-lg overflow-hidden mx-auto"
              >
                {/* Receipt Content */}
                <div className="p-4 text-center font-mono text-black text-sm">
                  <p className="font-bold">BODEGA RESEARCH</p>
                  <p className="text-xs text-gray-500 mt-1">*** PRINTING ***</p>
                  <div className="border-t border-dashed border-gray-400 my-3" />
                  <p className="font-bold truncate">{projectName}</p>
                  <div className="border-t border-dashed border-gray-400 my-3" />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-xs"
                  >
                    Processing analysis...
                  </motion.div>
                </div>
              </motion.div>

              {/* Tear edge */}
              <div
                className="h-4 w-64 mx-auto"
                style={{
                  background: `linear-gradient(135deg, transparent 33.33%, #f5f5dc 33.33%, #f5f5dc 66.67%, transparent 66.67%)`,
                  backgroundSize: "12px 100%",
                }}
              />
            </motion.div>

            {/* Status Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Receipt className="w-8 h-8 text-bodega-gold mx-auto mb-2 animate-pulse" />
              <p className="font-mono text-foreground">
                Printing receipt for <span className="text-bodega-gold">{projectName}</span>
              </p>
              <p className="font-mono text-sm text-gray-500 mt-1">
                Claude is analyzing the data...
              </p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Complete Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="w-20 h-20 bg-bodega-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-surface-primary" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-mono font-bold text-2xl text-foreground mb-2">
                RECEIPT PRINTED
              </h3>
              <p className="font-mono text-gray-400">
                {projectName} has been added to inventory
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
