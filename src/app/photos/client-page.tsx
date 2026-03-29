"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "@/components/context/PortfolioContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterConfig, SortConfig } from "@/lib/types/shared.contract";
import { Photo } from "@/lib/types/portfolio";
import { SortOption } from "@/lib/types/type.config";
import { formatDateLong } from "@/lib/helpers/date.helper";
import { showLucidIcon } from "@/components/lucid-icon-map";
import { useContentLoader } from "@/components/hooks/use-content-loader";
import { usePagination } from "@/components/hooks/use-pagination";

type ViewMode = "gallery" | "albums";

export default function ClientPage() {
  const { langI18n, profileType, languageType } = usePortfolio();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");

  const {
    data: photos,
    loading,
    error,
  } = useContentLoader<Photo[]>(profileType, languageType, "photo_list", []);

  // Get URL parameters
  const albumParam = searchParams?.get("album");
  const photoParam = searchParams?.get("photo");

  // Set album filter based on URL parameter
  useEffect(() => {
    if (albumParam && albumParam !== "all") {
      setSelectedAlbum(decodeURIComponent(albumParam));
      setViewMode("gallery");
    } else if (!albumParam) {
      setSelectedAlbum("all");
    }
  }, [albumParam]);

  // Get unique albums and tags
  const albums = useMemo(() => {
    const uniqueAlbums = [
      ...new Set(photos.map((photo: Photo) => photo.album).filter(Boolean)),
    ];
    return uniqueAlbums.sort();
  }, [photos]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(photos.map((photo) => photo.category)),
    ];
    return uniqueCategories.sort();
  }, [photos]);

  const tags = useMemo(() => {
    const allTags = photos.flatMap((photo: Photo) => photo.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [photos]);

  // Group photos by album
  const albumGroups = useMemo(() => {
    const groups: { [key: string]: Photo[] } = {};
    photos.forEach((photo: Photo) => {
      if (!groups[photo.album]) {
        groups[photo.album] = [];
      }
      groups[photo.album].push(photo);
    });
    return groups;
  }, [photos]);

  // Filter and search photos
  const filteredPhotos = useMemo(() => {
    let filtered = photos.filter((photo: Photo) => {
      // Album filter
      if (selectedAlbum !== "all" && photo.album !== selectedAlbum) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && photo.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag !== "all" && !photo.tags?.includes(selectedTag)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          photo.title,
          photo.album,
          photo.description || "",
          ...(photo.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort photos
    filtered.sort((a: Photo, b: Photo) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
        case "date-asc":
          return (
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
          );
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "album-asc":
          return (a.album || "").localeCompare(b.album || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    photos,
    selectedAlbum,
    selectedCategory,
    selectedTag,
    searchQuery,
    sortBy,
  ]);
  const {
    currentPage,
    setCurrentPage,
    currentItems: currentPhotos,
    totalPages,
    totalItems: totalPhotos,
  } = usePagination(filteredPhotos);

  // Get page from URL or default to 1
  const pageParam = searchParams?.get("page");

  useEffect(() => {
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [pageParam]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    // Update URL to remove page parameter when filters change
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("page");
    if (params.toString()) {
      router.push(`/photos?${params.toString()}`, { scroll: false });
    } else {
      router.push("/photos", { scroll: false });
    }
  }, [searchQuery, selectedAlbum, selectedCategory, selectedTag, sortBy]);

  // Find current photo for detail view
  const currentPhoto = photoParam
    ? photos.find((p: Photo) => p.id.toString() === photoParam)
    : null;

  // Handle album selection from filter
  const handleAlbumChange = (album: string) => {
    setSelectedAlbum(album);
    // Update URL with album parameter
    const params = new URLSearchParams(searchParams?.toString());
    if (album !== "all") {
      params.set("album", album);
    } else {
      params.delete("album");
    }
    params.delete("photo"); // Clear photo when changing album
    router.push(`/photos?${params.toString()}`, { scroll: false });
  };

  // Configure filters
  const filterConfigs: FilterConfig[] = [
    {
      name: "album",
      label: langI18n.album,
      value: selectedAlbum,
      onChange: handleAlbumChange,
      options: [
        { value: "all", label: langI18n.album_all },
        ...albums.map((album: string) => ({ value: album, label: album })),
      ],
    },
    {
      name: "category",
      label: langI18n.category,
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { value: "all", label: langI18n.all_categories },
        ...categories.map((cat) => ({ value: cat, label: cat })),
      ],
    },
    {
      name: "tag",
      label: langI18n.tag,
      value: selectedTag,
      onChange: setSelectedTag,
      options: [
        { value: "all", label: langI18n.tag_all },
        ...tags.map((tag: string) => ({ value: tag, label: tag })),
      ],
    },
  ];

  const sortConfig: SortConfig = {
    value: sortBy,
    onChange: (value: string) => setSortBy(value as SortOption),
    options: [
      { value: "date-desc", label: langI18n.date_newest },
      { value: "date-asc", label: langI18n.date_oldest },
      { value: "title-asc", label: langI18n.title_a_z },
      { value: "title-desc", label: langI18n.title_z_a },
      { value: "album-asc", label: langI18n.album_a_z },
      { value: "views-desc", label: langI18n.most_viewed },
    ],
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedAlbum("all");
    setSelectedTag("all");
    setSortBy("date-desc");
    router.push("/photos", { scroll: false });
  };

  const handlePhotoClick = (photo: Photo) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("photo", photo.id.toString());
    router.push(`/photos?${params.toString()}`, { scroll: false });
  };

  const handleClosePhoto = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("photo");
    router.push(`/photos?${params.toString()}`, { scroll: false });
  };

  const handleAlbumCardClick = (albumName: string) => {
    setSelectedAlbum(albumName);
    setViewMode("gallery");
    router.push(`/photos?album=${encodeURIComponent(albumName)}`, {
      scroll: false,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams?.toString());
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    router.push(`/photos?${params.toString()}`, { scroll: true });
  };

  // If photo detail is open, show full-screen view
  if (currentPhoto) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleClosePhoto}
            >
              {showLucidIcon("arrow-left", "w-5 h-5 mr-2")}
              Back to Gallery
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleClosePhoto}
            >
              {showLucidIcon("x", "w-5 h-5")}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full flex flex-col lg:flex-row">
          {/* Image/Video Container */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
            {currentPhoto.image.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={currentPhoto.image}
                controls
                autoPlay
                className="max-w-full max-h-full"
              >
                <source src={currentPhoto.image} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full lg:w-96 bg-background p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l border-border">
            <h2 className="text-2xl font-bold mb-2">{currentPhoto.title}</h2>
            <Badge variant="secondary" className="mb-4">
              {currentPhoto.album}
            </Badge>

            {currentPhoto.description && (
              <p className="text-muted-foreground mb-4">
                {currentPhoto.description}
              </p>
            )}

            <div className="space-y-3 mb-4">
              {currentPhoto.date && (
                <div className="flex items-center gap-2 text-sm">
                  {showLucidIcon("calendar", "w-4 h-4 text-muted-foreground")}
                  <span>{formatDateLong(currentPhoto.date)}</span>
                </div>
              )}
              {currentPhoto.location && (
                <div className="flex items-center gap-2 text-sm">
                  {showLucidIcon("map-pin", "w-4 h-4 text-muted-foreground")}
                  <span>{currentPhoto.location}</span>
                </div>
              )}
              {currentPhoto.camera && (
                <div className="flex items-center gap-2 text-sm">
                  {showLucidIcon("camera", "w-4 h-4 text-muted-foreground")}
                  <span>{currentPhoto.camera}</span>
                </div>
              )}
            </div>

            {currentPhoto.tags && currentPhoto.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPhoto.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {selectedAlbum !== "all" ? selectedAlbum : langI18n.photos}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              {selectedAlbum !== "all"
                ? `${langI18n.viewing_album}: ${selectedAlbum}`
                : langI18n.viewing_album_detail}
            </p>
          </div>
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "gallery" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("gallery")}
            >
              {showLucidIcon("grid3x3", "w-4 h-4 mr-2")}
              Gallery
            </Button>
            <Button
              variant={viewMode === "albums" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("albums")}
            >
              {showLucidIcon("layers", "w-4 h-4 mr-2")}
              Albums
            </Button>
          </div>
        </div>
      </div>

      {/* Albums View */}
      {viewMode === "albums" ? (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{langI18n.photo_albums}</h2>
            <p className="text-muted-foreground">
              {langI18n.photo_albums_detail}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(albumGroups).map(
              ([albumName, albumPhotos]: [string, any]) => (
                <Card
                  key={albumName}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => handleAlbumCardClick(albumName)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={albumPhotos[0].image}
                      alt={albumName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-sm">
                        {showLucidIcon("image-icon", "w-4 h-4")}
                        <span>
                          {albumPhotos.length} {langI18n.photos.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {albumName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {albumPhotos.length}{" "}
                      {albumPhotos.length === 1
                        ? langI18n.photo.toLowerCase()
                        : langI18n.photos.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Gallery View with Filters */}
          <FilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={langI18n.photos_search_placeholder}
            filters={filterConfigs}
            sortConfig={sortConfig}
            resultsCount={totalPhotos}
            resultsLabel={
              totalPhotos === 1
                ? langI18n.photo.toLowerCase()
                : langI18n.photos.toLowerCase()
            }
            onClearAll={handleClearAll}
          />

          {/* Photos/Videos Grid or Empty State */}
          {currentPhotos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentPhotos.map((item: Photo) => {
                const isVideo = item.image.match(/\.(mp4|webm|ogg)$/i);
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handlePhotoClick(item)}
                  >
                    <div className="aspect-square overflow-hidden relative">
                      {isVideo ? (
                        <>
                          <video
                            src={item.image}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            {showLucidIcon("play-circle", "w-12 h-12 text-white")}
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1 flex items-center gap-1">
                        {isVideo && showLucidIcon("video", "w-3 h-3")}
                        {item.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {item.album}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              {showLucidIcon(
                "image-icon",
                "mx-auto mb-4 opacity-50 text-muted-foreground",
                48,
              )}
              <h3 className="text-xl font-semibold mb-2">
                {langI18n.photo_not_found}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {langI18n.photo_not_found_detail}
              </p>
              <Button variant="outline" onClick={handleClearAll}>
                {langI18n.clear_all_filters}
              </Button>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
