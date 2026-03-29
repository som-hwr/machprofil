"use client";

import React from "react";
import { TemplateSwitcher } from "@/components/switchers/template-switcher";
import { LanguageSwitcher } from "@/components/switchers/language-switcher";
import { ProfileSwitcher } from "@/components/switchers/profile-switcher";
import { ThemeSwitcher } from "@/components/switchers/theme-switcher";
import { settings_const } from "@/data/configs/generated/settings";

export interface FooterProps {
  siteTitle: string;
}

export default function Footer({ siteTitle }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium mb-1">{siteTitle}</p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {settings_const.show.LanguageChangeButton && <LanguageSwitcher />}
            {settings_const.show.TemplateChangeButton && <TemplateSwitcher />}
            {settings_const.show.ProfileChangeButton && <ProfileSwitcher />}
            {settings_const.show.ThemeChangeButton && <ThemeSwitcher />}
          </div>
        </div>
      </div>
    </footer>
  );
}
