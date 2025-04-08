"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import type { Report } from "@/context/reports-context"
import { Skeleton } from "@/components/ui/skeleton"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const torontoCenter = {
  lat: 43.6532,
  lng: -79.3832,
}

const defaultOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }, { lightness: "-10" }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#a5b1bf" }, { visibility: "on" }, { weight: "1.00" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3a4051" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#f1f6f9" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e3e8ee" }],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5f9fd" }],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e3e8ee" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [{ color: "#f5f9fd" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c9d1d9" }],
    },
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [{ color: "#dde5e9" }],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ saturation: "-5" }, { lightness: "5" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#dde5e9" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ saturation: "-45" }, { lightness: "5" }, { visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#c4d3da" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c4d3da" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.icon",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#53626d" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [{ color: "#dde5e9" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c4d3da" }],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [{ color: "#dde5e9" }],
    },
    {
      featureType: "road.local",
      elementType: "geometry.stroke",
      stylers: [{ color: "#dde5e9" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ saturation: "-25" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [{ color: "#c4d3da" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c4d3da" }],
    },
    {
      featureType: "transit.station.airport",
      elementType: "geometry.fill",
      stylers: [{ saturation: "-100" }, { lightness: "5" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a6cbe3" }],
    },
  ],
}

type GoogleMapComponentProps = {
  reports?: Report[]
  onMapClick?: (e: google.maps.MapMouseEvent) => void
  selectedLocation?: { lat: number; lng: number } | null
  onMarkerClick?: (report: Report) => void
  height?: string
  zoom?: number
  interactive?: boolean
}

export function GoogleMapComponent({
  reports = [],
  onMapClick,
  selectedLocation,
  onMarkerClick,
  height = "500px",
  zoom = 12,
  interactive = true,
}: GoogleMapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMap(map)
  }, [])

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report)
    if (onMarkerClick) {
      onMarkerClick(report)
    }
  }

  // Update map center when selectedLocation changes
  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
    }
  }, [map, selectedLocation])

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <Skeleton className="w-full" style={{ height }} />
  }

  return (
    <div style={{ height, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedLocation || torontoCenter}
        zoom={zoom}
        options={defaultOptions}
        onClick={interactive ? onMapClick : undefined}
        onLoad={onMapLoad}
      >
        {/* Selected location marker */}
        {selectedLocation && !reports.length && (
          <Marker
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}

        {/* Report markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={{ lat: report.location.lat, lng: report.location.lng }}
            onClick={() => handleMarkerClick(report)}
            icon={{
              url: getMarkerIconByStatus(report.status),
            }}
          />
        ))}

        {/* Info window for selected report */}
        {selectedReport && (
          <InfoWindow
            position={{
              lat: selectedReport.location.lat,
              lng: selectedReport.location.lng,
            }}
            onCloseClick={() => setSelectedReport(null)}
          >
            <div className="max-w-xs">
              <h3 className="font-bold">{getReportTypeLabel(selectedReport.type)}</h3>
              <p className="text-sm">{selectedReport.description}</p>
              <p className="text-xs mt-1">{selectedReport.location.address}</p>
              <p className="text-xs mt-1 font-semibold">Status: {getStatusLabel(selectedReport.status)}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

function getMarkerIconByStatus(status: string) {
  switch (status) {
    case "pending":
      return "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    case "in-progress":
      return "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
    case "resolved":
      return "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
    default:
      return "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  }
}

function getReportTypeLabel(type: string) {
  switch (type) {
    case "pothole":
      return "Pothole"
    case "street-light":
      return "Street Light Issue"
    case "graffiti":
      return "Graffiti"
    case "garbage":
      return "Garbage Issue"
    case "sidewalk":
      return "Sidewalk Damage"
    case "traffic-sign":
      return "Traffic Sign Issue"
    default:
      return "Other Issue"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pending"
    case "in-progress":
      return "In Progress"
    case "resolved":
      return "Resolved"
    default:
      return "Unknown"
  }
}
