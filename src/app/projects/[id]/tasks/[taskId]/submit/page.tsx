'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

export default function SubmitTaskPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deliverable, setDeliverable] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('deliverable', deliverable)
      if (file) {
        formData.append('file', file)
      }

      const response = await fetch(`/api/tasks/${params.id}/submit`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Deliverable submitted successfully!',
        })
        router.push(`/projects/${params.id}/tasks`)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit deliverable',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/projects/${params.id}/tasks`} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-bold text-xl">Submit Deliverable</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Submit Task Deliverable</CardTitle>
            <CardDescription>
              Upload your work and provide a summary for task completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliverable">Deliverable Description</Label>
                <Textarea
                  id="deliverable"
                  placeholder="Describe what you've delivered, achievements, and any notes..."
                  rows={4}
                  value={deliverable}
                  onChange={(e) => setDeliverable(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File Attachment</Label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={loading}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload any relevant files (PDF, images, documents, etc.)
                </p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">Submission Guidelines</div>
                    <ul className="space-y-1 mt-1">
                      <li>• Be clear about what you've delivered</li>
                      <li>• Provide specific details about your work</li>
                      <li>• Attach any relevant files or documentation</li>
                      <li>• This submission will be visible to your team lead</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/projects/${params.id}/tasks`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !deliverable.trim()}>
                  {loading ? 'Submitting...' : 'Submit Deliverable'}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
