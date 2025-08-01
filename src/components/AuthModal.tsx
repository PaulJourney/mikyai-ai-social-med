import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, EyeSlash, CheckCircle, Envelope } from '@phosphor-icons/react'
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
  const [emailSent, setEmailSent] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [verificationCode] = useState('123456') // Mock verification code

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (mode === 'signup' && !emailSent) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        
        // Send confirmation email
        setEmailSent(true)
        setIsLoading(false)
        toast.success('Confirmation email sent! Check your inbox.')
        return
      }
      
      if (mode === 'signup' && emailSent) {
        // Verify confirmation code
        if (confirmationCode !== verificationCode) {
          toast.error('Invalid confirmation code')
          setIsLoading(false)
          return
        }
        
        // Create account after email confirmation
        const newUser = {
          id: crypto.randomUUID(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          credits: referralCode ? 300 : 100,
          plan: 'free' as const,
          referralCode: crypto.randomUUID().slice(0, 8),
          referralsCount: 0,
          creditsEarned: 0,
          cashEarned: 0,
          language: 'en'
        }
        
        onAuthSuccess(newUser)
        toast.success(referralCode ? 'Account created! You received 300 bonus credits!' : 'Account created successfully!')
        setIsLoading(false)
        onClose()
        return
      }
      
      if (mode === 'signin') {
        // Test account
        if (formData.email === 'support@miky.ai' && formData.password === '1234') {
          const testUser = {
            id: 'test-user',
            email: 'support@miky.ai',
            firstName: 'Support',
            lastName: 'Team',
            credits: 5000,
            plan: 'business' as const,
            referralCode: 'SUPPORT123',
            referralsCount: 20,
            creditsEarned: 600,
            cashEarned: 20.00,
            language: 'en'
          }
          
          onAuthSuccess(testUser)
          toast.success('Welcome back, Support Team!')
          setIsLoading(false)
          onClose()
          return
        }
        
        // Regular signin simulation
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
          cashEarned: 12.00,
          language: 'en'
        }
        
        onAuthSuccess(existingUser)
        toast.success('Welcome back!')
        setIsLoading(false)
        onClose()
      }
    }, 1500)
  }

  const handleConfirmEmail = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    })
    setEmailSent(false)
    setConfirmationCode('')
  }

  const handleModeSwitch = () => {
    resetForm()
    onModeSwitch()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === 'signin' ? 'Welcome Back' : 
             emailSent ? 'Confirm Your Email' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        {mode === 'signup' && emailSent ? (
          // Email confirmation step
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Envelope className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a confirmation code to {formData.email}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  For demo purposes, use code: <span className="font-mono text-primary">123456</span>
                </p>
              </div>
            </div>
            
            <form onSubmit={handleConfirmEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmationCode">Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || confirmationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Confirm Email'}
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setEmailSent(false)
                    setConfirmationCode('')
                  }}
                  className="text-muted-foreground"
                >
                  ← Back to signup
                </Button>
              </div>
            </form>
          </div>
        ) : (
          // Regular signin/signup form
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

            {mode === 'signin' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Test account: support@miky.ai / 1234
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
        )}
      </DialogContent>
    </Dialog>
  )
}