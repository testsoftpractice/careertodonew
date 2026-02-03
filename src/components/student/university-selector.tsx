'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  Building2,
  Check,
  Search,
  Globe,
  GraduationCap,
  ExternalLink,
  Loader2,
  ChevronDown,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface University {
  id: string
  name: string
  code: string
  description?: string
  location?: string
  website?: string
  rankingScore?: number
  rankingPosition?: number
  totalStudents?: number
  verificationStatus?: string
}

interface UniversitySelectorProps {
  value?: string | null
  onChange: (university: University | null) => void
  disabled?: boolean
  label?: string
  placeholder?: string
  showWebsite?: boolean
  allowManualEntry?: boolean
}

export function UniversitySelector({
  value,
  onChange,
  disabled = false,
  label = 'University',
  placeholder = 'Search and select your university...',
  showWebsite = true,
  allowManualEntry = false,
}: UniversitySelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)

  // Fetch universities when search query changes
  useEffect(() => {
    const fetchUniversities = async () => {
      if (searchQuery.length < 1) {
        // Don't clear - show initial list or all universities
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/universities?search=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()

        if (data.universities) {
          setUniversities(data.universities)
        }
      } catch (error) {
        console.error('Fetch universities error:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchUniversities, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Load initial universities (top ones by ranking)
  useEffect(() => {
    const fetchInitialUniversities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/universities?sortBy=rankingPosition&sortOrder=asc&limit=50')
        const data = await response.json()

        if (data.universities) {
          setUniversities(data.universities.slice(0, 50))
        }
      } catch (error) {
        console.error('Fetch universities error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialUniversities()
  }, [])

  // Filter universities based on search query (client-side for instant feedback)
  const filteredUniversities = universities.filter(univ => {
    if (searchQuery.length < 1) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      univ.name.toLowerCase().includes(searchLower) ||
      univ.code.toLowerCase().includes(searchLower) ||
      (univ.location && univ.location.toLowerCase().includes(searchLower))
    )
  })

  // Update selected university when value prop changes
  useEffect(() => {
    if (value && selectedUniversity?.id !== value) {
      // Find the university in the list
      const found = universities.find(u => u.id === value)
      if (found) {
        setSelectedUniversity(found)
      } else if (value) {
        // Try to fetch specific university by ID
        fetchUniversityById(value)
      }
    } else if (!value && selectedUniversity) {
      setSelectedUniversity(null)
    }
  }, [value])

  const fetchUniversityById = async (id: string) => {
    try {
      const response = await fetch(`/api/universities/${id}`)
      const data = await response.json()

      if (data.university) {
        setSelectedUniversity(data.university)
        setUniversities(prev => [data.university, ...prev.filter(u => u.id !== id)])
      }
    } catch (error) {
      console.error('Fetch university error:', error)
    }
  }

  const handleSelect = (university: University) => {
    setSelectedUniversity(university)
    onChange(university)
    setOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    setSelectedUniversity(null)
    onChange(null)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="university-select" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal h-auto py-3"
            disabled={disabled}
            id="university-select"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedUniversity ? (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-foreground">{selectedUniversity.name}</p>
                    {selectedUniversity.location && (
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedUniversity.location}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground truncate">{placeholder}</span>
                </div>
              )}
              <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[600px] p-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95"
          align="start"
          sideOffset={4}
        >
          <Command>
            <CommandInput
              placeholder="Search universities by name, code, or location (e.g., Dhaka, du)..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0 h-12 text-base"
            />
            <CommandList className="max-h-96 overflow-y-auto">
              {loading && searchQuery.length >= 1 && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {!loading && filteredUniversities.length === 0 && (
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No universities found</p>
                    <p className="text-xs text-muted-foreground">Try searching for city name or university code</p>
                  </div>
                </CommandEmpty>
              )}

              <CommandGroup heading="Universities">
                {filteredUniversities.map((university) => (
                  <CommandItem
                    key={university.id}
                    value={university.id}
                    onSelect={() => handleSelect(university)}
                    className="cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center border border-blue-200/20">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground text-base">{university.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {university.code && (
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-xs">
                              {university.code}
                            </span>
                          )}
                          {university.location && (
                            <>
                              <span className="text-muted-foreground/50">•</span>
                              <span className="truncate">{university.location}</span>
                            </>
                          )}
                          {university.rankingPosition && (
                            <>
                              <span className="text-muted-foreground/50">•</span>
                              <Badge variant="secondary" className="text-xs">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                #{university.rankingPosition}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      {selectedUniversity?.id === university.id && (
                        <Check className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedUniversity && (
        <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-foreground">{selectedUniversity.name}</h4>
                    {selectedUniversity.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Globe className="h-3 w-3" />
                        {selectedUniversity.location}
                      </p>
                    )}
                  </div>
                  {selectedUniversity.rankingPosition && (
                    <div className="shrink-0">
                      <Badge variant="secondary" className="flex items-center gap-1 text-sm px-3 py-1">
                        <GraduationCap className="h-3 w-3" />
                        Rank #{selectedUniversity.rankingPosition}
                      </Badge>
                    </div>
                  )}
                </div>

                {selectedUniversity.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                    {selectedUniversity.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  {selectedUniversity.totalStudents && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{selectedUniversity.totalStudents.toLocaleString()}</span>
                      <span className="text-muted-foreground/70">students</span>
                    </div>
                  )}

                  {selectedUniversity.website && showWebsite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-blue-600 hover:text-blue-700 font-medium"
                      asChild
                    >
                      <a
                        href={selectedUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="shrink-0 h-8 w-8 hover:bg-red-50 hover:text-red-600 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
