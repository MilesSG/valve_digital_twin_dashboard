<template>
  <div class="device-monitor card">
    <div class="monitor-header">
      <div class="section-title">工厂平面布局</div>
      <div class="control-bar">
        <el-button-group>
          <el-button :type="viewMode === 'map' ? 'primary' : 'default'" @click="viewMode = 'map'">
            <el-icon><MapLocation /></el-icon>
            平面图
          </el-button>
          <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
            <el-icon><List /></el-icon>
            列表视图
          </el-button>
        </el-button-group>
        <el-button-group>
          <el-button @click="filterStatus = null">
            <el-icon><Close /></el-icon>
            全部
          </el-button>
          <el-button @click="filterStatus = 'normal'">
            <span class="status-dot normal"></span>
            正常
          </el-button>
          <el-button @click="filterStatus = 'warning'">
            <span class="status-dot warning"></span>
            预警
          </el-button>
          <el-button @click="filterStatus = 'error'">
            <span class="status-dot error"></span>
            故障
          </el-button>
        </el-button-group>
        <el-button :icon="Refresh" circle @click="handleRefresh" />
      </div>
    </div>
    <div class="monitor-content">
      <div v-if="viewMode === 'map'" ref="chartRef" class="chart-container"></div>
      <div v-else class="list-view">
        <el-table :data="filteredDevices" style="width: 100%" stripe>
          <el-table-column prop="id" label="设备编号" width="120" />
          <el-table-column prop="name" label="设备名称" width="180" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="zone" label="区域" width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="temperature" label="温度(°C)" width="100" />
          <el-table-column prop="pressure" label="压力(MPa)" width="100" />
          <el-table-column prop="flow" label="流量(L/min)" width="120" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMonitorStore } from '@/stores/monitor'
import { getStatusColor } from '@/utils/echarts-config'
import type { Device, DeviceStatus } from '@/types'
import { MapLocation, List, Refresh, Close } from '@element-plus/icons-vue'

const store = useMonitorStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const viewMode = ref<'map' | 'list'>('map')
const filterStatus = ref<DeviceStatus | null>(null)

const filteredDevices = computed(() => {
  if (!filterStatus.value) return store.devices
  return store.devices.filter(d => d.status === filterStatus.value)
})

