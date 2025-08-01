import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { MainInput } from './components/MainInput'
import { PersonaSelector } from './components/PersonaSelector'
import { ChatInterface } from './components/ChatInterface'
import { ConversationHistory } from './components/ConversationHistory'
import { AdminDashboard } from './components/AdminDashboard'
import { Pricing } from './components/Pricing'
import { Footer } from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'sonner'

export type Persona = 'lawyer' | 'engineer' | 'marketer' | 'coach' | 'medical' | 'god-mode'

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
  credits: number
  plan: 'free' | 'plus' | 'business'
  referralCode: string
  referralsCount: number
  creditsEarned: number
  language: string
}

function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'history' | 'admin' | 'pricing'>('chat')
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  
  // Persistent user data
  const [user, setUser] = useKV<User>('user', {
    id: crypto.randomUUID(),
    credits: 100,
    plan: 'free',
    referralCode: crypto.randomUUID().slice(0, 8),
    referralsCount: 0,
    creditsEarned: 0,
    language: 'en'
  })
  
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [isRecording, setIsRecording] = useState(false)

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona)
    // If we have an active conversation with a different persona, start new conversation
    if (currentConversation && currentConversation.persona !== persona) {
      setCurrentConversation(null)
    }
  }

  const consumeCredits = (amount: number) => {
    setUser(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits - amount)
    }))
  }

  const handlePlanSelect = (plan: 'free' | 'plus' | 'business') => {
    const creditsByPlan = {
      free: 100,
      plus: 1000,
      business: 5000
    }
    
    setUser(prev => ({
      ...prev,
      plan,
      credits: creditsByPlan[plan]
    }))
  }

  const handleCreditPurchase = (credits: number) => {
    setUser(prev => ({
      ...prev,
      credits: prev.credits + credits
    }))
  }

  const handleSendMessage = (content: string) => {
    if (!selectedPersona) return
    if (user.credits <= 0) return

    const messageId = crypto.randomUUID()
    const newMessage: Message = {
      id: messageId,
      content,
      sender: 'user',
      timestamp: new Date(),
      persona: selectedPersona
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
        persona: selectedPersona,
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
        content: generatePersonaResponse(selectedPersona, content),
        sender: 'assistant',
        timestamp: new Date(),
        persona: selectedPersona
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
      consumeCredits(getPersonaCost(selectedPersona))
    }, 1000)
  }

  const generatePersonaResponse = (persona: Persona, input: string): string => {
    const responses = {
      lawyer: `As your legal advisor, I need to analyze this matter carefully. ${input.includes('contract') ? 'Contract law requires specific attention to terms and conditions.' : 'This requires legal interpretation and risk assessment.'} Please note this is general guidance, not formal legal advice.`,
      engineer: `From an engineering perspective, let me break this down systematically. ${input.includes('code') ? 'The technical implementation should consider scalability and maintainability.' : 'We need to approach this with solid engineering principles.'} Would you like me to elaborate on specific technical aspects?`,
      marketer: `Great question! From a marketing standpoint, this presents interesting opportunities. ${input.includes('brand') ? 'Brand positioning is crucial here.' : 'We should consider your target audience and value proposition.'} Let's discuss strategy and execution tactics.`,
      coach: `I appreciate you sharing this with me. ${input.includes('goal') ? 'Setting clear goals is the foundation of success.' : 'Personal growth often starts with honest self-reflection.'} What specific outcome are you hoping to achieve? Let's work together on a practical approach.`,
      medical: `Thank you for your health-related question. ${input.includes('symptom') ? 'Symptoms should always be evaluated in context.' : 'Health matters require careful consideration.'} Please remember that this is educational information only - always consult with healthcare professionals for medical advice.`,
      'god-mode': `*ACCESSING UNIVERSAL KNOWLEDGE MATRIX* Your question touches on fundamental aspects of existence and reality. ${input.includes('meaning') ? 'The search for meaning is perhaps the most human of all endeavors.' : 'Let me process this through multiple dimensional frameworks.'} Prepare for deep insights that transcend conventional thinking...`
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
      'god-mode': 5
    }
    return costs[persona] || 2
  }

  const handleVoiceInput = () => {
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

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground font-['Inter'] flex flex-col">
        <Header 
          user={user} 
          onViewChange={setCurrentView}
          currentView={currentView}
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
                  disabled={!selectedPersona || user.credits <= 0}
                  selectedPersona={selectedPersona}
                />
                
                <PersonaSelector 
                  selectedPersona={selectedPersona}
                  onPersonaSelect={handlePersonaSelect}
                  userPlan={user.plan}
                  onUpgradeToPlusRequest={() => setCurrentView('pricing')}
                />
              </div>

              {currentConversation && (
                <ChatInterface 
                  conversation={currentConversation}
                  onSendMessage={handleSendMessage}
                  isLoading={false}
                />
              )}
            </div>
          )}

          {currentView === 'history' && (
            <ConversationHistory 
              conversations={conversations}
              onSelectConversation={(conv) => {
                setCurrentConversation(conv)
                setSelectedPersona(conv.persona)
                setCurrentView('chat')
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

          {currentView === 'pricing' && (
            <Pricing 
              user={user}
              onPlanSelect={handlePlanSelect}
              onCreditPurchase={handleCreditPurchase}
            />
          )}
        </main>

        <Footer onAdminAccess={() => setCurrentView('admin')} />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default App