"use client";

import { ReactNode } from "react";

export default function ModernTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="modern-template">
      {children}
    </div>
  );
}
