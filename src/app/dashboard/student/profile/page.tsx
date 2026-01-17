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
import { Progress } from '@/components/ui/progress'
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Linkedin,
  ExternalLink,
  Camera,
  Save,
  Shield,
  Star,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function StudentProfilePage() {
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
    portfolioUrl: '',
    major: '',
    graduationYear: '',
  })

  const [userData, setUserData] = useState<any>(null)

  // Fetch user data on mount
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
            portfolioUrl: data.user.portfolioUrl || '',
            major: data.user.major || '',
            graduationYear: data.user.graduationYear?.toString() || '',
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
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Student Profile</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/student">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Overview Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-primary-foreground">
                      {profile.name?.charAt(0) || 'S'}
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
                    {profile.name || 'Student'}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                    {userData?.university?.name && (
                      <Badge variant="secondary" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {userData.university.name}
                      </Badge>
                    )}
                    {profile.major && (
                      <Badge variant="outline" className="text-xs">
                        {profile.major}
                      </Badge>
                    )}
                    {profile.graduationYear && (
                      <Badge variant="outline" className="text-xs">
                        Class of {profile.graduationYear}
                      </Badge>
                    )}
                  </div>
                  {userData?.verificationStatus && (
                    <Badge
                      variant={userData.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {userData.verificationStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Statistics */}
          {userData?.reputationScores && (
            <Card>
              <CardHeader>
                <CardTitle>Reputation Scores</CardTitle>
                <CardDescription>Your multi-dimensional performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-5">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Execution</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-500">
                      {userData.reputationScores.execution.toFixed(1)}
                    </div>
                    <Progress value={userData.reputationScores.execution} max={5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Collaboration</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-500">
                      {userData.reputationScores.collaboration.toFixed(1)}
                    </div>
                    <Progress value={userData.reputationScores.collaboration} max={5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Leadership</div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-500">
                      {userData.reputationScores.leadership.toFixed(1)}
                    </div>
                    <Progress value={userData.reputationScores.leadership} max={5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Ethics</div>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500">
                      {userData.reputationScores.ethics.toFixed(1)}
                    </div>
                    <Progress value={userData.reputationScores.ethics} max={5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Reliability</div>
                    <div className="text-2xl sm:text-3xl font-bold text-pink-500">
                      {userData.reputationScores.reliability.toFixed(1)}
                    </div>
                    <Progress value={userData.reputationScores.reliability} max={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for Profile Management */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>

            {/* Profile Info Tab */}
            <TabsContent value="profile" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
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
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
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

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Manage your contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" value={profile.email} disabled />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact support to change your email address
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Academic Tab */}
            <TabsContent value="academic" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic background and progression</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major / Field of Study</Label>
                    <Input
                      id="major"
                      value={profile.major}
                      onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                      placeholder="e.g., Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={profile.graduationYear}
                      onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                      placeholder="e.g., 2025"
                      min="2020"
                      max="2030"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Progression Level</div>
                        <div className="text-xs text-muted-foreground">
                          {userData?.progressionLevel || 'Not started'}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {userData?.progressionLevel || 'N/A'}
                      </Badge>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Social & Professional Links</CardTitle>
                  <CardDescription>Connect your professional profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portfolioUrl"
                        value={profile.portfolioUrl}
                        onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.com"
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

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access related features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    View Notifications
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/student/verifications">
                    <Shield className="h-4 w-4 mr-2" />
                    Verification Requests
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/records/create">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Record
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/leaderboards">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Leaderboards
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
