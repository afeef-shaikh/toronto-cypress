"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { GoogleMapComponent } from "@/components/google-map"
import { useReports } from "@/context/reports-context"
import { useAuth } from "@/context/auth-context"
import { useNotifications } from "@/context/notifications-context"
import { ReportStatusBadge } from "@/components/report-status-badge"
import { EditReportDialog } from "@/components/edit-report-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow, format } from "date-fns"
import { MapPin, Calendar, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getReportById, updateReport } = useReports()
  const { isAuthenticated, user, isAdmin } = useAuth()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const [report, setReport] = useState(getReportById(params.id as string))
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!report) {
      toast({
        title: "Report not found",
        description: "The report you're looking for doesn't exist.",
        variant: "destructive",
      })
      router.push("/map")
    }
  }, [report, router, toast])

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Report Not Found</AlertTitle>
            <AlertDescription>The report you're looking for doesn't exist or has been removed.</AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  const isOwner = isAuthenticated && user?.id === report.userId
  const canEdit = isOwner || isAdmin

  const getReportTypeLabel = (type: string) => {
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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!isAuthenticated || (!isOwner && !isAdmin)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to update this report.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const updatedReport = await updateReport(report.id, {
        status: newStatus as "pending" | "in-progress" | "resolved",
      })
      setReport(updatedReport)

      // Add notification
      addNotification({
        title: "Report Status Updated",
        message: `Your report status has been updated to ${newStatus.replace("-", " ")}.`,
        type: "info",
      })

      toast({
        title: "Status updated",
        description: `Report status updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update report status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReportUpdate = () => {
    // Refresh the report data
    const updatedReport = getReportById(report.id)
    if (updatedReport) {
      setReport(updatedReport)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{getReportTypeLabel(report.type)}</h1>
              <ReportStatusBadge status={report.status} />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Report Details</CardTitle>
                  <CardDescription>Information about this reported issue</CardDescription>
                </div>
                {canEdit && <EditReportDialog report={report} onUpdate={handleReportUpdate} />}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p>{report.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{report.location.address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Dates</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Reported: {format(new Date(report.createdAt), "PPP")} (
                        {formatDistanceToNow(new Date(report.createdAt))} ago)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        Last updated: {format(new Date(report.updatedAt), "PPP")} (
                        {formatDistanceToNow(new Date(report.updatedAt))} ago)
                      </span>
                    </div>
                  </div>
                </div>

                {report.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {report.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Report image ${index + 1}`}
                          className="rounded-md object-cover aspect-video"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              {(isOwner || isAdmin) && (
                <CardFooter>
                  <div className="w-full space-y-2">
                    <h3 className="font-semibold">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={report.status === "pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusUpdate("pending")}
                        disabled={isUpdating || report.status === "pending"}
                      >
                        Pending
                      </Button>
                      <Button
                        variant={report.status === "in-progress" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusUpdate("in-progress")}
                        disabled={isUpdating || report.status === "in-progress"}
                      >
                        In Progress
                      </Button>
                      <Button
                        variant={report.status === "resolved" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusUpdate("resolved")}
                        disabled={isUpdating || report.status === "resolved"}
                      >
                        Resolved
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] rounded-b-lg overflow-hidden">
                  <GoogleMapComponent
                    reports={[report]}
                    selectedLocation={{ lat: report.location.lat, lng: report.location.lng }}
                    height="100%"
                    zoom={15}
                    interactive={false}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>History of this report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        1
                      </div>
                      <div className="h-full w-px bg-border"></div>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="font-medium">Report Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(report.createdAt), "PPP 'at' p")}
                      </p>
                    </div>
                  </div>

                  {report.createdAt !== report.updatedAt && (
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          2
                        </div>
                        <div className="h-full w-px bg-border"></div>
                      </div>
                      <div className="space-y-1 pt-2">
                        <p className="font-medium">Status Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.updatedAt), "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                  )}

                  {report.status === "resolved" && (
                    <div className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                          ✓
                        </div>
                      </div>
                      <div className="space-y-1 pt-2">
                        <p className="font-medium">Issue Resolved</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.updatedAt), "PPP 'at' p")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
