// components/shared/Pagination.tsx
import React from "react";

export interface PageHeadingProps {
  title: string;
  subTitle: string;
}

export function PageHeading({ title, subTitle }: PageHeadingProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-4">
          {title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          {subTitle}
        </p>
      </div>
    </div>
  );
}