function initChart() {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const devices = filterStatus.value 
    ? store.devices.filter(d => d.status === filterStatus.value)
    : store.devices

  // 绘制工厂平面图
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50,
      containLabel: false
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 60,
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const device = devices.find(d => d.name === params.name)
        if (!device) return ''
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 8px;">${device.name}</div>
            <div>类型: ${device.type}</div>
            <div>区域: ${device.zone}</div>
            <div>状态: ${getStatusText(device.status)}</div>
            <div>温度: ${device.temperature}°C</div>
            <div>压力: ${device.pressure}MPa</div>
            <div>流量: ${device.flow}L/min</div>
          </div>
        `
      }
    },
    graphic: [
      // 绘制厂房轮廓
      {
        type: 'rect',
        shape: {
          x: 10,
          y: 10,
          width: 80,
          height: 40
        },
        style: {
          fill: '#f5f5f5',
          stroke: '#e8e8e8',
          lineWidth: 2
        }
      },
      // A区车间
      {
        type: 'rect',
        shape: {
          x: 15,
          y: 15,
          width: 35,
          height: 18
        },
        style: {
          fill: 'rgba(91, 143, 249, 0.1)',
          stroke: '#5B8FF9',
          lineWidth: 1
        }
      },
      {
        type: 'text',
        style: {
          text: 'A区车间',
          x: 32.5,
          y: 24,
          fontSize: 12,
          fill: '#5B8FF9',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      },
      // B区车间
      {
        type: 'rect',
        shape: {
          x: 55,
          y: 15,
          width: 35,
          height: 18
        },
        style: {
          fill: 'rgba(250, 173, 20, 0.1)',
          stroke: '#FAAD14',
          lineWidth: 1
        }
      },
      {
        type: 'text',
        style: {
          text: 'B区车间',
          x: 72.5,
          y: 24,
          fontSize: 12,
          fill: '#FAAD14',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      },
      // C区车间
      {
        type: 'rect',
        shape: {
          x: 15,
          y: 37,
          width: 35,
          height: 18
        },
        style: {
          fill: 'rgba(82, 196, 26, 0.1)',
          stroke: '#52C41A',
          lineWidth: 1
        }
      },
      {
        type: 'text',
        style: {
          text: 'C区车间',
          x: 32.5,
          y: 46,
          fontSize: 12,
          fill: '#52C41A',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      },
      // D区车间
      {
        type: 'rect',
        shape: {
          x: 55,
          y: 37,
          width: 35,
          height: 18
        },
        style: {
          fill: 'rgba(19, 194, 194, 0.1)',
          stroke: '#13C2C2',
          lineWidth: 1
        }
      },
      {
        type: 'text',
        style: {
          text: 'D区车间',
          x: 72.5,
          y: 46,
          fontSize: 12,
          fill: '#13C2C2',
          textAlign: 'center',
          textVerticalAlign: 'middle'
        }
      },
      // 管道线条
      {
        type: 'line',
        shape: {
          x1: 15,
          y1: 24,
          x2: 90,
          y2: 24
        },
        style: {
          stroke: '#d9d9d9',
          lineWidth: 3,
          lineDash: [5, 5]
        }
      },
      {
        type: 'line',
        shape: {
          x1: 50,
          y1: 15,
          x2: 50,
          y2: 55
        },
        style: {
          stroke: '#d9d9d9',
          lineWidth: 3,
          lineDash: [5, 5]
        }
      }
    ],
    series: [
      {
        name: '设备位置',
        type: 'scatter',
        data: devices.map(device => ({
          value: [device.position.x, device.position.y],
          name: device.name,
          device,
          symbolSize: 20,
          itemStyle: {
            color: getStatusColor(device.status),
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: device.id,
            fontSize: 10,
            color: '#262626',
            position: 'bottom',
            offset: [0, 5]
          }
        })),
        emphasis: {
          itemStyle: {
            borderColor: '#262626',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          scale: true
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 点击事件
  chartInstance.on('click', (params: any) => {
    if (params.data && params.data.device) {
      console.log('点击设备:', params.data.device)
      // 这里可以打开设备详情弹窗
    }
  })
}

function handleRefresh() {
  store.refreshData()
}

function getStatusText(status: DeviceStatus): string {
  const map = {
    normal: '正常',
    warning: '预警',
    error: '故障',
    offline: '离线'
  }
  return map[status]
}

function getStatusTagType(status: DeviceStatus): string {
  const map = {
    normal: 'success',
    warning: 'warning',
    error: 'danger',
    offline: 'info'
  }
  return map[status]
}

onMounted(() => {
  if (viewMode.value === 'map') {
    initChart()
  }
  watch(() => store.devices, () => {
    if (viewMode.value === 'map') {
      updateChart()
    }
  }, { deep: true })
  watch(filterStatus, () => {
    if (viewMode.value === 'map') {
      updateChart()
    }
  })
  watch(viewMode, (newVal) => {
    if (newVal === 'map' && !chartInstance) {
      initChart()
    } else if (newVal === 'map' && chartInstance) {
      updateChart()
    }
  })
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
.device-monitor {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .control-bar {
      display: flex;
      gap: 12px;
      align-items: center;

      .status-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;

        &.normal {
          background: #52C41A;
        }

        &.warning {
          background: #FAAD14;
        }

        &.error {
          background: #FF4D4F;
        }
      }
    }
  }

  .monitor-content {
    flex: 1;
    min-height: 0;

    .chart-container {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }

    .list-view {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
