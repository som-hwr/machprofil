"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolio } from "@/components/context/PortfolioContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuService } from "@/lib/services/menu.service";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { showLucidIcon } from "@/components/lucid-icon-map";

export default function BottomNav() {
  const { langI18n, profileType, languageType } = usePortfolio();
  const isMobile = useIsMobile();
  const { primaryMenuItems, moreMenuItems } = MenuService.getMenu(
    profileType,
    languageType,
    isMobile,
  );
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (currentScrollY + windowHeight >= documentHeight - 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isMoreActive = moreMenuItems.some((item) => pathname === item.path);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg transition-all duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {primaryMenuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.key}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative group ${
                  active
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`${active ? "scale-110" : "group-hover:scale-105"} transition-transform`}>
                  {showLucidIcon(item.icon, "", 24)}
                </div>
                <span className={`text-xs mt-1 ${active ? "font-bold" : ""}`}>
                  {langI18n[item.key as keyof typeof langI18n]}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
              </Link>
            );
          })}

          {moreMenuItems.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                    isMoreActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {showLucidIcon("more-horizontal", "", 24)}
                  <span className="text-xs mt-1">{langI18n.more}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="mb-2">
                {moreMenuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <DropdownMenuItem key={item.key} asChild>
                      <Link
                        key={item.key}
                        href={item.path}
                        className={`cursor-pointer ${active ? "bg-accent" : ""}`}
                      >
                        {langI18n[item.key as keyof typeof langI18n]}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
