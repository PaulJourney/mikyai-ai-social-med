import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { User, Globe, ShareNetwork, ClockCounterClockwise, CreditCard } from '@phosphor-icons/react'
import type { User as UserType } from '../App'
import { toast } from 'sonner'

interface HeaderProps {
  user: UserType
  onViewChange: (view: 'chat' | 'history' | 'admin' | 'pricing') => void
  currentView: 'chat' | 'history' | 'admin' | 'pricing'
}

export function Header({ user, onViewChange, currentView }: HeaderProps) {
  const handleReferralClick = () => {
    const referralLink = `https://miky.ai/ref/${user.referralCode}`
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied to clipboard!')
  }

  const getCreditsBadgeColor = () => {
    if (user.credits <= 10) return 'destructive'
    if (user.credits <= 50) return 'secondary'
    return 'default'
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
            {/* Credits Badge */}
            <Badge variant={getCreditsBadgeColor()} className="text-xs font-medium">
              {user.credits} credits
            </Badge>

            {/* Referral Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReferralClick}
              className="text-xs hover:glow-effect hover:text-primary"
            >
              <ShareNetwork className="w-4 h-4 mr-1" />
              Refer
            </Button>

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
                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => onViewChange('pricing')}
                    >
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  )
}