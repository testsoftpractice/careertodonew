'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Mail,
  MapPin,
  DollarSign,
  Globe,
  Linkedin,
  ExternalLink,
  Camera,
  Save,
  Shield,
  TrendingUp,
  Award,
  PieChart,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function InvestorProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    location: '',
    linkedinUrl: '',
    websiteUrl: '',
    investmentFocus: '',
  })

  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/users/${user.id}`)
        const data = await response.json()

        if (data.user) {
          setUserData(data.user)
          setProfile({
            name: data.user.name || '',
            email: data.user.email || '',
            bio: data.user.bio || '',
            avatar: data.user.avatar || '',
            location: data.user.location || '',
            linkedinUrl: data.user.linkedinUrl || '',
            websiteUrl: data.user.portfolioUrl || '',
            investmentFocus: '',
          })
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive',
        })
      }
    }

    fetchUserData()
  }, [user])

  const handleSaveProfile = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (data.message) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Investor Profile</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/investor">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-background p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl sm:text-3xl bg-green-500 text-white">
                      {profile.name?.charAt(0) || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {profile.name || 'Investor'}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Strategic investor looking for high-growth opportunities
                  </p>
                  <Badge variant="default" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    VERIFIED INVESTOR
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="investment">Investment Focus</TabsTrigger>
              <TabsTrigger value="social">Social & Links</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Describe your investment philosophy and focus..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="investment" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <CardDescription>Your investment focus and criteria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentFocus">Investment Focus</Label>
                    <Input
                      id="investmentFocus"
                      value={profile.investmentFocus}
                      onChange={(e) => setProfile({ ...profile, investmentFocus: e.target.value })}
                      placeholder="e.g., Early-stage tech startups, EdTech, SaaS"
                    />
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Investment preferences help match you with relevant opportunities.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Specify preferred sectors and stages</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Define investment range preferences</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Set portfolio diversification goals</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social & Professional Links</CardTitle>
                  <CardDescription>Connect your professional profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" value={profile.email} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedinUrl"
                        value={profile.linkedinUrl}
                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website / Portfolio</Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="websiteUrl"
                        value={profile.websiteUrl}
                        onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access investor features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/investor/proposals">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Investment Proposals
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/investor/deals">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Deal Pipeline
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/marketplace">
                    <Award className="h-4 w-4 mr-2" />
                    Browse Marketplace
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/projects">
                    <Shield className="h-4 w-4 mr-2" />
                    All Projects
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
