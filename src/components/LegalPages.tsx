import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft } from '@phosphor-icons/react'

interface LegalPagesProps {
  currentPage: 'terms' | 'privacy' | 'cookies'
  onBack: () => void
}

export function LegalPages({ currentPage, onBack }: LegalPagesProps) {
  const renderTermsAndConditions = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Terms and Conditions</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing and using Miky.ai ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
        <p className="text-muted-foreground leading-relaxed">
          Miky.ai is an AI assistant platform that provides specialized personas for various professional and personal assistance needs. 
          The service operates on a credit-based system with subscription plans.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">3. User Accounts and Registration</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must be at least 13 years old to use this service. You are responsible for maintaining the confidentiality of your account 
          and password and for restricting access to your computer.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">4. Credit System and Payments</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our service operates on a credit-based system. Credits are consumed when using AI personas. Payments are processed through Stripe. 
          Subscription fees are non-refundable except as required by law.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">5. Prohibited Uses</h2>
        <p className="text-muted-foreground leading-relaxed">
          You may not use our service for any illegal activities, to generate harmful content, for harassment, fraud, or any activity 
          that violates applicable laws or regulations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">
          The service and its original content are and will remain the exclusive property of Neuronica Srl and its licensors. 
          The service is protected by copyright, trademark, and other laws.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">7. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may terminate or suspend your account at any time, without prior notice or liability, for any reason whatsoever, 
          including without limitation if you breach the Terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">8. Contact Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about these Terms and Conditions, please contact us at support@miky.ai
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">9. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms shall be interpreted and governed by the laws of the Republic of San Marino.
        </p>
      </section>

      <p className="text-sm text-muted-foreground mt-8">
        Last updated: January 2025
      </p>
    </div>
  )

  const renderPrivacyPolicy = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          We collect information you provide directly to us, such as when you create an account, use our AI personas, 
          or contact us for support. This includes your conversations with AI personas, usage patterns, and payment information.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to provide, maintain, and improve our services, process transactions, 
          send you technical notices and support messages, and communicate with you about products and services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
        <p className="text-muted-foreground leading-relaxed">
          We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. 
          We may share information with trusted service providers who assist us in operating our service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate security measures to protect your personal information against unauthorized access, 
          alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. 
          Contact us at support@miky.ai to exercise these rights.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">6. International Transfers</h2>
        <p className="text-muted-foreground leading-relaxed">
          Your information may be transferred to and processed in countries other than your country of residence, 
          including the Republic of San Marino where our company is located.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">7. Contact Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at support@miky.ai
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Neuronica Srl<br />
          Via del Serrone 62<br />
          47890 Repubblica di San Marino
        </p>
      </section>

      <p className="text-sm text-muted-foreground mt-8">
        Last updated: January 2025
      </p>
    </div>
  )

  const renderCookiePolicy = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Cookie Policy</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">1. What Are Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cookies are small text files that are placed on your device when you visit our website. 
          They help us provide you with a better experience by remembering your preferences and usage patterns.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">2. Types of Cookies We Use</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground">Essential Cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              These cookies are necessary for the website to function properly and cannot be disabled.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Functionality Cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              These cookies remember your preferences and choices to provide a personalized experience.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Analytics Cookies</h3>
            <p className="text-muted-foreground leading-relaxed">
              These cookies help us understand how visitors use our website to improve our services.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">3. Managing Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          You can control and manage cookies through your browser settings. Please note that disabling certain cookies 
          may affect the functionality of our service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">4. Third-Party Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may use third-party services like Stripe for payments, which may set their own cookies. 
          We do not control these cookies and recommend reviewing their privacy policies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">5. Updates to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about our use of cookies, please contact us at support@miky.ai
        </p>
      </section>

      <p className="text-sm text-muted-foreground mt-8">
        Last updated: January 2025
      </p>
    </div>
  )

  const getContent = () => {
    switch (currentPage) {
      case 'terms':
        return renderTermsAndConditions()
      case 'privacy':
        return renderPrivacyPolicy()
      case 'cookies':
        return renderCookiePolicy()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App
        </Button>
        
        <Card className="p-8">
          {getContent()}
        </Card>
      </div>
    </div>
  )
}