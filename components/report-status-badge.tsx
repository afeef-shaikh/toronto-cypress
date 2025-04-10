import { Badge } from "@/components/ui/badge"
import type { ReportStatus } from "@/context/reports-context"

interface ReportStatusBadgeProps {
  status: ReportStatus
  className?: string
}

export function ReportStatusBadge({ status, className }: ReportStatusBadgeProps) {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "in-progress":
        return "bg-blue-500 hover:bg-blue-600"
      case "resolved":
        return "bg-green-500 hover:bg-green-600"
      case "withdrawn":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      case "withdrawn":
        return "Withdrawn"
      default:
        return "Unknown"
    }
  }

  return <Badge className={`${getStatusColor(status)} ${className}`}>{getStatusLabel(status)}</Badge>
}
