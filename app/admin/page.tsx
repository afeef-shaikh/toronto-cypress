"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/context/auth-context"
import { useReports, type Report, type ReportStatus } from "@/context/reports-context"
import { useNotifications } from "@/context/notifications-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportStatusBadge } from "@/components/report-status-badge"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertCircle, CheckCircle, Clock, MoreVertical, Search, Users, FileText, BarChart, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function AdminDashboardPage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { reports, updateReport } = useReports()
  const { addNotification } = useNotifications()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports)

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

  // Apply filters whenever reports or filter criteria change
  useEffect(() => {
    let filtered = [...reports]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.description.toLowerCase().includes(query) ||
          report.location.address.toLowerCase().includes(query) ||
          report.userId.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.type === typeFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchQuery, statusFilter, typeFilter])

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const updatedReport = await updateReport(reportId, { status: newStatus })

      // Send notification to the user
      addNotification({
        title: "Report Status Updated",
        message: `Your report has been updated to ${newStatus.replace("-", " ")}.`,
        type: "info",
      })

      toast({
        title: "Status Updated",
        description: `Report status has been updated to ${newStatus.replace("-", " ")}.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update report status.",
        variant: "destructive",
      })
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

  // Calculate statistics
  const totalReports = reports.length
  const pendingReports = reports.filter((report) => report.status === "pending").length
  const inProgressReports = reports.filter((report) => report.status === "in-progress").length
  const resolvedReports = reports.filter((report) => report.status === "resolved").length

  if (!isAuthenticated || !isAdmin) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalReports}</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pendingReports}</div>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{inProgressReports}</div>
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{resolvedReports}</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-12 mb-8">
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Reports Overview</CardTitle>
              <CardDescription>Manage and update citizen reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search reports..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="pothole">Pothole</SelectItem>
                        <SelectItem value="street-light">Street Light</SelectItem>
                        <SelectItem value="graffiti">Graffiti</SelectItem>
                        <SelectItem value="garbage">Garbage</SelectItem>
                        <SelectItem value="sidewalk">Sidewalk</SelectItem>
                        <SelectItem value="traffic-sign">Traffic Sign</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium">{report.id.substring(0, 8)}</TableCell>
                            <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{report.location.address}</TableCell>
                            <TableCell>
                              <ReportStatusBadge status={report.status} />
                            </TableCell>
                            <TableCell>{formatDistanceToNow(new Date(report.createdAt))} ago</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/report/${report.id}`)}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(report.id, "pending")}>
                                    Mark as Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(report.id, "in-progress")}>
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(report.id, "resolved")}>
                                    Mark as Resolved
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No reports found matching your filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Overview of system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Most Reported Area</p>
                    <p className="text-lg font-medium">Downtown Toronto</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Resolution Rate</p>
                    <p className="text-2xl font-bold">
                      {totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link href="/admin/reports">View Detailed Analytics</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
