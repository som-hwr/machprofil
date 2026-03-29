"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TemplateSwitcher } from "@/components/switchers/template-switcher";
import { LanguageSwitcher } from "@/components/switchers/language-switcher";
import { ProfileSwitcher } from "@/components/switchers/profile-switcher";
import { ThemeSwitcher } from "@/components/switchers/theme-switcher";
import { settings_const } from "@/data/configs/generated/settings";
import { profileLanguageMap, ProfileType } from "@/lib/types/type.config";
import { ConfigData } from "@/data/configs/constants/config-data";

export interface HeaderProps {
  siteTitle: string;
  profileType: ProfileType;
}

export default function Header({ siteTitle, profileType }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const allowedLanguages = profileLanguageMap[profileType];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        scrolled
          ? "glass border-b shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-lg font-bold gradient-text">
              {siteTitle}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {settings_const.show.ProfileChangeButton &&
              ConfigData.profileList.length > 1 && <ProfileSwitcher />}
            {settings_const.show.LanguageChangeButton &&
              allowedLanguages.length > 1 && <LanguageSwitcher />}
            {settings_const.show.TemplateChangeButton && <TemplateSwitcher />}
            {settings_const.show.ThemeChangeButton && <ThemeSwitcher />}
          </div>
        </div>
      </div>
    </header>
  );
}
