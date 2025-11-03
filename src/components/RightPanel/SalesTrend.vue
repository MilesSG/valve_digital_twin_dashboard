<template>
  <div class="sales-trend card-neon">
    <div class="section-title-neon">
      <span>销售趋势（近30天）</span>
      <div class="title-dot"></div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useBusinessStore } from '@/stores/business'

const store = useBusinessStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !store.salesTrend.length) return

  const dates = store.salesTrend.map(item => item.date.substring(5))
  const sales = store.salesTrend.map(item => item.sales / 1000) // 转换为千元
  const orders = store.salesTrend.map(item => item.orders)

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['销售额(千元)', '订单数'],
      top: 10,
      textStyle: {
        color: '#64748B',
        fontSize: 12
      },
      itemWidth: 16,
      itemHeight: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: {
        color: '#94A3B8',
        fontSize: 10
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        axisLabel: {
          color: '#64748B',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#E2E8F0',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '订单数',
        axisLabel: {
          color: '#64748B',
          fontSize: 10
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '销售额(千元)',
        type: 'line',
        data: sales,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#00E676'
        },
        lineStyle: {
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 230, 118, 0.5)'
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
              { offset: 1, color: 'rgba(0, 230, 118, 0.03)' }
            ]
          }
        }
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        data: orders,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#64748B'
        },
        lineStyle: {
          width: 2,
          shadowBlur: 4,
          shadowColor: 'rgba(100, 116, 139, 0.3)'
        }
      }
    ]
  })
}

onMounted(() => {
  initChart()
  watch(() => store.salesTrend, updateChart, { deep: true })
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.sales-trend {
  height: 400px;
  flex-shrink: 0;
  
  .chart-container {
    height: calc(100% - 56px);
  }
}
</style>