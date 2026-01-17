'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  Plus,
  Loader2,
  ArrowRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function NeedsPage() {
  const [needs, setNeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  const categories = ['all', 'Development', 'Design', 'Marketing']
  const urgencyOptions = ['all', 'HIGH', 'MEDIUM', 'LOW']

  // Fetch needs
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/needs?category=${categoryFilter}&urgency=${urgencyFilter}`
        )
        const data = await response.json()
        if (data.success) {
          setNeeds(data.data.needs || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch needs',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch needs error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNeeds()
  }, [categoryFilter, urgencyFilter])

  // Filter needs locally
  const filteredNeeds = needs.filter((need) => {
    const matchesSearch =
      searchQuery === '' ||
      need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Get urgency badge variant
  const getUrgencyVariant = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'default'
      case 'LOW':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  // Get urgency icon
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />
      case 'MEDIUM':
        return <Clock className="h-4 w-4" />
      case 'LOW':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Project Needs Board</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Filter Needs</CardTitle>
              <CardDescription>Search and filter project needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search needs by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === 'all' ? 'All Urgency Levels' : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredNeeds.length} needs found
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/needs/create">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Post a Need</span>
                <span className="sm:hidden">Post Need</span>
              </Link>
            </Button>
          </div>

          {/* Needs Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading needs...</p>
            </div>
          ) : filteredNeeds.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              {filteredNeeds.map((need) => (
                <Card key={need.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{need.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {need.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getUrgencyVariant(need.urgency)}>
                        {getUrgencyIcon(need.urgency)}
                        <span className="ml-1">{need.urgency}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Category</div>
                        <Badge variant="outline" className="mt-1">{need.category}</Badge>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Skills Required</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {need.skills.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            ${need.budget ? need.budget.toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Posted {new Date(need.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/projects/${need.projectId}/needs/${need.id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <ClipboardList className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Needs Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {searchQuery || categoryFilter !== 'all' || urgencyFilter !== 'all'
                    ? 'Try adjusting your filters to find more needs.'
                    : 'There are no project needs available at this time.'}
                </p>
                <Button asChild>
                  <Link href="/needs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Need
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
