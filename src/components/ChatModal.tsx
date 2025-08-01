import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { X, Microphone, Paperclip, PaperPlaneTilt, User, Robot, ClockCounterClockwise } from '@phosphor-icons/react'
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
  onViewHistory?: () => void
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
  isLoading = false,
  onViewHistory
}: ChatModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [modalSize, setModalSize] = useState({ width: 90, height: 90 }) // percentages
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    setIsResizing(true)
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = modalSize.width
    const startHeight = modalSize.height
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = ((e.clientX - startX) / window.innerWidth) * 100
      const deltaY = ((e.clientY - startY) / window.innerHeight) * 100
      
      let newWidth = startWidth
      let newHeight = startHeight
      
      switch (direction) {
        case 'right':
        case 'top-right':
        case 'bottom-right':
          newWidth = Math.min(95, Math.max(25, startWidth + deltaX))
          break
        case 'left':
        case 'top-left':
        case 'bottom-left':
          newWidth = Math.min(95, Math.max(25, startWidth - deltaX))
          break
      }
      
      switch (direction) {
        case 'bottom':
        case 'bottom-left':
        case 'bottom-right':
          newHeight = Math.min(95, Math.max(35, startHeight + deltaY))
          break
        case 'top':
        case 'top-left':
        case 'top-right':
          newHeight = Math.min(95, Math.max(35, startHeight - deltaY))
          break
      }
      
      setModalSize({ width: newWidth, height: newHeight })
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
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

  // Prevent text selection during resize
  useEffect(() => {
    if (isResizing) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    
    return () => {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape' && !isResizing) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isResizing, onClose])

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
      <DialogContent 
        className="resizable-chat-modal p-0 bg-background border-border overflow-hidden [&>button]:hidden transition-all duration-150"
        style={{
          '--modal-width': `${modalSize.width}vw`,
          '--modal-height': `${modalSize.height}vh`,
          width: `${modalSize.width}vw`,
          height: `${modalSize.height}vh`,
          maxWidth: `${modalSize.width}vw`,
          maxHeight: `${modalSize.height}vh`,
          minWidth: '300px',
          minHeight: '250px'
        } as React.CSSProperties}
      >
        <div className={`flex flex-col h-full relative ${isResizing ? 'select-none' : ''}`}>
          {/* Resize handles - only show on desktop */}
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            {isResizing && (
              <div className="absolute inset-0 bg-primary/5 border-2 border-primary/20 rounded-lg pointer-events-none" />
            )}
            {/* Top resize handle */}
            <div 
              className="chat-resize-handle absolute top-0 left-4 right-4 h-2 cursor-n-resize pointer-events-auto opacity-0 bg-primary/20 rounded-b transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'top')}
            />
            {/* Bottom resize handle */}
            <div 
              className="chat-resize-handle absolute bottom-0 left-4 right-4 h-2 cursor-s-resize pointer-events-auto opacity-0 bg-primary/20 rounded-t transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            />
            {/* Left resize handle */}
            <div 
              className="chat-resize-handle absolute left-0 top-4 bottom-4 w-2 cursor-w-resize pointer-events-auto opacity-0 bg-primary/20 rounded-r transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'left')}
            />
            {/* Right resize handle */}
            <div 
              className="chat-resize-handle absolute right-0 top-4 bottom-4 w-2 cursor-e-resize pointer-events-auto opacity-0 bg-primary/20 rounded-l transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
            />
            {/* Corner resize handles */}
            <div 
              className="chat-resize-handle absolute top-0 left-0 w-4 h-4 cursor-nw-resize pointer-events-auto opacity-0 bg-primary/20 rounded-br transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'top-left')}
            />
            <div 
              className="chat-resize-handle absolute top-0 right-0 w-4 h-4 cursor-ne-resize pointer-events-auto opacity-0 bg-primary/20 rounded-bl transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'top-right')}
            />
            <div 
              className="chat-resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize pointer-events-auto opacity-0 bg-primary/20 rounded-tr transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
            />
            <div 
              className="chat-resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto opacity-0 bg-primary/20 rounded-tl transition-opacity"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewHistory}
                className="h-8 px-3 text-sm text-muted-foreground hover:text-primary"
              >
                <ClockCounterClockwise className="w-4 h-4 mr-2" />
                History
              </Button>
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
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth chat-messages">
              {conversation?.messages.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Start a conversation with {getPersonaName(selectedPersona)}
                </div>
              )}
              
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
                        inline-block px-4 py-3 rounded-md text-sm max-w-[80%]
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
                    <div className="inline-block px-4 py-3 rounded-md text-sm bg-muted">
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
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-card shrink-0">
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