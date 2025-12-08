import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProducts, getOrders, getRegionSales, getCustomers, getSalesTrend, getDashboardStats, getRealTimeData } from '@/api/business'
import type { Product, Order, RegionSales, Customer, SalesTrend, DashboardStats } from '@/types'

export const useBusinessStore = defineStore('business', () => {
  // 状态
  const products = ref<Product[]>([])
  const orders = ref<Order[]>([])
  const regionSales = ref<RegionSales[]>([])
  const customers = ref<Customer[]>([])
  const salesTrend = ref<SalesTrend[]>([])
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const lastUpdateTime = ref<Date>(new Date())

  // 计算属性 - 产品分类统计
  const productsByCategory = computed(() => {
    const grouped: Record<string, number> = {}
    products.value.forEach(product => {
      grouped[product.category] = (grouped[product.category] || 0) + 1
    })
    return grouped
  })

  // 计算属性 - 产品销量排行
  const topProducts = computed(() => {
    return [...products.value]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
  })

  // 计算属性 - 订单状态统计
  const ordersByStatus = computed(() => {
    const grouped: Record<string, number> = {}
    orders.value.forEach(order => {
      grouped[order.status] = (grouped[order.status] || 0) + 1
    })
    return grouped
  })

  // 计算属性 - 区域销售排行
  const topRegions = computed(() => {
    return [...regionSales.value]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
  })

  // 计算属性 - VIP客户
  const vipCustomers = computed(() => {
    return customers.value.filter(c => c.level === 'VIP')
  })

  // 加载数据
  async function loadData() {
    loading.value = true
    try {
      // 首先尝试加载真实数据（从Excel导入的）
      const realData = await getRealTimeData()
      
      if (realData && realData.dataSource) {
        console.log('✅ 使用真实数据:', realData.dataSource, realData.updateTime)
        // 使用真实数据
        loadRealData(realData)
      } else {
        console.log('📊 使用模拟数据（Demo）')
        // 使用模拟数据
        await loadMockData()
      }
      
      lastUpdateTime.value = new Date()
    } catch (error) {
      console.error('加载数据失败:', error)
      // 出错时使用模拟数据
      await loadMockData()
    } finally {
      loading.value = false
    }
  }
  
  // 加载真实数据（从Excel导入）
  function loadRealData(data: any) {
    // 订单数据
    if (data.orders) {
      // 转换为系统需要的格式
      const orderList: Order[] = data.orders.trend?.map((item: any, index: number) => ({
        id: `ORDER-${index + 1}`,
        orderNo: `SO${item.date.replace(/-/g, '')}${String(index + 1).padStart(3, '0')}`,
        customer: '客户' + (index % 10 + 1),
        amount: item.amount || 0,
        status: index % 4 === 0 ? 'completed' : index % 4 === 1 ? 'processing' : index % 4 === 2 ? 'pending' : 'cancelled',
        date: item.date,
        product: '阀门产品'
      })) || []
      orders.value = orderList
    }
    
    // 生产数据转换为产品数据
    if (data.production && Array.isArray(data.production)) {
      products.value = data.production.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        category: item.name,
        price: 0,
        sales: item.output || 0,
        inventory: item.output || 0,
        status: item.status === 'running' ? 'normal' : 'warning'
      }))
    }
    
    // 客户数据
    if (data.customers && Array.isArray(data.customers)) {
      customers.value = data.customers.map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        contact: item.contact || '',
        phone: '',
        amount: item.amount || 0,
        orders: item.orderCount || 0,
        level: item.level || 'C',
        region: '华东'
      }))
    }
    
    // 销售趋势
    if (data.orders?.trend) {
      salesTrend.value = data.orders.trend.map((item: any) => ({
        date: item.date,
        sales: item.amount || 0,
        orders: item.count || 0
      }))
    }
    
    // 统计数据
    stats.value = {
      totalOrders: data.orders?.total || 0,
      todayOrders: 0,
      totalSales: data.orders?.trend?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0,
      monthSales: 0,
      totalCustomers: data.customers?.length || 0,
      newCustomers: 0,
      productTypes: 8,
      totalProducts: 50,
      totalProduction: data.production?.reduce((sum: number, item: any) => sum + (item.output || 0), 0) || 0,
      orderGrowth: 0,
      salesGrowth: 0,
      productionGrowth: 0,
      customerGrowth: 0
    }
    
    // 区域销售（暂时使用模拟数据）
    const totalSales = stats.value?.totalSales || 0
    const totalOrders = stats.value?.totalOrders || 0

    regionSales.value = [
      {
        region: '华东',
        province: '上海',
        sales: totalSales * 0.35,
        orders: totalOrders * 0.35,
        growth: 15.5,
        coordinates: [121.47, 31.23] as [number, number]
      },
      {
        region: '华北',
        province: '北京',
        sales: totalSales * 0.25,
        orders: totalOrders * 0.25,
        growth: 12.3,
        coordinates: [116.40, 39.90] as [number, number]
      },
      {
        region: '华南',
        province: '广东',
        sales: totalSales * 0.20,
        orders: totalOrders * 0.20,
        growth: 18.7,
        coordinates: [113.26, 23.13] as [number, number]
      },
      {
        region: '华中',
        province: '湖北',
        sales: totalSales * 0.12,
        orders: totalOrders * 0.12,
        growth: 10.2,
        coordinates: [114.30, 30.60] as [number, number]
      },
      {
        region: '西南',
        province: '四川',
        sales: totalSales * 0.08,
        orders: totalOrders * 0.08,
        growth: 8.9,
        coordinates: [104.07, 30.65] as [number, number]
      }
    ]
  }
  
  // 加载模拟数据
  async function loadMockData() {
    const [productsData, ordersData, regionData, customersData, trendData, statsData] = await Promise.all([
      getProducts(),
      getOrders(50),
      getRegionSales(),
      getCustomers(100),
      getSalesTrend(),
      getDashboardStats()
    ])
    
    products.value = productsData
    orders.value = ordersData
    regionSales.value = regionData
    customers.value = customersData
    salesTrend.value = trendData
    stats.value = statsData
  }

  // 刷新数据
  async function refreshData() {
    await loadData()
  }

  return {
    // 状态
    products,
    orders,
    regionSales,
    customers,
    salesTrend,
    stats,
    loading,
    lastUpdateTime,
    // 计算属性
    productsByCategory,
    topProducts,
    ordersByStatus,
    topRegions,
    vipCustomers,
    // 方法
    loadData,
    refreshData
  }
})
