<template>
  <div class="production-lines">
    <div class="section-header">
      <div class="section-title-neon">
        <PanelIcon type="production" />
        <span>{{ t('chart.productionLines') }}</span>
        <div class="title-dot"></div>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">{{ t('chart.totalOutput') }}</span>
          <span class="stat-value">{{ totalOutput }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">{{ t('chart.avgQuality') }}</span>
          <span class="stat-value" :style="{ color: avgQualityColor }">{{ avgQuality }}%</span>
        </div>
      </div>
    </div>

    <div class="lines-container">
      <div
        v-for="(line, index) in productionLines"
        :key="line.id"
        class="production-line-card"
        :class="[`line-${index + 1}`, line.status]"
      >
        <!-- 左侧信息区 -->
        <div class="line-info">
          <div class="line-header">
            <div class="line-title-group">
              <div class="line-number">{{ line.id }}</div>
              <div class="line-details">
                <h3 class="line-name">{{ line.name }}</h3>
                <p class="line-product">{{ line.product }}</p>
              </div>
            </div>

            <div class="line-status-badge" :class="line.status">
              <div class="status-dot"></div>
              <span>{{ t(`status.${line.status}`) }}</span>
            </div>
          </div>

          <div class="line-metrics">
            <!-- 生产进度 -->
            <div class="metric-item">
              <div class="metric-header">
                <span class="metric-label">{{ t('chart.productionProgress') }}</span>
                <span class="metric-value">{{ line.progress }}%</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-track">
                  <div
                    class="progress-bar-fill"
                    :style="{ width: `${line.progress}%` }"
                  >
                    <div class="progress-glow"></div>
                  </div>
                </div>
              </div>
              <div class="metric-subtitle">
                {{ line.currentOutput }} / {{ line.targetOutput }} {{ t('chart.units') }}
              </div>
            </div>

            <!-- 质量和设备利用率 -->
            <div class="metric-row">
              <div class="metric-box">
                <div class="metric-icon" :style="{ background: qualityColor(line.qualityRate) }">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-mini-label">{{ t('chart.qualityRate') }}</span>
                  <span class="metric-mini-value" :style="{ color: qualityColor(line.qualityRate) }">
                    {{ line.qualityRate }}%
                  </span>
                </div>
              </div>

              <div class="metric-box">
                <div class="metric-icon" :style="{ background: utilizationColor(line.utilization) }">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" stroke-width="2" fill="none"/>
                    <path d="M9 12h6M12 9v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-mini-label">{{ t('chart.utilization') }}</span>
                  <span class="metric-mini-value" :style="{ color: utilizationColor(line.utilization) }">
                    {{ line.utilization }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧图表区 -->
        <div class="line-chart">
          <div class="chart-header">{{ t('chart.hourlyTrend') }}</div>
          <div :ref="el => chartRefs[index] = el" class="mini-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import PanelIcon from '@/components/common/PanelIcon.vue'

const { t } = useI18n()

interface ProductionLine {
  id: string
  name: string
  product: string
  status: 'running' | 'idle' | 'maintenance'
  progress: number
  currentOutput: number
  targetOutput: number
  qualityRate: number
  utilization: number
  trendData: number[]
}

const productionLines = ref<ProductionLine[]>([
  {
    id: 'A线',
    name: '电动球阀生产线',
    product: 'Q941F-16C DN50',
    status: 'running',
    progress: 78,
    currentOutput: 156,
    targetOutput: 200,
    qualityRate: 98.2,
    utilization: 92,
    trendData: Array.from({ length: 12 }, () => 10 + Math.random() * 8)
  },
  {
    id: 'B线',
    name: '气动蝶阀生产线',
    product: 'D671X-10 DN80',
    status: 'running',
    progress: 65,
    currentOutput: 130,
    targetOutput: 200,
    qualityRate: 96.8,
    utilization: 88,
    trendData: Array.from({ length: 12 }, () => 8 + Math.random() * 7)
  },
  {
    id: 'C线',
    name: '调节阀生产线',
    product: 'ZAZP-16C DN65',
    status: 'maintenance',
    progress: 42,
    currentOutput: 84,
    targetOutput: 200,
    qualityRate: 97.5,
    utilization: 45,
    trendData: Array.from({ length: 12 }, () => 3 + Math.random() * 5)
  }
])

const chartRefs = ref<HTMLDivElement[]>([])
const chartInstances: echarts.ECharts[] = []
let updateInterval: ReturnType<typeof setInterval> | null = null

// 总产量
const totalOutput = computed(() => {
  return productionLines.value.reduce((sum, line) => sum + line.currentOutput, 0)
})

// 平均质量
const avgQuality = computed(() => {
  const avg = productionLines.value.reduce((sum, line) => sum + line.qualityRate, 0) / productionLines.value.length
  return avg.toFixed(1)
})

const avgQualityColor = computed(() => {
  const avg = parseFloat(avgQuality.value)
  if (avg >= 98) return '#2E7D32'
  if (avg >= 95) return '#1976D2'
  return '#F57C00'
})

// 质量颜色
function qualityColor(rate: number): string {
  if (rate >= 98) return '#2E7D32'
  if (rate >= 95) return '#1976D2'
  return '#F57C00'
}

// 利用率颜色
function utilizationColor(rate: number): string {
  if (rate >= 85) return '#2E7D32'
  if (rate >= 70) return '#1976D2'
  return '#F57C00'
}

// 初始化图表
function initCharts() {
  chartRefs.value.forEach((chartRef, index) => {
    if (!chartRef) return

    const chart = echarts.init(chartRef)
    const line = productionLines.value[index]

    chart.setOption({
      backgroundColor: 'transparent',
      grid: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        type: 'line',
        data: line.trendData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2.5,
          color: line.status === 'running' ? '#2E7D32' :
                 line.status === 'idle' ? '#1976D2' : '#F57C00',
          shadowBlur: 8,
          shadowColor: line.status === 'running' ? 'rgba(46, 125, 50, 0.3)' :
                       line.status === 'idle' ? 'rgba(25, 118, 210, 0.3)' :
                       'rgba(245, 124, 0, 0.3)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: line.status === 'running' ? 'rgba(46, 125, 50, 0.2)' :
                       line.status === 'idle' ? 'rgba(25, 118, 210, 0.2)' :
                       'rgba(245, 124, 0, 0.2)'
              },
              {
                offset: 1,
                color: line.status === 'running' ? 'rgba(46, 125, 50, 0.02)' :
                       line.status === 'idle' ? 'rgba(25, 118, 210, 0.02)' :
                       'rgba(245, 124, 0, 0.02)'
              }
            ]
          }
        }
      }]
    })

    chartInstances.push(chart)
  })
}

