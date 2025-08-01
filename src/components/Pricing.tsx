import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Lightning, Crown, Infinity } from '@phosphor-icons/react'
import type { User } from '../App'
import { toast } from 'sonner'

interface PricingProps {
  user: User
  onPlanSelect: (plan: 'free' | 'plus' | 'business') => void
}

export function Pricing({ user, onPlanSelect }: PricingProps) {
  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      price: '$0',
      period: '/month',
      credits: '100',
      icon: CheckCircle,
      features: [
        '100 credits per month',
        'Basic personas',
        'Text input only',
        'Community support',
        'Basic conversation history'
      ],
      limitations: [
        'No voice input',
        'No God Mode access',
        'Limited file uploads'
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
        '1,000 credits per month',
        'All personas including God Mode',
        'Voice input & recognition',
        'Priority support',
        'Advanced conversation management',
        'File upload support',
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
        '5,000 credits per month',
        'All Plus features',
        'Priority AI processing',
        'Advanced analytics',
        'Team collaboration',
        'Custom personas',
        'API access',
        '24/7 dedicated support'
      ]
    }
  ]

  const handleSelectPlan = (planId: 'free' | 'plus' | 'business') => {
    if (planId === user.plan) {
      toast.info('You are already on this plan')
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

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Choose Your <span className="text-primary">Plan</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of Miky.ai with advanced features and increased credits. 
          Start free and upgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                <Infinity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Need More Credits?</h3>
              <p className="text-muted-foreground">
                All plans include monthly credit allowances that reset each billing cycle. 
                Credits are consumed based on AI processing complexity and features used.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">Basic Personas</div>
                  <div className="text-muted-foreground">2-3 credits per message</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">Advanced Features</div>
                  <div className="text-muted-foreground">Voice input, file analysis</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">God Mode</div>
                  <div className="text-muted-foreground">5 credits per message</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}