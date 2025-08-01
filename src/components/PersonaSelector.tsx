import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { 
  Scales, 
  Wrench, 
  TrendUp, 
  ChatCircle, 
  FirstAidKit, 
  Lightning 
} from '@phosphor-icons/react'
import type { Persona } from '../App'

interface PersonaSelectorProps {
  selectedPersona: Persona | null
  onPersonaSelect: (persona: Persona) => void
  userPlan: 'free' | 'plus' | 'business'
  onUpgradeToPlusRequest?: () => void
}

export function PersonaSelector({ selectedPersona, onPersonaSelect, userPlan, onUpgradeToPlusRequest }: PersonaSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const personas: Array<{
    id: Persona
    name: string
    icon: React.ElementType
    description: string
    requiresPaid: boolean
  }> = [
    {
      id: 'lawyer',
      name: 'Lawyer',
      icon: Scales,
      description: 'Legal advice and contract analysis',
      requiresPaid: false
    },
    {
      id: 'engineer',
      name: 'Engineer', 
      icon: Wrench,
      description: 'Technical solutions and code review',
      requiresPaid: false
    },
    {
      id: 'marketer',
      name: 'Marketer',
      icon: TrendUp,
      description: 'Brand strategy and growth tactics',
      requiresPaid: false
    },
    {
      id: 'coach',
      name: 'Coach',
      icon: ChatCircle,
      description: 'Personal development and goal setting',
      requiresPaid: false
    },
    {
      id: 'medical',
      name: 'Medical Advisor',
      icon: FirstAidKit,
      description: 'Health information and wellness guidance',
      requiresPaid: true
    },
    {
      id: 'god-mode',
      name: 'God Mode',
      icon: Lightning,
      description: 'Advanced AI for complex philosophical questions',
      requiresPaid: true
    }
  ]

  const canUsePersona = (persona: typeof personas[0]) => {
    if (!persona.requiresPaid) return true
    return userPlan !== 'free'
  }

  const handlePersonaClick = (persona: typeof personas[0]) => {
    if (canUsePersona(persona)) {
      onPersonaSelect(persona.id)
    } else if (persona.requiresPaid && userPlan === 'free') {
      setShowUpgradeModal(true)
    }
  }

  const handleUpgradeClick = () => {
    setShowUpgradeModal(false)
    onUpgradeToPlusRequest?.()
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
          const IconComponent = persona.icon
          
          return (
            <Button
              key={persona.id}
              variant={isSelected ? 'default' : 'outline'}
              className={`
                h-auto p-4 flex flex-col items-center gap-2 text-left transition-all duration-200 group
                ${isSelected ? 'glow-effect ring-2 ring-primary/50' : ''}
                ${!canUse ? 'opacity-50' : 'hover:glow-effect'}
              `}
              onClick={() => handlePersonaClick(persona)}
              disabled={false}
            >
              <div className="flex items-center gap-2 w-full">
                <IconComponent size={20} className="text-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors duration-200">{persona.name}</span>
                    {persona.requiresPaid && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Plus
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

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Upgrade to Plus</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 p-4">
            <p className="text-muted-foreground">
              This persona is available starting from the Plus plan.
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade now to unlock Medical Advisor, God Mode, and other advanced features.
            </p>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpgradeClick}
                className="flex-1"
              >
                Upgrade to Plus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}