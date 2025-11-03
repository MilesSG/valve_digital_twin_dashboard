/**
 * 生成Demo Excel文件
 * 用于快速测试数据导入功能
 * 
 * 运行：node scripts/generate-demo-excel.cjs
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 确保data目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('\n🎨 开始生成Demo Excel文件...\n');

// ========== 1. 订单数据 ==========
console.log('📊 生成订单数据...');

const ordersData = [
  { 
    日期: '2025-11-01', 
    订单号: 'SO20251101001', 
    客户名称: '上海华东石化', 
    金额: 85600, 
    状态: 'completed' 
  },
  { 
    日期: '2025-11-01', 
    订单号: 'SO20251101002', 
    客户名称: '江苏长江电力', 
    金额: 65800, 
    状态: 'processing' 
  },
  { 
    日期: '2025-11-01', 
    订单号: 'SO20251101003', 
    客户名称: '浙江能源集团', 
    金额: 42300, 
    状态: 'completed' 
  },
  { 
    日期: '2025-11-02', 
    订单号: 'SO20251102001', 
    客户名称: '安徽电力公司', 
    金额: 92300, 
    状态: 'completed' 
  },
  { 
    日期: '2025-11-02', 
    订单号: 'SO20251102002', 
    客户名称: '山东石化集团', 
    金额: 53800, 
    状态: 'processing' 
  },
  { 
    日期: '2025-11-02', 
    订单号: 'SO20251102003', 
    客户名称: '江西燃气公司', 
    金额: 38500, 
    状态: 'pending' 
  },
  { 
    日期: '2025-11-03', 
    订单号: 'SO20251103001', 
    客户名称: '福建化工集团', 
    金额: 98500, 
    状态: 'completed' 
  },
  { 
    日期: '2025-11-03', 
    订单号: 'SO20251103002', 
    客户名称: '湖南电力公司', 
    金额: 72600, 
    状态: 'completed' 
  },
  { 
    日期: '2025-11-03', 
    订单号: 'SO20251103003', 
    客户名称: '河南能源集团', 
    金额: 45900, 
    状态: 'processing' 
  },
  { 
    日期: '2025-11-03', 
    订单号: 'SO20251103004', 
    客户名称: '湖北石化', 
    金额: 28700, 
    状态: 'pending' 
  },
];

// 添加更多历史订单（最近30天）
for (let i = 4; i <= 30; i++) {
  const date = new Date('2025-10-04');
  date.setDate(date.getDate() + i);
  const dateStr = date.toISOString().split('T')[0];
  
  // 每天2-4个订单
  const orderCount = Math.floor(Math.random() * 3) + 2;
  for (let j = 1; j <= orderCount; j++) {
    ordersData.push({
      日期: dateStr,
      订单号: `SO${dateStr.replace(/-/g, '')}${String(j).padStart(3, '0')}`,
      客户名称: ['上海华东石化', '江苏长江电力', '浙江能源集团', '安徽电力公司', '山东石化集团'][Math.floor(Math.random() * 5)],
      金额: Math.floor(Math.random() * 80000) + 20000,
      状态: ['completed', 'completed', 'completed', 'processing', 'pending'][Math.floor(Math.random() * 5)]
    });
  }
}

const ordersWS = XLSX.utils.json_to_sheet(ordersData);
const ordersWB = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(ordersWB, ordersWS, '订单数据');
XLSX.writeFile(ordersWB, path.join(dataDir, '订单数据.xlsx'));
console.log(`   ✅ 订单数据.xlsx - ${ordersData.length} 条记录`);

// ========== 2. 生产数据 ==========
console.log('🏭 生成生产数据...');

const productionData = [];
const productionLines = ['闸阀生产线', '球阀生产线', '蝶阀生产线', '截止阀生产线', '止回阀生产线'];

// 生成最近7天的生产数据
for (let i = 0; i < 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  const dateStr = date.toISOString().split('T')[0];
  
  productionLines.forEach(line => {
    const baseOutput = 100;
    const output = baseOutput + Math.floor(Math.random() * 40) - 10;
    const qualifiedRate = 93 + Math.random() * 5;
    const defectRate = 100 - qualifiedRate;
    
    productionData.push({
      日期: dateStr,
      生产线: line,
      产量: output,
      合格率: parseFloat(qualifiedRate.toFixed(2)),
      不良率: parseFloat(defectRate.toFixed(2))
    });
  });
}

const productionWS = XLSX.utils.json_to_sheet(productionData);
const productionWB = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(productionWB, productionWS, '生产数据');
XLSX.writeFile(productionWB, path.join(dataDir, '生产数据.xlsx'));
console.log(`   ✅ 生产数据.xlsx - ${productionData.length} 条记录`);

// ========== 3. 客户数据 ==========
console.log('👥 生成客户数据...');

const customersData = [
  { 客户名称: '上海华东石化', 累计金额: 1250000, 等级: 'VIP', 联系人: '张经理', 订单数: 45 },
  { 客户名称: '江苏长江电力', 累计金额: 980000, 等级: 'A', 联系人: '李总', 订单数: 38 },
  { 客户名称: '浙江能源集团', 累计金额: 850000, 等级: 'A', 联系人: '王主任', 订单数: 32 },
  { 客户名称: '安徽电力公司', 累计金额: 720000, 等级: 'A', 联系人: '赵工', 订单数: 28 },
  { 客户名称: '山东石化集团', 累计金额: 650000, 等级: 'B', 联系人: '钱总', 订单数: 25 },
  { 客户名称: '江西燃气公司', 累计金额: 520000, 等级: 'B', 联系人: '孙经理', 订单数: 22 },
  { 客户名称: '福建化工集团', 累计金额: 450000, 等级: 'B', 联系人: '周总', 订单数: 18 },
  { 客户名称: '湖南电力公司', 累计金额: 380000, 等级: 'B', 联系人: '吴主任', 订单数: 15 },
  { 客户名称: '河南能源集团', 累计金额: 320000, 等级: 'C', 联系人: '郑经理', 订单数: 12 },
  { 客户名称: '湖北石化有限公司', 累计金额: 280000, 等级: 'C', 联系人: '冯工', 订单数: 10 },
  { 客户名称: '广东天然气公司', 累计金额: 245000, 等级: 'C', 联系人: '陈总', 订单数: 9 },
  { 客户名称: '广西能源集团', 累计金额: 210000, 等级: 'C', 联系人: '褚经理', 订单数: 8 },
  { 客户名称: '四川电力公司', 累计金额: 185000, 等级: 'C', 联系人: '卫主任', 订单数: 7 },
  { 客户名称: '重庆石化', 累计金额: 160000, 等级: 'C', 联系人: '蒋工', 订单数: 6 },
  { 客户名称: '云南燃气集团', 累计金额: 135000, 等级: 'C', 联系人: '沈经理', 订单数: 5 },
];

const customersWS = XLSX.utils.json_to_sheet(customersData);
const customersWB = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(customersWB, customersWS, '客户数据');
XLSX.writeFile(customersWB, path.join(dataDir, '客户数据.xlsx'));
console.log(`   ✅ 客户数据.xlsx - ${customersData.length} 条记录`);

// ========== 4. 质检数据 ==========
console.log('✅ 生成质检数据...');

const qualityData = [];
const inspectors = ['李师傅', '张师傅', '王师傅', '刘师傅'];
const defectTypes = ['尺寸偏差', '表面划痕', '焊接缺陷', '材料问题', '装配不良'];

// 生成最近7天的质检数据
let productNo = 1;
for (let i = 0; i < 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() - (6 - i));
  const dateStr = date.toISOString().split('T')[0];
  
  // 每天50-80个产品检验
  const count = Math.floor(Math.random() * 31) + 50;
  for (let j = 0; j < count; j++) {
    const isQualified = Math.random() > 0.05; // 95%合格率
    qualityData.push({
      日期: dateStr,
      产品编号: `V${dateStr.replace(/-/g, '')}${String(productNo++).padStart(4, '0')}`,
      是否合格: isQualified ? '是' : '否',
      检验员: inspectors[Math.floor(Math.random() * inspectors.length)],
      不良类型: isQualified ? '-' : defectTypes[Math.floor(Math.random() * defectTypes.length)]
    });
  }
}

const qualityWS = XLSX.utils.json_to_sheet(qualityData);
const qualityWB = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(qualityWB, qualityWS, '质检数据');
XLSX.writeFile(qualityWB, path.join(dataDir, '质检数据.xlsx'));
console.log(`   ✅ 质检数据.xlsx - ${qualityData.length} 条记录`);

console.log('\n✅ 所有Demo Excel文件生成完成！\n');
console.log('📁 文件位置: data/ 目录');
console.log('   ├── 订单数据.xlsx');
console.log('   ├── 生产数据.xlsx');
console.log('   ├── 客户数据.xlsx');
console.log('   └── 质检数据.xlsx\n');
console.log('🚀 下一步操作:');
console.log('   1. 查看生成的Excel文件');
console.log('   2. 根据需要修改数据');
console.log('   3. 运行: npm run data:import');
console.log('   4. 启动: npm run dev\n');

