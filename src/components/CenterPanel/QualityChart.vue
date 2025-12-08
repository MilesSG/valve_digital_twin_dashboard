<template>
  <div class="quality-chart card-neon">
    <div class="section-title-neon">
      <span>{{ t('chart.quality') }}</span>
      <div class="title-dot"></div>
      <div class="quality-summary">
        <div class="summary-item" :class="qualityStatus">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" :fill="qualityStatusColor" opacity="0.2"/>
            <circle cx="7" cy="7" r="3" :fill="qualityStatusColor"/>
          </svg>
          <span class="summary-label">{{ t('chart.qualityRate') }}:</span>
          <span class="summary-value">{{ currentQualityRate }}%</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="summary-text">{{ qualityStatusText }}</span>
        </div>
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

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
let qualifiedData = ref(Array.from({ length: 24 }, () => 92 + Math.random() * 6))
let defectData = ref(Array.from({ length: 24 }, () => 3 + Math.random() * 5))

// 计算当前合格率（最新一小时）
const currentQualityRate = computed(() => {
  return Math.round(qualifiedData.value[qualifiedData.value.length - 1])
})

// 质量状态
const qualityStatus = computed(() => {
  const rate = currentQualityRate.value
  if (rate >= 95) return 'excellent'
  if (rate >= 90) return 'good'
  return 'warning'
})

// 质量状态颜色
const qualityStatusColor = computed(() => {
  const status = qualityStatus.value
  if (status === 'excellent') return '#00E676'
  if (status === 'good') return '#3B82F6'
  return '#FFA726'
})

// 质量状态文本
const qualityStatusText = computed(() => {
  const rate = currentQualityRate.value
  const warningLine = 95
  if (rate >= warningLine) {
    return `高于 ${warningLine}% ${t('chart.warningLine')}`
  } else {
    return `低于 ${warningLine}% ${t('chart.warningLine')}`
  }
})

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      textStyle: {
        color: '#1E293B'
      }
    },
    legend: {
      data: ['合格率', '预警线'],
      top: 10,
      right: 20,
      textStyle: {
        color: '#64748B',
        fontSize: 12
      },
      itemWidth: 16,
      itemHeight: 8
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLabel: {
        color: '#94A3B8',
        fontSize: 11,
        interval: 2
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '百分比(%)',
      min: 85,
      max: 100,
      axisLabel: {
        color: '#64748B',
        fontSize: 11,
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: '#E2E8F0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '合格率',
        type: 'line',
        data: qualifiedData.value,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        itemStyle: {
          color: '#00E676'
        },
        lineStyle: {
          width: 2.5,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 230, 118, 0.4)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 230, 118, 0.15)' },
              { offset: 1, color: 'rgba(0, 230, 118, 0.02)' }
            ]
          }
        }
      },
      {
        name: '预警线',
        type: 'line',
        data: Array(24).fill(95),
        symbol: 'none',
        lineStyle: {
          color: '#FFA726',
          width: 2,
          type: 'dashed'
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: {
            show: true,
            position: 'end',
            formatter: '95% 预警线',
            color: '#FFA726',
            fontSize: 11
          },
          lineStyle: {
            color: '#FFA726',
            type: 'dashed',
            width: 2
          },
          data: [{ yAxis: 95 }]
        }
      }
    ]
  })

  // 实时更新数据
  setInterval(() => {
    qualifiedData.value = qualifiedData.value.map(v =>
      Math.max(88, Math.min(98, v + (Math.random() - 0.5) * 3))
    )

    chartInstance?.setOption({
      series: [
        { data: qualifiedData.value },
        { data: Array(24).fill(95) }
      ]
    })
  }, 3000)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.quality-chart {
  flex: 1;
  min-height: 0;

  .section-title-neon {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;

    .quality-summary {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 12px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;

      .summary-item {
        display: flex;
        align-items: center;
        gap: 5px;

        .summary-label {
          font-size: 10px;
          color: #64748B;
          font-weight: 500;
        }

        .summary-value {
          font-size: 15px;
          font-weight: 800;
          font-feature-settings: 'tnum';
        }

        .summary-text {
          font-size: 10px;
          font-weight: 500;
          color: #64748B;
        }

        &.excellent .summary-value {
          color: #00E676;
        }

        &.good .summary-value {
          color: #3B82F6;
        }

        &.warning .summary-value {
          color: #FFA726;
        }
      }

      .summary-divider {
        width: 1px;
        height: 14px;
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }

  .chart-container {
    height: calc(100% - 52px);
  }
}
</style>
