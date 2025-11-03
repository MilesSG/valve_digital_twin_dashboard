<template>
  <div class="type-distribution card">
    <div class="section-title">阀门类型统计</div>
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

const colors = ['#4A9EFF', '#52C41A', '#FAAD14', '#FF4D4F', '#13C2C2', '#9254DE']

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const typeData = Object.entries(store.devicesByType).map(([type, count], index) => ({
    name: type,
    value: count,
    itemStyle: {
      color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [
          { offset: 0, color: colors[index % colors.length] },
          { offset: 1, color: colors[index % colors.length] + '80' }
        ]
      },
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      shadowBlur: 15,
      shadowColor: colors[index % colors.length] + '60'
    }
  }))

  const total = typeData.reduce((sum, item) => sum + item.value, 0)

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percent = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>数量: ${params.value}台<br/>占比: ${percent}%`
      },
      backgroundColor: 'rgba(15, 27, 54, 0.9)',
      borderColor: 'rgba(74, 158, 255, 0.5)',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    series: [
      {
        name: '阀门类型',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#A0AEC0',
          fontSize: 11
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          lineStyle: {
            color: 'rgba(160, 174, 192, 0.5)'
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#FFFFFF'
          },
          scale: true,
          scaleSize: 8
        },
        data: typeData
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  watch(() => store.devicesByType, updateChart, { deep: true })
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
.type-distribution {
  height: 260px;

  .chart-container {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>