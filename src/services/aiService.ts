import axios from 'axios'

// DeepSeek API 配置
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-a9eb1809c54c416e96f31c4e3a1955e3'
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

// 注意：DeepSeek API 不支持联网检索
// 如需联网信息，需要先通过其他API获取，再传给DeepSeek进行分析

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
}

/**
 * DeepSeek AI 服务
 */
export class AIService {
  /**
   * 通用对话接口
   */
  static async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<ChatResponse>(
        `${DEEPSEEK_BASE_URL}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI服务调用失败:', error)
      throw new Error('AI服务暂时不可用，请稍后重试')
    }
  }

  /**
   * 异常预警分析
   */
  static async analyzeAnomaly(anomalyData: {
    type: string
    currentValue: number
    normalRange: string
    context: string
  }): Promise<string> {
    const systemPrompt = `你是一个工业生产数据分析专家，专注于阀门生产领域。请用简洁、专业的语言分析异常情况，并给出实用的建议。`
    
    const userPrompt = `
检测到异常：
- 异常类型：${anomalyData.type}
- 当前值：${anomalyData.currentValue}
- 正常范围：${anomalyData.normalRange}
- 背景信息：${anomalyData.context}

请分析：
1. 可能的原因（3-4条）
2. 风险等级评估
3. 具体应对建议（按优先级排序）
4. 是否需要关联历史数据

请用JSON格式返回：
{
  "causes": ["原因1", "原因2", "原因3"],
  "riskLevel": "高/中/低",
  "suggestions": ["建议1", "建议2", "建议3"],
  "needHistoryCheck": true/false,
  "summary": "一句话总结"
}
`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const result = await this.chat(messages)
    return result
  }

  /**
   * 数据查询对话
   */
  static async queryData(
    question: string,
    contextData: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = `你是法尔阀门集团的智能数据助手，负责回答关于生产、销售、订单等业务数据的问题。
当前数据上下文：
- 月度订单：${contextData.totalOrders || 0} 单
- 销售额：${contextData.totalSales || 0} 元
- 生产产量：${contextData.totalProducts || 0} 件
- 客户总数：${contextData.totalCustomers || 0} 家
- 订单状态：处理中 ${contextData.processing || 0}，已完成 ${contextData.completed || 0}，待处理 ${contextData.pending || 0}

请根据数据回答问题，如果数据不足，请说明。回答要简洁、专业、有洞察力。`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: question }
    ]

    const result = await this.chat(messages)
    return result
  }

  /**
   * 生成数据洞察
   */
  static async generateInsights(dashboardData: any): Promise<string> {
    const systemPrompt = `你是一个数据分析专家，擅长从工业生产数据中挖掘洞察。`
    
    const userPrompt = `
基于以下数据，生成3-5条关键洞察：
${JSON.stringify(dashboardData, null, 2)}

要求：
1. 每条洞察要有数据支撑
2. 指出趋势和异常
3. 给出可行建议
4. 简洁明了

返回JSON格式：
{
  "insights": [
    {
      "title": "洞察标题",
      "description": "详细描述",
      "type": "positive/warning/info",
      "actionable": "行动建议"
    }
  ]
}
`

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]

    const result = await this.chat(messages)
    return result
  }
}

export type { ChatMessage }

