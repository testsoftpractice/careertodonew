'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  Users,
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Settings,
  Save,
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { logoutAndRedirect } from '@/lib/utils/logout'
import { useAuth } from '@/contexts/auth-context'

export interface Preferences {
  publicProfile: boolean
  showReputation: boolean
  emailNotifications: boolean
  taskReminders: boolean
  projectUpdates: boolean
  weeklyDigest: boolean
  pushNotifications: boolean
}

export default function StudentSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    publicProfile: true,
    showReputation: true,
    emailNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    weeklyDigest: true,
    pushNotifications: true,
  })
  const [activeTab, setActiveTab] = useState('preferences')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: 'Success', description: 'Settings saved successfully' })
    } catch (error) {
      console.error('Save error:', error)
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePreference = async <K extends keyof Preferences>(key: K) => {
    const newValue = !preferences[key]
    setPreferences(prev => ({ ...prev, [key]: newValue }))

    // Show notification for each toggle
    const preferenceLabels: Record<keyof Preferences, string> = {
      publicProfile: 'Public Profile',
      showReputation: 'Reputation Scores',
      emailNotifications: 'Email Notifications',
      taskReminders: 'Task Reminders',
      projectUpdates: 'Project Updates',
      weeklyDigest: 'Weekly Digest',
      pushNotifications: 'Push Notifications',
    }

    const action = newValue ? 'enabled' : 'disabled'
    toast({
      title: 'Preference Updated',
      description: `${preferenceLabels[key]} has been ${action}`,
    })
  }

  const handleChangePassword = async () => {
    if (account.newPassword !== account.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive'
      })
      return
    }

    if (account.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive'
      })
      return
    }

    if (!account.newPassword) {
      toast({
        title: 'Error',
        description: 'Password is required',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({ title: 'Success', description: 'Password updated successfully' })
      setShowPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
      setAccount({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Password update error:', error)
      toast({ title: 'Error', description: 'Failed to update password', variant: 'destructive' })
      setShowPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const success = await logoutAndRedirect()
    if (success) {
      toast({ title: 'Success', description: 'Logged out successfully' })
    }
  }

  const quickActions = [
    { id: 'view-profile', label: 'View Profile', icon: User, href: '/dashboard/student/profile' },
    { id: 'go-dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/student' },
    { id: 'logout', label: 'Logout', icon: LogOut, onClick: handleLogout },
  ]

  const ToggleItem = ({ id, label, checked, onChange, description }: {
    id: string
    label: string
    checked: boolean
    onChange: () => void
    description?: string
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Label htmlFor={id} className="font-medium text-base">
            {label}
          </Label>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {checked ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              On
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50">
              <XCircle className="w-3 h-3 mr-1" />
              Off
            </Badge>
          )}
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-primary focus-visible"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                  Student Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {quickActions.map(action => (
                action.href ? (
                  <Link key={action.id} href={action.href}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-white/5 dark:hover:bg-slate-100 transition-colors"
                      title={action.label}
                    >
                      <action.icon className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/5 dark:hover:bg-slate-100 transition-colors"
                    onClick={action.onClick}
                    title={action.label}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                )
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex gap-2 bg-muted/50 rounded-xl p-1 w-full">
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-4 py-2.5 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white rounded-xl px-4 py-2.5 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="mt-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                    <CardDescription>Control how your profile appears to others</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Separator className="my-4" />
                    <ToggleItem
                      id="publicProfile"
                      label="Public Profile"
                      checked={preferences.publicProfile}
                      onChange={() => handleTogglePreference('publicProfile')}
                      description="Make your profile visible to other users on the platform"
                    />
                    <Separator className="my-4" />
                    <ToggleItem
                      id="showReputation"
                      label="Reputation Scores"
                      checked={preferences.showReputation}
                      onChange={() => handleTogglePreference('showReputation')}
                      description="Display your reputation scores and ratings on your profile"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose how you want to receive updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Separator className="my-4" />
                    <ToggleItem
                      id="emailNotifications"
                      label="Email Notifications"
                      checked={preferences.emailNotifications}
                      onChange={() => handleTogglePreference('emailNotifications')}
                      description="Receive notifications via email"
                    />
                    <Separator className="my-4" />
                    <ToggleItem
                      id="taskReminders"
                      label="Task Reminders"
                      checked={preferences.taskReminders}
                      onChange={() => handleTogglePreference('taskReminders')}
                      description="Get notified about task deadlines and updates"
                    />
                    <Separator className="my-4" />
                    <ToggleItem
                      id="projectUpdates"
                      label="Project Updates"
                      checked={preferences.projectUpdates}
                      onChange={() => handleTogglePreference('projectUpdates')}
                      description="Get notified about projects you're involved in"
                    />
                    <Separator className="my-4" />
                    <ToggleItem
                      id="weeklyDigest"
                      label="Weekly Digest"
                      checked={preferences.weeklyDigest}
                      onChange={() => handleTogglePreference('weeklyDigest')}
                      description="Receive weekly summary emails of your activity"
                    />
                    <Separator className="my-4" />
                    <ToggleItem
                      id="pushNotifications"
                      label="Push Notifications"
                      checked={preferences.pushNotifications}
                      onChange={() => handleTogglePreference('pushNotifications')}
                      description="Receive push notifications on your device"
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={loading} className="cursor-pointer" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Change your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="currentPassword" className="font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={account.currentPassword}
                        onChange={e => setAccount({ ...account, currentPassword: e.target.value })}
                        className="w-full pr-10"
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <Label htmlFor="newPassword" className="font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={account.newPassword}
                        onChange={e => setAccount({ ...account, newPassword: e.target.value })}
                        className="w-full pr-10"
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={account.confirmPassword}
                        onChange={e => setAccount({ ...account, confirmPassword: e.target.value })}
                        className="w-full pr-10"
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setAccount({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex-1 cursor-pointer"
                    >
                      {loading ? 'Updating...' : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">Security Tips</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Use a strong, unique password</li>
                            <li>Enable two-factor authentication when available</li>
                            <li>Don't share your password with anyone</li>
                            <li>Update your password regularly</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
