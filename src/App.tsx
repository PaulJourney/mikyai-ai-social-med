import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { MainInput } from './components/MainInput'
import { PersonaSelector } from './components/PersonaSelector'
import { ChatInterface } from './components/ChatInterface'
import { ChatModal } from './components/ChatModal'
import { ConversationHistory } from './components/ConversationHistory'
import { AdminDashboard } from './components/AdminDashboard'
import { Pricing } from './components/Pricing'
import { Footer } from './components/Footer'
import { LegalPages } from './components/LegalPages'
import { AuthModal } from './components/AuthModal'
import { WelcomeTutorial } from './components/WelcomeTutorial'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'sonner'

export type Persona = 'lawyer' | 'engineer' | 'marketer' | 'coach' | 'medical' | 'god-mode' | 'general'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  persona?: Persona
}

export interface Conversation {
  id: string
  title: string
  persona: Persona
  messages: Message[]
  lastUpdated: Date
}

export interface User {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  credits: number
  plan: 'free' | 'plus' | 'business'
  referralCode: string
  referralsCount: number
  creditsEarned: number
  cashEarned?: number
  language: string
}

function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'admin' | 'pricing' | 'legal'>('chat')
  const [currentLegalPage, setCurrentLegalPage] = useState<'terms' | 'privacy' | 'cookies'>('terms')
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [referralCode, setReferralCode] = useState<string | undefined>()
  const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Persistent user data - now nullable for unauthenticated users
  const [user, setUser] = useKV<User | null>('user', null)
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [isRecording, setIsRecording] = useState(false)

  // Check for referral code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      setReferralCode(refCode)
      setAuthMode('signup')
      setShowAuthModal(true)
    }
  }, [])

  const handlePersonaSelect = (persona: Persona | null) => {
    setSelectedPersona(persona)
    // If we have an active conversation with a different persona, start new conversation
    if (currentConversation && currentConversation.persona !== (persona || 'general')) {
      setCurrentConversation(null)
    }
  }

  const consumeCredits = (amount: number) => {
    if (!user) return
    setUser(prev => prev ? ({
      ...prev,
      credits: Math.max(0, prev.credits - amount)
    }) : null)
  }

  const handlePlanSelect = (plan: 'free' | 'plus' | 'business') => {
    if (!user) return
    const creditsByPlan = {
      free: 100,
      plus: 1000,
      business: 5000
    }
    
    setUser(prev => prev ? ({
      ...prev,
      plan,
      credits: creditsByPlan[plan]
    }) : null)
  }

  const handleCreditPurchase = (credits: number) => {
    if (!user) return
    setUser(prev => prev ? ({
      ...prev,
      credits: prev.credits + credits
    }) : null)
  }

  const handleAuthSuccess = (userData: User, isNewUser = false) => {
    setUser(userData)
    setShowAuthModal(false)
    
    // Show welcome tutorial for new users
    if (isNewUser) {
      setTimeout(() => {
        setShowWelcomeTutorial(true)
      }, 500)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setConversations([])
    setCurrentConversation(null)
    setSelectedPersona(null)
    setCurrentView('chat')
  }

  const handleAuthRequest = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!user) return
    setUser(prev => prev ? ({ ...prev, ...updates }) : null)
  }

  const handleSendMessage = (content: string) => {
    if (!user) {
      handleAuthRequest('signup')
      return
    }
    
    if (user.credits <= 0) return

    setIsLoading(true)
    const messageId = crypto.randomUUID()
    const newMessage: Message = {
      id: messageId,
      content,
      sender: 'user',
      timestamp: new Date(),
      persona: selectedPersona || undefined
    }

    // Create or update conversation
    let updatedConversation: Conversation
    if (currentConversation) {
      updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        lastUpdated: new Date()
      }
    } else {
      updatedConversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        persona: selectedPersona || 'general' as Persona,
        messages: [newMessage],
        lastUpdated: new Date()
      }
    }

    setCurrentConversation(updatedConversation)

    // Update conversations list
    setConversations(prev => {
      const existingIndex = prev.findIndex(c => c.id === updatedConversation.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = updatedConversation
        return updated
      } else {
        return [updatedConversation, ...prev]
      }
    })

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        content: generatePersonaResponse(selectedPersona || 'general' as Persona, content),
        sender: 'assistant',
        timestamp: new Date(),
        persona: selectedPersona || undefined
      }

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse],
        lastUpdated: new Date()
      }

      setCurrentConversation(finalConversation)
      
      setConversations(prev => {
        const updated = [...prev]
        const index = updated.findIndex(c => c.id === finalConversation.id)
        if (index >= 0) {
          updated[index] = finalConversation
        }
        return updated
      })

      // Consume credits after successful response
      consumeCredits(getPersonaCost(selectedPersona || 'general' as Persona))
      setIsLoading(false)
    }, 1000)
  }

  const generatePersonaResponse = (persona: Persona, input: string): string => {
    const responses = {
      lawyer: `As your legal advisor, I need to analyze this matter carefully. ${input.includes('contract') ? 'Contract law requires specific attention to terms and conditions.' : 'This requires legal interpretation and risk assessment.'} Please note this is general guidance, not formal legal advice.`,
      engineer: `From an engineering perspective, let me break this down systematically. ${input.includes('code') ? 'The technical implementation should consider scalability and maintainability.' : 'We need to approach this with solid engineering principles.'} Would you like me to elaborate on specific technical aspects?`,
      marketer: `Great question! From a marketing standpoint, this presents interesting opportunities. ${input.includes('brand') ? 'Brand positioning is crucial here.' : 'We should consider your target audience and value proposition.'} Let's discuss strategy and execution tactics.`,
      coach: `I appreciate you sharing this with me. ${input.includes('goal') ? 'Setting clear goals is the foundation of success.' : 'Personal growth often starts with honest self-reflection.'} What specific outcome are you hoping to achieve? Let's work together on a practical approach.`,
      medical: `Thank you for your health-related question. ${input.includes('symptom') ? 'Symptoms should always be evaluated in context.' : 'Health matters require careful consideration.'} Please remember that this is educational information only - always consult with healthcare professionals for medical advice.`,
      'god-mode': `*ACCESSING UNIVERSAL KNOWLEDGE MATRIX* Your question touches on fundamental aspects of existence and reality. ${input.includes('meaning') ? 'The search for meaning is perhaps the most human of all endeavors.' : 'Let me process this through multiple dimensional frameworks.'} Prepare for deep insights that transcend conventional thinking...`,
      general: `Hello! I'm Miky, your AI assistant. I'd be happy to help you with your question. ${input.includes('?') ? 'Let me provide you with a comprehensive answer.' : 'I can assist you with various topics and tasks.'} For specialized expertise, consider selecting one of my ultra-skilled personas above for more targeted assistance.`
    }
    return responses[persona] || 'I understand your request and will provide a comprehensive response.'
  }

  const getPersonaCost = (persona: Persona): number => {
    const costs = {
      lawyer: 3,
      engineer: 2,
      marketer: 2,
      coach: 2,
      medical: 3,
      'god-mode': 5,
      general: 1
    }
    return costs[persona] || 1
  }

  const handleVoiceInput = () => {
    if (!user) {
      handleAuthRequest('signup')
      return
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      handleSendMessage(transcript)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      alert('Voice recognition failed. Please try again.')
    }

    recognition.start()
  }

  const handleLegalPageSelect = (page: 'terms' | 'privacy' | 'cookies') => {
    setCurrentLegalPage(page)
    setCurrentView('legal')
  }

  if (currentView === 'admin') {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground font-['Inter']">
          <AdminDashboard onClose={() => setCurrentView('chat')} />
          <Toaster />
        </div>
      </ThemeProvider>
    )
  }

  if (currentView === 'legal') {
    return (
      <ThemeProvider>
        <LegalPages 
          currentPage={currentLegalPage}
          onBack={() => setCurrentView('chat')}
        />
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground font-['Inter'] flex flex-col">
        <Header 
          user={user} 
          onViewChange={setCurrentView}
          currentView={currentView}
          onSignOut={handleSignOut}
          onAuthRequest={handleAuthRequest}
          onUpdateUser={handleUpdateUser}
        />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          {currentView === 'chat' && (
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                  Ask to <span className="text-primary">Miky</span>
                </h1>
                
                <MainInput 
                  onSendMessage={handleSendMessage}
                  onVoiceInput={handleVoiceInput}
                  isRecording={isRecording}
                  disabled={user && user.credits <= 0}
                  selectedPersona={selectedPersona}
                  onOpenChat={() => setShowChatModal(true)}
                  showChatModal={showChatModal}
                />
                
                <PersonaSelector 
                  selectedPersona={selectedPersona}
                  onPersonaSelect={handlePersonaSelect}
                  userPlan={user?.plan || 'free'}
                  onUpgradeToPlusRequest={() => setCurrentView('pricing')}
                />
                
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Sign in to start chatting with AI personas
                  </p>
                )}
              </div>
            </div>
          )}

          {currentView === 'history' && user && (
            <ConversationHistory 
              conversations={conversations}
              onSelectConversation={(conv) => {
                setCurrentConversation(conv)
                setSelectedPersona(conv.persona === 'general' ? null : conv.persona)
                setCurrentView('chat')
              }}
              onContinueConversation={(conv) => {
                setCurrentConversation(conv)
                setSelectedPersona(conv.persona === 'general' ? null : conv.persona)
                setShowChatModal(true)
              }}
              onDeleteConversation={(id) => {
                setConversations(prev => prev.filter(c => c.id !== id))
                if (currentConversation?.id === id) {
                  setCurrentConversation(null)
                }
              }}
              onRenameConversation={(id, newTitle) => {
                setConversations(prev => 
                  prev.map(c => c.id === id ? { ...c, title: newTitle } : c)
                )
              }}
            />
          )}

          {currentView === 'pricing' && user && (
            <Pricing 
              user={user}
              onPlanSelect={handlePlanSelect}
              onCreditPurchase={handleCreditPurchase}
            />
          )}
        </main>

        <Footer 
          onAdminAccess={() => setCurrentView('admin')} 
          onLegalPageSelect={handleLegalPageSelect}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeSwitch={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          onAuthSuccess={handleAuthSuccess}
          referralCode={referralCode}
        />
        
        <WelcomeTutorial
          isOpen={showWelcomeTutorial}
          onClose={() => setShowWelcomeTutorial(false)}
          userName={user?.firstName}
        />
        
        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          conversation={currentConversation}
          selectedPersona={selectedPersona}
          onSendMessage={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          isRecording={isRecording}
          disabled={!user || user.credits <= 0}
          user={user}
          isLoading={isLoading}
          onViewHistory={() => {
            setShowChatModal(false)
            setCurrentView('history')
          }}
        />
        
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App