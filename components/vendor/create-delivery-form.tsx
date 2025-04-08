"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, Check, Loader2, ExternalLink, Truck, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CreateDeliveryFormProps {
  onCreateDelivery: (delivery: any) => void
}

export function CreateDeliveryForm({ onCreateDelivery }: CreateDeliveryFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState<{
    id: string
    driverLink: string
    customerLink: string
  } | null>(null)
  const [copyState, setCopyState] = useState<{
    driver: boolean
    customer: boolean
  }>({ driver: false, customer: false })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTrackingInfo(null)

    // TODO: Replace with actual API call to create delivery
    setTimeout(() => {
      // Generate a tracking ID
      const trackingId = `del-${Math.random().toString(36).substring(2, 8)}`

      // Create mock tracking links
      const origin = window.location.origin
      const driverLink = `${origin}/driver/${trackingId}`
      const customerLink = `${origin}/track/${trackingId}`

      // Set tracking info
      setTrackingInfo({
        id: trackingId,
        driverLink,
        customerLink,
      })

      // Call the parent component's callback
      onCreateDelivery({
        ...formData,
        id: trackingId,
      })

      setIsSubmitting(false)

      toast({
        title: "Delivery created",
        description: "The delivery has been successfully created.",
      })
    }, 1500) // Simulate 1.5 second loading
  }

  const handleClear = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      address: "",
      notes: "",
    })
    setTrackingInfo(null)
    setCopyState({ driver: false, customer: false })
  }

  const copyToClipboard = async (text: string, type: "driver" | "customer") => {
    try {
      await navigator.clipboard.writeText(text)

      // Set the copied state for this specific link
      setCopyState((prev) => ({ ...prev, [type]: true }))

      // Reset after 2 seconds
      setTimeout(() => {
        setCopyState((prev) => ({ ...prev, [type]: false }))
      }, 2000)

      toast({
        title: "Copied to clipboard",
        description: "Link has been copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Create New Delivery</CardTitle>
        <CardDescription>Fill in the details to create a new delivery and get tracking links.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              placeholder="John Smith"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main St, New York, NY"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any special instructions for the delivery..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Delivery"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isSubmitting}>
              Clear
            </Button>
          </div>
        </form>

        {trackingInfo && (
          <div className="mt-6">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <AlertTitle className="text-green-800 dark:text-green-300">Delivery Created</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Delivery #{trackingInfo.id} has been created successfully.
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <div className="mt-4 space-y-3 p-4 border rounded-md bg-muted/30">
              <h3 className="text-sm font-medium mb-2">Tracking Links</h3>

              {/* Driver Link */}
              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Driver Link</p>
                  <p className="text-xs truncate">{trackingInfo.driverLink}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => copyToClipboard(trackingInfo.driverLink, "driver")}
                  >
                    {copyState.driver ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="ml-1.5">{copyState.driver ? "Copied" : "Copy"}</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a href={trackingInfo.driverLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">Open</span>
                    </a>
                  </Button>
                </div>
              </div>

              {/* Customer Link */}
              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Customer Link</p>
                  <p className="text-xs truncate">{trackingInfo.customerLink}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => copyToClipboard(trackingInfo.customerLink, "customer")}
                  >
                    {copyState.customer ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span className="ml-1.5">{copyState.customer ? "Copied" : "Copy"}</span>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                    <a href={trackingInfo.customerLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">Open</span>
                    </a>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Share these links with your driver and customer to let them track the delivery.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
