import type { Device, Alarm, TrendData, Stats } from '@/types'
import { generateDevices, generateAlarms, generateTrendData, generateStats } from '@/mock/data'

// Mock API实现 - 模拟异步请求
function mockRequest<T>(data: T, delay = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

// 获取所有设备
export function getDevices(): Promise<Device[]> {
  return mockRequest(generateDevices())
}

// 获取告警列表
export function getAlarms(limit = 20): Promise<Alarm[]> {
  return mockRequest(generateAlarms(limit))
}

// 获取趋势数据
export function getTrendData(): Promise<TrendData> {
  return mockRequest(generateTrendData())
}

// 获取统计数据
export function getStats(): Promise<Stats> {
  return mockRequest(generateStats())
}
