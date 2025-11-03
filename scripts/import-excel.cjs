/**
 * Excel数据导入脚本 (CommonJS版本)
 * 用于将Excel数据转换为系统可用的JSON格式
 * 
 * 使用方法：
 * 1. 安装依赖：npm install xlsx
 * 2. 准备好Excel文件放在 data/ 目录
 * 3. 运行：npm run data:import
 * 4. 生成的JSON会保存到 public/data/ 目录
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  dataDir: './data',           // Excel文件目录
  outputDir: './public/data',  // 输出JSON目录
  files: {
    orders: '订单数据.xlsx',
    production: '生产数据.xlsx',
    customers: '客户数据.xlsx',
    quality: '质检数据.xlsx'
  }
};

/**
 * 读取Excel文件转为JSON
 */
function readExcelToJSON(filePath, sheetName = null) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  文件不存在: ${filePath}`);
      return [];
    }
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error(`❌ 读取文件失败: ${filePath}`, error.message);
    return [];
  }
}

/**
 * 处理订单数据
 */
function processOrders(data) {
  if (!data || data.length === 0) {
    console.warn('⚠️  订单数据为空，使用默认值');
    return {
      total: 0,
      completed: 0,
      processing: 0,
      pending: 0,
      cancelled: 0,
      trend: []
    };
  }

  // 统计
  const stats = {
    total: data.length,
    completed: 0,
    processing: 0,
    pending: 0,
    cancelled: 0
  };

  // 按日期汇总（最近30天）
  const trendMap = new Map();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  data.forEach(row => {
    // 统计状态 - 支持中英文
    const status = (row['状态'] || row['status'] || 'pending').toLowerCase();
    const statusMap = {
      'completed': 'completed',
      '已完成': 'completed',
      'processing': 'processing',
      '处理中': 'processing',
      'pending': 'pending',
      '待处理': 'pending',
      'cancelled': 'cancelled',
      '已取消': 'cancelled'
    };
    const mappedStatus = statusMap[status] || 'pending';
    if (stats[mappedStatus] !== undefined) {
      stats[mappedStatus]++;
    }

    // 趋势数据
    const dateStr = row['日期'] || row['订单日期'] || row['date'];
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime()) && date >= thirtyDaysAgo) {
        const key = date.toISOString().split('T')[0];
        if (!trendMap.has(key)) {
          trendMap.set(key, { date: key, count: 0, amount: 0 });
        }
        const trend = trendMap.get(key);
        trend.count++;
        trend.amount += parseFloat(row['金额'] || row['amount'] || 0);
      }
    }
  });

  // 转为数组并排序
  const trend = Array.from(trendMap.values())
    .sort((a, b) => a.date.localeCompare(b.date));

  console.log(`   ├─ 总订单: ${stats.total}`);
  console.log(`   ├─ 已完成: ${stats.completed}`);
  console.log(`   ├─ 处理中: ${stats.processing}`);
  console.log(`   └─ 待处理: ${stats.pending}`);

  return {
    ...stats,
    trend,
    lastUpdate: new Date().toISOString()
  };
}

/**
 * 处理生产数据
 */
function processProduction(data) {
  if (!data || data.length === 0) {
    console.warn('⚠️  生产数据为空，使用默认值');
    return [];
  }

  // 按生产线汇总最新数据
  const lineMap = new Map();
  
  data.forEach(row => {
    const line = row['生产线'] || row['产线'] || row['line'] || '未知生产线';
    const output = parseInt(row['产量'] || row['output'] || 0);
    const qualified = parseFloat(row['合格率'] || row['qualifiedRate'] || 0);
    const defect = parseFloat(row['不良率'] || row['defectRate'] || 0);

    if (!lineMap.has(line)) {
      lineMap.set(line, {
        name: line,
        output: 0,
        qualifiedRate: 0,
        defectRate: 0,
        count: 0
      });
    }

    const lineData = lineMap.get(line);
    lineData.output += output;
    lineData.qualifiedRate += qualified;
    lineData.defectRate += defect;
    lineData.count++;
  });

  // 计算平均值
  const result = Array.from(lineMap.values()).map(line => ({
    name: line.name,
    output: line.output,
    qualifiedRate: parseFloat((line.qualifiedRate / line.count).toFixed(2)),
    defectRate: parseFloat((line.defectRate / line.count).toFixed(2)),
    status: line.qualifiedRate / line.count >= 90 ? 'running' : 'warning'
  }));

  console.log(`   └─ 生产线数: ${result.length}`);
  return result;
}

/**
 * 处理客户数据
 */
function processCustomers(data) {
  if (!data || data.length === 0) {
    console.warn('⚠️  客户数据为空，使用默认值');
    return [];
  }

  const result = data
    .map(row => ({
      name: row['客户名称'] || row['name'] || '未知客户',
      amount: parseFloat(row['累计金额'] || row['amount'] || 0),
      level: row['等级'] || row['level'] || 'C',
      contact: row['联系人'] || row['contact'] || '',
      orderCount: parseInt(row['订单数'] || row['orderCount'] || 0)
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 20); // 取前20名

  console.log(`   └─ 客户数: ${result.length}`);
  return result;
}

/**
 * 处理质检数据
 */
function processQuality(data) {
  if (!data || data.length === 0) {
    console.warn('⚠️  质检数据为空，使用默认值');
    return {
      qualifiedRate: 95,
      defectRate: 5,
      trend: []
    };
  }

  // 按日期统计
  const dateMap = new Map();
  
  data.forEach(row => {
    const date = row['日期'] || row['date'];
    const isQualified = row['是否合格'] || row['qualified'];
    
    if (!dateMap.has(date)) {
      dateMap.set(date, { date, qualified: 0, total: 0 });
    }
    
    const stat = dateMap.get(date);
    stat.total++;
    if (isQualified === '是' || isQualified === '合格' || isQualified === true || isQualified === 1) {
      stat.qualified++;
    }
  });

  // 计算趋势（最近30天）
  const trend = Array.from(dateMap.values())
    .map(item => ({
      date: item.date,
      qualifiedRate: parseFloat(((item.qualified / item.total) * 100).toFixed(2)),
      defectRate: parseFloat((((item.total - item.qualified) / item.total) * 100).toFixed(2))
    }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-30);

  // 总体统计
  const totalQualified = Array.from(dateMap.values()).reduce((sum, item) => sum + item.qualified, 0);
  const totalCount = Array.from(dateMap.values()).reduce((sum, item) => sum + item.total, 0);
  const qualifiedRate = totalCount > 0 ? ((totalQualified / totalCount) * 100).toFixed(2) : 95;
  const defectRate = totalCount > 0 ? (((totalCount - totalQualified) / totalCount) * 100).toFixed(2) : 5;

  console.log(`   ├─ 合格率: ${qualifiedRate}%`);
  console.log(`   └─ 不良率: ${defectRate}%`);

  return {
    qualifiedRate: parseFloat(qualifiedRate),
    defectRate: parseFloat(defectRate),
    trend
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('\n🚀 开始导入Excel数据...\n');

  // 确保输出目录存在
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`✅ 创建输出目录: ${CONFIG.outputDir}\n`);
  }

  // 读取所有Excel
  console.log('📖 读取Excel文件...');
  const ordersData = readExcelToJSON(path.join(CONFIG.dataDir, CONFIG.files.orders));
  const productionData = readExcelToJSON(path.join(CONFIG.dataDir, CONFIG.files.production));
  const customersData = readExcelToJSON(path.join(CONFIG.dataDir, CONFIG.files.customers));
  const qualityData = readExcelToJSON(path.join(CONFIG.dataDir, CONFIG.files.quality));

  console.log(`   ├─ 订单数据: ${ordersData.length} 条`);
  console.log(`   ├─ 生产数据: ${productionData.length} 条`);
  console.log(`   ├─ 客户数据: ${customersData.length} 条`);
  console.log(`   └─ 质检数据: ${qualityData.length} 条\n`);

  // 处理数据
  console.log('🔄 处理数据...');
  console.log('📊 订单统计:');
  const orders = processOrders(ordersData);
  console.log('🏭 生产统计:');
  const production = processProduction(productionData);
  console.log('👥 客户统计:');
  const customers = processCustomers(customersData);
  console.log('✅ 质检统计:');
  const quality = processQuality(qualityData);

  const processedData = {
    orders,
    production,
    customers,
    quality,
    updateTime: new Date().toISOString(),
    dataSource: 'Excel导入'
  };

  // 保存JSON
  const outputPath = path.join(CONFIG.outputDir, 'realtime-data.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(processedData, null, 2),
    'utf-8'
  );

  console.log('\n✅ 数据处理完成！');
  console.log(`📁 输出文件: ${outputPath}`);
  console.log(`⏰ 更新时间: ${new Date().toLocaleString('zh-CN')}\n`);
  console.log('💡 提示: 现在可以刷新大屏页面查看最新数据\n');
}

// 执行
main().catch(error => {
  console.error('\n❌ 执行失败:', error.message);
  console.error('\n💡 请检查:');
  console.error('   1. xlsx 包是否已安装 (npm install xlsx)');
  console.error('   2. data/ 目录下是否有Excel文件');
  console.error('   3. Excel文件格式是否正确\n');
  process.exit(1);
});

