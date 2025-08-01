import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeSwitch: () => void
  onAuthSuccess: (userData: any) => void
  referralCode?: string
}

export function AuthModal({ isOpen, onClose, mode, onModeSwitch, onAuthSuccess, referralCode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        
        // Simulate successful signup
        const newUser = {
          id: crypto.randomUUID(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          credits: referralCode ? 300 : 100, // Bonus credits for referral
          plan: 'free' as const,
          referralCode: crypto.randomUUID().slice(0, 8),
          referralsCount: 0,
          creditsEarned: 0,
          cashEarned: 0,
          language: 'en'
        }
        
        onAuthSuccess(newUser)
        toast.success(referralCode ? 'Account created! You received 300 bonus credits!' : 'Account created successfully!')
      } else {
        // Simulate successful signin
        const existingUser = {
          id: crypto.randomUUID(),
          email: formData.email,
          firstName: 'John',
          lastName: 'Doe',
          credits: 250,
          plan: 'plus' as const,
          referralCode: 'ABC12345',
          referralsCount: 3,
          creditsEarned: 150,
          cashEarned: 3.50,
          language: 'en'
        }
        
        onAuthSuccess(existingUser)
        toast.success('Welcome back!')
      }
      
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
  }

  const handleModeSwitch = () => {
    resetForm()
    onModeSwitch()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
          )}

          {referralCode && mode === 'signup' && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                🎉 Referral bonus: You'll receive 300 free credits!
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleModeSwitch}
              className="p-0 ml-1 h-auto text-primary"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}