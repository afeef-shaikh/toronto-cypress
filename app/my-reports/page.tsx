"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/context/auth-context"
import { useReports } from "@/context/reports-context"
import { ReportCard } from "@/components/report-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MyReportsPage() {
  const { isAuthenticated } = useAuth()
  const { userReports } = useReports()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  // Filter reports based on active tab
  const filteredReports = userReports.filter((report) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return report.status === "pending"
    if (activeTab === "in-progress") return report.status === "in-progress"
    if (activeTab === "resolved") return report.status === "resolved"
    return true
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>Please log in to view your reports.</AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Reports</h1>
          <Button asChild>
            <a href="/report">
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </a>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredReports.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No reports found</h2>
                <p className="mt-2 text-muted-foreground">
                  {activeTab === "all"
                    ? "You haven't submitted any reports yet."
                    : `You don't have any ${activeTab} reports.`}
                </p>
                <Button asChild className="mt-6">
                  <a href="/report">Create Your First Report</a>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
