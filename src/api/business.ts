import type { Product, Order, RegionSales, Customer, SalesTrend, DashboardStats } from '@/types'
import { 
  generateProducts, 
  generateOrders, 
  generateRegionSales, 
  generateCustomers, 
  generateSalesTrend,
  generateDashboardStats 
} from '@/mock/data'

// Mock API实现 - 模拟异步请求
function mockRequest<T>(data: T, delay = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

// 获取产品列表
export function getProducts(): Promise<Product[]> {
  return mockRequest(generateProducts())
}

// 获取订单列表
export function getOrders(limit = 50): Promise<Order[]> {
  return mockRequest(generateOrders(limit))
}

// 获取区域销售数据
export function getRegionSales(): Promise<RegionSales[]> {
  return mockRequest(generateRegionSales())
}

// 获取客户列表
export function getCustomers(limit = 100): Promise<Customer[]> {
  return mockRequest(generateCustomers(limit))
}

// 获取销售趋势数据
export function getSalesTrend(): Promise<SalesTrend[]> {
  return mockRequest(generateSalesTrend())
}

// 获取统计数据
export function getDashboardStats(): Promise<DashboardStats> {
  return mockRequest(generateDashboardStats())
}

// ========== 真实数据API（从Excel导入的数据） ==========

/**
 * 从JSON文件读取真实数据
 * 需要先运行 npm run data:import 生成 realtime-data.json
 */
export async function getRealTimeData() {
  try {
    const response = await fetch('/data/realtime-data.json')
    if (!response.ok) {
      throw new Error('数据文件不存在，请先运行 npm run data:import')
    }
    return await response.json()
  } catch (error) {
    console.warn('⚠️ 无法加载真实数据，使用模拟数据', error)
    // 如果真实数据不存在，返回null，让调用方使用mock数据
    return null
  }
}