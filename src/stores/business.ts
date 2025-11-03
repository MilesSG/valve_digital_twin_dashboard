import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProducts, getOrders, getRegionSales, getCustomers, getSalesTrend, getDashboardStats } from '@/api/business'
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
