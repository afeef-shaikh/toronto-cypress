"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useReports, type Report, type ReportType } from "@/context/reports-context"
import { useNotifications } from "@/context/notifications-context"
import { Edit } from "lucide-react"

interface EditReportDialogProps {
  report: Report
  onUpdate?: () => void
}

export function EditReportDialog({ report, onUpdate }: EditReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ReportType>(report.type)
  const [description, setDescription] = useState(report.description)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { updateReport } = useReports()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateReport(report.id, {
        type,
        description,
      })

      addNotification({
        title: "Report Updated",
        message: "Your report has been successfully updated.",
        type: "success",
      })

      toast({
        title: "Report Updated",
        description: "Your report has been successfully updated.",
      })

      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
            <DialogDescription>Make changes to your report. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Problem Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select problem type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="street-light">Street Light Issue</SelectItem>
                  <SelectItem value="graffiti">Graffiti</SelectItem>
                  <SelectItem value="garbage">Garbage Issue</SelectItem>
                  <SelectItem value="sidewalk">Sidewalk Damage</SelectItem>
                  <SelectItem value="traffic-sign">Traffic Sign Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
