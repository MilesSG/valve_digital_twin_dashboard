<template>
  <div class="product-display card-neon">
    <div class="section-title-neon">
      <span>产品类别分布</span>
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

const colorPalette = ['#00E676', '#64748B', '#94A3B8', '#475569', '#CBD5E1', '#69F0AE', '#00E676', '#64748B']

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const data = Object.entries(store.productsByCategory).map(([name, value], index) => ({
    name,
    value,
    itemStyle: {
      color: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.5,
        colorStops: [
          { offset: 0, color: colorPalette[index % colorPalette.length] },
          { offset: 0.7, color: colorPalette[index % colorPalette.length] },
          { offset: 1, color: colorPalette[index % colorPalette.length] + '70' }
        ]
      },
      shadowBlur: index === 0 ? 12 : 6,
      shadowColor: index === 0 ? 'rgba(0, 230, 118, 0.4)' : colorPalette[index % colorPalette.length] + '40'
    }
  }))

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}种 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#64748B',
        fontSize: 12
      },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      data,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#1E293B'
        },
        scale: true,
        scaleSize: 10
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: () => Math.random() * 200
    }]
  })
}

onMounted(() => {
  initChart()
  watch(() => store.productsByCategory, updateChart, { deep: true })
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.product-display {
  height: 320px;
  
  .chart-container {
    height: calc(100% - 56px);
  }
}
</style>