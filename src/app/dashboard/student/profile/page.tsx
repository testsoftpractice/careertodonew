'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  Edit,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Plus,
  Save,
  X,
  Globe,
  Linkedin,
  Github,
  Twitter,
  CheckCircle2,
  Star,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'
import { authFetch } from '@/lib/api-response'
import Link from 'next/link'
import { UniversityProfileEnhanced } from '@/components/student/university-profile-enhanced'

interface Experience {
  id: string
  title: string
  company: string
  location: string
  description: string
  startDate: string
  endDate: string | null
  current: boolean
  skills: string[]
}

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  endorsements: number
}

export default function StudentProfile() {
  const { user } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  
  const [formData, setFormData] = useState({
    headline: '',
    location: '',
    about: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
  })

  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [showSkillModal, setShowSkillModal] = useState(false)
  
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: '',
    company: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    skills: [],
  })

  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
  })

  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'Intermediate' as Skill['level'],
  })

  useEffect(() => {
    if (user) {
      fetchProfileData()
    }
  }, [user])

  const fetchProfileData = async () => {
    if (!user) return

    try {
      // Fetch user profile data
      const profileResponse = await authFetch(`/api/users/${user.id}`)
      const profileData = await profileResponse.json()
      
      if (profileData.success && profileData.data) {
        const data = profileData.data
        setFormData({
          headline: data.headline || '',
          location: data.location || '',
          about: data.about || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          twitter: data.twitter || '',
          website: data.website || '',
        })
      }

      // Fetch experiences
      const expResponse = await authFetch(`/api/experiences?userId=${user.id}`)
      const expData = await expResponse.json()
      if (expData.success) {
        setExperiences(expData.data || [])
      }

      // Fetch education
      const eduResponse = await authFetch(`/api/education?userId=${user.id}`)
      const eduData = await eduResponse.json()
      if (eduData.success) {
        setEducation(eduData.data || [])
      }

      // Fetch skills
      const skillsResponse = await authFetch(`/api/skills?userId=${user.id}`)
      const skillsData = await skillsResponse.json()
      if (skillsData.success) {
        setSkills(skillsData.data || [])
      }
    } catch (error) {
      console.error('Fetch profile data error:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await authFetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        })
        setIsEditing(false)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update profile',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Save profile error:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddExperience = async () => {
    if (!user || !newExperience.title) return

    try {
      const response = await authFetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newExperience,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setExperiences([...experiences, data.data])
        setNewExperience({
          title: '',
          company: '',
          location: '',
          description: '',
          startDate: '',
          endDate: '',
          current: false,
          skills: [],
        })
        setShowExperienceModal(false)
        toast({
          title: 'Success',
          description: 'Experience added successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add experience',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Add experience error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add experience',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      const response = await authFetch(`/api/experiences/${experienceId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setExperiences((experiences || []).filter(exp => exp.id !== experienceId))
        toast({
          title: 'Success',
          description: 'Experience deleted successfully',
        })
      }
    } catch (error) {
      console.error('Delete experience error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete experience',
        variant: 'destructive',
      })
    }
  }

  const handleAddEducation = async () => {
    if (!user || !newEducation.school) return

    try {
      const response = await authFetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newEducation,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setEducation([...education, data.data])
        setNewEducation({
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        })
        setShowEducationModal(false)
        toast({
          title: 'Success',
          description: 'Education added successfully',
        })
      }
    } catch (error) {
      console.error('Add education error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add education',
        variant: 'destructive',
      })
    }
  }

  const handleAddSkill = async () => {
    if (!user || !newSkill.name) return

    try {
      const response = await authFetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: newSkill.name,
          level: newSkill.level,
          endorsements: 0,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSkills([...skills, data.data])
        setNewSkill({
          name: '',
          level: 'Intermediate',
        })
        setShowSkillModal(false)
        toast({
          title: 'Success',
          description: 'Skill added successfully',
        })
      }
    } catch (error) {
      console.error('Add skill error:', error)
      toast({
        title: 'Error',
        description: 'Failed to add skill',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const response = await authFetch(`/api/skills/${skillId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setSkills((skills || []).filter(skill => skill.id !== skillId))
        toast({
          title: 'Success',
          description: 'Skill deleted successfully',
        })
      }
    } catch (error) {
      console.error('Delete skill error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete skill',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'Advanced': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'Intermediate': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'Beginner': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link href="/dashboard/student">
          <Button variant="ghost" size="sm" className="mb-6">
            <X className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Profile Header */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800 mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="h-32 w-32 sm:h-40 sm:w-40 ring-4 ring-white dark:ring-slate-900 shadow-2xl">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold text-3xl">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                      {user?.name || 'Student Name'}
                    </h1>
                    {isEditing ? (
                      <Input
                        value={formData.headline}
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                        placeholder="Professional headline"
                        className="mb-2"
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground mb-2">
                        {formData.headline || user?.role || 'Student'}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {formData.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {isEditing ? (
                            <Input
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="Location"
                              className="h-8 text-sm w-48"
                            />
                          ) : (
                            <span>{formData.location}</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email"
                            className="h-8 text-sm w-48"
                          />
                        ) : (
                          <span>{formData.email}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                    disabled={loading}
                  >
                    {isEditing ? (
                      loading ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        placeholder="Write a short bio about yourself..."
                        rows={4}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            placeholder="linkedin.com/in/username"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="github">GitHub</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            placeholder="github.com/username"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="twitter"
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            placeholder="@username"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {formData.about && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.about}
                      </p>
                    )}
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        {formData.website}
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Experiences and Education */}
          <div className="lg:col-span-2 space-y-6">
            {/* University Profile */}
            <UniversityProfileEnhanced userId={user?.id} />

            {/* Experiences Section */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      Experience
                    </CardTitle>
                    <CardDescription>
                      {experiences.length} {experiences.length === 1 ? 'position' : 'positions'}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowExperienceModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {experiences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No experiences added yet</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowExperienceModal(true)}
                    >
                      Add Your First Experience
                    </Button>
                  </div>
                ) : (
                  experiences.map((experience) => (
                    <div
                      key={experience.id}
                      className="relative p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 hover:opacity-100"
                        onClick={() => handleDeleteExperience(experience.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {(experience.company || experience.title).charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1">{experience.title}</h3>
                          <p className="text-sm font-medium text-primary mb-1">{experience.company}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(experience.startDate)} - {experience.current ? 'Present' : formatDate(experience.endDate!)}</span>
                            </div>
                            {experience.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{experience.location}</span>
                              </div>
                            )}
                          </div>
                          {experience.description && (
                            <p className="text-sm text-muted-foreground">{experience.description}</p>
                          )}
                          {experience.skills && experience.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {experience.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-emerald-500" />
                      Education
                    </CardTitle>
                    <CardDescription>
                      {education.length} {education.length === 1 ? 'school' : 'schools'}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowEducationModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No education added yet</p>
                  </div>
                ) : (
                  education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                          {(edu.school || edu.field).charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1">{edu.school}</h3>
                          <p className="text-sm text-primary mb-1">{edu.degree} in {edu.field}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                          </div>
                          {edu.description && (
                            <p className="text-sm text-muted-foreground">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Skills and Contact */}
          <div className="space-y-6">
            {/* Skills Section */}
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-500" />
                      Skills
                    </CardTitle>
                    <CardDescription>
                      {skills.length} skills
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowSkillModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {skills.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No skills added yet</p>
                  </div>
                ) : (
                  skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <Badge className={`text-xs ${getSkillLevelColor(skill.level)}`}>
                            {skill.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Contact Info Card */}
            {(formData.phone || formData.email || formData.website) && (
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${formData.email}`} className="text-primary hover:underline">
                        {formData.email}
                      </a>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${formData.phone}`} className="text-primary hover:underline">
                        {formData.phone}
                      </a>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {formData.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Links Card */}
            {(formData.linkedin || formData.github || formData.twitter) && (
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-blue-500" />
                    Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.linkedin && (
                    <a
                      href={formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span className="flex-1 truncate">LinkedIn</span>
                    </a>
                  )}
                  {formData.github && (
                    <a
                      href={formData.github.startsWith('http') ? formData.github : `https://${formData.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      <Github className="h-4 w-4" />
                      <span className="flex-1 truncate">GitHub</span>
                    </a>
                  )}
                  {formData.twitter && (
                    <a
                      href={formData.twitter.startsWith('http') ? formData.twitter : `https://twitter.com/${formData.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
                    >
                      <Twitter className="h-4 w-4 text-blue-400" />
                      <span className="flex-1 truncate">Twitter</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Add Experience Modal */}
        {showExperienceModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExperienceModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Experience</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowExperienceModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newExperience.endDate}
                        onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                        disabled={newExperience.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="current"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="current">I currently work here</Label>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      placeholder="Describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowExperienceModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddExperience} className="flex-1">
                      Add Experience
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Education Modal */}
        {showEducationModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEducationModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Education</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowEducationModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="school">School *</Label>
                    <Input
                      id="school"
                      value={newEducation.school}
                      onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                      placeholder="School name"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="degree">Degree *</Label>
                      <Input
                        id="degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="field">Field of Study *</Label>
                      <Input
                        id="field"
                        value={newEducation.field}
                        onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                        placeholder="Computer Science, etc."
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eduStartDate">Start Date *</Label>
                      <Input
                        id="eduStartDate"
                        type="date"
                        value={newEducation.startDate}
                        onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eduEndDate">End Date *</Label>
                      <Input
                        id="eduEndDate"
                        type="date"
                        value={newEducation.endDate}
                        onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eduDescription">Description</Label>
                    <Textarea
                      id="eduDescription"
                      value={newEducation.description}
                      onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                      placeholder="Achievements, activities, etc."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowEducationModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddEducation} className="flex-1">
                      Add Education
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Skill Modal */}
        {showSkillModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSkillModal(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Skill</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSkillModal(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skillName">Skill Name *</Label>
                    <Input
                      id="skillName"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g., JavaScript, Python"
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillLevel">Proficiency Level</Label>
                    <select
                      id="skillLevel"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowSkillModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddSkill} className="flex-1">
                      Add Skill
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
