import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { X, Microphone, Paperclip, PaperPlaneTilt, User, Robot } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Conversation, Persona } from '../App'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  conversation: Conversation | null
  selectedPersona: Persona | null
  onSendMessage: (message: string) => void
  onVoiceInput: () => void
  isRecording: boolean
  disabled?: boolean
  user: any
  isLoading?: boolean
}

export function ChatModal({ 
  isOpen, 
  onClose, 
  conversation, 
  selectedPersona,
  onSendMessage, 
  onVoiceInput, 
  isRecording, 
  disabled,
  user,
  isLoading = false
}: ChatModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  // Typing animation effect for placeholder
  useEffect(() => {
    if (!isOpen || inputValue) {
      setIsAnimating(false)
      return
    }

    // No animation in modal - just set static placeholder
    setAnimatedPlaceholder(getStaticPlaceholder())
    setIsAnimating(false)
  }, [isOpen, selectedPersona, inputValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || disabled) return
    
    onSendMessage(inputValue)
    setInputValue('')
    setShowTyping(true)
    
    // Hide typing indicator after response
    setTimeout(() => setShowTyping(false), 2000)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ')
      toast.success(`Files attached: ${fileNames}`)
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getPersonaIcon = (persona: string) => {
    const icons = {
      lawyer: '⚖️',
      engineer: '🛠️', 
      marketer: '📈',
      coach: '💬',
      medical: '🏥',
      'god-mode': '🌌'
    }
    return icons[persona as keyof typeof icons] || '🤖'
  }

  const getPersonaName = (persona: Persona | null) => {
    if (!persona) return 'Miky'
    
    const names = {
      lawyer: 'Lawyer Miky',
      engineer: 'Engineer Miky',
      marketer: 'Marketer Miky', 
      coach: 'Coach Miky',
      medical: 'Doctor Miky',
      'god-mode': 'God Miky'
    }
    return names[persona] || 'Miky'
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getPlaceholder = () => {
    if (inputValue) return '' // Hide placeholder when user is typing
    return getStaticPlaceholder()
  }

  const getStaticPlaceholder = () => {
    if (!selectedPersona) return 'Ask to Miky'
    
    const placeholders = {
      lawyer: 'Ask to Lawyer Miky',
      engineer: 'Ask to Engineer Miky',
      marketer: 'Ask to Marketer Miky',
      coach: 'Ask to Coach Miky',
      medical: 'Ask to Doctor Miky',
      'god-mode': 'Ask to God Miky'
    }
    return placeholders[selectedPersona] || 'Ask to Miky'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-background border-border overflow-hidden [&>button]:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                  <Robot className="w-5 h-5 text-primary" />
                </div>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{getPersonaName(selectedPersona)}</h2>
                {selectedPersona && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {getPersonaIcon(selectedPersona)} {selectedPersona.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {user?.credits} credits
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Robot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </Avatar>

                <div className={`flex-1 space-y-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`
                      inline-block px-4 py-3 rounded-2xl text-sm max-w-[80%]
                      ${message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted text-foreground'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(new Date(message.timestamp))}
                  </div>
                </div>
              </div>
            ))}

            {(showTyping || isLoading) && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                    <Robot className="w-4 h-4 text-primary" />
                  </div>
                </Avatar>
                <div className="flex-1">
                  <div className="inline-block px-4 py-3 rounded-2xl text-sm bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-card">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-10 w-10 p-0 flex-shrink-0"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder()}
                  disabled={disabled}
                  className="pr-12 h-12 text-base italic placeholder:italic"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onVoiceInput}
                  disabled={disabled}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                    isRecording ? 'text-red-500 animate-pulse' : ''
                  }`}
                >
                  <Microphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                type="submit"
                disabled={!inputValue.trim() || disabled}
                className="h-12 px-6"
              >
                <PaperPlaneTilt className="w-4 h-4" />
              </Button>
            </form>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
            />
            
            {disabled && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                No credits remaining. Please upgrade your plan to continue.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}