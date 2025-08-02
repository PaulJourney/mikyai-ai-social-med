import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  X, 
  Users, 
  CreditCard, 
  TrendUp, 
  Settings, 
  Download,
  UserCheck,
  UserX,
  Coins,
  ChartLine,
  Handshake,
  ChatCircle,
  Brain,
  ShieldCheck,
  Robot,
  MoneyWavy,
  GlobeHemisphereWest
} from '@phosphor-icons/react'

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock admin data - reflecting actual Miky.ai functionality
  const mockData = {
    overview: {
      totalUsers: 3247,
      activeUsers: 1856,
      totalCreditsUsed: 125430,
      totalConversations: 8940,
      revenue: 28940,
      conversionsThisMonth: 89,
      totalReferrals: 456,
      pendingCashouts: 12
    },
    users: [
      { 
        id: '1', 
        email: 'john.smith@example.com', 
        firstName: 'John', 
        lastName: 'Smith',
        plan: 'plus', 
        credits: 850, 
        status: 'active', 
        joined: '2024-12-15',
        referrals: 3,
        totalSpent: 57,
        language: 'English'
      },
      { 
        id: '2', 
        email: 'maria.garcia@example.com', 
        firstName: 'Maria', 
        lastName: 'Garcia',
        plan: 'free', 
        credits: 45, 
        status: 'active', 
        joined: '2024-12-20',
        referrals: 0,
        totalSpent: 0,
        language: 'Español'
      },
      { 
        id: '3', 
        email: 'support@miky.ai', 
        firstName: 'Test', 
        lastName: 'User',
        plan: 'business', 
        credits: 3200, 
        status: 'active', 
        joined: '2024-11-10',
        referrals: 20,
        totalSpent: 147,
        language: 'English'
      },
    ],
    financials: {
      monthlyRevenue: 28940,
      churnRate: 3.2,
      averageRevenue: 32.50,
      pendingCashouts: 240,
      referralPayouts: 912,
      subscriptions: {
        free: 2189,
        plus: 832,
        business: 226
      },
      creditPurchases: {
        thisMonth: 156,
        totalRevenue: 4320
      }
    },
    personas: {
      usage: {
        general: 2345,
        lawyer: 1234,
        engineer: 987,
        marketer: 856,
        coach: 723,
        medical: 645,
        'god-mode': 234
      },
      avgCreditsPerPersona: {
        general: 1,
        lawyer: 3,
        engineer: 2,
        marketer: 2,
        coach: 2,
        medical: 3,
        'god-mode': 5
      }
    },
    referrals: {
      totalReferrals: 456,
      successfulSignups: 234,
      pendingCashouts: 12,
      totalCashoutRequests: 89,
      averageReferralValue: 2.00
    },
    conversations: {
      total: 8940,
      avgPerUser: 4.8,
      avgLength: 12.3,
      languageDistribution: {
        'English': 7156,
        'Español': 892,
        'Italiano': 456,
        'Deutsch': 234,
        '日本語': 123,
        '한국어': 79
      }
    }
  }

  const handleExportUsers = () => {
    // Mock CSV export with actual user data structure
    const csvContent = 'Email,First Name,Last Name,Plan,Credits,Status,Joined,Referrals,Total Spent,Language\n' + 
      mockData.users.map(u => `${u.email},${u.firstName},${u.lastName},${u.plan},${u.credits},${u.status},${u.joined},${u.referrals},$${u.totalSpent},${u.language}`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miky-users-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleExportConversations = () => {
    // Mock conversation export
    const csvContent = 'Date,User Email,Persona,Messages Count,Credits Used\n' + 
      'Sample conversation data would be here...'
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miky-conversations-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleSuspendUser = (userId: string) => {
    // Mock user suspension
    console.log('Suspending user:', userId)
  }

  const handleResetCredits = (userId: string) => {
    // Mock credit reset
    console.log('Resetting credits for user:', userId)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="personas">Personas</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{mockData.overview.activeUsers.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Used</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalCreditsUsed.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${mockData.overview.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <ChatCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Conversations</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalConversations.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold">{mockData.overview.conversionsThisMonth}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-bold">{mockData.overview.totalReferrals}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MoneyWavy className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                    <p className="text-2xl font-bold">{mockData.overview.pendingCashouts}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start" onClick={handleExportUsers}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Users
                </Button>
                <Button variant="outline" className="justify-start" onClick={handleExportConversations}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Conversations
                </Button>
                <Button variant="outline" className="justify-start">
                  <ChartLine className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">User Management</h2>
              <div className="flex gap-2">
                <Button onClick={handleExportUsers} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.plan === 'free' ? 'secondary' : user.plan === 'plus' ? 'default' : 'destructive'}>
                          {user.plan.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.credits}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.referrals}</TableCell>
                      <TableCell>${user.totalSpent}</TableCell>
                      <TableCell>{user.language}</TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleResetCredits(user.id)}>
                            Reset Credits
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <h2 className="text-lg font-medium">Financial Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${mockData.financials.monthlyRevenue.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold">{mockData.financials.churnRate}%</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Avg Revenue/User</p>
                <p className="text-2xl font-bold">${mockData.financials.averageRevenue}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                <p className="text-2xl font-bold">${mockData.financials.pendingCashouts}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Subscription Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.financials.subscriptions).map(([plan, count]) => (
                    <div key={plan} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{plan}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan === 'free' ? 'secondary' : 'default'}>
                          {count} users
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {((count / Object.values(mockData.financials.subscriptions).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Credit Purchases</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-medium">{mockData.financials.creditPurchases.thisMonth} purchases</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">${mockData.financials.creditPurchases.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Payouts</span>
                    <span className="font-medium">${mockData.financials.referralPayouts}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personas" className="space-y-6">
            <h2 className="text-lg font-medium">AI Personas Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Usage by Persona</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.personas.usage).map(([persona, usage]) => (
                    <div key={persona} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-primary" />
                        <span className="capitalize">{persona === 'god-mode' ? 'God Mode' : persona}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>{usage} conversations</Badge>
                        <span className="text-sm text-muted-foreground">
                          {mockData.personas.avgCreditsPerPersona[persona as keyof typeof mockData.personas.avgCreditsPerPersona]} credits avg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Persona Settings</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Configure AI model routing and credit costs for each persona</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Robot className="w-4 h-4 mr-2" />
                      Configure AI Models
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Coins className="w-4 h-4 mr-2" />
                      Adjust Credit Costs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Manage Restrictions
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <h2 className="text-lg font-medium">Referral Program Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Handshake className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-bold">{mockData.referrals.totalReferrals}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Successful Signups</p>
                    <p className="text-2xl font-bold">{mockData.referrals.successfulSignups}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <MoneyWavy className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Cashouts</p>
                    <p className="text-2xl font-bold">{mockData.referrals.pendingCashouts}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Referral Value</p>
                    <p className="text-2xl font-bold">${mockData.referrals.averageReferralValue}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Referral Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Referral Reward (per signup)</label>
                    <Input defaultValue="$2.00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bonus Credits for Invitee</label>
                    <Input defaultValue="300" className="mt-1" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Cashout</label>
                    <Input defaultValue="$10.00" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PayPal Processing Fee</label>
                    <Input defaultValue="2.9%" className="mt-1" />
                  </div>
                </div>
              </div>
              <Button className="mt-4">Update Settings</Button>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <h2 className="text-lg font-medium">Conversation Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <ChatCircle className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Conversations</p>
                    <p className="text-2xl font-bold">{mockData.conversations.total.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per User</p>
                    <p className="text-2xl font-bold">{mockData.conversations.avgPerUser}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Length</p>
                    <p className="text-2xl font-bold">{mockData.conversations.avgLength} messages</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <GlobeHemisphereWest className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Languages</p>
                    <p className="text-2xl font-bold">{Object.keys(mockData.conversations.languageDistribution).length}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Language Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(mockData.conversations.languageDistribution).map(([language, count]) => (
                    <div key={language} className="flex justify-between items-center">
                      <span>{language}</span>
                      <div className="flex items-center gap-2">
                        <Badge>{count} conversations</Badge>
                        <span className="text-sm text-muted-foreground">
                          {((count / mockData.conversations.total) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Conversation Management</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportConversations}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Conversation Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ChartLine className="w-4 h-4 mr-2" />
                    Generate Usage Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Review Flagged Content
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <h2 className="text-lg font-medium">Content Management</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Homepage Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Main Title</label>
                  <Input defaultValue="Ask to Miky" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Persona Section Title</label>
                  <Input defaultValue="Choose Your Ultra‑Skilled AI Persona:" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Upgrade Message</label>
                  <Input defaultValue="Upgrade to unlock Medical Advisor and God Mode personas" className="mt-1" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Persona Descriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Lawyer</label>
                  <Input defaultValue="Legal advice and contract help" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Engineer</label>
                  <Input defaultValue="Technical help and code review" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Marketer</label>
                  <Input defaultValue="Brand growth and marketing plans" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Coach</label>
                  <Input defaultValue="Personal goals and life coaching" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Medical Advisor</label>
                  <Input defaultValue="Health tips and wellness support" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">God Mode</label>
                  <Input defaultValue="Uncover the purpose of existence" className="mt-1" />
                </div>
              </div>
              <Button className="mt-4">Update Descriptions</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Pricing Page Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Free Plan Credits</label>
                  <Input defaultValue="100" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Plus Plan Price</label>
                  <Input defaultValue="19" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Business Plan Price</label>
                  <Input defaultValue="49" type="number" className="mt-1" />
                </div>
                <Button>Update Pricing</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Legal Pages</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Legal pages are automatically generated based on company information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company Name</label>
                    <Input defaultValue="Neuronica Srl" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Email</label>
                    <Input defaultValue="support@miky.ai" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company Address</label>
                    <Input defaultValue="Via del Serrone 62, 47890 Repubblica di San Marino" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Country</label>
                    <Input defaultValue="Repubblica di San Marino" className="mt-1" />
                  </div>
                </div>
                <Button>Update Legal Info</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-lg font-medium">System Settings</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">AI Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <Input type="password" placeholder="sk-..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Default AI Model</label>
                  <Input defaultValue="gpt-4o" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Fallback Model</label>
                  <Input defaultValue="gpt-4o-mini" className="mt-1" />
                </div>
                <Button>Update AI Settings</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Payment Integration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Stripe Public Key</label>
                  <Input type="password" placeholder="pk_..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stripe Secret Key</label>
                  <Input type="password" placeholder="sk_..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stripe Webhook Secret</label>
                  <Input type="password" placeholder="whsec_..." className="mt-1" />
                </div>
                <Button>Update Payment Settings</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Feature Configuration</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Voice Input</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Upload</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>God Mode</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Referral Program</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multilingual Support</span>
                  <Badge variant="default">6 Languages</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Verification</span>
                  <Badge variant="default">Required</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Credit System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">General Chat Cost</label>
                  <Input defaultValue="1" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Lawyer/Medical Cost</label>
                  <Input defaultValue="3" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Engineer/Marketer/Coach Cost</label>
                  <Input defaultValue="2" type="number" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">God Mode Cost</label>
                  <Input defaultValue="5" type="number" className="mt-1" />
                </div>
              </div>
              <Button className="mt-4">Update Credit Costs</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}