import { create } from 'zustand'
import type { DashboardStatsResponse } from '@/types/dashboard'

interface DashboardState {
  stats: DashboardStatsResponse | null
  isLoading: boolean
  error: string | null
  fetchStats: () => Promise<void>
  reset: () => void
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch('/api/v1/user/stats/dashboard')
      if (res.status === 401) {
        set({ error: 'unauthorized' })
        return
      }
      const data = await res.json()
      if (data.success) {
        set({ stats: data.data })
      } else {
        set({ error: data.error?.message ?? 'Failed to fetch dashboard stats' })
      }
    } catch {
      set({ error: 'Failed to fetch dashboard stats' })
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () => set({ stats: null, isLoading: false, error: null }),
}))
