<template>
  <div class="product-display card-neon">
    <div class="section-title-neon">
      <PanelIcon type="product" />
      <span>{{ t('leftPanel.productCategoryDist') }}</span>
      <div class="title-dot"></div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { useBusinessStore } from '@/stores/business'
import PanelIcon from '@/components/common/PanelIcon.vue'

const { t } = useI18n()
const store = useBusinessStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

// 森林绿和工业蓝配色方案 - 现代、清新、专业
const colorPalette = [
  '#2E7D32',  // 森林绿（主色）
  '#1976D2',  // 工业蓝（次要色）
  '#4CAF50',  // 浅森林绿
  '#42A5F5',  // 浅工业蓝
  '#388E3C',  // 中绿
  '#2196F3',  // 中蓝
  '#66BB6A',  // 明绿
  '#64B5F6'   // 明蓝
]

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const data = Object.entries(store.productsByCategory).map(([name, value], index) => {
    const color = colorPalette[index % colorPalette.length]
    return {
      name,
      value,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: color },
            { offset: 1, color: color + 'DD' }  // 微妙的渐变
          ]
        },
        shadowBlur: index === 0 ? 10 : 4,
        shadowColor: index === 0 ? 'rgba(46, 125, 50, 0.3)' : 'rgba(0, 0, 0, 0.08)',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.8)'
      }
    }
  })

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}种 ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      textStyle: {
        color: '#475569',
        fontSize: 13
      },
      padding: [10, 15],
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;'
    },
    legend: {
      orient: 'vertical',
      right: 15,
      top: 'center',
      textStyle: {
        color: '#475569',
        fontSize: 12,
        fontWeight: 500
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      icon: 'circle'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['30%', '50%'],
      data,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 15,
          fontWeight: '600',
          color: '#1E293B',
          formatter: '{b}\n{d}%'
        },
        scale: true,
        scaleSize: 8,
        itemStyle: {
          shadowBlur: 12,
          shadowColor: 'rgba(0, 0, 0, 0.12)'
        }
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
  height: 240px;
  flex-shrink: 0;

  .chart-container {
    height: calc(100% - 52px);
  }
}
</style>