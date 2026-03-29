"use client";

import { ReactNode } from "react";

export default function MinimalTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="minimal-template">
      <style jsx global>{`
        .minimal-template {
          --primary: 0 0% 20%;
          --primary-foreground: 0 0% 100%;
        }

        .minimal-template {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .minimal-template h1,
        .minimal-template h2,
        .minimal-template h3 {
          font-weight: 300;
          letter-spacing: -0.02em;
          color: hsl(0, 0%, 20%);
        }

        .minimal-template .card {
          border: 1px solid hsl(0, 0%, 85%);
          box-shadow: none;
          border-radius: 2px;
          transition: all 0.2s ease;
        }

        .minimal-template .card:hover {
          border-color: hsl(0, 0%, 70%);
        }

        .minimal-template .button {
          border-radius: 0;
          border: 1px solid currentColor;
          background: transparent;
        }

        .minimal-template .button:hover {
          background: hsl(0, 0%, 20%);
          color: white;
        }

        .minimal-template .max-w-7xl {
          max-width: 60rem;
        }

        .minimal-template main > div {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .minimal-template section {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
      `}</style>
      {children}
    </div>
  );
}
