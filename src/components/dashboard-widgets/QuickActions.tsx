import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  onClick?: () => void
  href?: string
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  disabled?: boolean
  badge?: string | number
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  layout?: 'horizontal' | 'grid'
  className?: string
}

const buttonVariants = {
  default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
  outline: 'border-2 hover:bg-accent',
  ghost: 'hover:bg-accent text-foreground',
  link: 'text-primary hover:text-primary/80',
}

export function QuickActions({
  actions,
  title = 'Quick Actions',
  layout = 'grid',
  className = '',
}: QuickActionsProps) {
  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          {title}
        </h3>
      )}
      <div className={`
        ${layout === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3'
          : 'flex flex-wrap gap-2 sm:gap-3'
        }
      `}>
        {actions.map((action) =>
          action.href ? (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              disabled={action.disabled}
              asChild
              className={`
                ${buttonVariants[action.variant || 'outline']}
                flex items-center gap-2 w-full
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
                relative
              `}
            >
              <a href={action.href} className="flex items-center gap-2 w-full">
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">
                  {action.label}
                </span>
                {action.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                    {action.badge}
                  </span>
                )}
              </a>
            </Button>
          ) : (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                ${buttonVariants[action.variant || 'outline']}
                flex items-center gap-2 w-full
                hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
                relative
              `}
            >
              <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium flex-1">
                {action.label}
              </span>
              {action.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                  {action.badge}
                </span>
              )}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
