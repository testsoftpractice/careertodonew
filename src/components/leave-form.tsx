'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

interface LeaveRequestFormProps {
  userId?: string
  onCreated?: () => void
}

export function LeaveRequestForm({ userId, onCreated }: LeaveRequestFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const handleSubmit = async () => {
    if (loading) return

    // Validate form
    if (!formData.leaveType) {
      toast({
        title: 'Validation Error',
        description: 'Please select a leave type',
        variant: 'destructive',
      })
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      })
      return
    }

    if (!formData.reason) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason for your leave request',
        variant: 'destructive',
      })
      return
    }

    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)

    if (startDate >= endDate) {
      toast({
        title: 'Validation Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Leave request submitted successfully',
          variant: 'default',
        })
        onCreated?.()
        handleClose()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to submit leave request',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Submit leave request error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit leave request',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          New Leave Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Leave Request</DialogTitle>
          <DialogDescription>
            Submit a leave request for review.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="leaveType">
                Leave Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) => setFormData({ ...formData, leaveType: value as any })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                  <SelectItem value="PERSONAL_LEAVE">Personal Leave</SelectItem>
                  <SelectItem value="VACATION">Vacation</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  <SelectItem value="BEREAVEMENT">Bereavement</SelectItem>
                  <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                  <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value as string })}
                placeholder="YYYY-MM-DD"
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="endDate">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value as string })}
                placeholder="YYYY-MM-DD"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="reason">
              Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain reason for your leave request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full resize-none min-h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
