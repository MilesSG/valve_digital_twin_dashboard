<template>
  <div class="order-statistics card-neon">
    <div class="section-title-neon">
      <span>订单状态分布</span>
      <div class="title-dot"></div>
    </div>
    <div class="stats-grid">
      <div class="stat-item" v-for="item in orderStats" :key="item.label" :class="item.class">
        <div class="stat-icon-neon" :style="{ borderColor: item.neonColor, boxShadow: `0 0 12px ${item.neonColor}` }">
          <el-icon :size="22" :color="item.neonColor">
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
        <span class="trend-title">近7日订单趋势</span>
        <span class="trend-total">总计: <strong>{{ totalOrders }}</strong></span>
      </div>
      <div ref="trendChartRef" class="trend-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/business'
import { Clock, Loading, CircleCheck, Close } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const store = useBusinessStore()
const trendChartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const orderStats = computed(() => {
  const total = Object.values(store.ordersByStatus).reduce((a, b) => a + b, 0) || 1
  
  return [
    {
      label: '处理中',
      value: store.ordersByStatus['processing'] || 0,
      icon: Loading,
      neonColor: '#64748B',
      class: 'neutral',
      progress: ((store.ordersByStatus['processing'] || 0) / total) * 100
    },
    {
      label: '已完成',
      value: store.ordersByStatus['completed'] || 0,
      icon: CircleCheck,
      neonColor: '#00E676',
      class: 'neon-accent',
      progress: ((store.ordersByStatus['completed'] || 0) / total) * 100
    },
    {
      label: '待处理',
      value: store.ordersByStatus['pending'] || 0,
      icon: Clock,
      neonColor: '#FFA726',
      class: 'warning',
      progress: ((store.ordersByStatus['pending'] || 0) / total) * 100
    },
    {
      label: '已取消',
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
        color: '#00E676'
      },
      lineStyle: {
        width: 2,
        color: '#00E676',
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
            { offset: 0, color: 'rgba(0, 230, 118, 0.2)' },
            { offset: 1, color: 'rgba(0, 230, 118, 0.02)' }
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
  gap: $spacing-lg;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
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
          background: $neon-green;
          box-shadow: $glow-neon-subtle;
        }
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.95);
        transform: translateY(-2px);
        border-color: rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      }
      
      .stat-icon-neon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid;
        transition: all 0.3s ease;
      }
      
      .stat-info {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        
        .stat-label {
          font-size: 12px;
          color: $text-secondary;
          font-weight: 600;
        }
      }
      
      .stat-progress {
        .progress-bar {
          height: 3px;
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
    padding: $spacing-md;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    border: 1px solid $card-border;

    .trend-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;
      
      .trend-title {
        font-size: 13px;
        font-weight: 600;
        color: $text-secondary;
      }
      
      .trend-total {
        font-size: 12px;
        color: $text-tertiary;
        
        strong {
          color: $neon-green;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }

    .trend-chart {
      height: 80px;
    }
  }
}
</style>