import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function BaseCard({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
} 