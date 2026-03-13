'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'
import { Mail, Phone, Building2, Linkedin, X, Facebook, Instagram, Youtube, CheckCircle2, Loader2, MessageSquare, Sparkles, Clock, Globe, Send } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
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
      const response = await fetch('https://formsubmit.co/ajax/info@careertodo.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _captcha: false,
          _subject: 'New Contact Form Submission - CareerToDo',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.category,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (data.success === 'true') {
        toast({
          title: 'Message Sent',
          description: 'Thank you for contacting us. We\'ll get back to you within 24-48 hours.',
        })
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', category: '', subject: '', message: '' })
      } else {
        throw new Error(data.message || 'Failed to send message')
      }
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-sky-950/20 dark:to-blue-950/20 flex flex-col">
      <PublicHeader title="Contact Us" />

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 px-6 py-2 rounded-full">
              <Sparkles className="w-3 h-3 mr-1" />
              Get In Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-800 dark:text-white">
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have questions or need assistance? Fill out the form below or reach out through any of our contact channels.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <MessageSquare className="h-5 w-5 text-sky-600" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    We typically respond within 24-48 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Message Sent!</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-11 border-sky-200/50 focus:border-sky-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11 border-sky-200/50 focus:border-sky-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (415) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11 border-sky-200/50 focus:border-sky-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-2 relative z-50">
                        <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Interested In</Label>
                        <Select
                          name="service"
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger className="h-11 bg-white/80 dark:bg-gray-800/80 border-sky-200/50 focus:border-sky-400 transition-colors">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-sky-200/50">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="account">Account Support</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="student">Student Support</SelectItem>
                            <SelectItem value="university">University Partnership</SelectItem>
                            <SelectItem value="employer">Employer Services</SelectItem>
                            <SelectItem value="investor">Investor Relations</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Brief description of your inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="h-11 border-sky-200/50 focus:border-sky-400 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Please provide as much detail as possible..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          maxLength={1000}
                          required
                          className="resize-none border-sky-200/50 focus:border-sky-400 transition-colors"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-500 text-right">
                          {formData.message.length}/1000 characters
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 transition-all duration-300"
                      >
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
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Direct Contact */}
              <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Direct Contact</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Email Support</div>
                        <a
                          href="mailto:info@careertodo.com"
                          className="text-sm font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-colors"
                        >
                          info@careertodo.com
                        </a>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Response time: 24-48 hours
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Office</div>
                        <div className="text-sm mt-1">
                          <div className="text-slate-800 dark:text-slate-200">San Francisco, CA 94102</div>
                          <a href="tel:+14151234567" className="font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-colors">
                            +1 (415) 123-4567
                          </a>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Mon-Fri: 9am - 5pm EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 p-2 rounded-lg">
                      <Globe className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Follow Us</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                    Stay updated with the latest news, features, and platform updates.
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
                    <a
                      href="https://www.facebook.com/careertodo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">Facebook</span>
                    </a>
                    <a
                      href="https://x.com/CareerToDo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="X (Twitter)"
                    >
                      <X className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">X</span>
                    </a>
                    <a
                      href="https://www.instagram.com/career.todo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">Instagram</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@careertodo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">YouTube</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/careertodo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" />
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">LinkedIn</span>
                    </a>
                    <a
                      href="https://www.tiktok.com/@careertodo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="TikTok"
                    >
                      <svg className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">TikTok</span>
                    </a>
                    <a
                      href="https://www.pinterest.com/careertodo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 border border-sky-200/50 rounded-xl hover:shadow-lg hover:from-sky-100 hover:to-blue-100 hover:border-sky-300 transition-all duration-300 group"
                      aria-label="Pinterest"
                    >
                      <span className="h-5 w-5 text-slate-600 group-hover:text-sky-600 transition-colors mb-1 font-bold text-xl flex items-center justify-center">P</span>
                      <span className="text-[10px] font-medium text-slate-600 group-hover:text-sky-600 transition-colors">Pinterest</span>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="border border-sky-200/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:border-sky-300 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 p-2 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">FAQ</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg border border-sky-200/30">
                      <h3 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">How do I create an account?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Click the "Sign Up" button in the navigation and follow the registration process. Choose your role and provide basic information.
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg border border-sky-200/30">
                      <h3 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">Is the platform free?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Yes! The CareerToDo Platform is free for students and universities. Employers and investors have additional premium features.
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-sky-50/50 to-blue-50/50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg border border-sky-200/30">
                      <h3 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">How do I post a project?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        After logging in, navigate to Projects and click "Create Project". Fill in the details and submit for review.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
