"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useReports, type Report } from "@/context/reports-context"
import { useNotifications } from "@/context/notifications-context"
import { Copy } from "lucide-react"

interface DuplicateReportDialogProps {
  report: Report
  allReports: Report[]
  onUpdate?: () => void
}

export function DuplicateReportDialog({ report, allReports, onUpdate }: DuplicateReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [originalReportId, setOriginalReportId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { markAsDuplicate } = useReports()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  // Filter out the current report and get only pending/in-progress reports
  const potentialOriginalReports = allReports.filter(
    (r) => r.id !== report.id && (r.status === "pending" || r.status === "in-progress"),
  )

  const handleMarkAsDuplicate = async () => {
    if (!originalReportId) {
      toast({
        title: "Original Report Required",
        description: "Please select an original report.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await markAsDuplicate(report.id, originalReportId)

      addNotification({
        title: "Report Marked as Duplicate",
        message: "The report has been marked as a duplicate and withdrawn.",
        type: "info",
      })

      toast({
        title: "Marked as Duplicate",
        description: "The report has been marked as a duplicate and withdrawn.",
      })

      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Failed to mark report as duplicate.",
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
          <Copy className="h-4 w-4" />
          Mark as Duplicate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark as Duplicate Report</DialogTitle>
          <DialogDescription>
            This will mark the current report as a duplicate of another report and withdraw it from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-report">Select Original Report</Label>
            <Select value={originalReportId} onValueChange={setOriginalReportId}>
              <SelectTrigger>
                <SelectValue placeholder="Select the original report" />
              </SelectTrigger>
              <SelectContent>
                {potentialOriginalReports.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No eligible reports found
                  </SelectItem>
                ) : (
                  potentialOriginalReports.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.type} - {r.location.address.substring(0, 30)}...
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            This action will withdraw the current report and link it to the selected original report. The user who
            reported this issue will be notified.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMarkAsDuplicate} disabled={isSubmitting || !originalReportId}>
            {isSubmitting ? "Processing..." : "Mark as Duplicate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
