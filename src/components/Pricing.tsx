import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { CheckCircle, Lightning, Crown, Coins, CreditCard } from '@phosphor-icons/react'
import type { User } from '../App'
import { toast } from 'sonner'
import { useState } from 'react'

interface PricingProps {
  user: User
  onPlanSelect: (plan: 'free' | 'plus' | 'business') => void
  onCreditPurchase: (credits: number) => void
}

export function Pricing({ user, onPlanSelect, onCreditPurchase }: PricingProps) {
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false)
  const [showBuyCreditsDialog, setShowBuyCreditsDialog] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [creditsToBuy, setCreditsToBuy] = useState([500])
  const [purchasedCredits, setPurchasedCredits] = useState(0)
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: '/month',
      credits: '100',
      icon: CheckCircle,
      features: [
        '100 credits/month',
        'Basic personas',
        'Text input only',
        'Community support',
        'Conversation history'
      ],
      limitations: [
        'No voice input',
        'No God Mode',
        'Limited uploads'
      ]
    },
    {
      id: 'plus' as const,
      name: 'Plus',
      price: '$19',
      period: '/month',
      credits: '1,000',
      icon: Lightning,
      popular: true,
      features: [
        '1,000 credits/month',
        'All personas + God Mode',
        'Voice recognition',
        'Priority support',
        'Advanced management',
        'File uploads',
        'Export conversations'
      ]
    },
    {
      id: 'business' as const,
      name: 'Business',
      price: '$49',
      period: '/month',
      credits: '5,000',
      icon: Crown,
      features: [
        '5,000 credits/month',
        'All Plus features',
        'Priority processing',
        'Advanced analytics',
        'Team collaboration',
        'Custom personas',
        'API access',
        '24/7 support'
      ]
    }
  ]

  const calculateCreditPrice = (credits: number): number => {
    return Math.round(credits * 0.02) // $0.02 per credit
  }

  const formatNextBillingDate = (): string => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleSelectPlan = (planId: 'free' | 'plus' | 'business') => {
    if (planId === user.plan) {
      toast.info('You are already on this plan')
      return
    }

    // Check if it's a downgrade
    if (planId === 'free' && user.plan !== 'free') {
      setShowDowngradeDialog(true)
      return
    }

    // Mock payment flow - in real implementation, integrate Stripe
    if (planId !== 'free') {
      toast.success(`Redirecting to payment for ${plans.find(p => p.id === planId)?.name} plan...`)
      // Here you would integrate with Stripe
      setTimeout(() => {
        onPlanSelect(planId)
        toast.success('Plan upgraded successfully!')
      }, 2000)
    } else {
      onPlanSelect(planId)
      toast.success('Downgraded to Free plan')
    }
  }

  const handleDowngradeConfirm = () => {
    setShowDowngradeDialog(false)
    onPlanSelect('free')
    toast.success('Downgraded to Free plan')
  }

  const handleBuyCredits = () => {
    const credits = creditsToBuy[0]
    const price = calculateCreditPrice(credits)
    
    // Mock payment processing
    toast.success('Processing payment...')
    
    setTimeout(() => {
      setPurchasedCredits(credits)
      setShowBuyCreditsDialog(false)
      setShowPaymentSuccess(true)
      
      // Actually add credits to user account
      onCreditPurchase(credits)
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Choose Your <span className="text-primary">Plan</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = user.plan === plan.id
          const isUpgrade = plan.id !== 'free' && user.plan === 'free'
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : isCurrentPlan 
                    ? 'border-accent' 
                    : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <CardDescription className="text-primary font-medium">
                  {plan.credits} credits/month
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground">×</div>
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : isCurrentPlan ? 'secondary' : 'outline'}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan 
                    ? 'Current Plan' 
                    : isUpgrade 
                      ? `Upgrade to ${plan.name}` 
                      : plan.id === 'free' 
                        ? 'Downgrade to Free'
                        : `Select ${plan.name}`
                  }
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Need More Credits?</h3>
              <p className="text-muted-foreground">
                Buy additional credits anytime to extend your monthly allowance. 
                Credits never expire and can be used with any plan.
              </p>
              <Button 
                onClick={() => setShowBuyCreditsDialog(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downgrade Confirmation Dialog */}
      <Dialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Downgrade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to downgrade to the Free plan? You'll lose access to premium features.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="font-medium">Billing Information:</div>
              <div className="text-sm text-muted-foreground">
                Your current plan will remain active until {formatNextBillingDate()}.
                After this date, you'll be charged $0/month for the Free plan.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDowngradeDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDowngradeConfirm}>
              Confirm Downgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Credits Dialog */}
      <Dialog open={showBuyCreditsDialog} onOpenChange={setShowBuyCreditsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Buy Additional Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {creditsToBuy[0].toLocaleString()} Credits
                </div>
                <div className="text-2xl font-semibold">
                  ${calculateCreditPrice(creditsToBuy[0])}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${(calculateCreditPrice(creditsToBuy[0]) / creditsToBuy[0]).toFixed(3)} per credit
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select amount:</label>
                <Slider
                  value={creditsToBuy}
                  onValueChange={setCreditsToBuy}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyCreditsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyCredits}>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold">
                {purchasedCredits.toLocaleString()} credits added!
              </div>
              <div className="text-muted-foreground">
                Your credits have been successfully added to your account and are ready to use.
              </div>
            </div>
          </div>
          <DialogFooter className="justify-center">
            <Button onClick={() => setShowPaymentSuccess(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}