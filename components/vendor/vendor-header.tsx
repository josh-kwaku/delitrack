"use client"

import { Button } from "@/components/ui/button"
import { MapPin, LogOut } from "lucide-react"

interface VendorHeaderProps {
  businessName: string
  onLogout: () => void
}

export function VendorHeader({ businessName, onLogout }: VendorHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-semibold">DeliTrack</span>
          {businessName && (
            <>
              <span className="hidden md:inline mx-2 text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">{businessName}</span>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" onClick={onLogout} className="md:hidden">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  )
}
