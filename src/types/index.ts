// 产品相关类型
export interface Product {
  id: string
  name: string
  category: string
  image?: string
  price: number
  sales: number
  stock: number
  description?: string
}

export type ProductCategory = '调节阀' | '截止阀' | '球阀' | '闸阀' | '蝶阀' | '安全阀' | '止回阀' | '减压阀'

// 订单相关类型
export interface Order {
  id: string
  customerName: string
  productName: string
  amount: number
  quantity: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  orderDate: Date
  region: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

// 区域销售数据
export interface RegionSales {
  region: string
  province: string
  sales: number
  orders: number
  growth: number
  coordinates: [number, number] // [经度, 纬度]
}

// 客户数据
export interface Customer {
  id: string
  name: string
  region: string
  industry: string
  totalOrders: number
  totalAmount: number
  level: 'VIP' | 'A' | 'B' | 'C'
}

// 销售趋势数据
export interface SalesTrend {
  date: string
  sales: number
  orders: number
  newCustomers: number
}

// 统计数据
export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  totalSales: number
  monthSales: number
  totalCustomers: number
  newCustomers: number
  productTypes: number
  totalProducts: number
  orderGrowth: number
  salesGrowth: number
  customerGrowth: number
}