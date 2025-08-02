import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Trash, 
  PencilSimple, 
  ChatCircle, 
  Scales, 
  Wrench, 
  TrendUp, 
  FirstAidKit, 
  Lightning,
  Robot,
  MagnifyingGlass,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react'
import type { Conversation, Persona } from '../App'
import { useT } from '../contexts/TranslationContext'

interface ConversationHistoryProps {
  conversations: Conversation[]
  onSelectConversation: (conversation: Conversation) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
  onContinueConversation?: (conversation: Conversation) => void
  isAuthenticated: boolean
  onAuthRequest: (mode: 'signin' | 'signup') => void
}

export function ConversationHistory({ 
  conversations, 
  onSelectConversation, 
  onDeleteConversation, 
  onRenameConversation,
  onContinueConversation,
  isAuthenticated,
  onAuthRequest
}: ConversationHistoryProps) {
  const { t, language } = useT()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<Persona | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // Filter conversations based on selected persona
  const filteredConversations = selectedFilter === 'all' 
    ? conversations 
    : conversations.filter(conv => conv.persona === selectedFilter)

  // Calculate pagination
  const totalPages = Math.ceil(filteredConversations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedConversations = filteredConversations.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: Persona | 'all') => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  const getPersonaIcon = (persona: string) => {
    const iconMap = {
      lawyer: Scales,
      engineer: Wrench,
      marketer: TrendUp,
      coach: ChatCircle,
      medical: FirstAidKit,
      'god-mode': Lightning,
      general: Robot
    }
    return iconMap[persona as keyof typeof iconMap] || Robot
  }

  const getPersonaDisplayName = (persona: string) => {
    const names = {
      lawyer: t('history.filters.lawyer'),
      engineer: t('history.filters.engineer'),
      marketer: t('history.filters.marketer'),
      coach: t('history.filters.coach'),
      medical: t('history.filters.medical'),
      'god-mode': t('history.filters.godMode'),
      general: t('history.filters.general')
    }
    return names[persona as keyof typeof names] || t('history.filters.general')
  }

  const getAllPersonas = (): Array<{ key: Persona | 'all', label: string, icon: React.ElementType }> => {
    const uniquePersonas = Array.from(new Set(conversations.map(c => c.persona)))
    
    const allPersonas = [
      { key: 'all' as const, label: t('history.filters.all'), icon: MagnifyingGlass },
      ...uniquePersonas.map(persona => ({
        key: persona,
        label: getPersonaDisplayName(persona),
        icon: getPersonaIcon(persona)
      }))
    ]
    
    return allPersonas
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    const locale = language === 'en' ? 'en-US' : 
                   language === 'it' ? 'it-IT' : 
                   language === 'es' ? 'es-ES' : 
                   language === 'de' ? 'de-DE' : 'en-US'
    
    const timeString = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
    
    if (diffDays === 0) {
      return `${t('history.today')} ${t('history.at')} ${timeString}`
    } else if (diffDays === 1) {
      return `${t('history.yesterday')} ${t('history.at')} ${timeString}`
    } else if (diffDays < 7) {
      return `${diffDays} ${t('history.daysAgo')} ${t('history.at')} ${timeString}`
    } else {
      const dateString = new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric'
      }).format(new Date(date))
      return `${dateString} ${t('history.at')} ${timeString}`
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

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <ChatCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">{t('history.title')}</h2>
        <p className="text-muted-foreground mb-6">{t('history.signInPrompt')}</p>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => onAuthRequest('signin')}
            variant="outline"
            className="hover:text-primary"
          >
            {t('history.signIn')}
          </Button>
          <Button 
            onClick={() => onAuthRequest('signup')}
          >
            {t('auth.signUp')}
          </Button>
        </div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <ChatCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">{t('history.empty')}</h2>
        <p className="text-muted-foreground">{t('history.empty')}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('history.title')}</h1>
        <p className="text-muted-foreground">{t('history.title')}</p>
      </div>

      {/* Persona Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {getAllPersonas().map((persona) => {
            const IconComponent = persona.icon
            const isSelected = selectedFilter === persona.key
            
            return (
              <Button
                key={persona.key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(persona.key)}
                className={`text-xs group transition-colors ${
                  !isSelected ? 'hover:border-primary' : ''
                }`}
              >
                <IconComponent className={`w-4 h-4 mr-1 ${
                  !isSelected ? 'group-hover:text-primary' : ''
                }`} />
                <span className={`${
                  !isSelected ? 'group-hover:text-primary' : ''
                }`}>
                  {persona.label}
                </span>
                {persona.key !== 'all' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {conversations.filter(c => c.persona === persona.key).length}
                  </Badge>
                )}
                {persona.key === 'all' && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {conversations.length}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <ChatCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium text-foreground mb-2">No conversations found</h2>
          <p className="text-muted-foreground">
            {selectedFilter === 'all' 
              ? 'Start a conversation to see your history here'
              : `No conversations with ${getPersonaDisplayName(selectedFilter as string)} persona`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {paginatedConversations.map((conversation) => (
            <Card key={conversation.id} className="p-4 hover:bg-card/80 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {(() => {
                        const IconComponent = getPersonaIcon(conversation.persona)
                        return <IconComponent className="w-3 h-3 mr-1" />
                      })()}
                      {conversation.persona === 'general' ? 'General' : conversation.persona.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conversation.lastUpdated)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {conversation.messages.length} {conversation.messages.length === 1 ? t('history.message') : t('history.messages')}
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
                        {t('modals.save')}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelRename} className="text-xs">
                        {t('modals.cancel')}
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
                    onClick={() => onContinueConversation ? onContinueConversation(conversation) : onSelectConversation(conversation)}
                    className="text-xs"
                  >
                    {t('history.continue')}
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
                        <DialogTitle>{t('history.delete')}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {t('history.deleteConfirmation', { title: conversation.title })}
                        </p>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="group">
                            <span className="group-hover:text-primary transition-colors duration-200">
                              {t('modals.cancel')}
                            </span>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => onDeleteConversation(conversation.id)}
                          >
                            {t('modals.delete')}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <CaretLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0 text-xs"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <CaretRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Results info */}
          <div className="text-center text-xs text-muted-foreground">
            {t('history.showingConversations', { 
              start: startIndex + 1, 
              end: Math.min(endIndex, filteredConversations.length), 
              total: filteredConversations.length 
            })}
          </div>
        </div>
      )}
    </div>
  )
}