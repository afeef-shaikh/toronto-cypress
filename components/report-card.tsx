"use client"

import type { Report, ReportStatus } from "@/context/reports-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { MapPin, Calendar, ArrowRight } from "lucide-react"

interface ReportCardProps {
  report: Report
  showActions?: boolean
}

export function ReportCard({ report, showActions = true }: ReportCardProps) {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{getReportTypeLabel(report.type)}</CardTitle>
          <Badge className={getStatusColor(report.status)}>
            {report.status === "in-progress"
              ? "In Progress"
              : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">{report.description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="truncate">{report.location.address}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Reported {formatDistanceToNow(new Date(report.createdAt))} ago</span>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-2">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/report/${report.id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
