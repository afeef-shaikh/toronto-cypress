"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/context/auth-context"
import { useReports } from "@/context/reports-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { BarChart, PieChart, LineChart } from "lucide-react"

export default function AdminReportsPage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { reports } = useReports()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be logged in as an administrator to access this page.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [isAuthenticated, isAdmin, router, toast])

  // Calculate statistics
  const totalReports = reports.length
  const pendingReports = reports.filter((report) => report.status === "pending").length
  const inProgressReports = reports.filter((report) => report.status === "in-progress").length
  const resolvedReports = reports.filter((report) => report.status === "resolved").length

  // Calculate report types
  const reportTypes = reports.reduce(
    (acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (!isAuthenticated || !isAdmin) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reports Analytics</h1>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Status Distribution
              </CardTitle>
              <CardDescription>Breakdown of reports by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span>Pending</span>
                  </span>
                  <span className="font-medium">
                    {pendingReports} ({Math.round((pendingReports / totalReports) * 100) || 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                    <span>In Progress</span>
                  </span>
                  <span className="font-medium">
                    {inProgressReports} ({Math.round((inProgressReports / totalReports) * 100) || 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    <span>Resolved</span>
                  </span>
                  <span className="font-medium">
                    {resolvedReports} ({Math.round((resolvedReports / totalReports) * 100) || 0}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Report Types
              </CardTitle>
              <CardDescription>Distribution of report categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(reportTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{getReportTypeLabel(type)}</span>
                    <span className="font-medium">
                      {count} ({Math.round((count / totalReports) * 100) || 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Resolution Rate
              </CardTitle>
              <CardDescription>How quickly issues are being resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Average Resolution Time</span>
                  <span className="font-medium">3.5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Resolution Rate</span>
                  <span className="font-medium">
                    {totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pending &gt; 7 Days</span>
                  <span className="font-medium">5 reports</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Report Trends</CardTitle>
            <CardDescription>Number of reports over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization would appear here in a production environment</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
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
