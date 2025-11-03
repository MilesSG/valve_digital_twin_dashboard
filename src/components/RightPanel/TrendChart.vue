<template>
  <div class="trend-chart card">
    <div class="section-title">24小时趋势</div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMonitorStore } from '@/stores/monitor'

const store = useMonitorStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !store.trendData) return

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#718096'
        }
      },
      backgroundColor: 'rgba(15, 27, 54, 0.9)',
      borderColor: 'rgba(74, 158, 255, 0.5)',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    legend: {
      data: ['温度', '压力'],
      top: 10,
      textStyle: {
        color: '#A0AEC0'
      },
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: store.trendData.hours.map(h => `${h}:00`),
      axisLine: {
        lineStyle: {
          color: 'rgba(74, 158, 255, 0.2)'
        }
      },
      axisLabel: {
        color: '#718096',
        fontSize: 11
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '温度(°C)',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#4A9EFF'
          }
        },
        axisLabel: {
          color: '#4A9EFF',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(74, 158, 255, 0.1)',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '压力(MPa)',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#52C41A'
          }
        },
        axisLabel: {
          color: '#52C41A',
          fontSize: 11
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: store.trendData.temperature,
        itemStyle: {
          color: '#4A9EFF'
        },
        lineStyle: {
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(74, 158, 255, 0.5)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(74, 158, 255, 0.4)' },
              { offset: 1, color: 'rgba(74, 158, 255, 0.05)' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#4A9EFF',
            borderWidth: 2,
            borderColor: '#FFFFFF',
            shadowBlur: 10,
            shadowColor: '#4A9EFF'
          }
        }
      },
      {
        name: '压力',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: store.trendData.pressure,
        itemStyle: {
          color: '#52C41A'
        },
        lineStyle: {
          width: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(82, 196, 26, 0.5)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(82, 196, 26, 0.4)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#52C41A',
            borderWidth: 2,
            borderColor: '#FFFFFF',
            shadowBlur: 10,
            shadowColor: '#52C41A'
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  watch(() => store.trendData, updateChart, { deep: true })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

function handleResize() {
  chartInstance?.resize()
}
</script>

<style lang="scss" scoped>
.trend-chart {
  height: 240px;

  .chart-container {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>