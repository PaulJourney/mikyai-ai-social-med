import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash, PencilSimple, ChatCircle } from '@phosphor-icons/react'
import type { Conversation } from '../App'

interface ConversationHistoryProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
}

export function ConversationHistory({ 
  conversations, 
  onSelectConversation, 
  onDeleteConversation, 
  onRenameConversation 
}: ConversationHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const getPersonaIcon = (persona: string) => {
    const icons = {
      lawyer: '⚖️',
      engineer: '🛠️',
      marketer: '📈',
      coach: '💬',
      medical: '🏥',
      'god-mode': '🌌',
      general: '🤖'
    }
    return icons[persona as keyof typeof icons] || '🤖'
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(new Date(date))
    }
  }

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const saveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const cancelRename = () => {
    setEditingId(null)
    setEditTitle('')
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <ChatCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">No conversations yet</h2>
        <p className="text-muted-foreground">Start a conversation with any persona to see your history here</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Conversation History</h1>
        <p className="text-muted-foreground">Manage and continue your previous conversations</p>
      </div>

      <div className="grid gap-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="p-4 hover:bg-card/80 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {getPersonaIcon(conversation.persona)} {conversation.persona === 'general' ? 'General' : conversation.persona.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(conversation.lastUpdated)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {conversation.messages.length} messages
                  </span>
                </div>

                {editingId === conversation.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename()
                        if (e.key === 'Escape') cancelRename()
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={saveRename} className="text-xs">
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelRename} className="text-xs">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <h3 className="font-medium text-foreground truncate mb-1">
                    {conversation.title}
                  </h3>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {conversation.messages[conversation.messages.length - 1]?.content}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectConversation(conversation)}
                  className="text-xs"
                >
                  Continue
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRename(conversation.id, conversation.title)}
                  className="p-2"
                >
                  <PencilSimple className="w-4 h-4" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 text-destructive hover:text-destructive">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Conversation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete "{conversation.title}"? This action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Cancel</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDeleteConversation(conversation.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}