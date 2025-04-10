"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type ReportStatus = "pending" | "in-progress" | "resolved" | "withdrawn"

export type ReportType = "pothole" | "street-light" | "graffiti" | "garbage" | "sidewalk" | "traffic-sign" | "other"

export type Report = {
  id: string
  userId: string
  type: ReportType
  description: string
  location: {
    lat: number
    lng: number
    address: string
  }
  status: ReportStatus
  images: string[]
  createdAt: string
  updatedAt: string
  isDuplicate?: boolean
  originalReportId?: string
  isFalse?: boolean
}

type ReportsContextType = {
  reports: Report[]
  userReports: Report[]
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => Promise<Report>
  updateReport: (id: string, updates: Partial<Report>) => Promise<Report>
  withdrawReport: (id: string) => Promise<void>
  getReportById: (id: string) => Report | undefined
  getNearbyReports: (lat: number, lng: number, radius: number) => Report[]
  markAsDuplicate: (reportId: string, originalId: string) => Promise<void>
  markAsFalse: (reportId: string) => Promise<void>
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined)

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      setReports(JSON.parse(storedReports))
    } else {
      // Initialize with some mock data if no reports exist
      const mockReports: Report[] = [
        {
          id: "report_1",
          userId: "user_1",
          type: "pothole",
          description: "Large pothole in the middle of the road",
          location: {
            lat: 43.6532,
            lng: -79.3832,
            address: "100 Queen St W, Toronto, ON",
          },
          status: "pending",
          images: ["/placeholder.svg?height=300&width=400"],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "report_2",
          userId: "user_2",
          type: "street-light",
          description: "Street light not working for the past week",
          location: {
            lat: 43.6547,
            lng: -79.3807,
            address: "200 Bay St, Toronto, ON",
          },
          status: "in-progress",
          images: ["/placeholder.svg?height=300&width=400"],
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "report_3",
          userId: "user_3",
          type: "garbage",
          description: "Overflowing garbage bin",
          location: {
            lat: 43.6472,
            lng: -79.3872,
            address: "300 Front St W, Toronto, ON",
          },
          status: "resolved",
          images: ["/placeholder.svg?height=300&width=400"],
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setReports(mockReports)
      localStorage.setItem("reports", JSON.stringify(mockReports))
    }
    setIsLoading(false)
  }, [])

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("reports", JSON.stringify(reports))
    }
  }, [reports, isLoading])

  // Get reports for the current user
  const userReports = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) return []
    return reports.filter((report) => report.userId === user.id)
  }

  const addReport = async (reportData: Omit<Report, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newReport: Report = {
      ...reportData,
      id: "report_" + Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    }

    setReports((prev) => [...prev, newReport])
    return newReport
  }

  const updateReport = async (id: string, updates: Partial<Report>) => {
    const reportIndex = reports.findIndex((r) => r.id === id)
    if (reportIndex === -1) {
      throw new Error(`Report with id ${id} not found`)
    }

    const updatedReport = {
      ...reports[reportIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    const newReports = [...reports]
    newReports[reportIndex] = updatedReport

    setReports(newReports)
    return updatedReport
  }

  const withdrawReport = async (id: string) => {
    const reportIndex = reports.findIndex((r) => r.id === id)
    if (reportIndex === -1) {
      throw new Error(`Report with id ${id} not found`)
    }

    // Check if the report can be withdrawn (only if it's pending)
    if (reports[reportIndex].status !== "pending") {
      throw new Error("Only pending reports can be withdrawn")
    }

    const updatedReport = {
      ...reports[reportIndex],
      status: "withdrawn" as ReportStatus,
      updatedAt: new Date().toISOString(),
    }

    const newReports = [...reports]
    newReports[reportIndex] = updatedReport

    setReports(newReports)
    return
  }

  const getReportById = (id: string) => {
    return reports.find((report) => report.id === id)
  }

  const getNearbyReports = (lat: number, lng: number, radius: number) => {
    // Simple distance calculation (not accounting for Earth's curvature)
    return reports.filter((report) => {
      const dlat = report.location.lat - lat
      const dlng = report.location.lng - lng
      const distance = Math.sqrt(dlat * dlat + dlng * dlng)
      // Convert degrees to approximate kilometers (very rough approximation)
      const distanceKm = distance * 111
      return distanceKm <= radius
    })
  }

  // Admin functionality: Mark a report as duplicate
  const markAsDuplicate = async (reportId: string, originalId: string) => {
    const reportIndex = reports.findIndex((r) => r.id === reportId)
    const originalReportIndex = reports.findIndex((r) => r.id === originalId)

    if (reportIndex === -1 || originalReportIndex === -1) {
      throw new Error("Report not found")
    }

    const updatedReport = {
      ...reports[reportIndex],
      isDuplicate: true,
      originalReportId: originalId,
      status: "withdrawn" as ReportStatus,
      updatedAt: new Date().toISOString(),
    }

    const newReports = [...reports]
    newReports[reportIndex] = updatedReport

    setReports(newReports)
  }

  // Admin functionality: Mark a report as false
  const markAsFalse = async (reportId: string) => {
    const reportIndex = reports.findIndex((r) => r.id === reportId)

    if (reportIndex === -1) {
      throw new Error("Report not found")
    }

    const updatedReport = {
      ...reports[reportIndex],
      isFalse: true,
      status: "withdrawn" as ReportStatus,
      updatedAt: new Date().toISOString(),
    }

    const newReports = [...reports]
    newReports[reportIndex] = updatedReport

    setReports(newReports)
  }

  if (isLoading) {
    return <div>Loading reports...</div>
  }

  return (
    <ReportsContext.Provider
      value={{
        reports,
        userReports: userReports(),
        addReport,
        updateReport,
        withdrawReport,
        getReportById,
        getNearbyReports,
        markAsDuplicate,
        markAsFalse,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider")
  }
  return context
}
