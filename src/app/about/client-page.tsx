"use client";

import React from "react";
import { usePortfolio } from "@/components/context/PortfolioContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showLucidIcon } from "@/components/lucid-icon-map";
import { useContentLoader } from "@/components/hooks/use-content-loader";
import { AboutContent } from "@/lib/types/about.contract";
import { emptyAboutContent } from "@/data/configs/constants/empty.data";

export default function ClientPage() {
  const { langI18n, profileType, languageType } = usePortfolio();

  const {
    data: about_content,
    loading,
    error,
  } = useContentLoader<AboutContent>(
    profileType,
    languageType,
    "about_content",
    emptyAboutContent,
  );

  const {
    bio,
    intro,
    sections = [],
    stats = [],
    interests = [],
    socialLinks,
    cta,
  } = about_content;

  return (
    <>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-primary/20">
              <img
                src={bio.image}
                alt={bio.name}
                className="w-full h-full object-cover"
              />
            </div>
            {bio.available && (
              <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Available
              </div>
            )}
          </div>

          {/* Hero Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{bio.name}</h1>
            <p className="text-2xl text-primary font-semibold mb-3">
              {bio.title}
            </p>
            <p className="text-lg text-muted-foreground mb-4">{bio.tagline}</p>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  {showLucidIcon("map-pin", "w-5 h-5")}
                </div>
                <span className="leading-none">{bio.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 flex items-center justify-center">
                  {showLucidIcon("mail", "w-5 h-5")}
                </div>
                <a
                  href={`mailto:${bio.email}`}
                  className="hover:text-primary transition-colors leading-none"
                >
                  {bio.email}
                </a>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks && (
              <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                {socialLinks.map((social) => {
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110 shadow-sm hover:shadow-md"
                      aria-label={social.platform}
                      title={social.platform}
                    >
                      {showLucidIcon(social.icon, "w-5 h-5")}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Introduction */}
      {intro && (
        <Card className="mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <p className="text-lg leading-relaxed">{intro.tagline}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => {
            return (
              <Card key={stat.label} className="text-center hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/10">
                    {showLucidIcon(
                      stat.icon,
                      "w-6 h-6 text-primary",
                    )}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* About Sections */}
      {sections.length > 0 && (
        <div className="space-y-8 mb-12">
          {sections.map((section) => {
            return (
              <Card key={section.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {showLucidIcon(section.icon, "w-6 h-6")}
                    </div>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed ml-16">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interests/Hobbies */}
      {interests.length > 0 && (
        <Card className="mb-12 hover:shadow-md transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                {showLucidIcon("heart", "w-5 h-5 text-primary")}
              </div>
              {langI18n.interests_hobbies}
            </h2>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => {
                return (
                  <Badge
                    key={interest.name}
                    variant="secondary"
                    className="px-4 py-2.5 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      {showLucidIcon(interest.icon, "w-4 h-4")}
                      <span>{interest.name}</span>
                    </div>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      {cta && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-3">{cta.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                {cta.primaryButton}
                {showLucidIcon("arrow-right", "w-5 h-5 ml-2")}
              </Button>
              {bio.resumeUrl && (
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {showLucidIcon("download", "w-5 h-5 mr-2")}
                  {cta.secondaryButton}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
