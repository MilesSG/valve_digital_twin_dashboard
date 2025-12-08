# 🎯 智能阀门控制系统 - 数据可视化中心

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![ECharts](https://img.shields.io/badge/ECharts-5.x-c22d40?style=flat-square)](https://echarts.apache.org/)
[![AI Powered](https://img.shields.io/badge/AI-DeepSeek-00E676?style=flat-square)](https://www.deepseek.com/)

> 江苏盐城大丰法尔阀门集团企业级智能数据可视化大屏系统  
> **浅色背景 + 荧光绿点缀 + AI智能分析**

![系统截图](./项目截屏1103.png)

---

## ✨ 核心特性

### 🎨 现代化设计
- **简约浅色主题** - 专业大气的商务风格
- **荧光绿点缀** - 关键数据高亮，科技感十足
- **微光效果** - 精致的悬浮和动画效果
- **响应式布局** - 完美适配各种屏幕尺寸

### 🤖 AI智能功能
- **智能异常预警** - 自动检测数据异常，AI深度分析原因和建议
- **对话式查询** - ChatGPT风格，自然语言问答业务数据
- **DeepSeek驱动** - 强大的AI推理能力
- **按需调用** - 节省Token，仅在主动触发时调用API

### 📊 全面数据展示
- **实时生产监控** - 5条生产线状态实时追踪
- **质量趋势分析** - 合格率、不良率可视化
- **销售数据洞察** - 30天趋势、重点客户排行
- **订单状态追踪** - 7天订单趋势，状态分布
- **关键指标概览** - 月度订单、销售额、产量、客户数

---

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- npm >= 9.x

### 安装运行
```bash
# 安装依赖
npm install

# 开发运行
npm run dev

# 生产构建
npm run build
```

访问：http://localhost:5173

---

## 🏗️ 项目结构

```
valve_digital_twin_dashboard/
├── src/
│   ├── components/
│   │   ├── AI/                    # 🤖 AI功能模块
│   │   │   ├── AIWarningPanel.vue      # 智能预警面板
│   │   │   └── AIChatAssistant.vue     # AI对话助手
│   │   ├── DataOverview/          # 数据概览统计卡片
│   │   ├── LeftPanel/             # 左侧面板（产品、订单）
│   │   ├── CenterPanel/           # 中央核心区域（生产、质量）
│   │   └── RightPanel/            # 右侧面板（销售、客户）
│   ├── services/
│   │   └── aiService.ts           # 🤖 AI服务封装（DeepSeek）
│   ├── stores/                    # Pinia状态管理
│   ├── styles/                    # 设计系统样式
│   └── views/Dashboard/           # 主页面
└── package.json
```

---

## 🎨 设计系统

### 配色方案

**主色调**
```scss
$bg-primary: #F8FAFC;              // 主背景
$neon-green: #00E676;              // 荧光绿强调色
$primary-color: #475569;           // 主文字色
```

**语义色**
- 成功：`#00E676`（荧光绿）
- 警告：`#FFA726`（橙色）
- 危险：`#EF5350`（红色）

---

## 🤖 AI功能说明

### 1️⃣ 智能异常预警

**位置**：顶部导航栏右侧

**功能**：
- 自动检测质量、生产、订单、销售异常
- 每5分钟自动扫描
- AI深度分析 + 应对建议
- 风险等级分级

### 2️⃣ 对话式数据查询

**位置**：右下角荧光绿浮动按钮

**功能**：
- ChatGPT风格对话界面
- 自然语言提问
- 基于实时业务数据回答
- 支持多轮对话

**示例提问**：
- "今天销售情况如何？"
- "哪条生产线效率最低？"
- "订单完成率是多少？"

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.21 | 渐进式框架 |
| TypeScript | ^5.4.0 | 类型安全 |
| Vite | ^5.2.0 | 构建工具 |
| Pinia | ^2.1.7 | 状态管理 |
| ECharts | ^5.5.0 | 数据可视化 |
| Element Plus | ^2.6.3 | UI组件库 |
| OpenAI SDK | ^6.7.0 | DeepSeek API |
| CountUp.js | ^2.8.0 | 数字动画 |

---

## ⚙️ 配置

### 修改公司信息
```vue
<!-- src/components/HeaderBar/index.vue -->
<h1 class="company-name">南阳镇XX企业</h1>
<div class="title-main">数据可视化中心</div>
```

### 配置AI API
```typescript
// src/services/aiService.ts
const DEEPSEEK_API_KEY = 'your-api-key-here'
```

### 调整刷新频率
```typescript
// src/views/Dashboard/index.vue
useDataRefresh(10000) // 10秒
```

---

## 📦 部署

### Nginx部署
```bash
npm run build

# Nginx配置
server {
    listen 80;
    root /var/www/valve-dashboard/dist;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker部署
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
```

---

## 🐛 常见问题

**Q: AI功能不工作？**
- 检查API Key配置
- 确认网络可访问DeepSeek API
- 查看浏览器控制台错误

**Q: 图表不显示？**
- 确保ECharts正确安装
- 检查窗口resize事件
- 查看控制台错误信息

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 👥 关于

**公司**: 江苏盐城大丰法尔阀门集团  
**系统**: 智能阀门控制系统 - 数据可视化中心  
**版本**: 4.1.0  
**更新**: 2025-11-03  

---

<div align="center">

**Made with ❤️ by Valve Digital Twin Team**

如果这个项目对你有帮助，请给一个 ⭐️ Star！

</div>
