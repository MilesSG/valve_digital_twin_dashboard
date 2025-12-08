<template>
  <div class="production-chart card-neon">
    <div class="section-title-neon">
      <span>{{ t('chart.production') }} {{ t('chart.efficiency') }}</span>
      <div class="title-dot"></div>
      <div class="efficiency-summary">
        <span class="summary-label">{{ t('chart.avgEfficiency') }}:</span>
        <span class="summary-value" :class="avgEfficiencyClass">{{ avgEfficiency }}%</span>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'

const { t } = useI18n()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const productionData = ref([
  { name: '调节阀生产线', actual: 156, target: 150, efficiency: 104 },
  { name: '截止阀生产线', actual: 136, target: 150, efficiency: 91 },
  { name: '球阀生产线', actual: 142, target: 150, efficiency: 95 },
  { name: '闸阀生产线', actual: 112, target: 150, efficiency: 75 },
  { name: '蝶阀生产线', actual: 123, target: 150, efficiency: 82 }
])

// 计算平均效率
const avgEfficiency = computed(() => {
  const total = productionData.value.reduce((sum, item) => sum + item.efficiency, 0)
  return Math.round(total / productionData.value.length)
})

// 平均效率等级样式
const avgEfficiencyClass = computed(() => {
  const eff = avgEfficiency.value
  if (eff >= 95) return 'excellent'
  if (eff >= 80) return 'good'
  return 'warning'
})

// 根据效率返回颜色
function getEfficiencyColor(efficiency: number) {
  if (efficiency >= 95) return { start: '#00E676', end: '#69F0AE' } // 绿色 - 优秀
  if (efficiency >= 80) return { start: '#3B82F6', end: '#60A5FA' } // 蓝色 - 良好
  if (efficiency >= 60) return { start: '#FFA726', end: '#FFB74D' } // 橙色 - 警告
  return { start: '#EF5350', end: '#E57373' } // 红色 - 危险
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const data = productionData.value

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex
        const item = data[dataIndex]
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 8px;">${item.name}</div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>实际产量:</span>
              <span style="font-weight: 700;">${item.actual} 件/日</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>目标产量:</span>
              <span style="font-weight: 700;">${item.target} 件/日</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span>完成率:</span>
              <span style="font-weight: 700; color: ${item.efficiency >= 95 ? '#00E676' : item.efficiency >= 80 ? '#3B82F6' : item.efficiency >= 60 ? '#FFA726' : '#EF5350'};">${item.efficiency}%</span>
            </div>
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '2%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 180,
      axisLabel: {
        color: '#64748B',
        fontSize: 12,
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: '#E2E8F0',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: {
        color: '#1E293B',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 20,
        margin: 20
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: '目标值',
        type: 'bar',
        data: data.map(d => d.target),
        barWidth: 24,
        barCategoryGap: '40%',
        itemStyle: {
          color: 'rgba(0, 0, 0, 0.04)',
          borderRadius: [0, 12, 12, 0]
        },
        barGap: '-100%',
        z: 1,
        silent: true
      },
      {
        name: '实际产量',
        type: 'bar',
        data: data.map(d => ({
          value: d.actual,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: getEfficiencyColor(d.efficiency).start },
                { offset: 1, color: getEfficiencyColor(d.efficiency).end }
              ]
            },
            borderRadius: [0, 12, 12, 0],
            shadowBlur: 10,
            shadowColor: getEfficiencyColor(d.efficiency).start + '30'
          }
        })),
        barWidth: 24,
        label: {
          show: true,
          position: 'right',
          color: '#1E293B',
          fontWeight: 700,
          fontSize: 14,
          formatter: (params: any) => {
            const item = data[params.dataIndex]
            return `${params.value}  {efficiency|${item.efficiency}%}`
          },
          rich: {
            efficiency: {
              fontSize: 13,
              fontWeight: 700,
              color: '#64748B',
              padding: [0, 0, 0, 6]
            }
          }
        },
        z: 2,
        animationDuration: 2000,
        animationEasing: 'cubicOut'
      }
    ]
  })

  // 自动更新动画
  setInterval(() => {
    productionData.value = productionData.value.map(d => {
      const newActual = Math.max(50, Math.min(170, d.actual + Math.random() * 20 - 10))
      return {
        ...d,
        actual: Math.round(newActual),
        efficiency: Math.round((newActual / d.target) * 100)
      }
    })
    updateChart()
  }, 5000)
}

function updateChart() {
  const data = productionData.value
  chartInstance?.setOption({
    yAxis: {
      data: data.map(d => d.name)
    },
    series: [
      {
        data: data.map(d => d.target)
      },
      {
        data: data.map(d => ({
          value: d.actual,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: getEfficiencyColor(d.efficiency).start },
                { offset: 1, color: getEfficiencyColor(d.efficiency).end }
              ]
            },
            borderRadius: [0, 14, 14, 0],
            shadowColor: getEfficiencyColor(d.efficiency).start + '30'
          }
        }))
      }
    ]
  })
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.production-chart {
  height: 280px;
  flex-shrink: 0;

  .section-title-neon {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    margin-bottom: 8px;

    .efficiency-summary {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;

      .summary-label {
        font-size: 12px;
        color: #64748B;
        font-weight: 500;
      }

      .summary-value {
        font-size: 16px;
        font-weight: 800;
        font-feature-settings: 'tnum';

        &.excellent {
          color: #00E676;
          text-shadow: 0 0 6px rgba(0, 230, 118, 0.2);
        }

        &.good {
          color: #3B82F6;
        }

        &.warning {
          color: #FFA726;
        }
      }
    }
  }

  .chart-container {
    height: calc(100% - 48px);
  }
}
</style>
