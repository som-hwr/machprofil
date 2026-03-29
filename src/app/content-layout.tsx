"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { usePortfolio } from "@/components/context/PortfolioContext";
import { useContentLoader } from "@/components/hooks/use-content-loader";
import { AboutContent } from "@/lib/types/about.contract";
import { emptyAboutContent } from "@/data/configs/constants/empty.data";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profileType, languageType } = usePortfolio();

  const { data: about_content } = useContentLoader<AboutContent>(
    profileType,
    languageType,
    "about_content",
    emptyAboutContent,
  );

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <Header siteTitle={about_content.bio.name} profileType={profileType} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </div>
      </main>
      <Footer siteTitle={about_content.bio.name} />
      <ScrollToTop />
    </div>
  );
}
