import Link from "next/link";
import BaseCard from "./BaseCard";
import React from "react";

interface CardLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function CardLink({ href, children, className = "" }: CardLinkProps) {
  return (
    <Link href={href}>
      <BaseCard className={className}>
        {children}
      </BaseCard>
    </Link>
  );
} 