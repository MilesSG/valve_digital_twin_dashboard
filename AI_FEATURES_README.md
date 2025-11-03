# 🤖 AI 功能使用说明

## 功能概述

系统集成了两个基于 DeepSeek AI 的智能功能：

### 1️⃣ **智能异常预警** - AIWarningPanel
- **位置**：HeaderBar 右侧（时间旁边）
- **触发方式**：点击"AI预警"按钮
- **功能**：
  - 自动监测数据异常（质量、生产、订单、销售）
  - 显示异常数量徽章
  - 支持手动触发 AI 深度分析
  - 给出原因分析和应对建议

### 2️⃣ **对话式数据查询** - AIChatAssistant
- **位置**：右下角荧光绿色浮动按钮
- **触发方式**：点击浮动按钮展开对话框
- **功能**：
  - ChatGPT 风格的对话界面
  - 自然语言提问数据
  - 基于当前业务数据回答
  - 支持快速提问模板

---

## 🎨 UI 设计特点

### AIWarningPanel（智能预警）
```
HeaderBar
├── Logo
├── 标题
└── 右侧工具栏
    ├── [AI预警] ← 新增（带数字徽章）
    ├── 时间显示
    └── 天气信息
```

**设计亮点**：
- 橙色主题（警告色调）
- 异常数量徽章提示
- 下拉面板展示（480px 宽）
- 风险等级分级显示（高/中/低）
- 荧光绿色 AI 分析结果框

**交互流程**：
1. 系统每5分钟自动检测异常
2. 发现异常后显示数字徽章
3. 点击按钮展开预警面板
4. 查看异常列表
5. 点击"AI深度分析"触发 DeepSeek 调用
6. 查看 AI 分析结果（原因+建议）

### AIChatAssistant（对话助手）
```
Dashboard
└── 右下角固定位置
    └── [荧光绿色浮动按钮] ← 新增
        └── 展开 420x600px 对话窗口
```

**设计亮点**：
- 荧光绿渐变圆形按钮（64px）
- 脉冲动画效果
- ChatGPT 风格界面
- 消息气泡设计
- 打字动画效果
- 快速提问模板

**交互流程**：
1. 点击浮动按钮展开对话
2. 输入问题或选择快速提问
3. 按 Ctrl+Enter 或点击发送
4. 等待 AI 回复（显示打字动画）
5. 查看回复结果
6. 继续多轮对话

---

## 💻 技术实现

### 文件结构
```
src/
├── services/
│   └── aiService.ts              # DeepSeek AI 服务封装
├── components/
│   └── AI/
│       ├── AIWarningPanel.vue    # 智能预警面板
│       └── AIChatAssistant.vue   # AI对话助手
├── components/HeaderBar/
│   └── index.vue                 # 集成 AIWarningPanel
└── views/Dashboard/
    └── index.vue                 # 集成 AIChatAssistant
```

### API 调用说明

**aiService.ts** 提供三个主要方法：

#### 1. 异常分析
```typescript
AIService.analyzeAnomaly({
  type: '质量合格率偏低',
  currentValue: 88.5,
  normalRange: '≥95%',
  context: '过去2小时质量合格率低于标准'
})
```

**返回格式**：
```json
{
  "causes": ["设备老化", "原料质量问题", "工艺参数偏离"],
  "riskLevel": "中",
  "suggestions": ["立即检查设备", "更换批次原料", "调整工艺参数"],
  "needHistoryCheck": true,
  "summary": "建议优先检查设备状态和原料批次"
}
```

#### 2. 数据查询
```typescript
AIService.queryData(
  "今天销售情况如何？",
  contextData,      // 当前业务数据
  conversationHistory  // 对话历史
)
```

**返回**：自然语言回答

#### 3. 数据洞察
```typescript
AIService.generateInsights(dashboardData)
```

### Token 优化策略

为了减少 token 消耗，实现了以下优化：

1. **被动触发**：只有用户主动点击"AI深度分析"或发送消息时才调用 API
2. **对话历史限制**：只保留最近 3 轮对话（6条消息）
3. **数据上下文精简**：只传递必要的统计数据
4. **结果缓存**：分析结果本地缓存，避免重复分析

---

## 🚀 使用场景

### 智能预警使用场景

**场景1：质量异常**
```
检测到：质量合格率 88.5%（正常≥95%）
AI分析：
- 可能原因：生产线B温度控制偏离、新批次原料
- 建议：调整温度参数、检查原料质量
```

**场景2：生产效率下降**
```
检测到：闸阀生产线 98件/日（正常110-120件/日）
AI分析：
- 可能原因：设备维护周期临近、人员配置不足
- 建议：安排设备保养、调配生产人员
```

### 对话查询使用场景

**场景1：数据查询**
```
用户："今天销售额是多少？"
AI："根据当前数据，今天的销售额为9,279元，相比昨日增长18.5%..."
```

**场景2：趋势分析**
```
用户："哪条生产线效率最低？"
AI："从数据看，闸阀生产线效率较低（98件/日），建议进行设备检查..."
```

**场景3：异常诊断**
```
用户："为什么订单待处理这么多？"
AI："当前待处理订单较多可能因为：1. 生产排期紧张 2. 部分产品缺料..."
```

---

## ⚙️ 配置说明

### API Key 配置
当前 API Key 已硬编码在 `aiService.ts` 中：
```typescript
const DEEPSEEK_API_KEY = 'sk-a9eb1809c54c416e96f31c4e3a1955e3'
```

**生产环境建议**：
1. 使用环境变量：`process.env.VITE_DEEPSEEK_API_KEY`
2. 配置在 `.env.local` 文件中
3. 不要将 API Key 提交到版本控制

### 异常检测规则
当前在 `AIWarningPanel.vue` 中配置，可根据实际需求调整：
- 质量合格率：< 90% 触发警告
- 生产效率：低于标准值 15% 触发警告
- 检测频率：每 5 分钟自动检测

---

## 🎯 扩展建议

### 短期优化
1. 连接真实业务数据源
2. 添加更多异常检测规则
3. 支持异常历史记录查看
4. 导出 AI 分析报告（PDF）

### 长期规划
1. 集成语音识别功能
2. 添加数据可视化推荐
3. 实时异常推送通知
4. 多语言支持（中英文切换）

---

## 📊 效果预览

### AIWarningPanel
- 位置：HeaderBar 右侧
- 橙色主题，带数字徽章
- 下拉面板展示异常详情
- AI 分析结果用荧光绿高亮

### AIChatAssistant
- 位置：右下角浮动
- 荧光绿色渐变按钮
- 脉冲动画效果
- ChatGPT 风格对话界面
- 打字动画效果

---

## 🐛 注意事项

1. **API 调用延迟**：DeepSeek API 响应时间约 2-5 秒
2. **Token 消耗**：单次对话约消耗 500-1000 tokens
3. **错误处理**：API 失败会显示提示，不影响其他功能
4. **数据同步**：对话助手使用的是实时的 store 数据

---

## 📝 开发日志

**2025-01-03**
- ✅ 创建 aiService.ts 服务
- ✅ 实现 AIWarningPanel 组件
- ✅ 实现 AIChatAssistant 组件
- ✅ 集成到 HeaderBar 和 Dashboard
- ✅ 安装 openai 依赖包
- ✅ Token 优化策略实施

---

## 🔗 相关资源

- [DeepSeek API 文档](https://platform.deepseek.com/api-docs/)
- [OpenAI SDK](https://github.com/openai/openai-node)
- [Element Plus](https://element-plus.org/)

---

**享受 AI 驱动的智能数据分析！** 🎉

