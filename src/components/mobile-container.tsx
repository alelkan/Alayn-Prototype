"use client";

import { useEffect, useState } from "react";

export default function MobileContainer({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isMobile) {
    return (
      <div className="hidden md:flex h-screen w-screen items-center justify-center bg-primary/10">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-primary mb-4">Mobile Only Experience</h1>
          <p className="text-foreground/60">Please access this application from a mobile device.</p>
        </div>
      </div>
    );
  }

  return <div className="max-w-md mx-auto min-h-screen">{children}</div>;
}