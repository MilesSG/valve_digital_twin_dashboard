<template>
  <div class="device-zone-chart card">
    <div class="section-title">区域设备分布</div>
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

const colors = ['#4A9EFF', '#52C41A', '#FAAD14', '#13C2C2', '#9254DE', '#F759AB']

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const zoneStats = Object.entries(store.devicesByZone).map(([zone, devices], index) => ({
    name: zone,
    value: devices.length,
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: colors[index % colors.length] },
          { offset: 1, color: colors[index % colors.length] + '80' }
        ]
      },
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      shadowBlur: 10,
      shadowColor: colors[index % colors.length] + '50'
    }
  }))

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}台 ({d}%)',
      backgroundColor: 'rgba(15, 27, 54, 0.9)',
      borderColor: 'rgba(74, 158, 255, 0.5)',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#A0AEC0',
        fontSize: 12
      },
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle'
    },
    series: [
      {
        name: '设备分布',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#FFFFFF'
          },
          scale: true,
          scaleSize: 10
        },
        data: zoneStats
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  watch(() => store.devices, updateChart, { deep: true })
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
.device-zone-chart {
  height: 260px;

  .chart-container {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
