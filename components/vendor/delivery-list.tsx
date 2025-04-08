"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Search, Package, Clock, Truck, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Delivery {
  id: string
  customerName: string
  address: string
  status: string
  createdAt: string
}

interface DeliveryListProps {
  deliveries: Delivery[]
}

export function DeliveryList({ deliveries }: DeliveryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return "Unknown"
    }
  }

  const copyTrackingLink = async (id: string) => {
    const link = `${window.location.origin}/track/${id}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Active Deliveries</CardTitle>
        <CardDescription>Manage and track all your active deliveries.</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search deliveries..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDeliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No deliveries found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term" : "Create your first delivery to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{delivery.customerName}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{delivery.address}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 ml-2">
                    {getStatusIcon(delivery.status)}
                    <span>{getStatusText(delivery.status)}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>ID: {delivery.id}</span>
                    <span>•</span>
                    <span>Created {formatDistanceToNow(new Date(delivery.createdAt), { addSuffix: true })}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => copyTrackingLink(delivery.id)}>
                    {copiedId === delivery.id ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    <span>{copiedId === delivery.id ? "Copied" : "Copy Link"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
