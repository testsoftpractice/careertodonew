'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Shield, Search, Filter, Scale, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface ComplianceItem {
  id: string
  type: string
  category: string
  project: string
  severity: string
  description: string
  status: string
  createdAt: string
}

export default function AdminCompliancePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(false)

  // Mock compliance data
  const mockCompliance: ComplianceItem[] = [
    {
      id: '1',
      type: 'Project Approval',
      category: 'Project',
      project: 'Tech Innovation Hub',
      severity: 'Low',
      description: 'Standard project submission requiring approval',
      status: 'Compliant',
      createdAt: '2024-12-15T10:00:00Z',
    },
    {
      id: '2',
      type: 'Data Privacy',
      category: 'User',
      project: 'Sarah Johnson',
      severity: 'Medium',
      description: 'Student data privacy review required',
      status: 'Pending Review',
      createdAt: '2024-12-10T14:30:00Z',
    },
    {
      id: '3',
      type: 'Content Policy',
      category: 'Content',
      project: 'N/A',
      severity: 'High',
      description: 'Project description violates content policies',
      status: 'Action Required',
      createdAt: '2024-12-05T09:00:00Z',
    },
    {
      id: '4',
      type: 'Investment Compliance',
      category: 'Financial',
      project: 'Financial Services Platform',
      severity: 'Low',
      description: 'Investment terms and conditions review',
      status: 'Compliant',
      createdAt: '2024-12-01T08:00:00Z',
    },
  ]

  useEffect(() => {
    const fetchCompliance = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setComplianceItems(mockCompliance)
      setLoading(false)
    }
    fetchCompliance()
  }, [])

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'action-required' && item.status === 'Action Required') ||
      (activeTab === 'pending' && item.status === 'Pending Review')
    return matchesSearch && matchesCategory && matchesTab
  })

  const handleAction = async (action: string, item: ComplianceItem) => {
    toast({
      title: 'Compliance Action',
      description: `${action} item: ${item.type}`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Compliance Tools</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find compliance items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by type, project, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={categoryFilter === 'Project' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('Project')}
                >
                  Projects
                </Button>
                <Button
                  variant={categoryFilter === 'User' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('User')}
                >
                  Users
                </Button>
                <Button
                  variant={categoryFilter === 'Content' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter('Content')}
                >
                  Content
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All Items
            </Button>
            <Button
              variant={activeTab === 'action-required' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('action-required')}
            >
              Action Required
            </Button>
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('pending')}
            >
              Pending Review
            </Button>
          </div>

          {loading ? (
            <div className="animate-pulse text-center py-8 sm:py-12">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-orange-500 border-r-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading compliance items...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{item.type}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-2 truncate">
                          {item.project} • {item.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        </div>
                      </div>
                      <Badge
                        variant={item.status === 'Compliant' ? 'default' : item.status === 'Action Required' ? 'destructive' : 'secondary'}
                        className="text-xs sm:text-sm w-fit"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Severity</div>
                        <Badge
                          variant={item.severity === 'High' ? 'destructive' : item.severity === 'Medium' ? 'default' : 'secondary'}
                          className="text-xs sm:text-sm w-fit"
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Category</div>
                        <div className="text-xs sm:text-sm font-medium">{item.category}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Date</div>
                        <div className="text-xs sm:text-sm">{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t flex items-center justify-between">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 mr-2 inline-block" />
                        {item.status === 'Compliant' ? 'Compliant with all policies' : 'Requires review and action'}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAction('Reviewed', item.id)}
                      >
                        Mark Reviewed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">All Compliance Clear</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  No compliance issues found at this time. All projects and content are compliant with platform policies.
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
