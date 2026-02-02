'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { UniversitySelector } from './university-selector'
import {
  Save,
  Building2,
  GraduationCap,
  MapPin,
  Link as LinkIcon,
  Calendar,
  User,
  Loader2,
  Users,
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  major?: string
  graduationYear?: number
  bio?: string
  location?: string
  linkedinUrl?: string
  portfolioUrl?: string
  universityId?: string | null
  university?: any
}

interface UniversityProfileEnhancedProps {
  userId: string
}

export function UniversityProfileEnhanced({ userId }: UniversityProfileEnhancedProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    major: '',
    graduationYear: '',
    bio: '',
    location: '',
    linkedinUrl: '',
    portfolioUrl: '',
    universityId: null as string | null,
  })

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()

      if (data.success) {
        const user = data.data.user
        setProfile(user)
        setFormData({
          major: user.major || '',
          graduationYear: user.graduationYear?.toString() || '',
          bio: user.bio || '',
          location: user.location || '',
          linkedinUrl: user.linkedinUrl || '',
          portfolioUrl: user.portfolioUrl || '',
          universityId: user.universityId || null,
        })
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          major: formData.major,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
          bio: formData.bio,
          location: formData.location,
          linkedinUrl: formData.linkedinUrl,
          portfolioUrl: formData.portfolioUrl,
          universityId: formData.universityId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully',
        })
        setProfile(data.data.user)
      } else {
        toast({
          title: 'Update Failed',
          description: data.error || 'Failed to update profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          University Profile
        </CardTitle>
        <CardDescription>
          Update your university and academic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* University Selection */}
          <UniversitySelector
            label="University"
            value={formData.universityId}
            onChange={(university) =>
              setFormData({ ...formData, universityId: university?.id || null })
            }
            placeholder="Search and select your university..."
            showWebsite={true}
          />

          {profile?.university && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">Currently Enrolled</span>
              </div>
              <p className="text-sm font-semibold">{profile.university.name}</p>
              {profile.university.location && (
                <p className="text-sm text-muted-foreground">{profile.university.location}</p>
              )}
            </div>
          )}

          {/* Academic Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Major / Field of Study
              </Label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Graduation Year
              </Label>
              <Select
                value={formData.graduationYear}
                onValueChange={(value) => setFormData({ ...formData, graduationYear: value })}
              >
                <SelectTrigger id="graduationYear">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Portfolio URL
              </Label>
              <Input
                id="portfolioUrl"
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
