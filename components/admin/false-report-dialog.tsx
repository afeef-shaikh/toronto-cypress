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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useReports, type Report } from "@/context/reports-context"
import { useNotifications } from "@/context/notifications-context"
import { AlertTriangle } from "lucide-react"

interface FalseReportDialogProps {
  report: Report
  onUpdate?: () => void
}

export function FalseReportDialog({ report, onUpdate }: FalseReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { markAsFalse } = useReports()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const handleMarkAsFalse = async () => {
    setIsSubmitting(true)

    try {
      await markAsFalse(report.id)

      addNotification({
        title: "Report Marked as False",
        message: "The report has been marked as false and withdrawn from the system.",
        type: "info",
      })

      toast({
        title: "Marked as False Report",
        description: "The report has been marked as false and withdrawn from the system.",
      })

      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Failed to mark report as false.",
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
          <AlertTriangle className="h-4 w-4" />
          Mark as False Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mark as False Report</DialogTitle>
          <DialogDescription>This will mark the report as false and withdraw it from the system.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter a reason for marking this report as false..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            This action will withdraw the report from the system and notify the user who submitted it. False reports are
            not included in statistics and are not visible to regular users.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleMarkAsFalse} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Mark as False Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
