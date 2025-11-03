/**
 * 真实API对接版本
 * 当 VITE_USE_MOCK=false 时，使用此文件的实现
 */

import axios from 'axios'
import type { Product, Order, Customer, SalesTrend, DashboardStats } from '@/types'
import { 
  generateProducts, 
  generateOrders, 
  generateCustomers, 
  generateSalesTrend,
  generateDashboardStats 
} from '@/mock/data'

// ============ 配置 ============
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')

console.log('🔧 API配置:', {
  useMock: USE_MOCK,
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
})

// ============ Axios实例 ============
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ============ 请求拦截器 ============
apiClient.interceptors.request.use(
  (config) => {
    // 1. 添加Token认证
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. 添加时间戳（防止缓存）
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 3. 日志记录
    console.log(`📤 API请求: ${config.method?.toUpperCase()} ${config.url}`, config.params)

    return config
  },
  (error) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// ============ 响应拦截器 ============
apiClient.interceptors.response.use(
  (response) => {
    // 假设后端返回格式: { code: 200, data: {...}, message: 'success' }
    const { code, data, message } = response.data

    console.log(`📥 API响应: ${response.config.url}`, { code, message })

    if (code === 200 || code === 0) {
      return data
    } else {
      console.error('API返回错误:', message)
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response
      console.error(`❌ HTTP ${status}:`, data?.message || error.message)

      if (status === 401) {
        // Token过期，跳转登录
        console.warn('Token已过期，请重新登录')
        // router.push('/login')
      } else if (status === 403) {
        console.error('没有权限访问')
      } else if (status === 404) {
        console.error('API接口不存在')
      } else if (status >= 500) {
        console.error('服务器错误，请稍后重试')
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('❌ 网络错误，无法连接服务器')
    } else {
      console.error('❌ 请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }
)

// ============ Mock模拟请求 ============
function mockRequest<T>(data: T, delay = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🎭 Mock数据返回:', data)
      resolve(data)
    }, delay)
  })
}

// ============ API函数 ============

/**
 * 获取产品列表
 * GET /api/products
 */
export function getProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    return mockRequest(generateProducts())
  }
  return apiClient.get('/products')
}

/**
 * 获取订单列表
 * GET /api/orders?limit=50
 */
export function getOrders(limit = 50): Promise<Order[]> {
  if (USE_MOCK) {
    return mockRequest(generateOrders(limit))
  }
  return apiClient.get('/orders', { 
    params: { limit } 
  })
}

/**
 * 获取客户列表
 * GET /api/customers?limit=100
 */
export function getCustomers(limit = 100): Promise<Customer[]> {
  if (USE_MOCK) {
    return mockRequest(generateCustomers(limit))
  }
  return apiClient.get('/customers', { 
    params: { limit } 
  })
}

/**
 * 获取销售趋势（30天）
 * GET /api/sales/trend?days=30
 */
export function getSalesTrend(days = 30): Promise<SalesTrend[]> {
  if (USE_MOCK) {
    return mockRequest(generateSalesTrend())
  }
  return apiClient.get('/sales/trend', { 
    params: { days } 
  })
}

/**
 * 获取仪表盘统计数据
 * GET /api/dashboard/stats
 */
export function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) {
    return mockRequest(generateDashboardStats())
  }
  return apiClient.get('/dashboard/stats')
}

/**
 * 获取生产线实时状态
 * GET /api/production/lines
 */
export function getProductionLines() {
  if (USE_MOCK) {
    return mockRequest([
      { name: '闸阀生产线', output: 98, target: 120, status: 'running', efficiency: 81.7 },
      { name: '球阀生产线', output: 156, target: 150, status: 'running', efficiency: 104.0 },
      { name: '蝶阀生产线', output: 132, target: 140, status: 'running', efficiency: 94.3 },
      { name: '截止阀生产线', output: 45, target: 100, status: 'maintenance', efficiency: 45.0 },
      { name: '止回阀生产线', output: 149, target: 130, status: 'running', efficiency: 114.6 }
    ])
  }
  return apiClient.get('/production/lines')
}

/**
 * 获取质量统计数据（24小时）
 * GET /api/quality/statistics
 */
export function getQualityStatistics() {
  if (USE_MOCK) {
    return mockRequest({
      qualifiedRate: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        rate: 92 + Math.random() * 6
      })),
      defectRate: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        rate: 2 + Math.random() * 4
      }))
    })
  }
  return apiClient.get('/quality/statistics')
}

/**
 * 获取区域销售数据
 * GET /api/sales/region
 */
export function getRegionSales() {
  if (USE_MOCK) {
    const regions = ['华东', '华南', '华北', '西南', '东北', '西北', '华中']
    return mockRequest(
      regions.map(region => ({
        region,
        sales: Math.floor(Math.random() * 500000) + 100000,
        orders: Math.floor(Math.random() * 200) + 50,
        growth: (Math.random() * 30 - 10).toFixed(1)
      }))
    )
  }
  return apiClient.get('/sales/region')
}

/**
 * 获取订单趋势（7天）
 * GET /api/orders/trend?days=7
 */
export function getOrderTrend(days = 7) {
  if (USE_MOCK) {
    return mockRequest(
      Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - 1 - i))
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 50) + 30
        }
      })
    )
  }
  return apiClient.get('/orders/trend', { params: { days } })
}

// ============ 导出axios实例（供其他模块使用） ============
export { apiClient }

// ============ 健康检查 ============
export async function healthCheck() {
  try {
    const response = await apiClient.get('/health')
    console.log('✅ API服务器健康检查通过')
    return response
  } catch (error) {
    console.error('❌ API服务器连接失败')
    throw error
  }
}

