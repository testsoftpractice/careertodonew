'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Building,
  Save,
  Eye,
  EyeOff,
  Mail,
  Briefcase,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function EmployerSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('preferences')

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    verificationAlerts: true,
    jobAlerts: true,
    weeklyDigest: true,
    publicProfile: true,
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      })
      setAccount({ currentPassword: '', newPassword: '', confirmPassword: '' })
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
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Employer Settings</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/employer">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize employer profile visibility</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile">Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to see your company profile
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

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control employer notifications</CardDescription>
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
                      <Label htmlFor="verificationAlerts">Verification Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about verification requests
                      </p>
                    </div>
                    <Switch
                      id="verificationAlerts"
                      checked={preferences.verificationAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, verificationAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="jobAlerts">Job Application Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for new job applications
                      </p>
                    </div>
                    <Switch
                      id="jobAlerts"
                      checked={preferences.jobAlerts}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, jobAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly summary of activities
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={account.newPassword}
                      onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={account.confirmPassword}
                      onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
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
                  <CardDescription>Manage your employer account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/dashboard/employer/profile">
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
