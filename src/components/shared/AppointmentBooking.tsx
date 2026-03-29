"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { showLucidIcon } from "@/components/lucid-icon-map";

interface AppointmentBookingProps {
  calendlyUrl?: string;
  googleCalendarUrl?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export default function AppointmentBooking({
  calendlyUrl,
  googleCalendarUrl,
  buttonText = "Book a Meeting",
  variant = "default",
  size = "default",
}: AppointmentBookingProps) {
  const [open, setOpen] = useState(false);

  const handleCalendlyClick = () => {
    if (calendlyUrl) {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
      setOpen(false);
    }
  };

  const handleGoogleCalendarClick = () => {
    if (googleCalendarUrl) {
      window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
      setOpen(false);
    }
  };

  if (!calendlyUrl && !googleCalendarUrl) {
    return null;
  }

  if (calendlyUrl && !googleCalendarUrl) {
    return (
      <Button variant={variant} size={size} onClick={handleCalendlyClick}>
        {showLucidIcon("calendar", "w-5 h-5 mr-2")}
        {buttonText}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          {showLucidIcon("calendar", "w-5 h-5 mr-2")}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule an Appointment</DialogTitle>
          <DialogDescription>
            Choose your preferred booking method
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {calendlyUrl && (
            <Button
              onClick={handleCalendlyClick}
              className="w-full justify-start"
              variant="outline"
              size="lg"
            >
              <div className="flex items-center gap-3">
                {showLucidIcon("calendar-check", "w-5 h-5")}
                <div className="text-left">
                  <div className="font-semibold">Calendly</div>
                  <div className="text-xs text-muted-foreground">
                    Quick scheduling
                  </div>
                </div>
              </div>
            </Button>
          )}
          {googleCalendarUrl && (
            <Button
              onClick={handleGoogleCalendarClick}
              className="w-full justify-start"
              variant="outline"
              size="lg"
            >
              <div className="flex items-center gap-3">
                {showLucidIcon("calendar-days", "w-5 h-5")}
                <div className="text-left">
                  <div className="font-semibold">Google Calendar</div>
                  <div className="text-xs text-muted-foreground">
                    Add to your calendar
                  </div>
                </div>
              </div>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
