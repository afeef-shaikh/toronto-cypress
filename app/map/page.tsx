"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { GoogleMapComponent } from "@/components/google-map"
import { useReports, type Report } from "@/context/reports-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportCard } from "@/components/report-card"
import { Search, MapPin, Filter } from "lucide-react"

export default function MapPage() {
  const { reports } = useReports()
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null)

  // Apply filters whenever reports or filter criteria change
  useEffect(() => {
    let filtered = [...reports]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.description.toLowerCase().includes(query) || report.location.address.toLowerCase().includes(query),
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

  const handleReportClick = (report: Report) => {
    setSelectedReport(report)
    setMapCenter({ lat: report.location.lat, lng: report.location.lng })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">View Reports Map</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Filter Reports</CardTitle>
                <CardDescription>Find specific reports by searching or filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Type</span>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
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

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setTypeFilter("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reports ({filteredReports.length})</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleReportClick(report)}
                    >
                      <ReportCard report={report} showActions={false} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No reports found matching your filters.</div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Toronto Reports Map
                </CardTitle>
                <CardDescription>View all reported issues across Toronto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border border-border h-[700px]">
                  <GoogleMapComponent reports={filteredReports} selectedLocation={mapCenter} height="100%" zoom={12} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
