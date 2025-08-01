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
  Coins
} from '@phosphor-icons/react'

interface AdminDashboardProps {
  onClose: () => void
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock admin data - in real app this would come from API
  const mockData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 856,
      totalCreditsUsed: 45230,
      revenue: 18940,
      conversionRate: 12.3
    },
    users: [
      { id: '1', email: 'user1@example.com', plan: 'plus', credits: 850, status: 'active', joined: '2024-01-15' },
      { id: '2', email: 'user2@example.com', plan: 'free', credits: 45, status: 'active', joined: '2024-01-20' },
      { id: '3', email: 'user3@example.com', plan: 'business', credits: 3200, status: 'suspended', joined: '2024-01-10' },
    ],
    financials: {
      monthlyRevenue: 18940,
      churnRate: 5.2,
      averageRevenue: 24.50,
      subscriptions: {
        free: 1089,
        plus: 132,
        business: 26
      }
    }
  }

  const handleExportUsers = () => {
    // Mock CSV export
    const csvContent = 'Email,Plan,Credits,Status,Joined\n' + 
      mockData.users.map(u => `${u.email},${u.plan},${u.credits},${u.status},${u.joined}`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
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
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="justify-start">
                  <TrendUp className="w-4 h-4 mr-2" />
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
              <Button onClick={handleExportUsers} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.plan === 'free' ? 'secondary' : 'default'}>
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.credits}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Subscription Distribution</h3>
              <div className="space-y-3">
                {Object.entries(mockData.financials.subscriptions).map(([plan, count]) => (
                  <div key={plan} className="flex justify-between items-center">
                    <span className="capitalize">{plan}</span>
                    <Badge>{count} users</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <h2 className="text-lg font-medium">Content Management</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Homepage Text</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Main Headline</label>
                  <Input placeholder="Enter headline..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <Input placeholder="Enter subtitle..." className="mt-1" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Persona Settings</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Configure AI model routing and behavior for each persona</p>
                <Button variant="outline">Manage Personas</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-lg font-medium">System Settings</h2>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">OpenAI API Key</label>
                  <Input type="password" placeholder="sk-..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Stripe Webhook Secret</label>
                  <Input type="password" placeholder="whsec_..." className="mt-1" />
                </div>
                <Button>Update Settings</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Feature Flags</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Voice Input</span>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Upload</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>God Mode</span>
                  <Badge>Enabled</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}