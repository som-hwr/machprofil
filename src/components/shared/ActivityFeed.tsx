"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { showLucidIcon } from "@/components/lucid-icon-map";

interface Activity {
  id: string;
  type: "spotify" | "github" | "blog" | "custom";
  title: string;
  description: string;
  link?: string;
  timestamp: string;
  icon?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  title?: string;
  maxItems?: number;
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "spotify",
    title: "Currently Listening",
    description: "Deep Focus - Spotify Playlist",
    link: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
    timestamp: "Now",
    icon: "music",
  },
  {
    id: "2",
    type: "github",
    title: "Recent Commit",
    description: "Updated portfolio design components",
    link: "https://github.com",
    timestamp: "2 hours ago",
    icon: "github",
  },
  {
    id: "3",
    type: "blog",
    title: "New Blog Post",
    description: "Building Modern Web Applications with Next.js",
    link: "/blog",
    timestamp: "1 day ago",
    icon: "pen-tool",
  },
];

export default function ActivityFeed({
  activities = defaultActivities,
  title = "Current Activity",
  maxItems = 3,
}: ActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityColor = (type: string) => {
    switch (type) {
      case "spotify":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "github":
        return "bg-slate-500/10 text-slate-600 border-slate-200";
      case "blog":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <h3 className="text-xl font-bold flex items-center gap-2">
          {showLucidIcon("activity", "w-5 h-5 text-primary")}
          {title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}
            >
              {showLucidIcon(activity.icon || "circle", "w-5 h-5")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{activity.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {activity.timestamp}
                </Badge>
              </div>
              {activity.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 mt-2 px-2"
                  asChild
                >
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                    {showLucidIcon("external-link", "w-3 h-3 ml-1")}
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
