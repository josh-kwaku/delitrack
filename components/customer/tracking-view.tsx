"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapboxMap } from "@/components/maps/mapbox-map"
import { MapPin, Package, CheckCircle, Clock, Truck, ThumbsUp, Phone } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CustomerTrackingViewProps {
  deliveryId: string
}

// Mock delivery data
const mockDelivery = {
  id: "del-1",
  customerName: "John Smith",
  address: "123 Main St, New York, NY",
  status: "in-progress",
  location: { lat: 52.52, lng: 13.405 },
  createdAt: new Date().toISOString(),
  businessName: "Joe's Pizza",
  estimatedDeliveryTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
  driverPhone: "+1 (555) 123-4567",
}

export function CustomerTrackingView({ deliveryId }: CustomerTrackingViewProps) {
  const [delivery, setDelivery] = useState(mockDelivery)
  const [progress, setProgress] = useState(60)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isDelivered, setIsDelivered] = useState(false)
  const [driverLocation, setDriverLocation] = useState(delivery.location)

  // Simulate progress updates
  useEffect(() => {
    if (isDelivered) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isDelivered])

  // Update delivery status based on progress
  useEffect(() => {
    if (progress >= 100 && !isDelivered) {
      setDelivery((prev) => ({ ...prev, status: "arrived" }))
      setIsConfirmationOpen(true)
    }
  }, [progress, isDelivered])

  // Handle driver location updates
  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setDriverLocation(location)

    // TODO: In a real app, you would use this data to update the ETA
    // and potentially other delivery status information
  }

  const confirmDelivery = () => {
    setIsDelivered(true)
    setDelivery((prev) => ({ ...prev, status: "completed" }))
    setIsConfirmationOpen(false)

    // TODO: In a real app, you would send this confirmation to your backend
    // to update the delivery status
  }

  const getStatusDetails = () => {
    switch (delivery.status) {
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Preparing",
          description: "Your order is being prepared",
          color: "text-yellow-500",
        }
      case "in-progress":
        return {
          icon: <Truck className="h-5 w-5" />,
          label: "On the way",
          description: "Your delivery is on the way",
          color: "text-blue-500",
        }
      case "arrived":
        return {
          icon: <MapPin className="h-5 w-5" />,
          label: "Arrived",
          description: "Your delivery has arrived",
          color: "text-green-500",
        }
      case "completed":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          label: "Delivered",
          description: "Your delivery has been completed",
          color: "text-green-500",
        }
      default:
        return {
          icon: <Package className="h-5 w-5" />,
          label: "Processing",
          description: "Your order is being processed",
          color: "text-gray-500",
        }
    }
  }

  const statusDetails = getStatusDetails()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold">DeliTrack</span>
            <span className="hidden md:inline mx-2 text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">
              {delivery.businessName}
            </span>
          </div>

          {/* Call driver button */}
          {delivery.status === "in-progress" && (
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <a href={`tel:${delivery.driverPhone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call Driver
              </a>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Delivery Tracking</CardTitle>
              <Badge
                className={`
                  ${delivery.status === "in-progress" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                  ${delivery.status === "arrived" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                  ${delivery.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                `}
                variant="outline"
              >
                {statusDetails.label}
              </Badge>
            </div>
            <CardDescription>
              Order #{deliveryId} • {delivery.customerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`p-2 rounded-full ${delivery.status === "completed" ? "bg-green-500/10" : "bg-primary/10"}`}
              >
                {statusDetails.icon}
              </div>
              <div>
                <p className={`font-medium ${statusDetails.color}`}>{statusDetails.label}</p>
                <p className="text-sm text-muted-foreground">{statusDetails.description}</p>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span>Delivery Progress</span>
                <span>{isDelivered ? "Delivered" : `${progress}%`}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{delivery.address}</span>
              </div>

              {!isDelivered && (
                <div className="flex">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Estimated arrival:{" "}
                    {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <MapboxMap
          isCustomerView={true}
          initialLocation={driverLocation}
          onLocationUpdate={handleLocationUpdate}
          isTracking={true}
        />

        {isDelivered && (
          <Card className="border-0 shadow-sm bg-green-500/5 border-green-500/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500/10 p-3 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-medium">Delivery Confirmed!</h3>
                <p className="text-muted-foreground mt-1">Thank you for using our delivery service.</p>

                <Button variant="outline" className="mt-4 gap-2" onClick={() => setIsConfirmationOpen(true)}>
                  <ThumbsUp className="h-4 w-4" />
                  Leave Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isDelivered ? "Leave Feedback" : "Confirm Delivery"}</DialogTitle>
            <DialogDescription>
              {isDelivered
                ? "Please share your experience with this delivery."
                : "Has your delivery arrived? Please confirm receipt."}
            </DialogDescription>
          </DialogHeader>

          {isDelivered ? (
            <div className="grid gap-4 py-4">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="How was your delivery experience?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-4">
              <div className="bg-blue-500/10 p-4 rounded-full">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
              {isDelivered ? "Cancel" : "Not Yet"}
            </Button>
            <Button onClick={isDelivered ? () => setIsConfirmationOpen(false) : confirmDelivery}>
              {isDelivered ? "Submit Feedback" : "Confirm Delivery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
