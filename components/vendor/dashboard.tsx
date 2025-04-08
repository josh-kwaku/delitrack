"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, Map, LogOut } from "lucide-react"
import { DeliveryMap } from "@/components/maps/delivery-map"
import { CreateDeliveryForm } from "@/components/vendor/create-delivery-form"
import { DeliveryList } from "@/components/vendor/delivery-list"
import { VendorHeader } from "@/components/vendor/vendor-header"

// Mock data for deliveries
const mockDeliveries = [
  {
    id: "del-1",
    customerName: "John Smith",
    address: "123 Main St, New York, NY",
    status: "in-progress",
    location: { lat: 40.7128, lng: -74.006 },
    createdAt: new Date().toISOString(),
  },
  {
    id: "del-2",
    customerName: "Sarah Johnson",
    address: "456 Park Ave, New York, NY",
    status: "pending",
    location: { lat: 40.7228, lng: -73.996 },
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
]

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("map")
  const [deliveries, setDeliveries] = useState(mockDeliveries)
  const [businessName, setBusinessName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get business name from localStorage
    const storedName = localStorage.getItem("businessName")
    if (!storedName) {
      router.push("/")
      return
    }
    setBusinessName(storedName)
  }, [router])

  const handleCreateDelivery = (delivery: any) => {
    const newDelivery = {
      ...delivery,
      id: `del-${deliveries.length + 1}`,
      status: "pending",
      location: { lat: 40.7128, lng: -74.006 }, // Default location
      createdAt: new Date().toISOString(),
    }

    setDeliveries([...deliveries, newDelivery])
    setActiveTab("map") // Switch to map view after creating delivery
  }

  const handleLogout = () => {
    localStorage.removeItem("businessName")
    router.push("/")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <VendorHeader businessName={businessName} onLogout={handleLogout} />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Deliveries</span>
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>

          <TabsContent value="map" className="mt-0">
            <Card className="border-0 shadow-sm overflow-hidden">
              <DeliveryMap deliveries={deliveries} isVendorView={true} />
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <CreateDeliveryForm onCreateDelivery={handleCreateDelivery} />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <DeliveryList deliveries={deliveries} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
