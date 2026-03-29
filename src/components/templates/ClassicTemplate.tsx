"use client";

import { ReactNode } from "react";

export default function ClassicTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="classic-template">
      <style jsx global>{`
        .classic-template {
          --primary: 15 75% 48%;
          --primary-foreground: 0 0% 100%;
          font-family: Georgia, "Times New Roman", serif;
        }

        .classic-template h1,
        .classic-template h2,
        .classic-template h3 {
          font-family: Georgia, "Times New Roman", serif;
          color: hsl(15, 75%, 35%);
        }

        .classic-template .card {
          border: 2px solid hsl(15, 75%, 48%);
          box-shadow: 4px 4px 0 hsl(15, 75%, 85%);
          transition: all 0.3s ease;
        }

        .classic-template .card:hover {
          box-shadow: 6px 6px 0 hsl(15, 75%, 75%);
          transform: translate(-2px, -2px);
        }

        .classic-template .button {
          border-radius: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }

        .classic-template .button:hover {
          letter-spacing: 1.5px;
        }
      `}</style>
      {children}
    </div>
  );
}
