import { useState } from 'react'
import React from 'react'
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
  CaretRight,
  GraduationCap,
  CurrencyDollar,
  Heart
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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 20

  // Search function that looks through conversation titles and message content
  const searchConversations = (conversations: Conversation[], query: string): Conversation[] => {
    if (!query.trim()) return conversations
    
    const lowercaseQuery = query.toLowerCase().trim()
    
    return conversations.filter(conversation => {
      // Search in title
      if (conversation.title.toLowerCase().includes(lowercaseQuery)) {
        return true
      }
      
      // Search in message content
      return conversation.messages.some(message => 
        message.content.toLowerCase().includes(lowercaseQuery)
      )
    })
  }

  // Apply search and filter
  const searchedConversations = searchConversations(conversations, searchQuery)
  const filteredConversations = selectedFilter === 'all' 
    ? searchedConversations 
    : searchedConversations.filter(conv => conv.persona === selectedFilter)

  // Calculate pagination
  const totalPages = Math.ceil(filteredConversations.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedConversations = filteredConversations.slice(startIndex, endIndex)

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (filter: Persona | 'all') => {
    setSelectedFilter(filter)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const getPersonaIcon = (persona: string) => {
    const iconMap = {
      academic: GraduationCap,
      marketer: TrendUp,
      engineer: Wrench,
      coach: ChatCircle,
      sensei: Heart,
      richman: CurrencyDollar,
      lawyer: Scales,
      medical: FirstAidKit,
      'god-mode': Lightning,
      general: Robot
    }
    return iconMap[persona as keyof typeof iconMap] || Robot
  }

  const getPersonaDisplayName = (persona: string) => {
    const names = {
      academic: t('history.filters.academic'),
      marketer: t('history.filters.marketer'),
      engineer: t('history.filters.engineer'),
      coach: t('history.filters.coach'),
      sensei: t('history.filters.sensei'),
      richman: t('history.filters.richman'),
      lawyer: t('history.filters.lawyer'),
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
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t('history.title')}</h1>
        <p className="text-sm text-muted-foreground hidden sm:block">{t('history.title')}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('history.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 text-sm"
          />
        </div>
      </div>

      {/* Persona Filters */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {getAllPersonas().map((persona) => {
            const IconComponent = persona.icon
            const isSelected = selectedFilter === persona.key
            
            return (
              <Button
                key={persona.key}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(persona.key)}
                className={`mobile-filter-btn text-xs group transition-colors ${
                  !isSelected ? 'hover:border-primary' : ''
                }`}
              >
                <IconComponent className={`w-3 h-3 mr-1 ${
                  !isSelected ? 'group-hover:text-primary' : ''
                }`} />
                <span className={`hidden sm:inline ${
                  !isSelected ? 'group-hover:text-primary' : ''
                }`}>
                  {persona.label}
                </span>
                {/* Short label for mobile */}
                <span className={`sm:hidden ${
                  !isSelected ? 'group-hover:text-primary' : ''
                }`}>
                  {persona.key === 'all' ? t('history.filters.all') : persona.label.slice(0, 3)}
                </span>
                <Badge variant="secondary" className="ml-1 text-xs px-1">
                  {persona.key !== 'all' ? (
                    conversations.filter(c => c.persona === persona.key).length
                  ) : (
                    conversations.length
                  )}
                </Badge>
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
          <div className="space-y-4">
            {paginatedConversations.map((conversation) => (
            <Card key={conversation.id} className="mobile-conversation-card hover:bg-card/80 transition-colors">
              <div className="space-y-3">
                {/* Mobile-optimized header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Badge variant="outline" className="mobile-badge-compact shrink-0">
                      {(() => {
                        const IconComponent = getPersonaIcon(conversation.persona)
                        return <IconComponent className="w-3 h-3 mr-1" />
                      })()}
                      <span className="hidden sm:inline">{getPersonaDisplayName(conversation.persona)}</span>
                      <span className="sm:hidden">{getPersonaDisplayName(conversation.persona).slice(0, 3)}</span>
                    </Badge>
                    <div className="text-xs text-muted-foreground truncate">
                      {formatDate(conversation.lastUpdated)}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mobile-conversation-actions flex items-center shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onContinueConversation ? onContinueConversation(conversation) : onSelectConversation(conversation)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      {t('history.continue')}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRename(conversation.id, conversation.title)}
                      className="p-1 h-auto"
                    >
                      <PencilSimple className="w-4 h-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 h-auto text-destructive hover:text-destructive">
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

                {/* Title and content */}
                <div className="space-y-2">
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
                      <Button size="sm" onClick={saveRename} className="text-xs shrink-0">
                        {t('modals.save')}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelRename} className="text-xs shrink-0">
                        {t('modals.cancel')}
                      </Button>
                    </div>
                  ) : (
                    <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2">
                      {conversation.title}
                    </h3>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {conversation.messages[conversation.messages.length - 1]?.content}
                  </p>
                  
                  {/* Message count for mobile */}
                  <div className="text-xs text-muted-foreground">
                    {conversation.messages.length} {conversation.messages.length === 1 ? t('history.message') : t('history.messages')}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 group"
              >
                <CaretLeft className="w-4 h-4 group-hover:text-primary transition-colors duration-200" />
              </Button>
              
              <div className="flex items-center gap-1">
                {/* Show max 5 pages on mobile, all on desktop */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // On mobile (small screens), show fewer pages
                    if (totalPages <= 5) return true
                    
                    // Show current page and 2 adjacent pages, plus first and last
                    return Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages
                  })
                  .map((page, index, array) => {
                    // Add ellipsis when there's a gap
                    const showEllipsis = index > 0 && page - array[index - 1] > 1
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-2 text-xs text-muted-foreground hidden sm:inline">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 text-xs ${
                            currentPage !== page ? 'group' : ''
                          }`}
                        >
                          <span className={`${
                            currentPage !== page ? 'group-hover:text-primary transition-colors duration-200' : ''
                          }`}>
                            {page}
                          </span>
                        </Button>
                      </React.Fragment>
                    )
                  })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 group"
              >
                <CaretRight className="w-4 h-4 group-hover:text-primary transition-colors duration-200" />
              </Button>
            </div>
          )}

          {/* Results info */}
          <div className="text-center text-xs text-muted-foreground mt-2 sm:mt-4">
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