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
  LogOut,
  Save,
  Eye,
  EyeOff,
  Globe,
  Database,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { toast } from '@/hooks/use-toast'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('platform')

  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    publicRegistration: true,
    autoApproveProjects: false,
    enableAnalytics: true,
  })

  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSavePlatformSettings = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Success',
        description: 'Platform settings saved successfully',
      })
    } catch (error) {
      console.error('Save settings error:', error)
      toast({
        title: 'Error',
        description: 'Failed to save platform settings',
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
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold truncate">Admin Settings</h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
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
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="platform" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Global platform settings and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable platform access
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setPlatformSettings({ ...platformSettings, maintenanceMode: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicRegistration">Public Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Switch
                      id="publicRegistration"
                      checked={platformSettings.publicRegistration}
                      onCheckedChange={(checked) =>
                        setPlatformSettings({ ...platformSettings, publicRegistration: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoApproveProjects">Auto-approve Projects</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve new projects
                      </p>
                    </div>
                    <Switch
                      id="autoApproveProjects"
                      checked={platformSettings.autoApproveProjects}
                      onCheckedChange={(checked) =>
                        setPlatformSettings({ ...platformSettings, autoApproveProjects: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Track platform usage and metrics
                      </p>
                    </div>
                    <Switch
                      id="enableAnalytics"
                      checked={platformSettings.enableAnalytics}
                      onCheckedChange={(checked) =>
                        setPlatformSettings({ ...platformSettings, enableAnalytics: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSavePlatformSettings}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Platform Settings'}
              </Button>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update admin account password</CardDescription>
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
                  <CardDescription>Manage admin account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="justify-start w-full" asChild>
                    <Link href="/admin/profile">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile Information
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

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notifications</CardTitle>
                  <CardDescription>Configure system notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailAlerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive system alerts via email
                      </p>
                    </div>
                    <Switch checked defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="securityAlerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about suspicious activities
                      </p>
                    </div>
                    <Switch checked defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="userActivityAlerts">User Activity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new user registrations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleSavePlatformSettings}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
