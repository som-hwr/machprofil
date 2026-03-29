"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/context/PortfolioContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
    loading,
    error,
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

  // Aggregate data from existing sources
  const profile = about_content.bio;
  // Get social links from profile or about data
  const socialLinks = about_content.socialLinks.filter((link) => link.url);

  // Calculate statistics
  const stats = useMemo(() => {
    // Calculate years of experience
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

    // Count completed projects
    const completedProjects = projects.filter(
      (p: any) => p.status === "Completed",
    ).length;

    // Count unique clients
    const uniqueClients =
      new Set(
        experiences.filter((e: any) => e.client).map((e: any) => e.client),
      ).size +
      new Set(projects.filter((p: any) => p.client).map((p: any) => p.client))
        .size;

    // Calculate satisfaction rate (based on testimonials with 5 stars)
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

  // Get featured projects (up to 3)
  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p: any) => p.featured);
    return (featured.length > 0 ? featured : projects).slice(0, 3);
  }, [projects]);

  // Get top services (up to 4)
  const topServices = useMemo(() => {
    if (services.length > 0) {
      return services.slice(0, 4);
    }

    // Generate services from skills if no services data
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

  // Get top testimonials (up to 2)
  const topTestimonials = testimonials.slice(0, 2);

  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              {profile.available && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  {langI18n.available_for_work}
                </Badge>
              )}

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {profile.name}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-semibold text-muted-foreground mb-4">
                  {profile.title}
                </h2>
                <p className="text-xl text-primary font-medium mb-6">
                  {profile.tagline}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {about_content.intro.tagline}
                </p>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    {showLucidIcon("map-pin", "w-4 h-4")}
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    {showLucidIcon("mail", "w-4 h-4")}
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/contact">
                    {showLucidIcon("mail", "w-5 h-5 mr-2")}
                    {langI18n.get_in_touch}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  asChild
                >
                  <Link href="/projects">
                    {showLucidIcon("eye", "w-5 h-5 mr-2")}
                    {langI18n.view_projects}
                  </Link>
                </Button>
                {profile.resumeUrl && (
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-lg px-8"
                    asChild
                  >
                    <Link href="/resume">
                      {showLucidIcon("download", "w-5 h-5 mr-2")}
                      {langI18n.resume}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Social Links */}
              {socialLinks?.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social: any) => {
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={social.platform}
                      >
                        {showLucidIcon(social.icon, "w-5 h-5")}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-3xl"></div>
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="relative rounded-full w-full shadow-2xl border-8 border-background"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Link href="/experience" className="text-center group cursor-pointer transition-all hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80">
                {stats.experience}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground">
                {langI18n.years_experience}
              </div>
            </Link>
            <Link href="/projects" className="text-center group cursor-pointer transition-all hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80">
                {stats.projects}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground">
                {langI18n.projects_completed}
              </div>
            </Link>
            <Link href="/projects" className="text-center group cursor-pointer transition-all hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80">
                {stats.clients}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground">
                {langI18n.happy_clients}
              </div>
            </Link>
            <Link href="/testimonials" className="text-center group cursor-pointer transition-all hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:text-primary/80">
                {stats.satisfaction}
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground">
                {langI18n.satisfaction_rate}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      {topServices.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{langI18n.what_i_do}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {langI18n.what_i_do_detail}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topServices.map((service: any) => {
                return (
                  <Card
                    key={service.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        {showLucidIcon(service.icon, "w-6 h-6 text-primary")}
                      </div>
                      <h3 className="text-xl font-bold">{service.title}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  {langI18n.featured_projects}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {langI18n.some_of_my_recent_work}
                </p>
              </div>
              {projects.length > 3 && (
                <Button variant="outline" asChild>
                  <Link href="/projects">
                    {langI18n.view_all}
                    {showLucidIcon("arrow-right", "w-4 h-4 ml-2")}
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: any) => (
                <Card
                  key={project.id}
                  className="overflow-hidden group hover:shadow-xl transition-all"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                  <CardHeader>
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground line-clamp-2">
                      {project.shortDescription || project.description}
                    </p>
                  </CardHeader>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {topTestimonials.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                {langI18n.client_testimonials}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {langI18n.client_testimonials_detail}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {topTestimonials.map((testimonial: any) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) =>
                        showLucidIcon(
                          "star",
                          "w-5 h-5 fill-yellow-400 text-yellow-400",
                        ),
                      )}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content || testimonial.testimonial}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {langI18n.cta_something_amazing}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {langI18n.cta_something_amazing_detail}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/contact">
                Start a Project
                {showLucidIcon("arrow-right", "w-5 h-5 ml-2")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              asChild
            >
              <Link href="/projects">{langI18n.view_my_work}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
