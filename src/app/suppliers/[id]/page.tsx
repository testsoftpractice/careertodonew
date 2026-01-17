'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  DollarSign,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  Users,
  Clock,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

interface SupplierData {
  id: string
  name: string
  description: string
  category: string
  subCategories?: string[]
  expertise: string[]
  hourlyRate?: number
  location: string
  website?: string
  contactEmail: string
  contactPhone?: string
  companySize?: string
  yearsInBusiness?: string
  portfolioLinks?: string[]
  services: string[]
  certifications?: string[]
  projectsCompleted: number
  rating: number
  verified: boolean
  createdAt: string
  owner?: {
    id: string
    name: string
    email: string
  }
}

export default function SupplierDetailPage() {
  const params = useParams()
  const supplierId = params.id as string

  const [supplier, setSupplier] = useState<SupplierData | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/suppliers/${supplierId}`)
        const data = await response.json()

        if (data.success) {
          setSupplier(data.data.supplier)
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to fetch supplier details',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Fetch supplier error:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch supplier details',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (supplierId) {
      fetchSupplier()
    }
  }, [supplierId])

  // Handle contact
  const handleContact = async () => {
    try {
      setContacting(true)
      const response = await fetch(`/api/suppliers/${supplierId}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Your contact request has been sent',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to send contact request',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Contact error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send contact request',
        variant: 'destructive'
      })
    } finally {
      setContacting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Loading supplier details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Supplier not found
  if (!supplier) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Supplier Not Found</h3>
                <p className="text-muted-foreground mb-6">The supplier you're looking for doesn't exist.</p>
                <Button asChild>
                  <Link href="/suppliers">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Suppliers
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/suppliers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Supplier Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl sm:text-3xl">{supplier.name}</CardTitle>
                    {supplier.verified && (
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {supplier.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{supplier.category}</Badge>
                {supplier.subCategories?.map((subCat, index) => (
                  <Badge key={index} variant="secondary">
                    {subCat}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-primary fill-current" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                    <div className="font-semibold">{supplier.rating.toFixed(1)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                    <div className="font-semibold">{supplier.projectsCompleted}</div>
                  </div>
                </div>

                {supplier.hourlyRate && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                      <div className="font-semibold">${supplier.hourlyRate}/hr</div>
                    </div>
                  </div>
                )}

                {supplier.companySize && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Team</div>
                      <div className="font-semibold">{supplier.companySize}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium truncate">{supplier.location}</div>
                  </div>
                </div>

                {supplier.yearsInBusiness && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Experience</div>
                      <div className="font-medium">{supplier.yearsInBusiness}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expertise */}
              {supplier.expertise.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {supplier.services.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Services Offered</h3>
                  <ul className="space-y-2">
                    {supplier.services.map((service, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {supplier.certifications && supplier.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {supplier.portfolioLinks && supplier.portfolioLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Portfolio & Work</h3>
                  <div className="space-y-2">
                    {supplier.portfolioLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{link}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${supplier.contactEmail}`}
                      className="text-sm hover:underline"
                    >
                      {supplier.contactEmail}
                    </a>
                  </div>
                  {supplier.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a
                        href={`tel:${supplier.contactPhone}`}
                        className="text-sm hover:underline"
                      >
                        {supplier.contactPhone}
                      </a>
                    </div>
                  )}
                  {supplier.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Link
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        {supplier.website}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Info */}
              {supplier.owner && (
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-3">Business Owner</div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {supplier.owner.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{supplier.owner.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{supplier.owner.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button onClick={handleContact} disabled={contacting} className="flex-1">
                  {contacting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Supplier
                    </>
                  )}
                </Button>
                {supplier.website && (
                  <Button variant="outline" asChild>
                    <Link href={supplier.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* More Suppliers */}
          <Card>
            <CardHeader>
              <CardTitle>Explore More Suppliers</CardTitle>
              <CardDescription>Check out other businesses on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/suppliers">
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Suppliers
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
