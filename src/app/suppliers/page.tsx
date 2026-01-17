'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Building2,
  Star,
  ExternalLink,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'
import { toast } from '@/hooks/use-toast'

export default function SuppliersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  const categories = ['all', 'Technology', 'Design', 'Marketing', 'Data & Analytics', 'Content']

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(`/api/suppliers?category=${categoryFilter}&search=${searchQuery}`)
        const data = await response.json()
        if (data.success) {
          setSuppliers(data.data.suppliers || [])
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch suppliers',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch suppliers error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [categoryFilter, user])

  // Filter suppliers locally
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      searchQuery === '' ||
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Filter Suppliers</CardTitle>
              <CardDescription>Search and filter suppliers by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="flex-1">
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
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredSuppliers.length} suppliers found
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/suppliers/create">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">List Your Business</span>
                <span className="sm:hidden">Add Business</span>
              </Link>
            </Button>
          </div>

          {/* Suppliers Grid */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading suppliers...</p>
            </div>
          ) : filteredSuppliers.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="truncate">{supplier.name}</CardTitle>
                          {supplier.verified && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {supplier.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{supplier.category}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{supplier.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                        <div className="font-semibold">{supplier.projectsCompleted}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Hourly Rate</div>
                        <div className="font-semibold">
                          ${supplier.hourlyRate ? supplier.hourlyRate.toLocaleString() : 'N/A'}/hr
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/suppliers/${supplier.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <Building2 className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Suppliers Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {searchQuery || categoryFilter !== 'all'
                    ? 'Try adjusting your filters to find more suppliers.'
                    : 'There are no suppliers available at this time.'}
                </p>
                <Button asChild>
                  <Link href="/suppliers/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Become a Supplier
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
