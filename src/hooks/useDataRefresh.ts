import { onMounted, onUnmounted } from 'vue'
import { useBusinessStore } from '@/stores/business'

export function useDataRefresh(interval = 5000) {
  const store = useBusinessStore()

  let refreshTimer: ReturnType<typeof setInterval> | null = null

  function startRefresh() {
    refreshTimer = setInterval(() => {
      store.refreshData()
    }, interval)
  }

  function stopRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  onMounted(() => {
    store.loadData()
    startRefresh()
  })

  onUnmounted(() => {
    stopRefresh()
  })

  return {
    startRefresh,
    stopRefresh,
    refresh: store.refreshData
  }
}