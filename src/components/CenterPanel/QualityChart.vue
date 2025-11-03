<template>
  <div class="quality-chart card-neon">
    <div class="section-title-neon">
      <span>质量检测统计</span>
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

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  let qualifiedData = Array.from({ length: 24 }, () => 92 + Math.random() * 6)
  let defectData = Array.from({ length: 24 }, () => 3 + Math.random() * 5)

  chartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['合格率', '不良率'],
      top: 10,
      textStyle: {
        color: '#64748B',
        fontSize: 13
      },
      itemWidth: 20,
      itemHeight: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLabel: {
        color: '#94A3B8',
        fontSize: 11
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '百分比(%)',
      axisLabel: {
        color: '#64748B',
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: '#E2E8F0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '合格率',
        type: 'line',
        data: qualifiedData,
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
        name: '不良率',
        type: 'line',
        data: defectData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#EF5350'
        },
        lineStyle: {
          width: 3,
          shadowBlur: 6,
          shadowColor: 'rgba(239, 83, 80, 0.3)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(239, 83, 80, 0.15)' },
              { offset: 1, color: 'rgba(239, 83, 80, 0.03)' }
            ]
          }
        }
      }
    ]
  })

  // 实时更新数据
  setInterval(() => {
    qualifiedData = qualifiedData.map(v => Math.max(90, Math.min(98, v + (Math.random() - 0.5) * 2)))
    defectData = defectData.map(v => Math.max(1, Math.min(8, v + (Math.random() - 0.5) * 1)))
    
    chartInstance?.setOption({
      series: [
        { data: qualifiedData },
        { data: defectData }
      ]
    })
  }, 2000)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance?.resize())
})
</script>

<style lang="scss" scoped>
.quality-chart {
  flex: 1;
  min-height: 420px;
  
  .chart-container {
    height: calc(100% - 56px);
  }
}
</style>
