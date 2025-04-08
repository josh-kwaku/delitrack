"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Bike, Package, ArrowRight } from "lucide-react"
import Image from "next/image"

export function WelcomeScreen() {
  const [businessName, setBusinessName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      // Store business name in localStorage
      localStorage.setItem("businessName", businessName)
      router.push("/vendor/dashboard")
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:h-full relative overflow-hidden">
      {/* Left content section */}
      <div className="w-full md:w-1/2 px-6 py-8 md:py-12 md:px-12 z-10">
        {/* Logo and badge */}
        <div className="flex items-center mb-4">
          <div className="bg-orange-500 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 font-bold text-xl">DeliTrack</span>
          <div className="ml-4 bg-gray-100 rounded-full px-3 py-1 flex items-center">
            <Bike className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-xs font-medium">Real-time Tracking</span>
          </div>
        </div>

        {/* Main heading with accent color */}
        <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4 leading-tight">
          <span className="text-gray-900">Fastest</span>
          <br />
          <span className="text-orange-500">Delivery</span>
          <span className="text-gray-900"> &</span>
          <br />
          <span className="text-gray-900">Easy </span>
          <span className="text-orange-500">Tracking</span>
          <span className="text-orange-500">.</span>
        </h1>

        <p className="text-gray-600 mb-8 max-w-md">
          Real-time delivery tracking for small businesses. No signup required, just enter your business name to get
          started.
        </p>

        {/* Input form with styled button */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label htmlFor="business-name" className="text-sm font-medium text-gray-700">
              Enter your business name
            </label>
            <div className="relative">
              <Input
                id="business-name"
                placeholder="e.g. Joe's Pizza"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full pl-4 pr-4 py-3 h-14 text-base rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500">This is your daily passphrase. It doesn't have to be unique.</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 py-3 h-14 text-base font-medium transition-all duration-200 flex-1"
              disabled={isLoading || !businessName.trim()}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Start My Day
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Floating elements */}
        <div className="absolute top-20 right-[5%] md:right-[45%] bg-white rounded-full p-3 shadow-lg z-10 hidden md:block">
          <Package className="h-6 w-6 text-orange-500" />
        </div>
      </div>

      {/* Right illustration section */}
      <div className="w-full md:w-1/2 relative h-60 md:h-full overflow-hidden bg-gray-100 rounded-t-3xl md:rounded-none">
        {/* Dotted path */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.4 }}
        >
          <path
            d="M50,200 C50,120 150,80 200,150 C250,220 300,250 350,200"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 15"
          />
          <circle cx="50" cy="200" r="8" fill="#f97316" />
          <circle cx="350" cy="200" r="8" fill="#f97316" />
        </svg>

        {/* Delivery illustration */}
        <div className="absolute bottom-0 right-0 w-full h-full flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-96 md:h-96">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Delivery illustration"
              width={400}
              height={400}
              className="object-contain"
            />

            {/* Floating delivery items */}
            <div className="absolute top-[20%] left-[10%] bg-white rounded-full p-4 shadow-lg">
              <Bike className="h-8 w-8 text-orange-500" />
            </div>

            <div className="absolute bottom-[30%] right-[15%] bg-white rounded-full p-3 shadow-lg">
              <MapPin className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Mobile floating elements that show on small screens */}
        <div className="absolute top-5 left-5 bg-white rounded-full p-2 shadow-lg md:hidden">
          <Bike className="h-5 w-5 text-orange-500" />
        </div>
        <div className="absolute bottom-5 right-5 bg-white rounded-full p-2 shadow-lg md:hidden">
          <MapPin className="h-5 w-5 text-orange-500" />
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-orange-500/10 rounded-full"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/10 rounded-full"></div>
    </div>
  )
}
