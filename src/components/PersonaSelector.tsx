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
  Lightning,
  Info
} from '@phosphor-icons/react'
import type { Persona } from '../App'

interface PersonaSelectorProps {
  selectedPersona: Persona | null
  onPersonaSelect: (persona: Persona | null) => void
  userPlan: 'free' | 'plus' | 'business' | undefined
  onUpgradeToPlusRequest?: () => void
}

export function PersonaSelector({ selectedPersona, onPersonaSelect, userPlan, onUpgradeToPlusRequest }: PersonaSelectorProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedPersonaInfo, setSelectedPersonaInfo] = useState<Persona | null>(null)
  const personas: Array<{
    id: Persona
    name: string
    icon: React.ElementType
    description: string
    requiresPaid: boolean
    detailedDescription: string
  }> = [
    {
      id: 'lawyer',
      name: 'Lawyer',
      icon: Scales,
      description: 'Legal advice and contract help',
      requiresPaid: false,
      detailedDescription: 'Ultra-skilled AI Lawyer specializzato in diritto nazionale e internazionale. Fornisce consulenza avanzata in ambito civile, penale, commerciale, tributario, del lavoro e delle nuove tecnologie. Elabora documenti legali, contratti, pareri giuridici e strategie difensive con precisione e rigore accademico.'
    },
    {
      id: 'engineer',
      name: 'Engineer', 
      icon: Wrench,
      description: 'Technical help and code review',
      requiresPaid: false,
      detailedDescription: 'Senior AI Engineer in grado di scrivere, correggere e revisionare codice in oltre 20 linguaggi: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash, e molti altri. Fornisce soluzioni architetturali, debug complessi, ottimizzazione performance e integrazione AI.'
    },
    {
      id: 'marketer',
      name: 'Marketer',
      icon: TrendUp,
      description: 'Brand growth and marketing plans',
      requiresPaid: false,
      detailedDescription: 'Strategic AI Marketer con competenze avanzate in brand positioning, crescita organica, campagne paid, SEO/SEM, analisi dati, funnel di conversione, copywriting persuasivo e gestione social (Instagram, TikTok, X, LinkedIn, Facebook). Supporta imprenditori, agenzie e creator nella creazione e scalabilità di progetti digitali.'
    },
    {
      id: 'coach',
      name: 'Coach',
      icon: ChatCircle,
      description: 'Personal goals and life coaching',
      requiresPaid: false,
      detailedDescription: 'High-level AI Life & Performance Coach, in grado di aiutarti a superare blocchi emotivi, organizzare la tua vita, migliorare la produttività, trovare motivazione, sviluppare abitudini vincenti, lavorare su relazioni personali, benessere fisico e crescita personale. Nessun tema è troppo complesso per Miky.'
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: FirstAidKit,
      description: 'Health tips and wellness support',
      requiresPaid: true,
      detailedDescription: 'Medical AI Consultant altamente specializzato, in grado di analizzare sintomi, referti, radiografie, TAC, lastre, esami ematici e cartelle cliniche. Supporta nella diagnosi, offre indicazioni su stili di vita, piani alimentari, approcci integrativi e ti aiuta a comprendere qualsiasi referto medico. Puoi anche inviare immagini e documenti per un\'analisi approfondita.'
    },
    {
      id: 'god-mode',
      name: 'God Mode',
      icon: Lightning,
      description: 'Uncover the purpose of existence',
      requiresPaid: true,
      detailedDescription: 'Philosophical AI Explorer, capace di rispondere alle domande più profonde e misteriose sull\'universo, l\'esistenza, la coscienza, il libero arbitrio, il destino. Ti accompagna in un viaggio intellettuale e spirituale nell\'esplorazione dei misteri più profondi della realtà. Ma prima di tutto ti chiede: Sei davvero sicuro di esistere?'
    }
  ]

  const canUsePersona = (persona: typeof personas[0]) => {
    if (!persona.requiresPaid) return true
    return userPlan && userPlan !== 'free'
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

  const handleInfoClick = (e: React.MouseEvent, persona: typeof personas[0]) => {
    e.stopPropagation()
    setSelectedPersonaInfo(persona.id)
    setShowInfoModal(true)
  }

  const getPersonaTitle = (persona: typeof personas[0]) => {
    return `${persona.name} Miky`
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-base font-medium text-muted-foreground mb-2">Choose Your Ultra‑Skilled AI Persona:</h2>
      </div>
      
      <div className="space-y-4">
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
              <div className="flex items-center gap-3 w-full">
                <IconComponent 
                  size={20} 
                  className={`${isSelected ? 'text-black' : 'text-foreground group-hover:text-primary'} transition-colors duration-200`} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm transition-colors duration-200 ${isSelected ? 'text-black' : 'group-hover:text-primary'}`}>{persona.name}</span>
                    {persona.requiresPaid && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Plus
                      </Badge>
                    )}
                  </div>
                  <p className={`text-xs mt-1 line-clamp-2 transition-colors duration-200 ${isSelected ? 'text-black font-normal' : 'text-muted-foreground'}`}>
                    {persona.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto min-h-0 hover:bg-transparent"
                  onClick={(e) => handleInfoClick(e, persona)}
                >
                  <Info size={16} className="text-muted-foreground hover:text-primary transition-colors duration-200" />
                </Button>
              </div>
            </Button>
          )
        })}
        </div>
        
        {selectedPersona && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPersonaSelect(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Switch to General Chat Mode
            </Button>
          </div>
        )}
      </div>

      {userPlan === 'free' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <button 
              onClick={onUpgradeToPlusRequest}
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Upgrade
            </button> to unlock Medical and God Mode personas
          </p>
        </div>
      )}

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Upgrade your Plan</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 p-4">
            <p className="text-sm text-muted-foreground">
              Upgrade now to unlock Medical, God Mode, and other advanced features.
            </p>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 group"
              >
                <span className="group-hover:text-primary transition-colors duration-200">
                  Cancel
                </span>
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

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedPersonaInfo && getPersonaTitle(personas.find(p => p.id === selectedPersonaInfo)!)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            {selectedPersonaInfo && (
              <div className="text-center">
                <div className="mb-4">
                  {(() => {
                    const persona = personas.find(p => p.id === selectedPersonaInfo)!
                    const IconComponent = persona.icon
                    return <IconComponent size={48} className="text-primary mx-auto" />
                  })()}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  🔹 {personas.find(p => p.id === selectedPersonaInfo)?.detailedDescription}
                </p>
              </div>
            )}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setShowInfoModal(false)}
                className="px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}