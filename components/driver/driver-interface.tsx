"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapboxMap } from "@/components/maps/mapbox-map"
import { MapPin, CheckCircle, Truck, Navigation, Phone } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DriverInterfaceProps {
  deliveryId: string
}

// Mock delivery data
const mockDelivery = {
  id: "del-1",
  customerName: "John Smith",
  phoneNumber: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY",
  status: "pending",
  location: { lat: 52.52, lng: 13.405 },
  createdAt: new Date().toISOString(),
  businessName: "Joe's Pizza",
  notes: "Please leave at the door. Doorbell doesn't work.",
}

export function DriverInterface({ deliveryId }: DriverInterfaceProps) {
  const [delivery, setDelivery] = useState(mockDelivery)
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isDelivered, setIsDelivered] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(delivery.location)
  const { toast } = useToast()

  // Update delivery status when location sharing is toggled
  useEffect(() => {
    if (isLocationSharing && delivery.status === "pending") {
      setDelivery((prev) => ({ ...prev, status: "in-progress" }))

      toast({
        title: "Location sharing started",
        description: "The customer can now track your location in real-time.",
      })

      // TODO: In a real app, you would send this status update to your backend
    }
  }, [isLocationSharing, delivery.status, toast])

  // Handle location updates from the map
  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location)

    // TODO: In a real app, you would send these location updates to your backend
    // so they can be shared with the customer and vendor
  }

  const confirmDelivery = () => {
    setIsDelivered(true)
    setDelivery((prev) => ({ ...prev, status: "completed" }))
    setIsConfirmationOpen(false)

    toast({
      title: "Delivery confirmed",
      description: "The delivery has been marked as completed.",
    })

    // TODO: In a real app, you would send this confirmation to your backend
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="font-semibold">DeliTrack</span>
            <span className="hidden md:inline mx-2 text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">Driver View</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Delivery #{deliveryId}</CardTitle>
              <Badge
                className={`
                  ${delivery.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}
                  ${delivery.status === "in-progress" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                  ${delivery.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                `}
                variant="outline"
              >
                {delivery.status === "pending" && "Pending"}
                {delivery.status === "in-progress" && "In Progress"}
                {delivery.status === "completed" && "Completed"}
              </Badge>
            </div>
            <CardDescription>{delivery.businessName}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{delivery.customerName}</p>
                    <p className="text-sm text-muted-foreground">{delivery.address}</p>
                  </div>
                </div>

                <Button variant="outline" size="icon" asChild>
                  <a href={`tel:${delivery.phoneNumber}`}>
                    <Phone className="h-4 w-4" />
                    <span className="sr-only">Call customer</span>
                  </a>
                </Button>
              </div>

              {delivery.notes && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium mb-1">Delivery Notes:</p>
                  <p className="text-muted-foreground">{delivery.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="location-sharing"
                    checked={isLocationSharing}
                    onCheckedChange={setIsLocationSharing}
                    disabled={isDelivered}
                  />
                  <Label htmlFor="location-sharing">Share Location</Label>
                </div>

                <Button
                  variant={isLocationSharing ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  disabled={!isLocationSharing || isDelivered}
                  onClick={() => setIsConfirmationOpen(true)}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm Delivery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <MapboxMap
          isDriverView={true}
          initialLocation={currentLocation}
          onLocationUpdate={handleLocationUpdate}
          isTracking={isLocationSharing}
        />

        {!isLocationSharing && !isDelivered && (
          <Card className="border-0 shadow-sm bg-yellow-500/5 border-yellow-500/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-500/10 p-3 rounded-full mb-4">
                  <Navigation className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-medium">Start Location Sharing</h3>
                <p className="text-muted-foreground mt-1">
                  Toggle the switch above to start sharing your location with the customer.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isDelivered && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <AlertTitle className="text-green-800 dark:text-green-300">Delivery Completed!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  This delivery has been marked as completed.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </main>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>Are you sure you want to mark this delivery as completed?</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <div className="bg-green-500/10 p-4 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelivery}>Confirm Delivery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
