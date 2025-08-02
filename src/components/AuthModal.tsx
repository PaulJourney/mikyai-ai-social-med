import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Eye, EyeSlash, CheckCircle, Envelope, Lock, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useT } from '../contexts/TranslationContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeSwitch: () => void
  onAuthSuccess: (userData: any, isNewUser?: boolean) => void
  referralCode?: string
}

export function AuthModal({ isOpen, onClose, mode, onModeSwitch, onAuthSuccess, referralCode }: AuthModalProps) {
  const { t } = useT()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    referralCode: referralCode || ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [verificationCode] = useState('123456') // Mock verification code
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [referralVerified, setReferralVerified] = useState(false)
  const [referrerName, setReferrerName] = useState('')
  const [isVerifyingReferral, setIsVerifyingReferral] = useState(false)

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
          credits: referralVerified ? 300 : 100,
          plan: 'free' as const,
          referralCode: crypto.randomUUID().slice(0, 8),
          referralsCount: 0,
          creditsEarned: 0,
          cashEarned: 0,
          language: 'en'
        }
        
        onAuthSuccess(newUser, true) // Mark as new user
        toast.success(referralVerified ? 'Account created! You received 300 bonus credits!' : 'Account created successfully!')
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
            cashEarned: 40.00,
            language: 'en'
          }
          
          onAuthSuccess(testUser, false)
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
          cashEarned: 6.00,
          language: 'en'
        }
        
        onAuthSuccess(existingUser, false)
        toast.success('Welcome back!')
        setIsLoading(false)
        onClose()
      }
    }, 1500)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password reset email sending
    setTimeout(() => {
      setResetEmailSent(true)
      setIsLoading(false)
      toast.success('Password reset code sent! Check your inbox.')
    }, 1000)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (resetCode !== '123456') {
      toast.error('Invalid reset code')
      setIsLoading(false)
      return
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }
    
    // Simulate password reset
    setTimeout(() => {
      toast.success('Password reset successfully! You can now sign in with your new password.')
      setShowForgotPassword(false)
      setResetEmailSent(false)
      setResetCode('')
      setNewPassword('')
      setConfirmNewPassword('')
      setIsLoading(false)
    }, 1000)
  }

  const handleVerifyReferral = async () => {
    if (!formData.referralCode.trim()) return
    
    setIsVerifyingReferral(true)
    
    // Simulate referral verification
    setTimeout(() => {
      // Mock verification - in real app, this would check against database
      if (formData.referralCode === 'SUPPORT123' || formData.referralCode.length >= 6) {
        setReferralVerified(true)
        const mockReferrerName = 'Marco'  // Mock referrer name
        setReferrerName(mockReferrerName)
        toast.success(t('referral.referralVerified', { name: mockReferrerName }))
      } else {
        toast.error('Invalid referral code')
      }
      setIsVerifyingReferral(false)
    }, 1000)
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
      lastName: '',
      referralCode: referralCode || ''
    })
    setEmailSent(false)
    setConfirmationCode('')
    setShowForgotPassword(false)
    setResetEmailSent(false)
    setResetCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setReferralVerified(false)
    setReferrerName('')
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
            {showForgotPassword ? 
              (resetEmailSent ? t('auth.resetPassword') : t('auth.lostPassword')) :
              mode === 'signin' ? t('modals.welcomeBack') : 
              emailSent ? t('auth.confirmEmail') : t('auth.createAccount')}
          </DialogTitle>
        </DialogHeader>
        
        {showForgotPassword ? (
          resetEmailSent ? (
            // Password reset form
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Enter reset code</h3>
                  <p className="text-sm text-muted-foreground">
                    We sent a reset code to {formData.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    For demo purposes, use code: <span className="font-mono text-primary">123456</span>
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetCode">Reset Code</Label>
                  <Input
                    id="resetCode"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('auth.password')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('auth.newPasswordPlaceholder')}
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                    minLength={6}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || resetCode.length !== 6 || !newPassword || !confirmNewPassword}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setShowForgotPassword(false)
                      setResetEmailSent(false)
                      setResetCode('')
                      setNewPassword('')
                      setConfirmNewPassword('')
                    }}
                    className="text-muted-foreground"
                  >
                    ← Back to sign in
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            // Request password reset
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Reset your password</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a reset code.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">{t('auth.email')}</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !formData.email}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </Button>
                
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-muted-foreground"
                  >
                    ← Back to sign in
                  </Button>
                </div>
              </form>
            </div>
          )
        ) : mode === 'signup' && emailSent ? (
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
                  placeholder="123456"
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
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder={t('auth.firstNamePlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder={t('auth.lastNamePlaceholder')}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={t('auth.passwordPlaceholder')}
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
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">
                    {t('referral.referralCode')} <span className="text-muted-foreground">({t('auth.referralCodePlaceholder').split(' ')[1]})</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="referralCode"
                      value={formData.referralCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                      placeholder={t('auth.referralCodePlaceholder')}
                      disabled={referralVerified}
                      className={referralVerified ? 'bg-primary/10 border-primary' : ''}
                    />
                    {formData.referralCode && !referralVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleVerifyReferral}
                        disabled={isVerifyingReferral}
                        className="px-3 whitespace-nowrap"
                      >
                        {isVerifyingReferral ? 'Verifying...' : t('referral.verifyReferral')}
                      </Button>
                    )}
                    {referralVerified && (
                      <div className="flex items-center justify-center px-3">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get 300 free credits if you were invited by someone
                  </p>
                  {referralVerified && (
                    <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-xs text-primary font-medium">
                        {t('referral.referralVerified', { name: referrerName })}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {referralCode && mode === 'signup' && !formData.referralCode && (
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
              {isLoading ? t('modals.processing') : mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
            </Button>
            
            {mode === 'signin' && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-muted-foreground"
                >
                  {t('auth.lostPassword')}?
                </Button>
              </div>
            )}
            
            <div className="text-center text-sm text-muted-foreground">
              {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleModeSwitch}
                className="p-0 ml-1 h-auto text-primary"
              >
                {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}