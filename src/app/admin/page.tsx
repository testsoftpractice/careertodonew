'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  Database,
  BarChart3,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building2,
  Globe,
  Lock,
  Zap,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react'
import Link from 'next/link'
import { logoutAndRedirect, adminLogoutAndRedirect } from '@/lib/utils/logout'

export default function AdminPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await adminLogoutAndRedirect()
  }

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage all platform users and roles',
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Audit & Compliance',
      description: 'Monitor platform activity and ensure compliance',
      icon: FileText,
      href: '/admin/audit',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Content Management',
      description: 'Approve and moderate user-generated content',
      icon: FileText,
      href: '/admin/content',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Governance',
      description: 'Manage platform governance and proposals',
      icon: ShieldCheck,
      href: '/admin/governance',
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Projects',
      description: 'Monitor and manage all platform projects',
      icon: Database,
      href: '/admin/projects',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and metrics',
      icon: BarChart3,
      href: '/admin/governance',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Profile',
      description: 'Manage your admin profile and preferences',
      icon: Shield,
      href: '/admin/profile',
      color: 'from-rose-500 to-rose-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-3 rounded-xl shadow-lg ring-2 ring-slate-500/20">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                    Platform Admin Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Administration & Governance Console
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6 sm:space-y-8">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-br from-slate-700 to-slate-800 text-white border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <LayoutDashboard className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-2xl">Welcome, Administrator</CardTitle>
                  <CardDescription className="text-slate-300">
                    Manage and monitor the entire platform from this central dashboard
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link href="/admin/users">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-xl mb-3">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">Active Users</div>
                  <p className="text-sm text-muted-foreground">Total registered users</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/governance">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-3 rounded-xl mb-3">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">Universities</div>
                  <p className="text-sm text-muted-foreground">Registered institutions</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/projects">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 rounded-xl mb-3">
                    <Database className="h-8 w-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">Projects</div>
                  <p className="text-sm text-muted-foreground">Active projects</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/audit">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-3 rounded-xl mb-3">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold mt-2">24h Activity</div>
                  <p className="text-sm text-muted-foreground">Platform engagement</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Admin Modules */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Admin Modules</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {adminModules.map((module) => (
                <Link key={module.title} href={module.href} className="group">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-800 cursor-pointer h-full">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center gap-3">
                        <div className={`bg-gradient-to-br ${module.color} text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <module.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-sm sm:text-base mb-1 group-hover:text-slate-600 transition-colors">{module.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/admin/users" className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/audit" className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    View Audits
                  </Button>
                </Link>
                <Link href="/admin/governance" className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Governance
                  </Button>
                </Link>
                <Link href="/admin/settings" className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900/50 dark:to-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                System Status
              </CardTitle>
              <CardDescription>Platform health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <div className="font-semibold">All Systems Operational</div>
                      <div className="text-xs text-muted-foreground">Platform is running normally</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white" variant="default">Healthy</Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm">API Gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-100" />
                    <span className="text-sm">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-200" />
                    <span className="text-sm">Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse delay-300" />
                    <span className="text-sm">Auth System</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
