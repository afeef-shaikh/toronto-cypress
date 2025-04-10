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
import { useToast } from "@/components/ui/use-toast"
import { useReports, type Report } from "@/context/reports-context"
import { useNotifications } from "@/context/notifications-context"
import { Trash2 } from "lucide-react"

interface WithdrawReportDialogProps {
  report: Report
  onUpdate?: () => void
}

export function WithdrawReportDialog({ report, onUpdate }: WithdrawReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { withdrawReport } = useReports()
  const { addNotification } = useNotifications()
  const { toast } = useToast()

  const handleWithdraw = async () => {
    setIsSubmitting(true)

    try {
      await withdrawReport(report.id)

      addNotification({
        title: "Report Withdrawn",
        message: "Your report has been successfully withdrawn.",
        type: "success",
      })

      toast({
        title: "Report Withdrawn",
        description: "Your report has been successfully withdrawn.",
      })

      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: error instanceof Error ? error.message : "Failed to withdraw report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Disable withdraw if report is not pending
  const canWithdraw = report.status === "pending"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={!canWithdraw}>
          <Trash2 className="h-4 w-4" />
          Withdraw Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Report</DialogTitle>
          <DialogDescription>
            Are you sure you want to withdraw this report? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!canWithdraw && (
            <p className="text-destructive text-sm">
              This report cannot be withdrawn because it is already being processed or has been resolved.
            </p>
          )}
          {canWithdraw && (
            <p className="text-sm">
              Withdrawing this report will remove it from the system and it will no longer be addressed by city
              officials.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleWithdraw} disabled={isSubmitting || !canWithdraw}>
            {isSubmitting ? "Withdrawing..." : "Withdraw Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
