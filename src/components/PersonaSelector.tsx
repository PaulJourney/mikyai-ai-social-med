import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Persona } from '../App'

interface PersonaSelectorProps {
  selectedPersona: Persona | null
  onPersonaSelect: (persona: Persona) => void
  userPlan: 'free' | 'plus' | 'business'
}

export function PersonaSelector({ selectedPersona, onPersonaSelect, userPlan }: PersonaSelectorProps) {
  const personas: Array<{
    id: Persona
    name: string
    icon: string
    description: string
    requiresPaid: boolean
  }> = [
    {
      id: 'lawyer',
      name: 'Lawyer',
      icon: '⚖️',
      description: 'Legal advice and contract analysis',
      requiresPaid: false
    },
    {
      id: 'engineer',
      name: 'Engineer', 
      icon: '🛠️',
      description: 'Technical solutions and code review',
      requiresPaid: false
    },
    {
      id: 'marketer',
      name: 'Marketer',
      icon: '📈',
      description: 'Brand strategy and growth tactics',
      requiresPaid: false
    },
    {
      id: 'coach',
      name: 'Coach',
      icon: '💬',
      description: 'Personal development and goal setting',
      requiresPaid: false
    },
    {
      id: 'medical',
      name: 'Medical Advisor',
      icon: '🏥',
      description: 'Health information and wellness guidance',
      requiresPaid: true
    },
    {
      id: 'god-mode',
      name: 'God Mode',
      icon: '🌌',
      description: 'Advanced AI for complex philosophical questions',
      requiresPaid: true
    }
  ]

  const canUsePersona = (persona: typeof personas[0]) => {
    if (!persona.requiresPaid) return true
    return userPlan !== 'free'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-foreground mb-2">Choose Your AI Assistant</h2>
        <p className="text-sm text-muted-foreground">Select a specialized persona to get tailored responses</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id
          const canUse = canUsePersona(persona)
          
          return (
            <Button
              key={persona.id}
              variant={isSelected ? 'default' : 'outline'}
              className={`
                h-auto p-4 flex flex-col items-center gap-2 text-left transition-all duration-200
                ${isSelected ? 'glow-effect ring-2 ring-primary/50' : ''}
                ${!canUse ? 'opacity-50' : 'hover:glow-effect'}
              `}
              onClick={() => canUse && onPersonaSelect(persona.id)}
              disabled={!canUse}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-lg">{persona.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{persona.name}</span>
                    {persona.requiresPaid && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {persona.description}
                  </p>
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {userPlan === 'free' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Upgrade to unlock Medical Advisor and God Mode personas
          </p>
        </div>
      )}
    </div>
  )
}