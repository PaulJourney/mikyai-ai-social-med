import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle } from '@phosphor-icons/react'

interface CashoutModalProps {
  isOpen: boolean
  onClose: () => void
  availableCash: number
  onCashoutSuccess: () => void
}

export function CashoutModal({ isOpen, onClose, availableCash, onCashoutSuccess }: CashoutModalProps) {
  const [paypalEmail, setPaypalEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (availableCash < 10) {
      return
    }

    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      onCashoutSuccess()
      setIsLoading(false)
      setShowSuccess(true)
    }, 2000)
  }

  const handleClose = () => {
    setPaypalEmail('')
    setShowSuccess(false)
    onClose()
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <CheckCircle className="w-16 h-16 text-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Request Received Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                We have received your cashout request and it will be processed as soon as possible.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cash Out Earnings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Available to cash out</div>
            <div className="text-2xl font-bold text-primary">${availableCash.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">Minimum: $10.00</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email Address</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="your-email@example.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Make sure this email is associated with your PayPal account
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || availableCash < 10}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Cash Out'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}