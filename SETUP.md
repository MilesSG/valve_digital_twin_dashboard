# XX阀门集团展示大屏 - 安装指南

## 📋 系统说明

这是一个企业级可视化展示大屏系统，专为企业展厅、办公大厅等场景设计，用于向客户展示公司实力、产品布局、销售业绩等商业数据。

### 核心特点
- ✅ 浅色商务风格设计
- ✅ 3D产品展示
- ✅ 销售地图可视化
- ✅ 实时数据更新
- ✅ 专业数据报表

## 🚀 快速开始

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

访问：http://localhost:3000

### 4. 构建生产版本
```bash
npm run build
```

## 📊 数据说明

系统当前使用 Mock 数据进行展示，包括：

### 产品数据
- 8个产品类别（调节阀、截止阀、球阀、闸阀、蝶阀、安全阀、止回阀、减压阀）
- 约30个产品型号
- 产品价格、销量、库存等信息

### 订单数据
- 订单状态（待处理、处理中、已完成、已取消）
- 订单金额、数量
- 客户信息、区域分布

### 销售数据
- 全国15个省份/城市的销售分布
- 销售额、订单数、增长率
- 近30天销售趋势

### 客户数据
- 100家模拟客户
- 客户等级（VIP、A、B、C）
- 行业分布（化工、石油、水利、电力等）

## 🎨 自定义配置

### 修改公司名称和标语

编辑 `src/components/HeaderBar/index.vue`:

```vue
<h1 class="company-name">您的公司名称</h1>
<p class="company-slogan">您的品牌标语</p>
```

### 修改公司地址

编辑 `src/components/HeaderBar/index.vue`:

```vue
<span>您的城市·区域</span>
```

### 调整数据刷新频率

编辑 `src/views/Dashboard/index.vue`:

```typescript
useDataRefresh(10000) // 10秒刷新一次，可修改
```

### 连接真实API

替换 `src/api/business.ts` 中的 Mock 函数为真实 API 调用：

```typescript
// 示例：
export function getProducts(): Promise<Product[]> {
  // 替换为真实 API
  return axios.get('https://your-api.com/products')
    .then(res => res.data)
}
```

## 🗺️ 地图配置

### 使用完整中国地图

当前使用简化地图，若需完整地图数据：

1. 安装 echarts 中国地图
```bash
npm install echarts-china-map
```

2. 在 `src/components/CenterPanel/SalesMap.vue` 中引入：
```typescript
import chinaMap from 'echarts/map/json/china.json'
echarts.registerMap('china', chinaMap)
```

## 📱 屏幕适配

### 推荐分辨率
- 设计分辨率：1920x1080
- 最佳体验：≥1600px宽度

### 调整缩放比例

编辑 `src/styles/common.scss`:

```scss
@media (max-width: 1600px) {
  body {
    zoom: 0.9; // 调整此值
  }
}
```

## 🎯 展示场景建议

### 硬件配置
- 推荐：55寸以上触控一体机或LED大屏
- 分辨率：1920x1080 或更高
- 浏览器：Chrome / Edge 最新版

### 展示环境
- 公司大厅、接待区
- 展厅、展会展位
- 会议室、视频会议背景
- 生产车间管理中心

### 使用建议
- 设置浏览器全屏模式（F11）
- 关闭浏览器标签栏和地址栏
- 保持页面自动刷新
- 定期检查数据更新

## 🔧 故障排查

### 问题1：页面显示空白
- 检查浏览器控制台错误
- 确认Node.js版本 >= 16
- 重新安装依赖：`rm -rf node_modules && npm install`

### 问题2：图表不显示
- 检查ECharts是否正确安装
- 查看浏览器控制台Network选项卡
- 确认数据已加载

### 问题3：地图显示异常
- 确认已注册地图：`echarts.registerMap('china', mapData)`
- 检查地图数据格式是否正确

### 问题4：样式错乱
- 清除浏览器缓存
- 重新构建：`npm run build`

## 📞 技术支持

### 常见问题
- 参考 README.md 完整文档
- 查看项目 Issues

### 联系方式
- 项目维护：查看 package.json
- 技术咨询：提交 Issue

## 🔄 更新日志

### v2.0.0 (2025-11-03)
- 全新浅色商务主题
- 企业展示大屏定位
- 产品/订单/销售数据展示
- 地图可视化
- Mock数据模拟

---

**祝您使用愉快！** 📊