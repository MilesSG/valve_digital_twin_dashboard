<template>
  <div class="realtime-gauge card">
    <div class="section-title">实时监控参数</div>
    <div class="gauges-grid">
      <div class="gauge-item">
        <div ref="tempGaugeRef" class="gauge-chart"></div>
        <div class="gauge-info">
          <div class="gauge-label">温度</div>
          <div class="gauge-value" style="color: #4A9EFF;">{{ avgTemperature.toFixed(1) }}°C</div>
        </div>
      </div>
      <div class="gauge-item">
        <div ref="pressureGaugeRef" class="gauge-chart"></div>
        <div class="gauge-info">
          <div class="gauge-label">压力</div>
          <div class="gauge-value" style="color: #52C41A;">{{ avgPressure.toFixed(2) }}MPa</div>
        </div>
      </div>
      <div class="gauge-item">
        <div ref="flowGaugeRef" class="gauge-chart"></div>
        <div class="gauge-info">
          <div class="gauge-label">流量</div>
          <div class="gauge-value" style="color: #FAAD14;">{{ avgFlow.toFixed(0) }}L/min</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMonitorStore } from '@/stores/monitor'

const store = useMonitorStore()
const tempGaugeRef = ref<HTMLDivElement>()
const pressureGaugeRef = ref<HTMLDivElement>()
const flowGaugeRef = ref<HTMLDivElement>()

let tempChart: echarts.ECharts | null = null
let pressureChart: echarts.ECharts | null = null
let flowChart: echarts.ECharts | null = null

const avgTemperature = computed(() => {
  if (store.devices.length === 0) return 0
  return store.devices.reduce((sum, d) => sum + d.temperature, 0) / store.devices.length
})

const avgPressure = computed(() => {
  if (store.devices.length === 0) return 0
  return store.devices.reduce((sum, d) => sum + d.pressure, 0) / store.devices.length
})

const avgFlow = computed(() => {
  if (store.devices.length === 0) return 0
  return store.devices.reduce((sum, d) => sum + d.flow, 0) / store.devices.length
})

function initGauge(chartRef: HTMLDivElement, value: number, max: number, name: string, colors: string[]) {
  const chart = echarts.init(chartRef)
  
  const option: EChartsOption = {
    series: [
      {
        name,
        type: 'gauge',
        center: ['50%', '65%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max,
        radius: '100%',
        splitNumber: 8,
        progress: {
          show: true,
          width: 8,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]
            },
            shadowBlur: 10,
            shadowColor: colors[0] + '80'
          }
        },
        axisLine: {
          lineStyle: {
            width: 8,
            color: [[1, 'rgba(74, 158, 255, 0.1)']]
          }
        },
        pointer: {
          length: '60%',
          width: 4,
          itemStyle: {
            color: colors[0],
            shadowBlur: 10,
            shadowColor: colors[0] + '80'
          }
        },
        axisTick: {
          distance: -14,
          length: 6,
          lineStyle: {
            color: 'rgba(160, 174, 192, 0.5)',
            width: 1
          }
        },
        splitLine: {
          distance: -16,
          length: 12,
          lineStyle: {
            color: 'rgba(160, 174, 192, 0.5)',
            width: 2
          }
        },
        axisLabel: {
          distance: -28,
          color: '#A0AEC0',
          fontSize: 10
        },
        detail: {
          show: false
        },
        data: [{ value }]
      }
    ]
  }
  
  chart.setOption(option)
  return chart
}

function updateGauges() {
  if (!tempGaugeRef.value || !pressureGaugeRef.value || !flowGaugeRef.value) return

  if (!tempChart) {
    tempChart = initGauge(tempGaugeRef.value, avgTemperature.value, 50, '温度', ['#4A9EFF', '#6FB4FF'])
  } else {
    tempChart.setOption({
      series: [{
        data: [{ value: avgTemperature.value }]
      }]
    })
  }

  if (!pressureChart) {
    pressureChart = initGauge(pressureGaugeRef.value, avgPressure.value, 5, '压力', ['#52C41A', '#73D13D'])
  } else {
    pressureChart.setOption({
      series: [{
        data: [{ value: avgPressure.value }]
      }]
    })
  }

  if (!flowChart) {
    flowChart = initGauge(flowGaugeRef.value, avgFlow.value, 300, '流量', ['#FAAD14', '#FFC53D'])
  } else {
    flowChart.setOption({
      series: [{
        data: [{ value: avgFlow.value }]
      }]
    })
  }
}

onMounted(() => {
  updateGauges()
  watch([avgTemperature, avgPressure, avgFlow], updateGauges)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  tempChart?.dispose()
  pressureChart?.dispose()
  flowChart?.dispose()
})

function handleResize() {
  tempChart?.resize()
  pressureChart?.resize()
  flowChart?.resize()
}
</script>

<style lang="scss" scoped>
.realtime-gauge {
  height: 280px;

  .gauges-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    height: calc(100% - 40px);

    .gauge-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      border: 1px solid rgba(74, 158, 255, 0.1);
      padding: 16px;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(74, 158, 255, 0.3);
        background: rgba(74, 158, 255, 0.05);
      }

      .gauge-chart {
        width: 100%;
        height: 140px;
      }

      .gauge-info {
        text-align: center;
        margin-top: -10px;

        .gauge-label {
          font-size: 12px;
          color: #A0AEC0;
          margin-bottom: 4px;
        }

        .gauge-value {
          font-size: 20px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
      }
    }
  }
}
</style>