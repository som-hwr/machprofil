"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/context/PortfolioContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showLucidIcon } from "@/components/lucid-icon-map";
import { useContentLoader } from "@/components/hooks/use-content-loader";
import { AboutContent } from "@/lib/types/about.contract";
import { emptyAboutContent } from "@/data/configs/constants/empty.data";
import {
  Experience,
  Project,
  Service,
  Skills,
  Testimonial,
} from "@/lib/types/portfolio";

export default function ClientPage() {
  const { langI18n, profileType, languageType } = usePortfolio();

  const {
    data: about_content,
  } = useContentLoader<AboutContent>(
    profileType,
    languageType,
    "about_content",
    emptyAboutContent,
  );

  const { data: experiences } = useContentLoader<Experience[]>(
    profileType,
    languageType,
    "experience_list",
    [],
  );

  const { data: projects } = useContentLoader<Project[]>(
    profileType,
    languageType,
    "project_list",
    [],
  );

  const { data: skills } = useContentLoader<Skills[]>(
    profileType,
    languageType,
    "skill_list",
    [],
  );

  const { data: testimonials } = useContentLoader<Testimonial[]>(
    profileType,
    languageType,
    "testimonial_list",
    [],
  );

  const { data: services } = useContentLoader<Service[]>(
    profileType,
    languageType,
    "service_list",
    [],
  );

  const profile = about_content.bio;
  const socialLinks = about_content.socialLinks.filter((link) => link.url);

  const stats = useMemo(() => {
    const totalYears =
      experiences.length > 0
        ? Math.floor(
            experiences.reduce((total: number, exp: any) => {
              const start = new Date(exp.startDate);
              const end =
                exp.endDate === "Present" ? new Date() : new Date(exp.endDate);
              return total + (end.getTime() - start.getTime());
            }, 0) /
              (1000 * 60 * 60 * 24 * 365),
          )
        : 8;

    const completedProjects = projects.filter(
      (p: any) => p.status === "Completed",
    ).length;

    const uniqueClients =
      new Set(
        experiences.filter((e: any) => e.client).map((e: any) => e.client),
      ).size +
      new Set(projects.filter((p: any) => p.client).map((p: any) => p.client))
        .size;

    const fiveStarCount = testimonials.filter(
      (t: any) => t.rating === 5,
    ).length;
    const satisfactionRate =
      testimonials.length > 0
        ? Math.round((fiveStarCount / testimonials.length) * 100)
        : 98;

    return {
      experience: totalYears > 0 ? `${totalYears}+` : "8+",
      projects:
        completedProjects > 0 ? `${completedProjects}+` : `${projects.length}+`,
      clients: uniqueClients > 0 ? `${uniqueClients}+` : "80+",
      satisfaction: `${satisfactionRate}%`,
    };
  }, [experiences, projects, testimonials]);

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p: any) => p.featured);
    return (featured.length > 0 ? featured : projects).slice(0, 3);
  }, [projects]);

  const topServices = useMemo(() => {
    if (services.length > 0) {
      return services.slice(0, 4);
    }

    const skillCategories = [
      ...new Set(skills.map((s: any) => s.category)),
    ].slice(0, 4);
    return skillCategories.map((category: string, idx: number) => ({
      id: `service-${idx}`,
      title: `${category}`,
      description: `${langI18n.professional} ${category.toLowerCase()} ${langI18n.services_tailored}`,
      icon:
        idx === 0
          ? "code"
          : idx === 1
            ? "palette"
            : idx === 2
              ? "smartphone"
              : "users",
    }));
  }, [services, skills]);

  const topTestimonials = testimonials.slice(0, 2);

  return (
    <div className="w-full">
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent">
        <div className="absolute inset-0 bg-grid opacity-[0.02]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {profile.available && (
              <Badge className="gradient-primary text-white border-0 px-4 py-1.5 text-sm">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                {langI18n.available_for_work}
              </Badge>
            )}

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text leading-tight">
              {profile.name}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
              {profile.title}
            </p>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
              {about_content.intro.tagline}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <Button size="lg" className="group" asChild>
                <Link href="/contact">
                  {showLucidIcon("send", "w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform")}
                  {langI18n.get_in_touch}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  {showLucidIcon("briefcase", "w-4 h-4 mr-2")}
                  {langI18n.view_projects}
                </Link>
              </Button>
            </div>

            {socialLinks?.length > 0 && (
              <div className="flex justify-center gap-2 pt-4">
                {socialLinks.map((link) => (
                  <Button
                    key={link.platform}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                    >
                      {showLucidIcon(link.icon, "w-5 h-5")}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/experience" className="group text-center space-y-1 hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{stats.experience}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{langI18n.years_experience}</div>
            </Link>
            <Link href="/projects" className="group text-center space-y-1 hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{stats.projects}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{langI18n.projects_completed}</div>
            </Link>
            <Link href="/projects" className="group text-center space-y-1 hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{stats.clients}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{langI18n.happy_clients}</div>
            </Link>
            <Link href="/testimonials" className="group text-center space-y-1 hover:scale-105 transition-transform">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{stats.satisfaction}</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{langI18n.satisfaction_rate}</div>
            </Link>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{langI18n.featured_projects}</h2>
              <p className="text-muted-foreground">{langI18n.projects_sub_title}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project: any) => (
                <Card key={project.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                  {project.image && (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies.slice(0, 3).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" className="px-0" asChild>
                      <Link href={`/projects`}>
                        {langI18n.view_details}
                        {showLucidIcon("arrow-right", "w-4 h-4 ml-1")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/projects">
                  {langI18n.view_projects}
                  {showLucidIcon("arrow-right", "w-4 h-4 ml-2")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {topServices.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{langI18n.services}</h2>
              <p className="text-muted-foreground">{langI18n.services_sub_title}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {topServices.map((service: any) => (
                <Card key={service.id} className="text-center p-6 hover:shadow-lg transition-all border-border/50 hover:border-primary/50 group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {showLucidIcon(service.icon, "w-7 h-7")}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {topTestimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{langI18n.testimonials}</h2>
              <p className="text-muted-foreground">{langI18n.testimonials_sub_title}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {topTestimonials.map((testimonial: any) => (
                <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-all border-border/50">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {showLucidIcon(
                          "star",
                          `w-4 h-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic text-foreground/90">
                    &ldquo;{testimonial.feedback}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/testimonials">
                  {langI18n.testimonials}
                  {showLucidIcon("arrow-right", "w-4 h-4 ml-2")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{langI18n.cta_title}</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {langI18n.cta_start_your_project}
          </p>
          <Button size="lg" className="group" asChild>
            <Link href="/contact">
              {showLucidIcon("send", "w-4 h-4 mr-2")}
              {langI18n.get_in_touch}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
