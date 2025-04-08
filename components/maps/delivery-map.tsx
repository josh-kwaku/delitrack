"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, AlertCircle } from "lucide-react"

interface Location {
  lat: number
  lng: number
}

interface Delivery {
  id: string
  customerName: string
  address: string
  status: string
  location: Location
}

interface DeliveryMapProps {
  deliveries: Delivery[]
  isVendorView?: boolean
  deliveryId?: string
  isDriverView?: boolean
}

export function DeliveryMap({ deliveries, isVendorView = false, deliveryId, isDriverView = false }: DeliveryMapProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate marker animation
  useEffect(() => {
    if (isMapLoaded && deliveries.length > 0) {
      // If it's a specific delivery view, find that delivery
      if (deliveryId) {
        const delivery = deliveries.find((d) => d.id === deliveryId) || deliveries[0]
        setSelectedDelivery(delivery)
      }
    }
  }, [isMapLoaded, deliveries, deliveryId])

  return (
    <div className="relative w-full h-[70vh] md:h-[600px] overflow-hidden rounded-md bg-muted/20">
      {!isMapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map placeholder - in a real app, this would be a Google Maps or Mapbox component */}
          <div
            ref={mapRef}
            className="absolute inset-0 bg-[#f8f9fa]"
            style={{
              backgroundImage: "url('/placeholder.svg?height=600&width=800')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Simulated map content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm max-w-xs">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Map Visualization</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isVendorView
                    ? `Showing ${deliveries.length} active deliveries`
                    : isDriverView
                      ? "Driver's current location"
                      : "Tracking delivery in real-time"}
                </p>
              </div>
            </div>

            {/* Animated delivery markers */}
            {deliveries.map((delivery, index) => (
              <div
                key={delivery.id}
                className={`absolute animate-bounce transition-all duration-500 ease-in-out ${
                  selectedDelivery?.id === delivery.id ? "z-10" : "z-0"
                }`}
                style={{
                  left: `${30 + (delivery.location.lng + 74.006) * 100}%`,
                  top: `${30 + (delivery.location.lat - 40.7128) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping"></div>
                  <div className="relative bg-primary text-primary-foreground p-2 rounded-full shadow-md">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <Card className="border-0 shadow-md bg-background/95 backdrop-blur-sm">
              <CardContent className="p-4">
                {isVendorView ? (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Active Deliveries</h3>
                      <Badge variant="outline" className="ml-2">
                        {deliveries.length} total
                      </Badge>
                    </div>

                    {selectedDelivery && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="font-medium">{selectedDelivery.customerName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{selectedDelivery.address}</p>
                        <div className="flex items-center mt-2">
                          <Badge
                            variant="outline"
                            className={`
                              flex items-center gap-1
                              ${selectedDelivery.status === "in-progress" ? "text-blue-500" : ""}
                              ${selectedDelivery.status === "completed" ? "text-green-500" : ""}
                            `}
                          >
                            <Truck className="h-3 w-3" />
                            <span>
                              {selectedDelivery.status === "pending" && "Pending"}
                              {selectedDelivery.status === "in-progress" && "In Progress"}
                              {selectedDelivery.status === "completed" && "Completed"}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isDriverView ? (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Driver View</h3>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Location Sharing Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your location is being shared with the customer and vendor.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Delivery Tracking</h3>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        In Progress
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your delivery is on the way. Estimated arrival in 15 minutes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map notice */}
          {!isVendorView && !isDriverView && (
            <div className="absolute top-4 left-0 right-0 px-4">
              <div className="bg-yellow-500/10 text-yellow-700 p-3 rounded-md flex items-start gap-2 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  This is a simulated tracking view. In a real application, this would show the real-time location of
                  your delivery driver on an interactive map.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
