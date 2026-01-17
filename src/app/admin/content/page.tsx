'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, Shield, Trash2, Flag, Search, Filter, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('reported')
  const [searchQuery, setSearchQuery] = useState('')

  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Mock content data
  const mockContent = [
    {
      id: '1',
      type: 'inappropriate',
      title: 'Offensive language in project description',
      reporter: 'user@careertodo.com',
      status: 'pending',
      contentId: 'p1',
      reportedDate: '2024-01-13T10:30:00Z',
    },
    {
      id: '2',
      type: 'spam',
      title: 'Multiple duplicate project submissions',
      reporter: 'admin@careertodo.com',
      status: 'pending',
      contentId: 'p2',
      reportedDate: '2024-01-13T11:15:00Z',
    },
    {
      id: '3',
      type: 'harmful',
      title: 'External link to phishing site',
      reporter: 'user@careertodo.com',
      status: 'pending',
      contentId: 'p4',
      reportedDate: '2024-01-13T09:45:00Z',
    },
    {
      id: '4',
      type: 'misinformation',
      title: 'False claims about project achievements',
      reporter: 'admin@careertodo.com',
      status: 'reviewed',
      contentId: 'p3',
      reportedDate: '2024-01-12T16:20:00Z',
    },
    {
      id: '5',
      type: 'inappropriate',
      title: 'Inappropriate profile image',
      reporter: 'user@careertodo.com',
      status: 'pending',
      contentId: 'u1',
      reportedDate: '2024-01-13T14:50:00Z',
    },
  ]

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setContent(mockContent)
      setLoading(false)
    }
    fetchContent()
  }, [])

  const handleAction = async (action: string, itemId: string) => {
    toast({
      title: 'Action',
      description: `${action} content: ${itemId}`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Content Moderation</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="ghost" size="sm" asChild className="text-primary-foreground hover:bg-primary/80">
                <Link href="/admin/governance">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Back to Admin</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Reported Content</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Review and moderate user-generated content
              </p>
            </div>
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Search content by title, type, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-orange-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading content...</p>
            </div>
          ) : content.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Content</th>
                      <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Reporter</th>
                      <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 sm:p-4">
                          <Badge
                            variant={item.type === 'inappropriate' ? 'destructive' : item.type === 'spam' ? 'default' : 'secondary'}
                            className="text-xs sm:text-sm w-fit"
                          >
                            {item.type}
                          </Badge>
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="space-y-1">
                            <div className="font-medium text-sm sm:text-base truncate max-w-[200px]">{item.title}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px]">ID: {item.contentId}</div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground truncate max-w-[150px]">{item.reporter}</td>
                        <td className="p-3 sm:p-4">
                          <Badge
                            variant={item.status === 'pending' ? 'secondary' : item.status === 'reviewed' ? 'default' : 'outline'}
                            className="text-xs sm:text-sm w-fit"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                          {new Date(item.reportedDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast({ title: 'Review Content', description: item.title })}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAction('Approved', item.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleAction('Removed', item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">All Content Clear</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  No reported content found at this time.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="text-center pt-6 sm:pt-8">
            <Button variant="outline" className="text-sm sm:text-base" asChild>
              <Link href="/admin/governance">
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
