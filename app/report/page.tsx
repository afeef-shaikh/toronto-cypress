"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { GoogleMapComponent } from "@/components/google-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useReports, type ReportType } from "@/context/reports-context"
import { MapPin, Upload, AlertCircle, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useJsApiLoader } from "@react-google-maps/api"

declare global {
  interface Window {
    google: any
  }
}

export default function ReportPage() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState("")
  const [type, setType] = useState<ReportType>("pothole")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

  const { isAuthenticated, user } = useAuth()
  const { addReport } = useReports()
  const { toast } = useToast()
  const router = useRouter()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  useEffect(() => {
    // Initialize geocoder when Google Maps API is loaded
    if (isLoaded) {
      try {
        setGeocoder(new google.maps.Geocoder())
      } catch (error) {
        console.error("Error initializing geocoder:", error)
      }
    }
  }, [isLoaded])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setSelectedLocation({ lat, lng })

      // Reverse geocode to get address
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address)
          } else {
            setAddress(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
          }
        })
      } else {
        setAddress(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Create a local URL for the file to display as preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrls([previewUrl])

      // In a real app, you would upload the file to a server
      // For this demo, we'll use the placeholder for the actual submission
      // but show the real image preview to the user
      setImages(["/placeholder.svg?height=300&width=400"])

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to report an issue.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a location on the map.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const report = await addReport({
        userId: user?.id || "",
        type,
        description,
        location: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address,
        },
        status: "pending",
        images,
      })

      toast({
        title: "Report submitted",
        description: "Your report has been submitted successfully.",
      })

      // Redirect to the report details page
      router.push(`/report/${report.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls])

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold mb-6">Report a Problem</h1>

            {!isAuthenticated && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>
                  You need to be logged in to submit a report. Please{" "}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="/login">log in</a>
                  </Button>{" "}
                  or{" "}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="/register">register</a>
                  </Button>
                  .
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Problem Details</CardTitle>
                <CardDescription>Provide information about the issue you want to report</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Problem Type</Label>
                    <Select value={type} onValueChange={(value) => setType(value as ReportType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select problem type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pothole">Pothole</SelectItem>
                        <SelectItem value="street-light">Street Light Issue</SelectItem>
                        <SelectItem value="graffiti">Graffiti</SelectItem>
                        <SelectItem value="garbage">Garbage Issue</SelectItem>
                        <SelectItem value="sidewalk">Sidewalk Damage</SelectItem>
                        <SelectItem value="traffic-sign">Traffic Sign Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the problem in detail"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="location"
                        placeholder="Select a location on the map"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // Get user's current location
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const lat = position.coords.latitude
                                const lng = position.coords.longitude
                                setSelectedLocation({ lat, lng })

                                // Reverse geocode to get address
                                if (geocoder) {
                                  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                    if (status === "OK" && results && results[0]) {
                                      setAddress(results[0].formatted_address)
                                    } else {
                                      setAddress(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
                                    }
                                  })
                                } else {
                                  setAddress(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
                                }
                              },
                              (error) => {
                                toast({
                                  title: "Location error",
                                  description: "Unable to get your current location.",
                                  variant: "destructive",
                                })
                              },
                            )
                          }
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click on the map to select the exact location of the problem
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image (Optional)</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                    </div>

                    {imagePreviewUrls.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden border border-border">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-auto object-cover aspect-video"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 bg-muted rounded-md flex items-center justify-center aspect-video">
                        <div className="text-center p-4">
                          <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground mt-2">No image uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !selectedLocation || !isAuthenticated}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Location on Map</h2>
            <div className="rounded-lg overflow-hidden border border-border">
              <GoogleMapComponent
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
                height="600px"
                zoom={13}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click on the map to pinpoint the exact location of the issue you want to report.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
