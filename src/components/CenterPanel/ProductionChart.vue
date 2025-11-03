<template>
  <div class="production-chart card-neon">
    <div class="section-title-neon">
      <span>生产线实时状态</span>
      <div class="title-dot"></div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const data = [
    { name: '调节阀生产线', value: 156, status: 'running' },
    { name: '截止阀生产线', value: 142, status: 'running' },
    { name: '球阀生产线', value: 128, status: 'running' },
    { name: '闸阀生产线', value: 98, status: 'maintenance' },
    { name: '蝶阀生产线', value: 87, status: 'running' }
  ]

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#64748B',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#E2E8F0',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: {
        color: '#1E293B',
        fontSize: 13,
        fontWeight: 600
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    series: [{
      type: 'bar',
      data: data.map((d, index) => ({
        value: d.value,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: d.status === 'running' ? '#00E676' : '#FFA726' },
              { offset: 1, color: d.status === 'running' ? '#69F0AE' : '#FFB74D' }
            ]
          },
          borderRadius: [0, 8, 8, 0],
          shadowBlur: d.status === 'running' ? 10 : 6,
          shadowColor: d.status === 'running' ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 167, 38, 0.25)'
        }
      })),
      barWidth: 26,
      label: {
        show: true,
        position: 'right',
        color: '#1E293B',
        fontWeight: 700,
        fontSize: 14,
        formatter: '{c} 件/日'
      },
      animationDuration: 2000,
      animationEasing: 'cubicOut'
    }]
  })

  // 自动更新动画
  setInterval(() => {
    const newData = data.map(d => ({
      ...d,
      value: d.value + Math.random() * 10 - 5
    }))
    
    chartInstance?.setOption({
      yAxis: {
        data: newData.map(d => d.name)
      },
      series: [{
        data: newData.map((d, index) => ({
          value: Math.round(d.value),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: d.status === 'running' ? '#00E676' : '#FFA726' },
                { offset: 1, color: d.status === 'running' ? '#69F0AE' : '#FFB74D' }
              ]
            }
          }
        }))
      }]
    })
  }, 3000)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.production-chart {
  height: 320px;
  flex-shrink: 0;
  
  .chart-container {
    height: calc(100% - 56px);
  }
}
</style>
