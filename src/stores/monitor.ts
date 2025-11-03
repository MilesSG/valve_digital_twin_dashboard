import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDevices, getAlarms, getTrendData, getStats } from '@/api/monitor'
import type { Device, Alarm, TrendData, Stats } from '@/types'

export const useMonitorStore = defineStore('monitor', () => {
  // 状态
  const devices = ref<Device[]>([])
  const alarms = ref<Alarm[]>([])
  const trendData = ref<TrendData | null>(null)
  const stats = ref<Stats | null>(null)
  const loading = ref(false)
  const lastUpdateTime = ref<Date>(new Date())

  // 计算属性
  const normalDevices = computed(() => 
    devices.value.filter(d => d.status === 'normal').length
  )
  
  const warningDevices = computed(() => 
    devices.value.filter(d => d.status === 'warning').length
  )
  
  const errorDevices = computed(() => 
    devices.value.filter(d => d.status === 'error').length
  )
  
  const offlineDevices = computed(() => 
    devices.value.filter(d => d.status === 'offline').length
  )

  // 按区域分组
  const devicesByZone = computed(() => {
    const grouped: Record<string, Device[]> = {}
    devices.value.forEach(device => {
      if (!grouped[device.zone]) {
        grouped[device.zone] = []
      }
      grouped[device.zone].push(device)
    })
    return grouped
  })

  // 按类型分组
  const devicesByType = computed(() => {
    const grouped: Record<string, number> = {}
    devices.value.forEach(device => {
      grouped[device.type] = (grouped[device.type] || 0) + 1
    })
    return grouped
  })

  // 获取设备详情
  function getDeviceById(id: string): Device | undefined {
    return devices.value.find(d => d.id === id)
  }

  // 加载数据
  async function loadData() {
    loading.value = true
    try {
      const [devicesData, alarmsData, trendDataData, statsData] = await Promise.all([
        getDevices(),
        getAlarms(20),
        getTrendData(),
        getStats()
      ])
      
      devices.value = devicesData
      alarms.value = alarmsData
      trendData.value = trendDataData
      stats.value = statsData
      lastUpdateTime.value = new Date()
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  async function refreshData() {
    await loadData()
  }

  return {
    // 状态
    devices,
    alarms,
    trendData,
    stats,
    loading,
    lastUpdateTime,
    // 计算属性
    normalDevices,
    warningDevices,
    errorDevices,
    offlineDevices,
    devicesByZone,
    devicesByType,
    // 方法
    getDeviceById,
    loadData,
    refreshData
  }
})
