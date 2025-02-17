import React from "react";
import RippleButton from "./RippleButton";

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function BaseButton({ children, className = "", ...props }: BaseButtonProps) {
  return (
    <RippleButton className={`btn ${className}`} {...props}>
      {children}
    </RippleButton>
  );
} 