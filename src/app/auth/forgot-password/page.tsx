'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, Lock, Shield, Bell, Check, Link2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      setSent(true)
    } catch (error: any) {
      console.error("Forgot password error:", error)
      toast({ title: "Error", description: error.message || "An error occurred. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/auth" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-bold text-xl">Forgot Password</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Lock className="h-16 w-16 mx-auto text-primary" />
          </div>
          {!sent ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
                <p className="text-center text-muted-foreground">Enter your email to receive a reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">We will send you a password reset link to this email</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/auth")}
                  className="w-full"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <Check className="h-20 w-20 mx-auto mb-4 text-green-500" />
                <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                <p className="text-muted-foreground">We have sent a password reset link to {email}</p>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-medium mb-1">What to do next</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Open the email we sent to you</li>
                      <li>• Click the "Reset Password" button in the email</li>
                      <li>• You will be redirected to reset your password</li>
                      <li>• Create a new, secure password</li>
                      <li>• Use your new password to log in</li>
                    </ul>
                  </div>
                </div>
              </div>
              <Button onClick={() => router.push("/auth")} variant="outline" className="w-full mt-6">
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
