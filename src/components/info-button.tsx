"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";

interface InfoButtonProps {
  title: string;
  description: string;
}

export default function InfoButton({ title, description }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-4 top-4 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-white/60 hover:bg-secondary transition-colors"
      >
        <FaInfoCircle className="w-full h-full" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-[90%] max-w-md bg-secondary p-6 rounded-xl shadow-lg z-50 text-center mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-white/80 mb-6 leading-relaxed">{description}</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 px-8 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 