// 更新数据
function updateData() {
  productionLines.value.forEach((line, index) => {
    if (line.status === 'running') {
      // 更新进度
      line.progress = Math.min(100, line.progress + Math.random() * 0.5)
      line.currentOutput = Math.round((line.progress / 100) * line.targetOutput)

      // 更新趋势数据
      line.trendData.shift()
      line.trendData.push(10 + Math.random() * 8)

      // 轻微波动质量和利用率
      line.qualityRate = Math.max(95, Math.min(100, line.qualityRate + (Math.random() - 0.5) * 0.2))
      line.utilization = Math.max(80, Math.min(100, line.utilization + (Math.random() - 0.5) * 1))
    } else if (line.status === 'idle') {
      line.trendData.shift()
      line.trendData.push(Math.random() * 2)
    } else {
      line.trendData.shift()
      line.trendData.push(0)
    }

    // 更新图表
    if (chartInstances[index]) {
      chartInstances[index].setOption({
        series: [{
          data: line.trendData
        }]
      })
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    initCharts()
    // 每5秒更新一次数据
    updateInterval = setInterval(updateData, 5000)
  }, 100)

  window.addEventListener('resize', () => {
    chartInstances.forEach(chart => chart?.resize())
  })
})

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  chartInstances.forEach(chart => chart?.dispose())
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.production-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-stats {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid $card-border;

      .stat-item {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: $text-secondary;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: $forest-green;
          font-feature-settings: 'tnum';
        }
      }

      .stat-divider {
        width: 1px;
        height: 24px;
        background: rgba(0, 0, 0, 0.08);
      }
    }
  }

  .lines-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .production-line-card {
    display: flex;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
    border-radius: 18px;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;

    // 状态指示条
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      transition: all 0.3s;
    }

    &.running::before {
      background: linear-gradient(180deg, $forest-green, $forest-green-light);
      box-shadow: 0 0 12px rgba(46, 125, 50, 0.4);
    }

    &.idle::before {
      background: linear-gradient(180deg, $industrial-blue, $industrial-blue-light);
      box-shadow: 0 0 12px rgba(25, 118, 210, 0.4);
    }

    &.maintenance::before {
      background: linear-gradient(180deg, $warning-color, $warning-light);
      box-shadow: 0 0 12px rgba(245, 124, 0, 0.4);
    }

    &:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.6);
    }

    .line-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .line-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .line-title-group {
          display: flex;
          align-items: center;
          gap: 14px;

          .line-number {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, $forest-green, $industrial-blue);
            border-radius: 12px;
            font-size: 18px;
            font-weight: 800;
            color: white;
            box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
          }

          .line-details {
            .line-name {
              font-size: 17px;
              font-weight: 700;
              color: $text-primary;
              margin: 0 0 4px 0;
            }

            .line-product {
              font-size: 12px;
              font-weight: 500;
              color: $text-secondary;
              margin: 0;
              font-family: 'Consolas', 'Monaco', monospace;
            }
          }
        }

        .line-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(8px);

          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse-status 2s ease-in-out infinite;
          }

          &.running {
            background: rgba(46, 125, 50, 0.12);
            color: $forest-green-dark;
            border: 1px solid rgba(46, 125, 50, 0.25);

            .status-dot {
              background: $forest-green;
              box-shadow: 0 0 8px rgba(46, 125, 50, 0.6);
            }
          }

          &.idle {
            background: rgba(25, 118, 210, 0.12);
            color: $industrial-blue-dark;
            border: 1px solid rgba(25, 118, 210, 0.25);

            .status-dot {
              background: $industrial-blue;
              box-shadow: 0 0 8px rgba(25, 118, 210, 0.6);
            }
          }

          &.maintenance {
            background: rgba(245, 124, 0, 0.12);
            color: $warning-color;
            border: 1px solid rgba(245, 124, 0, 0.25);

            .status-dot {
              background: $warning-color;
              box-shadow: 0 0 8px rgba(245, 124, 0, 0.6);
            }
          }
        }
      }

      .line-metrics {
        display: flex;
        flex-direction: column;
        gap: 14px;

        .metric-item {
          .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 8px;

            .metric-label {
              font-size: 13px;
              font-weight: 600;
              color: $text-secondary;
            }

            .metric-value {
              font-size: 20px;
              font-weight: 800;
              color: $forest-green;
              font-feature-settings: 'tnum';
            }
          }

          .progress-bar-container {
            margin-bottom: 6px;

            .progress-bar-track {
              height: 14px;
              background: rgba(15, 23, 42, 0.08);
              border-radius: 10px;
              overflow: hidden;
              box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);

              .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, $forest-green, $industrial-blue);
                border-radius: 10px;
                position: relative;
                transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);

                .progress-glow {
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
                  animation: progress-shine 2.5s ease-in-out infinite;
                }
              }
            }
          }

          .metric-subtitle {
            font-size: 12px;
            font-weight: 600;
            color: $text-tertiary;
            font-feature-settings: 'tnum';
          }
        }

        .metric-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;

          .metric-box {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 10px;
            border: 1px solid rgba(0, 0, 0, 0.04);

            .metric-icon {
              width: 36px;
              height: 36px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .metric-data {
              display: flex;
              flex-direction: column;
              gap: 2px;

              .metric-mini-label {
                font-size: 11px;
                font-weight: 500;
                color: $text-secondary;
              }

              .metric-mini-value {
                font-size: 16px;
                font-weight: 800;
                font-feature-settings: 'tnum';
              }
            }
          }
        }
      }
    }

    .line-chart {
      width: 280px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.04);

      .chart-header {
        font-size: 12px;
        font-weight: 600;
        color: $text-secondary;
        text-align: center;
      }

      .mini-chart {
        flex: 1;
        min-height: 80px;
      }
    }
  }
}

@keyframes pulse-status {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes progress-shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

// 滚动条样式
.lines-container::-webkit-scrollbar {
  width: 6px;
}

.lines-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
}

.lines-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, $forest-green-light, $industrial-blue-light);
  border-radius: 3px;

  &:hover {
    background: linear-gradient(180deg, $forest-green, $industrial-blue);
  }
}
</style>
