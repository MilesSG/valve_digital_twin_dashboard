<template>
  <div class="factory-map card">
    <div class="section-title">区域设备分布</div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMonitorStore } from '@/stores/monitor'
import { getStatusColor } from '@/utils/echarts-config'

const store = useMonitorStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const devices = store.devices
  
  // 按区域分组统计
  const zoneStats = Object.entries(store.devicesByZone).map(([zone, devices]) => ({
    name: zone,
    value: devices.length
  }))

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}台设备'
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#262626',
        fontSize: 12
      }
    },
    series: [
      {
        name: '设备分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}台'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
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
.factory-map {
  height: 280px;

  .chart-container {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
