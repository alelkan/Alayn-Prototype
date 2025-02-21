"use client";

import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import BaseModal from "./BaseModal";

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

      <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="card">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-white/80 mb-6 leading-relaxed">{description}</p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-8 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
        >
          Got it
        </button>
      </BaseModal>
    </>
  );
} 