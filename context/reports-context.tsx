"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type ReportStatus = "pending" | "in-progress" | "resolved"

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
}

type ReportsContextType = {
  reports: Report[]
  userReports: Report[]
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => Promise<Report>
  updateReport: (id: string, updates: Partial<Report>) => Promise<Report>
  getReportById: (id: string) => Report | undefined
  getNearbyReports: (lat: number, lng: number, radius: number) => Report[]
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

  const getReportById = (id: string) => {
    return reports.find((report) => report.id === id)
  }

  const getNearbyReports = (lat: number, lng: number, radius: number) => {
    // Simple distance calculation (not accounting for Earth's curvature)
    // In a real app, you'd use a more accurate formula like the Haversine formula
    return reports.filter((report) => {
      const dlat = report.location.lat - lat
      const dlng = report.location.lng - lng
      const distance = Math.sqrt(dlat * dlat + dlng * dlng)
      // Convert degrees to approximate kilometers (very rough approximation)
      const distanceKm = distance * 111
      return distanceKm <= radius
    })
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
        getReportById,
        getNearbyReports,
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
