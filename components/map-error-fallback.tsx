"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MapErrorFallbackProps {
  onRetry?: () => void
}

export function MapErrorFallback({ onRetry }: MapErrorFallbackProps) {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/30 rounded-md p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Map Loading Error</AlertTitle>
        <AlertDescription>
          <p className="mb-2">There was an issue loading the Google Maps component. This could be due to:</p>
          <ul className="list-disc pl-5 mb-4 text-sm">
            <li>Missing or invalid Google Maps API key</li>
            <li>Network connectivity issues</li>
            <li>API usage restrictions</li>
          </ul>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
