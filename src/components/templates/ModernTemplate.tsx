"use client";

import { ReactNode } from "react";

export default function ModernTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="modern-template">
      <style jsx global>{`
        .modern-template {
          --primary: 220 90% 56%;
          --primary-foreground: 0 0% 100%;
        }

        .modern-template .bg-gradient {
          background: linear-gradient(
            135deg,
            hsl(220, 90%, 56%) 0%,
            hsl(200, 90%, 50%) 100%
          );
        }

        .modern-template h1 {
          background: linear-gradient(
            135deg,
            hsl(220, 90%, 56%),
            hsl(200, 90%, 50%)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modern-template h2 {
          color: hsl(220, 90%, 56%);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .modern-template .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .modern-template .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-template .card:hover {
          transform: translateY(-4px);
        }
      `}</style>
      {children}
    </div>
  );
}
