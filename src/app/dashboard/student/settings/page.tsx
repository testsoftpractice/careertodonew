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

  const handleTogglePreference = <K extends keyof Preferences>(key: K) => {
    const newValue = !preferences[key]
    setPreferences(prev => ({ ...prev, [key]: newValue }))

    if (key === 'publicProfile') {
      toast({
        title: 'Profile Visibility Changed',
        description: newValue ? 'Profile is now public' : 'Profile is now private'
      })
    }
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
      setAccount({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Password update error:', error)
      toast({ title: 'Error', description: 'Failed to update password', variant: 'destructive' })
      setShowPassword(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 flex flex-col">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
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
                <Button
                  key={action.id}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/5 dark:hover:bg-slate-100 transition-colors"
                  asChild={action.href ? Link : undefined}
                  onClick={action.onClick}
                  title={action.label}
                >
                  {React.createElement(action.icon, { className: "h-4 w-4" })}
                </Button>
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
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="mt-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="publicProfile" className="font-medium">
                            Public Profile
                          </Label>
                        </div>
                        <Switch
                          id="publicProfile"
                          checked={preferences.publicProfile}
                          onCheckedChange={() => handleTogglePreference('publicProfile')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="showReputation" className="font-medium">
                            Reputation Scores
                          </Label>
                        </div>
                        <Switch
                          id="showReputation"
                          checked={preferences.showReputation}
                          onCheckedChange={() => handleTogglePreference('showReputation')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications" className="font-medium">
                            Email Notifications
                          </Label>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={preferences.emailNotifications}
                          onCheckedChange={() => handleTogglePreference('emailNotifications')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="taskReminders" className="font-medium">
                            Task Reminders
                          </Label>
                        </div>
                        <Switch
                          id="taskReminders"
                          checked={preferences.taskReminders}
                          onCheckedChange={() => handleTogglePreference('taskReminders')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get notified about task deadlines
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="projectUpdates" className="font-medium">
                            Project Updates
                          </Label>
                        </div>
                        <Switch
                          id="projectUpdates"
                          checked={preferences.projectUpdates}
                          onCheckedChange={() => handleTogglePreference('projectUpdates')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get notified about projects you're involved in
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weeklyDigest" className="font-medium">
                            Weekly Digest
                          </Label>
                        </div>
                        <Switch
                          id="weeklyDigest"
                          checked={preferences.weeklyDigest}
                          onCheckedChange={() => handleTogglePreference('weeklyDigest')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly summary emails
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications" className="font-medium">
                            Push Notifications
                          </Label>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={preferences.pushNotifications}
                          onCheckedChange={() => handleTogglePreference('pushNotifications')}
                          className="data-[state=checked]:bg-primary focus-visible"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSavePreferences} disabled={loading} className="cursor-pointer">
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
                        onClick={togglePasswordVisibility}
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
                    <Input
                      id="newPassword"
                      type="password"
                      value={account.newPassword}
                      onChange={e => setAccount({ ...account, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={account.confirmPassword}
                      onChange={e => setAccount({ ...account, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="w-full"
                    />
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
