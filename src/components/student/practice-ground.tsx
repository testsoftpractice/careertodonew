'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dumbbell,
  Code,
  Design,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface PracticeGroundProps {
  compact?: boolean
}

const practiceAreas = [
  {
    title: 'Coding Challenges',
    description: 'Sharpen your programming skills with hands-on coding exercises',
    icon: Code,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Design Projects',
    description: 'Practice UI/UX design with real-world project scenarios',
    icon: Design,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Case Studies',
    description: 'Analyze and solve business problems from real companies',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Skill Assessments',
    description: 'Test and validate your skills with interactive assessments',
    icon: Target,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
]

export function PracticeGround({ compact = false }: PracticeGroundProps) {
  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Practice Ground
          </CardTitle>
          <CardDescription>Interactive practice environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-3">
              Choose an area to practice and improve your skills
            </div>
            {practiceAreas.slice(0, 2).map((area) => (
              <Button
                key={area.title}
                variant="outline"
                className="w-full justify-start gap-3"
                disabled
              >
                <area.icon className={`h-4 w-4 ${area.color}`} />
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{area.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {area.description}
                  </div>
                </div>
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
              </Button>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3" disabled>
              Coming Soon
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Practice Ground
        </CardTitle>
        <CardDescription>
          Interactive practice environment to enhance your skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Practice real-world scenarios and improve your skills across different domains.
            Choose an area to get started.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {practiceAreas.map((area) => (
            <div
              key={area.title}
              className="p-4 rounded-xl border-2 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all hover:shadow-lg"
            >
              <div className={`flex items-center gap-3 mb-3 ${area.bgColor} w-fit p-3 rounded-lg`}>
                <area.icon className={`h-6 w-6 ${area.color}`} />
              </div>
              <h4 className="font-semibold mb-2">{area.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {area.description}
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Zap className="mr-2 h-4 w-4" />
                Start Practice
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Coming Soon</h4>
              <p className="text-sm text-muted-foreground">
                We're building interactive practice modules with real-time feedback and progress tracking.
                Stay tuned for launch!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
