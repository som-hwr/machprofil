"use client";

import { ReactNode } from "react";

export default function MinimalTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="minimal-template">
      {children}
    </div>
  );
}
