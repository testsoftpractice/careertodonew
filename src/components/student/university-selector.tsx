'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      if (searchQuery.length < 2) {
        setUniversities([])
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

  // Load initial universities (top ones)
  useEffect(() => {
    const fetchInitialUniversities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/universities')
        const data = await response.json()

        if (data.universities) {
          setUniversities(data.universities.slice(0, 10))
        }
      } catch (error) {
        console.error('Fetch universities error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialUniversities()
  }, [])

  // Update selected university when value prop changes
  useEffect(() => {
    if (value && selectedUniversity?.id !== value) {
      // Find the university in the list or fetch it
      const found = universities.find(u => u.id === value)
      if (found) {
        setSelectedUniversity(found)
      } else {
        // Could fetch specific university by ID here
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
                    <p className="font-semibold truncate">{selectedUniversity.name}</p>
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

        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search universities by name or code..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0"
            />
            <CommandList>
              {loading && searchQuery.length >= 2 && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {!loading && universities.length === 0 && (
                <CommandEmpty>No universities found.</CommandEmpty>
              )}

              <CommandGroup heading="Universities">
                {universities.map((university) => (
                  <CommandItem
                    key={university.id}
                    value={university.id}
                    onSelect={() => handleSelect(university)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{university.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {university.code && (
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {university.code}
                            </span>
                          )}
                          {university.location && (
                            <span className="truncate">{university.location}</span>
                          )}
                        </div>
                      </div>
                      {selectedUniversity?.id === university.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
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
        <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold">{selectedUniversity.name}</h4>
                    {selectedUniversity.location && (
                      <p className="text-sm text-muted-foreground">{selectedUniversity.location}</p>
                    )}
                  </div>
                  {selectedUniversity.rankingPosition && (
                    <div className="shrink-0">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Rank #{selectedUniversity.rankingPosition}
                      </Badge>
                    </div>
                  )}
                </div>

                {selectedUniversity.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {selectedUniversity.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  {selectedUniversity.totalStudents && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{selectedUniversity.totalStudents.toLocaleString()} students</span>
                    </div>
                  )}

                  {selectedUniversity.website && showWebsite && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-blue-600 hover:text-blue-700"
                      asChild
                    >
                      <a
                        href={selectedUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">Visit Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {selectedUniversity && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="shrink-0 h-8 w-8"
                >
                  ×
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
