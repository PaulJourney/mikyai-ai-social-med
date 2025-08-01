import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { User, Globe, ShareNetwork, ClockCounterClockwise, CreditCard, SignOut, DollarSign, Copy } from '@phosphor-icons/react'
import type { User as UserType } from '../App'
import { toast } from 'sonner'
import { CashoutModal } from './CashoutModal'

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

  const handleReferralClick = () => {
    if (!user) {
      onAuthRequest('signup')
      return
    }
    const referralLink = `https://miky.ai/ref/${user.referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied to clipboard!')
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
    toast.success('Referral link copied!')
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-foreground">
              Miky<span className="text-primary">.ai</span>
            </div>
            <div className="h-6 w-px bg-border mx-2"></div>
            <Button
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('chat')}
              className="text-xs"
            >
              Chat
            </Button>
            <Button
              variant={currentView === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('history')}
              className="text-xs"
            >
              <ClockCounterClockwise className="w-4 h-4 mr-1" />
              History
            </Button>
            <Button
              variant={currentView === 'pricing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('pricing')}
              className="text-xs"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Pricing
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Credits Badge */}
                <Badge variant={getCreditsBadgeColor()} className="text-xs font-medium">
                  {user.credits} credits
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
                      <span className="group-hover:text-primary transition-colors duration-200">Refer</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm mb-2">Referral Program</h3>
                        <p className="text-xs text-muted-foreground">
                          When someone signs up for a Plus plan using your referral code, they get 300 free credits and you earn $1!
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="text-xs text-muted-foreground">Your referral code</div>
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

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 bg-muted rounded">
                            <div className="text-muted-foreground">Total Earned</div>
                            <div className="font-medium">${((user.cashEarned || 0) + (user.referralsCount * 1)).toFixed(2)}</div>
                          </div>
                          <div className="p-2 bg-muted rounded">
                            <div className="text-muted-foreground">Available</div>
                            <div className="font-medium text-primary">${(user.cashEarned || 0).toFixed(2)}</div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          disabled={(user.cashEarned || 0) < 10}
                          onClick={() => setShowCashoutModal(true)}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Cash Out {(user.cashEarned || 0) < 10 ? '(Min $10)' : ''}
                        </Button>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          <div>Successful referrals: {user.referralsCount}</div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Language Selector */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Globe className="w-4 h-4 mr-1" />
                      EN
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2">
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                        English
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                        Español
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                        Français
                      </Button>
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
                        <div>Plan: <span className="text-foreground font-medium capitalize">{user.plan}</span></div>
                        <div>Credits: <span className="text-foreground font-medium">{user.credits}</span></div>
                        <div>Referrals: <span className="text-foreground font-medium">{user.referralsCount}</span></div>
                        <div>Credits Earned: <span className="text-foreground font-medium">{user.creditsEarned}</span></div>
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
                              Upgrade Plan
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
                              Get More Credits
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
                          Sign Out
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
                  Sign in
                </Button>
                <Button 
                  onClick={() => onAuthRequest('signup')} 
                  size="sm"
                  className="text-xs"
                >
                  Sign up
                </Button>
              </div>
            )}
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