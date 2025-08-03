// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.error || 'Request failed', errorData)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, 'Network error occurred')
  }
}

// Auth API
export const authApi = {
  signIn: async (credentials: { email: string; password: string }) => {
    return apiCall<{ user: any; token: string; refreshToken: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  signUp: async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    referralCode?: string
  }) => {
    return apiCall<{ user: any; token: string; refreshToken: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  verifyEmail: async (token: string) => {
    return apiCall<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  },

  forgotPassword: async (email: string) => {
    return apiCall<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, password: string) => {
    return apiCall<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  },

  refreshToken: async (refreshToken: string) => {
    return apiCall<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },
}

// Chat API
export const chatApi = {
  sendMessage: async (data: {
    message: string
    persona: string
    conversationId?: string
  }) => {
    return apiCall<{
      conversation: any
      creditsConsumed: number
      remainingCredits: number
      message: any
    }>('/chat/send', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Conversations API
export const conversationsApi = {
  getAll: async (page = 1, limit = 20, persona?: string, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(persona && { persona }),
      ...(search && { search }),
    })
    
    return apiCall<{
      conversations: any[]
      total: number
      page: number
      totalPages: number
    }>(`/conversations?${params}`)
  },

  getById: async (id: string) => {
    return apiCall<{ conversation: any }>(`/conversations/${id}`)
  },

  update: async (id: string, updates: { title?: string }) => {
    return apiCall<{ conversation: any }>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string) => {
    return apiCall<{ message: string }>(`/conversations/${id}`, {
      method: 'DELETE',
    })
  },
}

// User API
export const userApi = {
  getProfile: async () => {
    return apiCall<{ user: any }>('/user/profile')
  },

  updateProfile: async (updates: Partial<{
    firstName: string
    lastName: string
    language: string
  }>) => {
    return apiCall<{ user: any }>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  updateCredits: async (credits: number) => {
    return apiCall<{ user: any }>('/user/credits', {
      method: 'PATCH',
      body: JSON.stringify({ credits }),
    })
  },
}

// Payments API
export const paymentsApi = {
  createSubscription: async (planId: string) => {
    return apiCall<{ clientSecret: string; subscriptionId: string }>('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    })
  },

  purchaseCredits: async (amount: number) => {
    return apiCall<{ clientSecret: string; paymentIntentId: string }>('/payments/purchase-credits', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },

  getBillingInfo: async () => {
    return apiCall<{ subscription: any; paymentMethods: any[] }>('/payments/billing-info')
  },
}

// Referrals API
export const referralsApi = {
  getStats: async () => {
    return apiCall<{
      referralCode: string
      referralsCount: number
      cashEarned: number
      canCashOut: boolean
    }>('/referrals/stats')
  },

  requestCashout: async (paymentDetails: {
    paypalEmail: string
    firstName: string
    lastName: string
  }) => {
    return apiCall<{ message: string }>('/referrals/cashout', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    })
  },
}

// Admin API
export const adminApi = {
  login: async (password: string) => {
    return apiCall<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  getStats: async () => {
    return apiCall<{
      users: { total: number; thisMonth: number }
      conversations: { total: number; thisMonth: number }
      revenue: { total: number; thisMonth: number }
      activeSubscriptions: number
    }>('/admin/stats')
  },

  getUsers: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    return apiCall<{
      users: any[]
      total: number
      page: number
      totalPages: number
    }>(`/admin/users?${params}`)
  },

  updateUser: async (userId: string, updates: any) => {
    return apiCall<{ user: any }>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  getSettings: async () => {
    return apiCall<{ settings: Record<string, any> }>('/admin/settings')
  },

  updateSettings: async (settings: Record<string, any>) => {
    return apiCall<{ settings: Record<string, any> }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    })
  },
}

export { ApiError }