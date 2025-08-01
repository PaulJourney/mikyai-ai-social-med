import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Microphone, PaperPlaneRight, Paperclip } from '@phosphor-icons/react'
import type { Persona } from '../App'

interface MainInputProps {
  onSendMessage: (message: string) => void
  onVoiceInput: () => void
  isRecording: boolean
  disabled: boolean
  selectedPersona: Persona | null
}

export function MainInput({ 
  onSendMessage, 
  onVoiceInput, 
  isRecording, 
  disabled, 
  selectedPersona 
}: MainInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const getPlaceholder = () => {
    if (!selectedPersona) return 'Select a persona first, then ask Miky...'
    if (disabled) return 'Not enough credits to continue...'
    return 'Ask to Miky...'
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="p-4 bg-card/50 backdrop-blur border-border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="min-h-[80px] pr-20 text-sm resize-none focus:ring-primary focus:ring-2 focus:ring-offset-0 border-input"
              disabled={disabled}
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onVoiceInput}
                className={`p-2 ${isRecording ? 'voice-recording text-primary' : ''}`}
                disabled={disabled}
              >
                <Microphone className={`w-4 h-4 ${isRecording ? 'text-primary' : ''}`} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {selectedPersona && (
                <span>
                  Speaking to: <span className="text-primary font-medium capitalize">{selectedPersona.replace('-', ' ')}</span>
                </span>
              )}
            </div>
            <Button 
              type="submit" 
              size="sm" 
              disabled={!message.trim() || disabled}
              className="hover:glow-effect text-xs"
            >
              <PaperPlaneRight className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}