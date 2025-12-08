<template>
  <div class="sales-map card">
    <div class="section-title">销售区域分布</div>
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
  if (!chartInstance || !store.regionSales.length) return

  const scatterData = store.regionSales.map(item => ({
    name: item.province,
    value: [...item.coordinates, item.sales],
    sales: item.sales,
    orders: item.orders
  }))

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.data) {
          return `${params.data.name}<br/>销售额: ¥${(params.data.sales / 10000).toFixed(0)}<br/>订单数: ${params.data.orders}`
        }
        return ''
      }
    },
    geo: {
      map: 'china',
      roam: true,
      itemStyle: {
        areaColor: '#F3F4F6',
        borderColor: '#D1D5DB'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#E5E7EB'
        }
      },
      label: {
        show: false
      }
    },
    series: [{
      type: 'scatter',
      coordinateSystem: 'geo',
      data: scatterData,
      symbolSize: (val: number[]) => Math.sqrt(val[2]) / 100,
      itemStyle: {
        color: '#2563EB',
        shadowBlur: 10,
        shadowColor: 'rgba(37, 99, 235, 0.5)'
      },
      emphasis: {
        itemStyle: {
          color: '#1D4ED8'
        }
      }
    }]
  })
}

onMounted(async () => {
  // 注册中国地图（简化版，实际使用需要导入完整地图数据）
  echarts.registerMap('china', {
    type: 'FeatureCollection',
    features: []
  })
  
  initChart()
  watch(() => store.regionSales, updateChart, { deep: true })
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.sales-map {
  flex: 1;
  
  .chart-container {
    height: calc(100% - 40px);
  }
}
</style>
