<template>
  <div class="factory-3d-view card">
    <div class="view-header">
      <div class="section-title">工厂3D平面布局</div>
      <div class="control-bar">
        <el-button-group size="small">
          <el-button @click="resetView">
            <el-icon><Refresh /></el-icon>
            重置视图
          </el-button>
          <el-button @click="autoRotate = !autoRotate">
            <el-icon><VideoPlay /></el-icon>
            {{ autoRotate ? '停止旋转' : '自动旋转' }}
          </el-icon>
          </el-button>
        </el-button-group>
        <el-button-group size="small" class="ml-3">
          <el-button @click="filterStatus = null" :type="filterStatus === null ? 'primary' : 'default'">
            全部
          </el-button>
          <el-button @click="filterStatus = 'normal'" :type="filterStatus === 'normal' ? 'primary' : 'default'">
            <span class="status-dot normal"></span>
            正常
          </el-button>
          <el-button @click="filterStatus = 'warning'" :type="filterStatus === 'warning' ? 'primary' : 'default'">
            <span class="status-dot warning"></span>
            预警
          </el-button>
          <el-button @click="filterStatus = 'error'" :type="filterStatus === 'error' ? 'primary' : 'default'">
            <span class="status-dot error"></span>
            故障
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
    <div class="stats-overlay">
      <div class="stat-item">
        <span class="label">总设备</span>
        <span class="value">{{ store.devices.length }}</span>
      </div>
      <div class="stat-item success">
        <span class="label">正常</span>
        <span class="value">{{ store.normalDevices }}</span>
      </div>
      <div class="stat-item warning">
        <span class="label">预警</span>
        <span class="value">{{ store.warningDevices }}</span>
      </div>
      <div class="stat-item error">
        <span class="label">故障</span>
        <span class="value">{{ store.errorDevices }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import type { EChartsOption } from 'echarts'
import { useMonitorStore } from '@/stores/monitor'
import { getStatusColor } from '@/utils/echarts-config'
import type { DeviceStatus } from '@/types'
import { Refresh, VideoPlay } from '@element-plus/icons-vue'

const store = useMonitorStore()
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const filterStatus = ref<DeviceStatus | null>(null)
const autoRotate = ref(false)

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

  // 创建3D场景配置
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (params: any) => {
        if (!params.data) return ''
        const device = params.data.device
        return `
          <div style="padding: 12px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${device.name}</div>
            <div style="color: #A0AEC0; margin-bottom: 4px;">类型: ${device.type}</div>
            <div style="color: #A0AEC0; margin-bottom: 4px;">区域: ${device.zone}</div>
            <div style="color: ${getStatusColor(device.status)}; margin-bottom: 8px;">状态: ${getStatusText(device.status)}</div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 8px;">
              <div style="color: #A0AEC0;">温度: <span style="color: #4A9EFF;">${device.temperature}°C</span></div>
              <div style="color: #A0AEC0;">压力: <span style="color: #52C41A;">${device.pressure}MPa</span></div>
              <div style="color: #A0AEC0;">流量: <span style="color: #FAAD14;">${device.flow}L/min</span></div>
            </div>
          </div>
        `
      },
      backgroundColor: 'rgba(15, 27, 54, 0.95)',
      borderColor: 'rgba(74, 158, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#FFFFFF'
      }
    },
    xAxis3D: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    yAxis3D: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    zAxis3D: {
      type: 'value',
      min: 0,
      max: 50,
      show: false
    },
    grid3D: {
      boxWidth: 100,
      boxDepth: 100,
      boxHeight: 50,
      environment: 'none',
      light: {
        main: {
          intensity: 1.2,
          shadow: true,
          shadowQuality: 'high'
        },
        ambient: {
          intensity: 0.6
        },
        ambientCubemap: {
          diffuseIntensity: 0.5,
          specularIntensity: 0.5
        }
      },
      viewControl: {
        autoRotate: autoRotate.value,
        autoRotateSpeed: 10,
        distance: 200,
        alpha: 30,
        beta: 40,
        minAlpha: 10,
        maxAlpha: 90,
        minBeta: -80,
        maxBeta: 80
      },
      postEffect: {
        enable: true,
        bloom: {
          enable: true,
          intensity: 0.1
        },
        SSAO: {
          enable: true,
          radius: 2,
          intensity: 1
        }
      }
    },
    series: [
      // 地面
      {
        type: 'surface',
        parametric: true,
        wireframe: {
          show: false
        },
        shading: 'realistic',
        realisticMaterial: {
          roughness: 0.8,
          metalness: 0.2
        },
        parametricEquation: {
          u: { min: 0, max: 100, step: 10 },
          v: { min: 0, max: 100, step: 10 },
          x: (u: number) => u,
          y: (v: number) => v,
          z: () => 0
        },
        itemStyle: {
          color: 'rgba(30, 50, 80, 0.5)'
        }
      },
      // 厂房建筑物（使用bar3D模拟）
      {
        type: 'bar3D',
        name: '建筑物',
        data: [
          // A区车间
          { value: [25, 25, 15], itemStyle: { color: 'rgba(74, 158, 255, 0.3)' } },
          // B区车间
          { value: [75, 25, 15], itemStyle: { color: 'rgba(250, 173, 20, 0.3)' } },
          // C区车间
          { value: [25, 75, 15], itemStyle: { color: 'rgba(82, 196, 26, 0.3)' } },
          // D区车间
          { value: [75, 75, 15], itemStyle: { color: 'rgba(19, 194, 194, 0.3)' } }
        ],
        shading: 'realistic',
        realisticMaterial: {
          roughness: 0.5,
          metalness: 0.5
        },
        label: {
          show: true,
          distance: 0,
          formatter: (params: any) => {
            const zones = ['A区车间', 'B区车间', 'C区车间', 'D区车间']
            return zones[params.dataIndex]
          },
          textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
            borderWidth: 1,
            borderColor: 'rgba(74, 158, 255, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 4,
            borderRadius: 4
          }
        },
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            color: 'rgba(74, 158, 255, 0.8)'
          }
        }
      },
      // 设备点位（使用scatter3D）
      {
        type: 'scatter3D',
        name: '设备',
        symbolSize: 12,
        data: devices.map(device => ({
          value: [device.position.x, device.position.y, 5],
          device,
          itemStyle: {
            color: getStatusColor(device.status),
            opacity: 0.9
          },
          label: {
            show: true,
            formatter: device.id,
            distance: 2,
            textStyle: {
              color: '#FFFFFF',
              fontSize: 10,
              borderWidth: 1,
              borderColor: getStatusColor(device.status),
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 2,
              borderRadius: 3
            }
          }
        })),
        emphasis: {
          itemStyle: {
            opacity: 1,
            borderWidth: 3,
            borderColor: '#FFFFFF'
          },
          label: {
            show: true,
            distance: 5,
            textStyle: {
              fontSize: 12
            }
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)

  // 点击事件
  chartInstance.on('click', (params: any) => {
    if (params.seriesType === 'scatter3D' && params.data && params.data.device) {
      console.log('点击设备:', params.data.device)
      // 这里可以打开设备详情弹窗
    }
  })
}

function resetView() {
  if (chartInstance) {
    chartInstance.dispatchAction({
      type: 'restore'
    })
  }
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

onMounted(() => {
  initChart()
  watch(() => store.devices, updateChart, { deep: true })
  watch(filterStatus, updateChart)
  watch(autoRotate, updateChart)
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
.factory-3d-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;

  .view-header {
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
        margin-right: 6px;

        &.normal {
          background: #52C41A;
          box-shadow: 0 0 6px #52C41A;
        }

        &.warning {
          background: #FAAD14;
          box-shadow: 0 0 6px #FAAD14;
        }

        &.error {
          background: #FF4D4F;
          box-shadow: 0 0 6px #FF4D4F;
        }
      }
    }
  }

  .chart-container {
    flex: 1;
    min-height: 500px;
  }

  .stats-overlay {
    position: absolute;
    bottom: 30px;
    left: 30px;
    display: flex;
    gap: 16px;
    z-index: 10;

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px 20px;
      background: rgba(15, 27, 54, 0.8);
      border: 1px solid rgba(74, 158, 255, 0.3);
      border-radius: 8px;
      backdrop-filter: blur(10px);

      .label {
        font-size: 12px;
        color: #A0AEC0;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        color: #4A9EFF;
      }

      &.success .value {
        color: #52C41A;
      }

      &.warning .value {
        color: #FAAD14;
      }

      &.error .value {
        color: #FF4D4F;
      }
    }
  }
}
</style>
