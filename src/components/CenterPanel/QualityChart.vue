<template>
  <div class="quality-chart card-neon">
    <div class="section-title-neon">
      <PanelIcon type="quality" />
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
import PanelIcon from '@/components/common/PanelIcon.vue'

const { t } = useI18n()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
// 提高合格率范围，让数据更好看 (95%-98.5%)
let qualifiedData = ref(Array.from({ length: 24 }, () => 95 + Math.random() * 3.5))
let defectData = ref(Array.from({ length: 24 }, () => 1 + Math.random() * 2))

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

// 质量状态颜色 - 森林绿和工业蓝配色
const qualityStatusColor = computed(() => {
  const status = qualityStatus.value
  if (status === 'excellent') return '#2E7D32'
  if (status === 'good') return '#1976D2'
  return '#F57C00'
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
        type: 'cross',
        crossStyle: {
          color: '#94A3B8',
          type: 'dashed',
          width: 1
        }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      textStyle: {
        color: '#1E293B',
        fontSize: 13
      },
      padding: [10, 14],
      extraCssText: 'box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border-radius: 8px;'
    },
    grid: {
      left: '2%',
      right: '3%',
      bottom: '2%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLabel: {
        color: '#94A3B8',
        fontSize: 12,
        interval: 2,
        fontWeight: 500
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0',
          width: 1.5
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '百分比(%)',
      nameTextStyle: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: 600,
        padding: [0, 0, 0, 0]
      },
      min: 85,
      max: 100,
      axisLabel: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: 500,
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: '#E2E8F0',
          type: 'dashed',
          width: 1
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
        symbolSize: 6,
        itemStyle: {
          color: '#2E7D32',
          borderWidth: 2,
          borderColor: '#FFF'
        },
        lineStyle: {
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(46, 125, 50, 0.3)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(46, 125, 50, 0.15)' },
              { offset: 1, color: 'rgba(46, 125, 50, 0.02)' }
            ]
          }
        },
        emphasis: {
          scale: true,
          scaleSize: 10
        }
      },
      {
        name: '预警线',
        type: 'line',
        data: Array(24).fill(95),
        symbol: 'none',
        lineStyle: {
          color: '#F57C00',
          width: 2.5,
          type: [6, 4],
          cap: 'round'
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: {
            show: true,
            position: 'end',
            formatter: '95%',
            color: '#F57C00',
            fontSize: 12,
            fontWeight: 700,
            backgroundColor: 'rgba(245, 124, 0, 0.1)',
            padding: [4, 8],
            borderRadius: 4
          },
          lineStyle: {
            color: '#F57C00',
            type: [6, 4],
            width: 2.5,
            cap: 'round'
          },
          data: [{ yAxis: 95 }]
        }
      }
    ]
  })

  // 实时更新数据 - 降低刷新频率，缩小波动范围，保持高合格率
  setInterval(() => {
    qualifiedData.value = qualifiedData.value.map(v =>
      Math.max(94, Math.min(99, v + (Math.random() - 0.5) * 1.5))
    )

    chartInstance?.setOption({
      series: [
        { data: qualifiedData.value },
        { data: Array(24).fill(95) }
      ]
    })
  }, 8000)
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
    margin-bottom: 8px;

    .quality-summary {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;

      .summary-item {
        display: flex;
        align-items: center;
        gap: 6px;

        .summary-label {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
        }

        .summary-value {
          font-size: 16px;
          font-weight: 800;
          font-feature-settings: 'tnum';
        }

        .summary-text {
          font-size: 11px;
          font-weight: 500;
          color: #64748B;
        }

        &.excellent .summary-value {
          color: #00E676;
          text-shadow: 0 0 6px rgba(0, 230, 118, 0.2);
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
        height: 16px;
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }

  .chart-container {
    height: calc(100% - 48px);
  }
}
</style>
