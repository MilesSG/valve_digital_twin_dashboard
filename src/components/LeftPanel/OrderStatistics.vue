<template>
  <div class="order-statistics card-neon">
    <div class="section-title-neon">
      <PanelIcon type="order" />
      <span>{{ t('leftPanel.orderStatusDist') }}</span>
      <div class="title-dot"></div>
    </div>
    <div class="stats-grid">
      <div class="stat-item" v-for="item in orderStats" :key="item.label" :class="item.class">
        <div class="stat-icon-neon" :style="{ borderColor: item.neonColor, boxShadow: `0 0 10px ${item.neonColor}40` }">
          <el-icon :size="18" :color="item.neonColor">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value" :style="{ color: item.neonColor }">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
        <div class="stat-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: item.progress + '%', background: item.neonColor }"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 订单趋势迷你图 -->
    <div class="order-trend-mini">
      <div class="trend-header">
        <span class="trend-title">{{ t('leftPanel.orderTrend7Days') }}</span>
        <span class="trend-total">{{ t('leftPanel.total') }}: <strong>{{ totalOrders }}</strong></span>
      </div>
      <div ref="trendChartRef" class="trend-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBusinessStore } from '@/stores/business'
import { Clock, Loading, CircleCheck, Close } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import PanelIcon from '@/components/common/PanelIcon.vue'

const { t } = useI18n()
const store = useBusinessStore()
const trendChartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const orderStats = computed(() => {
  const total = Object.values(store.ordersByStatus).reduce((a, b) => a + b, 0) || 1

  return [
    {
      label: t('order.statusProcessing'),
      value: store.ordersByStatus['processing'] || 0,
      icon: Loading,
      neonColor: '#64748B',
      class: 'neutral',
      progress: ((store.ordersByStatus['processing'] || 0) / total) * 100
    },
    {
      label: t('order.statusCompleted'),
      value: store.ordersByStatus['completed'] || 0,
      icon: CircleCheck,
      neonColor: '#2E7D32',
      class: 'neon-accent',
      progress: ((store.ordersByStatus['completed'] || 0) / total) * 100
    },
    {
      label: t('order.statusPending'),
      value: store.ordersByStatus['pending'] || 0,
      icon: Clock,
      neonColor: '#FFA726',
      class: 'warning',
      progress: ((store.ordersByStatus['pending'] || 0) / total) * 100
    },
    {
      label: t('order.statusCanceled'),
      value: store.ordersByStatus['cancelled'] || 0,
      icon: Close,
      neonColor: '#94A3B8',
      class: 'neutral-light',
      progress: ((store.ordersByStatus['cancelled'] || 0) / total) * 100
    }
  ]
})

const totalOrders = computed(() => {
  return Object.values(store.ordersByStatus).reduce((a, b) => a + b, 0)
})

function initTrendChart() {
  if (!trendChartRef.value) return
  chartInstance = echarts.init(trendChartRef.value)
  
  // 模拟7天数据
  const days = ['10-24', '10-25', '10-26', '10-27', '10-28', '10-29', '10-30']
  const data = [45, 52, 48, 60, 55, 58, 62]
  
  chartInstance.setOption({
    backgroundColor: 'transparent',
    grid: {
      left: 5,
      right: 5,
      top: 10,
      bottom: 20,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      itemStyle: {
        color: '#2E7D32'
      },
      lineStyle: {
        width: 2,
        color: '#2E7D32',
        shadowBlur: 8,
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
            { offset: 0, color: 'rgba(46, 125, 50, 0.2)' },
            { offset: 1, color: 'rgba(46, 125, 50, 0.02)' }
          ]
        }
      }
    }]
  })
}

onMounted(() => {
  setTimeout(() => {
    initTrendChart()
  }, 100)
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.order-statistics {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      border: 1px solid $card-border;
      transition: all 0.3s ease;
      position: relative;

      // 顶部细线装饰
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 12px;
        right: 12px;
        height: 1px;
        background: rgba(0, 0, 0, 0.05);
        transition: all 0.3s;
      }

      &.neon-accent {
        &:hover::before {
          background: $forest-green;
          box-shadow: $glow-forest-subtle;
        }
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        border-color: rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
      
      .stat-icon-neon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid;
        transition: all 0.3s ease;
        
        :deep(.el-icon) {
          font-size: 18px;
        }
      }

      .stat-info {
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 10px;
          color: $text-secondary;
          font-weight: 600;
        }
      }

      .stat-progress {
        .progress-bar {
          height: 2.5px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 2px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 4px currentColor;
            opacity: 0.9;
          }
        }
      }
    }
  }

  .order-trend-mini {
    padding: 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    border: 1px solid $card-border;

    .trend-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .trend-title {
        font-size: 11px;
        font-weight: 600;
        color: $text-secondary;
      }

      .trend-total {
        font-size: 10px;
        color: $text-tertiary;

        strong {
          color: $forest-green;
          font-size: 12px;
          font-weight: 700;
        }
      }
    }

    .trend-chart {
      height: 60px;
    }
  }
}
</style>