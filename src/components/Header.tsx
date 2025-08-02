import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { User, Globe, ShareNetwork, ClockCounterClockwise, CreditCard, SignOut, DollarSign, Copy, WhatsappLogo, Link, ChatCircle, List } from '@phosphor-icons/react'
import type { User as UserType } from '../App'
import { toast } from 'sonner'
import { CashoutModal } from './CashoutModal'
import { useT } from '../contexts/TranslationContext'
import { getAvailableLanguages } from '../lib/i18n'

interface HeaderProps {
  user: UserType | null
  onViewChange: (view: 'chat' | 'history' | 'admin' | 'pricing') => void
  currentView: 'chat' | 'history' | 'admin' | 'pricing'
  onSignOut: () => void
  onAuthRequest: (mode?: 'signin' | 'signup') => void
  onUpdateUser: (userData: Partial<UserType>) => void
}

export function Header({ user, onViewChange, currentView, onSignOut, onAuthRequest, onUpdateUser }: HeaderProps) {
  const [showCashoutModal, setShowCashoutModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, language, setLanguage } = useT()
  const availableLanguages = getAvailableLanguages()

  const handleReferralClick = () => {
    if (!user) {
      onAuthRequest('signup')
      return
    }
    const referralLink = `https://miky.ai/ref/${user.referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast.success(t('referral.successful'))
  }

  const getCreditsBadgeColor = () => {
    if (!user) return 'default'
    if (user.credits <= 10) return 'destructive'
    if (user.credits <= 50) return 'secondary'
    return 'default'
  }

  const handleCashout = () => {
    if (!user) return
    onUpdateUser({ cashEarned: 0 })
  }

  const handleReferralCopy = (code: string) => {
    const referralLink = `https://miky.ai/ref/${code}`
    navigator.clipboard.writeText(referralLink)
    toast.success(t('referral.linkCopied'))
  }

  const createReferralMessage = (userName: string, referralCode: string) => {
    const referralLink = `https://miky.ai/ref/${referralCode}`
    return t('referral.shareMessage', { 
      name: userName, 
      code: referralCode, 
      link: referralLink 
    })
  }

  const handleWhatsAppShare = () => {
    if (!user) return
    try {
      const userName = user.firstName || user.email?.split('@')[0] || 'Un amico'
      const message = createReferralMessage(userName, user.referralCode)
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    } catch (error) {
      console.error('WhatsApp share error:', error)
      toast.error(t('referral.whatsappShareError'))
    }
  }

  const handleCopyReferralMessage = () => {
    if (!user) return
    const userName = user.firstName || user.email?.split('@')[0] || 'Un amico'
    const message = createReferralMessage(userName, user.referralCode)
    navigator.clipboard.writeText(message)
    toast.success(t('referral.messageCopied'))
  }

  const getCurrentLanguageDisplay = () => {
    const current = availableLanguages.find(lang => lang.code === language)
    return current ? `${current.flag} ${current.code.toUpperCase()}` : 'EN'
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onViewChange('chat')}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors duration-200"
            >
              Miky<span className="text-primary">.ai</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="h-6 w-px bg-border mx-2"></div>
            <Button
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('chat')}
              className="text-xs"
            >
              <ChatCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
            <Button
              variant={currentView === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('history')}
              className="text-xs"
            >
              <ClockCounterClockwise className="w-4 h-4 mr-1" />
              {t('header.conversations')}
            </Button>
            <Button
              variant={currentView === 'pricing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('pricing')}
              className="text-xs"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              {t('header.pricing')}
            </Button>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector - Available for all users */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Globe className="w-4 h-4 mr-1" />
                  {getCurrentLanguageDisplay()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  {availableLanguages.map((lang) => (
                    <Button 
                      key={lang.code}
                      variant={language === lang.code ? "default" : "ghost"} 
                      size="sm" 
                      className="w-full justify-start text-xs"
                      onClick={() => setLanguage(lang.code as any)}
                    >
                      {lang.flag} {lang.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {user ? (
              <>
                {/* Credits Badge */}
                <Badge variant={getCreditsBadgeColor()} className="text-xs font-medium">
                  {user.credits} {t('header.credits').toLowerCase()}
                </Badge>

                {/* Referral Button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs hover:glow-effect group"
                    >
                      <ShareNetwork className="w-4 h-4 mr-1 group-hover:text-primary transition-colors duration-200" />
                      <span className="group-hover:text-primary transition-colors duration-200">{t('header.refer')}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm mb-2">{t('referral.title')}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t('referral.howItWorks')}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground">{t('referral.yourReferralCode')}</div>
                            <div className="font-mono text-sm">{user.referralCode}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReferralCopy(user.referralCode)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Share Options */}
                        <div>
                          <div className="text-xs text-muted-foreground mb-2">{t('referral.shareOptions')}</div>
                          <div className="grid grid-cols-2 gap-4 px-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs group hover:text-primary transition-colors duration-200"
                              onClick={handleWhatsAppShare}
                            >
                              <WhatsappLogo className="w-4 h-4 mr-1" />
                              <span className="group-hover:text-primary transition-colors duration-200">WhatsApp</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs group hover:text-primary transition-colors duration-200"
                              onClick={handleCopyReferralMessage}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              <span className="group-hover:text-primary transition-colors duration-200">Copy</span>
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 bg-muted rounded">
                            <div className="text-muted-foreground">{t('referral.earnings')}</div>
                            <div className="font-medium">${((user.cashEarned || 0) + (user.referralsCount * 2)).toFixed(2)}</div>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <div className="text-muted-foreground">{t('referral.pending')}</div>
                            <div className="font-medium text-primary">${(user.cashEarned || 0).toFixed(2)}</div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          disabled={(user.cashEarned || 0) < 10}
                          onClick={() => setShowCashoutModal(true)}
                        >
                          {t('referral.cashOutMinimum')}
                        </Button>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          <div>{t('referral.successful')}: {user.referralsCount}</div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* User Menu */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Account</div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div>{t('profile.plan')}: <span className="text-foreground font-medium capitalize">{user.plan}</span></div>
                        <div>{t('profile.credits')}: <span className="text-foreground font-medium">{user.credits}</span></div>
                        <div>{t('profile.referrals')}: <span className="text-foreground font-medium">{user.referralsCount}</span></div>
                        <div>{t('profile.earned')}: <span className="text-foreground font-medium">${((user.cashEarned || 0) + (user.referralsCount * 2)).toFixed(2)}</span></div>
                      </div>
                      <div className="pt-2 border-t space-y-2">
                        {user.plan !== 'business' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs group"
                            onClick={() => onViewChange('pricing')}
                          >
                            <span className="group-hover:text-primary transition-colors duration-200">
                              {t('header.upgradePlan')}
                            </span>
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs group"
                            onClick={() => onViewChange('pricing')}
                          >
                            <span className="group-hover:text-primary transition-colors duration-200">
                              {t('header.getMoreCredits')}
                            </span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-xs text-destructive hover:text-destructive"
                          onClick={onSignOut}
                        >
                          <SignOut className="w-4 h-4 mr-1" />
                          {t('auth.logout')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onAuthRequest('signin')}
                  className="text-xs text-primary hover:text-primary"
                >
                  {t('auth.signIn')}
                </Button>
                <Button 
                  onClick={() => onAuthRequest('signup')} 
                  size="sm"
                  className="text-xs"
                >
                  {t('auth.signUp')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language Selector - Mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs px-2">
                  <Globe className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  {availableLanguages.map((lang) => (
                    <Button 
                      key={lang.code}
                      variant={language === lang.code ? "default" : "ghost"} 
                      size="sm" 
                      className="w-full justify-start text-xs"
                      onClick={() => setLanguage(lang.code as any)}
                    >
                      {lang.flag} {lang.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {user && (
              <Badge variant={getCreditsBadgeColor()} className="text-xs font-medium">
                {user.credits}
              </Badge>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="font-semibold">Menu</h2>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 p-4 space-y-3">
                    <Button
                      variant={currentView === 'chat' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        onViewChange('chat')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <ChatCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    
                    <Button
                      variant={currentView === 'history' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        onViewChange('history')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <ClockCounterClockwise className="w-4 h-4 mr-2" />
                      {t('header.conversations')}
                    </Button>
                    
                    <Button
                      variant={currentView === 'pricing' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        onViewChange('pricing')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {t('header.pricing')}
                    </Button>

                    {user ? (
                      <>
                        {/* User Info */}
                        <div className="pt-4 border-t space-y-3">
                          <div className="text-sm font-medium">Account</div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div>{t('profile.plan')}: <span className="text-foreground font-medium capitalize">{user.plan}</span></div>
                            <div>{t('profile.credits')}: <span className="text-foreground font-medium">{user.credits}</span></div>
                            <div>{t('profile.referrals')}: <span className="text-foreground font-medium">{user.referralsCount}</span></div>
                            <div>{t('profile.earned')}: <span className="text-foreground font-medium">${((user.cashEarned || 0) + (user.referralsCount * 2)).toFixed(2)}</span></div>
                          </div>
                          
                          <div className="space-y-2">
                            {user.plan !== 'business' ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => {
                                  onViewChange('pricing')
                                  setMobileMenuOpen(false)
                                }}
                              >
                                {t('header.upgradePlan')}
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => {
                                  onViewChange('pricing')
                                  setMobileMenuOpen(false)
                                }}
                              >
                                {t('header.getMoreCredits')}
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-xs"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <ShareNetwork className="w-4 h-4 mr-2" />
                              {t('header.refer')}
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-xs text-destructive hover:text-destructive"
                              onClick={() => {
                                onSignOut()
                                setMobileMenuOpen(false)
                              }}
                            >
                              <SignOut className="w-4 h-4 mr-2" />
                              {t('auth.logout')}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="pt-4 border-t space-y-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-primary"
                          onClick={() => {
                            onAuthRequest('signin')
                            setMobileMenuOpen(false)
                          }}
                        >
                          {t('auth.signIn')}
                        </Button>
                        <Button 
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            onAuthRequest('signup')
                            setMobileMenuOpen(false)
                          }}
                        >
                          {t('auth.signUp')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {user && (
        <CashoutModal
          isOpen={showCashoutModal}
          onClose={() => setShowCashoutModal(false)}
          availableCash={user.cashEarned || 0}
          onCashoutSuccess={handleCashout}
        />
      )}
    </header>
  )
}