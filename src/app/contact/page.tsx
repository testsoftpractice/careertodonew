'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'
import { Mail, Phone, Building2, Github, Linkedin, Twitter, Send, CheckCircle2, Loader2, User, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Simulate form submission (in production, this would go to an API)
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast({
        title: 'Message Sent',
        description: 'Thank you for contacting us. We\'ll get back to you within 24-48 hours.',
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Contact form error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader title="Contact Us" />

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions or need assistance? We're here to help. Fill out the form below or reach out through any of our contact channels.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-20 w-20 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
                    </p>
                    <Button onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', subject: '', category: '', message: '' })
                    }}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 relative z-50">
                      <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        required
                      >
                        <SelectTrigger className="h-11 bg-background">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background backdrop-blur-xl border-2 shadow-xl">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="account">Account Support</SelectItem>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        maxLength={1000}
                        required
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Direct Contact */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Direct Contact</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email Support</div>
                        <a
                          href="mailto:support@careertodo.com"
                          className="text-sm hover:underline font-medium"
                        >
                          support@careertodo.com
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">
                          Response time: 24-48 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm text-muted-foreground">Office</div>
                        <div className="text-sm mt-1">
                          <div>San Francisco, CA 94102</div>
                          <a href="tel:+14151234567" className="hover:underline font-medium">
                            +1 (415) 123-4567
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Mon-Fri: 9am - 5pm EST
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Follow Us</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Stay updated with the latest news, features, and platform updates.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 border rounded-lg hover:bg-accent transition-colors">
                      <Github className="h-6 w-6 text-muted-foreground" />
                    </a>
                    <a href="#" className="p-3 border rounded-lg hover:bg-accent transition-colors">
                      <Linkedin className="h-6 w-6 text-muted-foreground" />
                    </a>
                    <a href="#" className="p-3 border rounded-lg hover:bg-accent transition-colors">
                      <Twitter className="h-6 w-6 text-muted-foreground" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-1">How do I create an account?</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the "Sign Up" button in the navigation and follow the registration process. Choose your role and provide basic information.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Is the platform free?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes! The CareerToDo Platform is free for students and universities. Employers and investors have additional premium features.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">How do I post a project?</h3>
                      <p className="text-sm text-muted-foreground">
                        After logging in, navigate to Projects and click "Create Project". Fill in the details and submit for review.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
