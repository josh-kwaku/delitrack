"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertCircle, Navigation } from "lucide-react"

// Mock Mapbox token - in a real app, this would be an environment variable
// TODO: Replace with your actual Mapbox token
const MAPBOX_TOKEN = "pk.mock.mapbox.token"

// Initialize mapbox
mapboxgl.accessToken = MAPBOX_TOKEN

interface Location {
  lat: number
  lng: number
}

interface MapboxMapProps {
  isDriverView?: boolean
  isCustomerView?: boolean
  initialLocation?: Location
  onLocationUpdate?: (location: Location) => void
  isTracking?: boolean
}

export function MapboxMap({
  isDriverView = false,
  isCustomerView = false,
  initialLocation = { lat: 52.52, lng: 13.405 }, // Berlin by default
  onLocationUpdate,
  isTracking = false,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const [currentLocation, setCurrentLocation] = useState<Location>(initialLocation)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isMockingLocation, setIsMockingLocation] = useState(false)
  const locationUpdateInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return

    // Create a mock loading delay
    const loadingTimeout = setTimeout(() => {
      try {
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [initialLocation.lng, initialLocation.lat],
          zoom: 13,
        })

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

        // Add marker
        marker.current = new mapboxgl.Marker({
          color: isDriverView ? "#3b82f6" : "#f97316",
        })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(map.current)

        // Set map loaded state
        map.current.on("load", () => {
          setIsMapLoaded(true)
        })
      } catch (error) {
        console.error("Error initializing map:", error)
        // In a real app, you would handle this error properly
        setIsMapLoaded(true) // Set to true anyway to show fallback UI
      }
    }, 1000) // Simulate 1 second loading time

    return () => {
      clearTimeout(loadingTimeout)
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current)
      }
    }
  }, [initialLocation])

  // Update marker position when currentLocation changes
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat([currentLocation.lng, currentLocation.lat])

      // Center map on marker if tracking is active
      if (isTracking) {
        map.current.easeTo({
          center: [currentLocation.lng, currentLocation.lat],
          duration: 1000,
        })
      }
    }

    // Call the onLocationUpdate callback if provided
    if (onLocationUpdate) {
      onLocationUpdate(currentLocation)
    }
  }, [currentLocation, isTracking, onLocationUpdate])

  // Simulate location updates when tracking is active
  useEffect(() => {
    if (isTracking && isMockingLocation) {
      // Clear any existing interval
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current)
      }

      // Set up a new interval to update location
      locationUpdateInterval.current = setInterval(
        () => {
          // Generate a random movement (small changes to lat/lng)
          const latChange = (Math.random() - 0.5) * 0.005
          const lngChange = (Math.random() - 0.5) * 0.005

          setCurrentLocation((prev) => ({
            lat: prev.lat + latChange,
            lng: prev.lng + lngChange,
          }))
        },
        isDriverView ? 5000 : 3000,
      ) // Update every 5 seconds for driver, 3 seconds for customer
    } else if (!isTracking && locationUpdateInterval.current) {
      // Clear interval when tracking is stopped
      clearInterval(locationUpdateInterval.current)
      locationUpdateInterval.current = null
    }

    return () => {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current)
      }
    }
  }, [isTracking, isMockingLocation, isDriverView])

  // Start mocking location updates
  const startMockingLocation = () => {
    setIsMockingLocation(true)
  }

  // Fallback UI when Mapbox fails to load
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "pk.mock.mapbox.token") {
    return (
      <div className="relative w-full h-[70vh] md:h-[600px] overflow-hidden rounded-md bg-muted/20">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10 p-4 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Map Visualization</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            This is a simulated map view. In a real application, you would see an interactive map here.
            <br />
            <br />
            <span className="text-xs">Note: To enable actual maps, replace the mock Mapbox token with a real one.</span>
          </p>

          {isDriverView && (
            <div className="mt-8 flex flex-col items-center">
              <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
                Driver View
              </Badge>
              <p className="text-sm text-muted-foreground">
                Current Location: {currentLocation.lat.toFixed(5)}, {currentLocation.lng.toFixed(5)}
              </p>
            </div>
          )}

          {isCustomerView && (
            <div className="mt-8 flex flex-col items-center">
              <Badge variant="outline" className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
                Customer View
              </Badge>
              <p className="text-sm text-muted-foreground">Driver is approximately 10 minutes away</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[600px] overflow-hidden rounded-md">
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map controls */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
        <Card className="border-0 shadow-md bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            {isDriverView ? (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Driver View</h3>
                  <Badge
                    variant="outline"
                    className={isMockingLocation ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                  >
                    {isMockingLocation ? "Location Sharing Active" : "Location Sharing Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isMockingLocation
                    ? "Your location is being shared with the customer and vendor."
                    : "Start sharing your location to begin tracking."}
                </p>

                {!isMockingLocation && (
                  <Button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white" onClick={startMockingLocation}>
                    <Navigation className="mr-2 h-4 w-4" />
                    Start Sharing Location
                  </Button>
                )}
              </div>
            ) : isCustomerView ? (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Delivery Tracking</h3>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    In Transit
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your delivery is on the way. Estimated arrival in 15 minutes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Vendor View</h3>
                  <Badge variant="outline">Active Delivery</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Tracking delivery in real-time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map notice */}
      {!isDriverView && !isCustomerView && (
        <div className="absolute top-4 left-0 right-0 px-4 z-10">
          <div className="bg-yellow-500/10 text-yellow-700 p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>
              This is a simulated tracking view. In a real application, this would show the real-time location of your
              delivery driver on an interactive map.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Internal Button component to avoid importing from UI
function Button({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
