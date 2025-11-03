/**
 * 简易后端API服务
 * 提供数据接口给前端大屏调用
 * 
 * 功能：
 * 1. 读取JSON数据文件
 * 2. 提供RESTful API
 * 3. 支持CORS跨域
 * 4. 自动刷新数据
 * 
 * 启动：node scripts/setup-backend.js
 * 访问：http://localhost:3001/api/data
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, '../public/data/realtime-data.json');

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json());

// 内存缓存
let cachedData = null;
let lastUpdate = null;

/**
 * 读取数据文件
 */
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      cachedData = JSON.parse(fileContent);
      lastUpdate = new Date();
      console.log(`✅ 数据加载成功 (${lastUpdate.toLocaleString()})`);
      return cachedData;
    } else {
      console.warn('⚠️  数据文件不存在，返回模拟数据');
      return getMockData();
    }
  } catch (error) {
    console.error('❌ 数据加载失败:', error.message);
    return getMockData();
  }
}

/**
 * 模拟数据（当文件不存在时）
 */
function getMockData() {
  return {
    orders: {
      total: 686,
      completed: 458,
      processing: 142,
      pending: 72,
      cancelled: 14,
      trend: []
    },
    production: [
      { name: '闸阀生产线', output: 120, qualifiedRate: 96.5, status: 'running' },
      { name: '球阀生产线', output: 98, qualifiedRate: 94.2, status: 'running' },
      { name: '蝶阀生产线', output: 115, qualifiedRate: 97.1, status: 'running' },
      { name: '截止阀生产线', output: 87, qualifiedRate: 95.8, status: 'running' },
      { name: '止回阀生产线', output: 102, qualifiedRate: 96.3, status: 'running' }
    ],
    customers: [
      { name: '上海华东石化', amount: 1250000, level: 'VIP', orderCount: 45 },
      { name: '江苏长江电力', amount: 980000, level: 'A', orderCount: 38 },
      { name: '浙江能源集团', amount: 850000, level: 'A', orderCount: 32 }
    ],
    quality: {
      qualifiedRate: 95.8,
      defectRate: 4.2,
      trend: []
    },
    updateTime: new Date().toISOString(),
    dataSource: '模拟数据'
  };
}

// ============= API路由 =============

/**
 * 获取所有数据
 */
app.get('/api/data', (req, res) => {
  const data = cachedData || loadData();
  res.json({
    success: true,
    data,
    lastUpdate,
    message: '数据获取成功'
  });
});

/**
 * 获取订单统计
 */
app.get('/api/orders', (req, res) => {
  const data = cachedData || loadData();
  res.json({
    success: true,
    data: data.orders
  });
});

/**
 * 获取生产数据
 */
app.get('/api/production', (req, res) => {
  const data = cachedData || loadData();
  res.json({
    success: true,
    data: data.production
  });
});

/**
 * 获取客户数据
 */
app.get('/api/customers', (req, res) => {
  const data = cachedData || loadData();
  res.json({
    success: true,
    data: data.customers
  });
});

/**
 * 获取质检数据
 */
app.get('/api/quality', (req, res) => {
  const data = cachedData || loadData();
  res.json({
    success: true,
    data: data.quality
  });
});

/**
 * 获取系统状态
 */
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    lastUpdate,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

/**
 * 手动刷新数据
 */
app.post('/api/refresh', (req, res) => {
  console.log('🔄 手动刷新数据...');
  loadData();
  res.json({
    success: true,
    message: '数据刷新成功',
    lastUpdate
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

// ============= 启动服务 =============

// 初始加载数据
loadData();

// 定时刷新（每5分钟）
setInterval(() => {
  console.log('⏰ 定时刷新数据...');
  loadData();
}, 5 * 60 * 1000);

// 监听文件变化（开发模式）
if (process.env.NODE_ENV !== 'production') {
  fs.watch(DATA_FILE, (eventType) => {
    if (eventType === 'change') {
      console.log('📁 数据文件变化，重新加载...');
      loadData();
    }
  });
}

// 启动HTTP服务
app.listen(PORT, () => {
  console.log('\n🚀 后端API服务启动成功！\n');
  console.log(`   访问地址: http://localhost:${PORT}`);
  console.log(`   API文档: http://localhost:${PORT}/api/data`);
  console.log(`   系统状态: http://localhost:${PORT}/api/status\n`);
  console.log('📡 可用接口:');
  console.log('   GET  /api/data       - 获取所有数据');
  console.log('   GET  /api/orders     - 获取订单数据');
  console.log('   GET  /api/production - 获取生产数据');
  console.log('   GET  /api/customers  - 获取客户数据');
  console.log('   GET  /api/quality    - 获取质检数据');
  console.log('   GET  /api/status     - 获取系统状态');
  console.log('   POST /api/refresh    - 手动刷新数据\n');
  console.log('按 Ctrl+C 停止服务\n');
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭服务...');
  process.exit(0);
});

