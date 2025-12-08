import Mock from 'mockjs'

// 生成产品数据
export function generateProducts(count = 30) {
  const categories: Array<'调节阀' | '截止阀' | '球阀' | '闸阀' | '蝶阀' | '安全阀' | '止回阀' | '减压阀'> = 
    ['调节阀', '截止阀', '球阀', '闸阀', '蝶阀', '安全阀', '止回阀', '减压阀']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `P${String(i + 1).padStart(4, '0')}`,
    name: `${categories[i % categories.length]}-${Mock.Random.string('upper', 2, 4)}系列`,
    category: categories[i % categories.length],
    price: Mock.Random.integer(500, 50000),
    sales: Mock.Random.integer(100, 5000),
    stock: Mock.Random.integer(50, 1000),
    description: Mock.Random.cparagraph(1)
  }))
}

// 生成订单数据
export function generateOrders(count = 50) {
  const statuses: Array<'pending' | 'processing' | 'completed' | 'cancelled'> = 
    ['pending', 'processing', 'completed', 'cancelled']
  const regions = ['华东', '华南', '华北', '西南', '东北', '西北', '华中']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD${String(i + 1).padStart(6, '0')}`,
    customerName: Mock.Random.cname() + '有限公司',
    productName: Mock.Random.pick(['调节阀', '截止阀', '球阀', '闸阀', '蝶阀', '安全阀']) + '-系列',
    amount: Mock.Random.integer(10000, 500000),
    quantity: Mock.Random.integer(10, 500),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 3600000),
    region: regions[Math.floor(Math.random() * regions.length)]
  }))
}

// 生成区域销售数据
export function generateRegionSales() {
  const regions = [
    { region: '华东', province: '上海', coordinates: [121.47, 31.23] as [number, number] },
    { region: '华东', province: '江苏', coordinates: [118.78, 32.04] as [number, number] },
    { region: '华东', province: '浙江', coordinates: [120.15, 30.28] as [number, number] },
    { region: '华南', province: '广东', coordinates: [113.26, 23.13] as [number, number] },
    { region: '华南', province: '福建', coordinates: [119.30, 26.08] as [number, number] },
    { region: '华北', province: '北京', coordinates: [116.40, 39.90] as [number, number] },
    { region: '华北', province: '天津', coordinates: [117.20, 39.13] as [number, number] },
    { region: '华北', province: '河北', coordinates: [114.48, 38.03] as [number, number] },
    { region: '西南', province: '四川', coordinates: [104.07, 30.65] as [number, number] },
    { region: '西南', province: '重庆', coordinates: [106.55, 29.56] as [number, number] },
    { region: '东北', province: '辽宁', coordinates: [123.43, 41.80] as [number, number] },
    { region: '东北', province: '吉林', coordinates: [125.32, 43.88] as [number, number] },
    { region: '西北', province: '陕西', coordinates: [108.95, 34.27] as [number, number] },
    { region: '华中', province: '湖北', coordinates: [114.30, 30.60] as [number, number] },
    { region: '华中', province: '湖南', coordinates: [112.98, 28.19] as [number, number] }
  ]
  
  return regions.map(item => ({
    ...item,
    sales: Mock.Random.integer(500000, 5000000),
    orders: Mock.Random.integer(50, 500),
    growth: Mock.Random.float(-10, 50, 1, 1)
  }))
}

// 生成客户数据
export function generateCustomers(count = 100) {
  const industries = ['化工', '石油', '水利', '电力', '冶金', '制药', '食品', '造纸']
  const levels: Array<'VIP' | 'A' | 'B' | 'C'> = ['VIP', 'A', 'B', 'C']
  const regions = ['华东', '华南', '华北', '西南', '东北', '西北', '华中']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `C${String(i + 1).padStart(5, '0')}`,
    name: Mock.Random.cname() + (Mock.Random.boolean() ? '有限公司' : '股份有限公司'),
    region: regions[Math.floor(Math.random() * regions.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    totalOrders: Mock.Random.integer(5, 200),
    totalAmount: Mock.Random.integer(50000, 5000000),
    level: levels[Math.floor(Math.random() * levels.length)]
  }))
}

// 生成销售趋势数据（近30天）
export function generateSalesTrend() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })
  
  return days.map(date => ({
    date,
    sales: Mock.Random.integer(50000, 200000),
    orders: Mock.Random.integer(20, 80),
    newCustomers: Mock.Random.integer(1, 10)
  }))
}

// 生成统计数据
export function generateDashboardStats() {
  return {
    totalOrders: Mock.Random.integer(5000, 10000),
    todayOrders: Mock.Random.integer(20, 100),
    totalSales: Mock.Random.integer(50000000, 100000000),
    monthSales: Mock.Random.integer(5000000, 15000000),
    totalCustomers: Mock.Random.integer(500, 2000),
    newCustomers: Mock.Random.integer(10, 50),
    productTypes: 8,
    totalProducts: 50,
    orderGrowth: Mock.Random.float(5, 25, 1, 1),
    salesGrowth: Mock.Random.float(10, 35, 1, 1),
    customerGrowth: Mock.Random.float(3, 20, 1, 1)
  }
}

// 生成设备数据
export function generateDevices(count = 20) {
  const types = ['调节阀', '截止阀', '球阀', '闸阀', '蝶阀', '安全阀']
  const zones = ['生产区A', '生产区B', '生产区C', '仓储区', '包装区']
  const statuses: Array<'normal' | 'warning' | 'error' | 'offline'> = ['normal', 'warning', 'error', 'offline']

  return Array.from({ length: count }, (_, i) => ({
    id: `DEV${String(i + 1).padStart(4, '0')}`,
    name: `${types[i % types.length]}-${String(i + 1).padStart(2, '0')}`,
    type: types[i % types.length],
    zone: zones[i % zones.length],
    status: statuses[i % 4 === 0 ? 3 : i % 4 === 1 ? 2 : i % 4 === 2 ? 1 : 0],
    temperature: Mock.Random.float(20, 80, 1, 1),
    pressure: Mock.Random.float(0.1, 2.5, 1, 2),
    flowRate: Mock.Random.float(10, 100, 1, 1),
    power: Mock.Random.float(1, 15, 1, 1),
    efficiency: Mock.Random.float(75, 98, 1, 1),
    runningTime: Mock.Random.integer(1000, 50000),
    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString().split('T')[0],
    nextMaintenance: new Date(Date.now() + Math.random() * 60 * 24 * 3600000).toISOString().split('T')[0]
  }))
}

// 生成告警数据
export function generateAlarms(count = 20) {
  const levels: Array<'info' | 'warning' | 'error' | 'critical'> = ['info', 'warning', 'error', 'critical']
  const statuses: Array<'active' | 'acknowledged' | 'resolved'> = ['active', 'acknowledged', 'resolved']
  const messages = [
    '温度超过阈值',
    '压力异常波动',
    '流量降低',
    '设备效率下降',
    '维护周期临近',
    '设备离线',
    '传感器故障',
    '通信异常'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `ALM${String(i + 1).padStart(6, '0')}`,
    deviceId: `DEV${String(Mock.Random.integer(1, 20)).padStart(4, '0')}`,
    deviceName: `设备-${Mock.Random.integer(1, 20)}`,
    level: levels[i % levels.length],
    message: messages[i % messages.length],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 3600000),
    status: statuses[i % statuses.length],
    handler: i % 3 === 0 ? Mock.Random.cname() : undefined
  }))
}

// 生成趋势数据
export function generateTrendData() {
  const hours = 24
  const now = new Date()

  return {
    timestamps: Array.from({ length: hours }, (_, i) => {
      const date = new Date(now.getTime() - (hours - 1 - i) * 3600000)
      return `${String(date.getHours()).padStart(2, '0')}:00`
    }),
    temperature: Array.from({ length: hours }, () => Mock.Random.float(40, 70, 1, 1)),
    pressure: Array.from({ length: hours }, () => Mock.Random.float(0.8, 1.8, 1, 2)),
    flowRate: Array.from({ length: hours }, () => Mock.Random.float(40, 80, 1, 1)),
    power: Array.from({ length: hours }, () => Mock.Random.float(5, 12, 1, 1)),
    efficiency: Array.from({ length: hours }, () => Mock.Random.float(80, 95, 1, 1))
  }
}

// 生成监控统计数据
export function generateStats() {
  const totalDevices = 20
  const normalDevices = Mock.Random.integer(12, 16)
  const warningDevices = Mock.Random.integer(2, 4)
  const errorDevices = Mock.Random.integer(0, 2)
  const offlineDevices = totalDevices - normalDevices - warningDevices - errorDevices

  return {
    totalDevices,
    normalDevices,
    warningDevices,
    errorDevices,
    offlineDevices,
    activeAlarms: Mock.Random.integer(3, 10),
    totalAlarms: Mock.Random.integer(50, 200),
    avgEfficiency: Mock.Random.float(85, 92, 1, 1),
    totalPower: Mock.Random.float(100, 250, 1, 1),
    totalFlowRate: Mock.Random.float(800, 1500, 1, 1)
  }
}