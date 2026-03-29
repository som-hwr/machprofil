"use client";

import { ReactNode } from "react";

export default function ClassicTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="classic-template">
      {children}
    </div>
  );
}
