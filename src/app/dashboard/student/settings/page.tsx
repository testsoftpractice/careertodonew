'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Mail,
  Save,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function StudentSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('preferences')

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    projectUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    publicProfile: true,
    showReputation: true,
  })

  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSavePreferences = async () => {
    try {
      setLoading(true)
      // In a real app, this would call the preferences API
      // For now, we'll simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Success',
        description: 'Preferences saved successfully',
      })
    } catch (error) {
      console.error('Save preferences error:', error)
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (account.newPassword !== account.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (account.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      // In a real app, this would call the password change API
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      })

      setAccount({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Change password error:', error)
      toast({
        title: 'Error',
        description: 'Failed to change password',
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
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Student Settings</h1>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize your profile visibility and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your profile
                      </p>
                    </div>
                    <Switch
                      id="publicProfile"
                      checked={preferences.publicProfile}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, publicProfile: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="showReputation">Show Reputation Scores</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your reputation scores publicly
                      </p>
                    </div>
                    <Switch
                      id="showReputation"
                      checked={preferences.showReputation}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, showReputation: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access related settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/dashboard/student/profile">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/marketplace">
                      <Shield className="h-4 w-4 mr-2" />
                      Browse Marketplace
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Button
                onClick={handleSavePreferences}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Control which emails you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="taskReminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about upcoming task deadlines
                      </p>
                    </div>
                    <Switch
                      id="taskReminders"
                      checked={preferences.taskReminders}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, taskReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="projectUpdates">Project Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates on projects you're involved in
                      </p>
                    </div>
                    <Switch
                      id="projectUpdates"
                      checked={preferences.projectUpdates}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, projectUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly summary of your activities
                      </p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={preferences.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, weeklyDigest: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive product updates and promotions
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={preferences.marketingEmails}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, marketingEmails: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Push Notifications</CardTitle>
                  <CardDescription>Control browser push notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Enable Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive real-time notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, pushNotifications: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSavePreferences}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={account.currentPassword}
                        onChange={(e) =>
                          setAccount({ ...account, currentPassword: e.target.value })
                        }
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={account.newPassword}
                      onChange={(e) =>
                        setAccount({ ...account, newPassword: e.target.value })
                      }
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={account.confirmPassword}
                      onChange={(e) =>
                        setAccount({ ...account, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={loading || !account.currentPassword || !account.newPassword}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/dashboard/student/profile">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile Information
                    </Link>
                  </Button>

                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/auth/forgot-password">
                      <Mail className="h-4 w-4 mr-2" />
                      Reset Password via Email
                    </Link>
                  </Button>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="justify-start w-full" asChild>
                      <Link href="/auth">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Link>
                    </Button>
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
