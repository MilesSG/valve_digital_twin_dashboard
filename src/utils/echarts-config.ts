import type { EChartsOption } from 'echarts'

/**
 * ECharts默认配置
 */
export const defaultEChartsConfig: Partial<EChartsOption> = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Microsoft YaHei, Arial, sans-serif',
    fontSize: 12,
    color: '#262626'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderColor: '#333',
    borderWidth: 1,
    textStyle: {
      color: '#fff'
    },
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    textStyle: {
      color: '#262626'
    }
  }
}

/**
 * 状态颜色映射 - 荧光绿点缀
 */
export const statusColorMap = {
  normal: '#00E676',    // 荧光绿
  warning: '#FFA726',   // 橙色
  error: '#EF5350',     // 红色
  offline: '#94A3B8'    // 灰色
} as const

/**
 * 中性配色板（荧光绿作为强调）
 */
export const colorPalette = [
  '#00E676',  // 荧光绿（强调）
  '#64748B',  // 中性蓝灰
  '#94A3B8',  // 浅灰蓝
  '#475569',  // 深灰蓝
  '#CBD5E1',  // 浅灰
  '#69F0AE',  // 浅荧光绿
  '#00E676',  // 荧光绿循环
  '#64748B'   // 中性色循环
]

/**
 * 获取状态颜色
 */
export function getStatusColor(status: keyof typeof statusColorMap): string {
  return statusColorMap[status]
}
