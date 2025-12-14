<template>
  <div class="core-lines-monitor card-neon">
    <div class="section-title-neon">
      <PanelIcon type="production" />
      <span>{{ t('chart.coreLinesMonitor') }}</span>
      <div class="title-dot"></div>
    </div>

    <div class="lines-grid">
      <div
        v-for="(line, index) in coreLines"
        :key="line.id"
        class="line-card"
        :class="line.status"
      >
        <!-- 状态指示灯 -->
        <div class="status-lamp" :class="line.status">
          <div class="lamp-glow"></div>
        </div>

        <!-- 产线标题区 -->
        <div class="line-header">
          <div class="line-title-group">
            <h3 class="line-name">{{ line.name }}</h3>
            <div class="line-id-badge">{{ line.id }}</div>
          </div>
          <div class="status-badge-pill" :class="line.status">
            <div class="status-dot"></div>
            <span>{{ t(`status.${line.status}`) }}</span>
          </div>
        </div>

        <!-- 迷你甘特图 - 未来2-4小时排程 -->
        <div class="gantt-section micro-card">
          <div class="gantt-header">
            <span class="gantt-label">{{ t('chart.productionSchedule') }}</span>
            <span class="gantt-time-range">未来4小时</span>
          </div>
          <div class="mini-gantt">
            <div class="gantt-rows">
              <div
                v-for="(task, taskIndex) in line.schedule"
                :key="taskIndex"
                class="gantt-row"
              >
                <div
                  class="gantt-bar"
                  :class="[
                    task.status,
                    {
                      'idle-task': task.task.includes('待料') || task.task.includes('空闲'),
                      'down-task': task.task.includes('维护') || task.task.includes('停机') || task.task.includes('报警')
                    }
                  ]"
                  :style="{
                    left: `${(task.start / 4) * 100}%`,
                    width: `${(task.duration / 4) * 100}%`
                  }"
                  :title="task.task"
                >
                  <span class="gantt-bar-label">{{ task.task.length > 10 ? task.task.substring(0, 8) + '...' : task.task }}</span>
                </div>
              </div>
            </div>
            <div class="gantt-time-marks">
              <span
                v-for="(mark, markIndex) in getTimeMarks()"
                :key="markIndex"
                class="time-mark"
                :style="{ left: `${(markIndex / 4) * 100}%` }"
              >
                {{ mark }}
              </span>
            </div>
          </div>
        </div>

        <!-- 实时进度条 -->
        <div class="progress-section micro-card">
          <div class="progress-header">
            <span class="progress-label">{{ t('chart.currentOrderProgress') }}</span>
            <span class="progress-value mono-number">{{ formatPercent(line.orderProgress) }}%</span>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-track">
              <div
                class="progress-bar-fill"
                :style="{ width: `${line.orderProgress}%` }"
              >
                <div class="progress-shine"></div>
              </div>
            </div>
            <div class="progress-info">
              <span>{{ line.currentOrder }}</span>
              <span>{{ line.completedQty }} / {{ line.totalQty }} {{ t('chart.units') }}</span>
            </div>
          </div>
        </div>

        <!-- KPI指标区 -->
        <div class="kpi-grid micro-card">
          <div class="kpi-item">
            <div class="kpi-icon yield">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">{{ t('chart.yieldRate') }}</div>
              <div class="kpi-value-wrapper">
                <span class="kpi-value mono-number" :style="{ color: getYieldColor(line.yieldRate) }">
                  {{ formatPercent(line.yieldRate) }}%
                </span>
                <span class="kpi-trend trend-up">↑</span>
              </div>
            </div>
          </div>

          <div class="kpi-item">
            <div class="kpi-icon oee">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 12h6M12 9v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">{{ t('chart.oee') }}</div>
              <div class="kpi-value-wrapper">
                <span class="kpi-value mono-number" :style="{ color: getOEEColor(line.oee) }">
                  {{ formatPercent(line.oee) }}%
                </span>
                <span class="kpi-trend trend-up">↑</span>
              </div>
            </div>
          </div>

          <div class="kpi-item">
            <div class="kpi-icon cycle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">{{ t('chart.cycleTime') }}</div>
              <div class="kpi-value-wrapper">
                <span class="kpi-value mono-number" :style="{ color: getCycleTimeColor(line.cycleTime) }">
                  {{ Math.round(line.cycleTime) }}s
                </span>
                <span class="kpi-trend trend-down">↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import PanelIcon from '@/components/common/PanelIcon.vue'

const { t } = useI18n()

interface CoreLine {
  id: string
  name: string
  status: 'running' | 'starved' | 'alarm'
  orderProgress: number
  currentOrder: string
  completedQty: number
  totalQty: number
  yieldRate: number
  oee: number
  cycleTime: number
  schedule: Array<{
    task: string
    start: number // 小时偏移 (0-4)
    duration: number // 小时
    status: 'planned' | 'running' | 'completed'
  }>
}

const coreLines = ref<CoreLine[]>([
  {
    id: 'L1',
    name: '阀体加工线',
    status: 'running',
    orderProgress: 68,
    currentOrder: 'WO-2024-0123',
    completedQty: 136,
    totalQty: 200,
    yieldRate: 97.8,
    oee: 88.5,
    cycleTime: 145,
    schedule: [
      { task: 'WO-2024-0123', start: 0, duration: 1.5, status: 'running' },
      { task: 'WO-2024-0124', start: 1.5, duration: 1.2, status: 'planned' },
      { task: 'WO-2024-0125', start: 2.7, duration: 1.3, status: 'planned' }
    ]
  },
  {
    id: 'L2',
    name: '阀芯装配线',
    status: 'starved',
    orderProgress: 42,
    currentOrder: 'WO-2024-0126',
    completedQty: 84,
    totalQty: 200,
    yieldRate: 96.2,
    oee: 72.3,
    cycleTime: 168,
    schedule: [
      { task: 'WO-2024-0126', start: 0, duration: 0.8, status: 'running' },
      { task: '待料', start: 0.8, duration: 0.5, status: 'planned' },
      { task: 'WO-2024-0127', start: 1.3, duration: 1.5, status: 'planned' },
      { task: 'WO-2024-0128', start: 2.8, duration: 1.2, status: 'planned' }
    ]
  },
  {
    id: 'L3',
    name: '总装测试线',
    status: 'alarm',
    orderProgress: 55,
    currentOrder: 'WO-2024-0129',
    completedQty: 110,
    totalQty: 200,
    yieldRate: 94.5,
    oee: 65.8,
    cycleTime: 192,
    schedule: [
      { task: 'WO-2024-0129', start: 0, duration: 1.0, status: 'running' },
      { task: '设备维护', start: 1.0, duration: 0.8, status: 'planned' },
      { task: 'WO-2024-0130', start: 1.8, duration: 1.4, status: 'planned' },
      { task: 'WO-2024-0131', start: 3.2, duration: 0.8, status: 'planned' }
    ]
  }
])

let updateInterval: ReturnType<typeof setInterval> | null = null

// 数据格式化函数
function formatPercent(value: number): string {
  return Math.round(value * 10) / 10 + ''
}

// 获取时间标记（显示实际时间）
function getTimeMarks(): string[] {
  const now = new Date()
  const marks: string[] = []
  for (let i = 0; i <= 4; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000)
    const hours = time.getHours().toString().padStart(2, '0')
    const minutes = time.getMinutes().toString().padStart(2, '0')
    marks.push(`${hours}:${minutes}`)
  }
  return marks
}

// 颜色计算函数
function getYieldColor(rate: number): string {
  if (rate >= 97) return '#2E7D32'
  if (rate >= 95) return '#1976D2'
  return '#F57C00'
}

function getOEEColor(oee: number): string {
  if (oee >= 85) return '#2E7D32'
  if (oee >= 70) return '#1976D2'
  return '#F57C00'
}

function getCycleTimeColor(time: number): string {
  if (time <= 150) return '#2E7D32'
  if (time <= 180) return '#1976D2'
  return '#F57C00'
}


// 更新数据
function updateData() {
  coreLines.value.forEach((line, index) => {
    if (line.status === 'running') {
      // 更新进度
      line.orderProgress = Math.min(100, line.orderProgress + Math.random() * 0.3)
      line.completedQty = Math.round((line.orderProgress / 100) * line.totalQty)

      // 轻微波动KPI
      line.yieldRate = Math.max(94, Math.min(99, line.yieldRate + (Math.random() - 0.5) * 0.2))
      line.oee = Math.max(60, Math.min(95, line.oee + (Math.random() - 0.5) * 1))
      line.cycleTime = Math.max(120, Math.min(200, line.cycleTime + (Math.random() - 0.5) * 2))
    }
  })
}

onMounted(() => {
  updateInterval = setInterval(updateData, 6000)
})

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.core-lines-monitor {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .lines-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    min-height: 0;
  }

  .line-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
    border-radius: 18px;
    padding: 18px;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), inset 0 1px 3px rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px) saturate(180%);
    position: relative;
    overflow: visible;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;

    // 科技蓝装饰线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, $industrial-blue, transparent);
      opacity: 0.3;
    }

    // 状态指示灯
    .status-lamp {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      z-index: 2;

      .lamp-glow {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        animation: pulse-lamp 2s ease-in-out infinite;
      }

      &.running {
        background: #2E7D32;
        box-shadow: 0 0 12px rgba(46, 125, 50, 0.6);
        .lamp-glow {
          background: #4CAF50;
          box-shadow: 0 0 16px rgba(76, 175, 80, 0.8);
        }
      }

      &.starved {
        background: #1976D2;
        box-shadow: 0 0 12px rgba(25, 118, 210, 0.6);
        .lamp-glow {
          background: #42A5F5;
          box-shadow: 0 0 16px rgba(66, 165, 245, 0.8);
        }
      }

      &.alarm {
        background: #F57C00;
        box-shadow: 0 0 12px rgba(245, 124, 0, 0.6);
        .lamp-glow {
          background: #FFB74D;
          box-shadow: 0 0 16px rgba(255, 183, 77, 0.8);
        }
        animation: blink-alarm 1s ease-in-out infinite;
      }
    }

    // 产线标题
    .line-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;

      .line-title-group {
        display: flex;
        align-items: center;
        gap: 10px;

        .line-name {
          font-size: 16px;
          font-weight: 700;
          color: $text-primary;
          margin: 0;
        }

        .line-id-badge {
          padding: 4px 10px;
          background: linear-gradient(135deg, $forest-green, $industrial-blue);
          color: white;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(46, 125, 50, 0.25);
        }
      }

      .status-badge-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        &.running {
          background: linear-gradient(135deg, rgba(46, 125, 50, 0.95), rgba(76, 175, 80, 0.95));
          color: white;
          border: 1px solid rgba(46, 125, 50, 0.3);
          box-shadow: 0 2px 12px rgba(46, 125, 50, 0.3);

          .status-dot {
            background: white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          }
        }

        &.starved {
          background: linear-gradient(135deg, rgba(25, 118, 210, 0.95), rgba(66, 165, 245, 0.95));
          color: white;
          border: 1px solid rgba(25, 118, 210, 0.3);
          box-shadow: 0 2px 12px rgba(25, 118, 210, 0.3);

          .status-dot {
            background: white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          }
        }

        &.alarm {
          background: linear-gradient(135deg, rgba(245, 124, 0, 0.95), rgba(255, 183, 77, 0.95));
          color: white;
          border: 1px solid rgba(245, 124, 0, 0.3);
          box-shadow: 0 2px 12px rgba(245, 124, 0, 0.4);

          .status-dot {
            background: white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
            animation: blink-dot 1s ease-in-out infinite;
          }
        }
      }
    }

    // 内部微卡片样式
    .micro-card {
      background: rgba(248, 250, 252, 0.8);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8);
      min-height: 0;
      overflow: visible;
    }

    // 甘特图区域
    .gantt-section {

      .gantt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .gantt-label {
          font-size: 12px;
          font-weight: 600;
          color: $text-secondary;
        }

        .gantt-time-range {
          font-size: 11px;
          color: $text-tertiary;
        }
      }

      .mini-gantt {
        height: auto;
        min-height: 120px;
        width: 100%;
        position: relative;

        .gantt-rows {
          position: relative;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 8px;
          margin-bottom: 10px;
          padding: 8px 4px;
          min-height: 80px;

          .gantt-row {
            position: relative;
            height: 24px;
            margin-bottom: 6px;

            &:last-child {
              margin-bottom: 0;
            }

            .gantt-bar {
              position: absolute;
              top: 0;
              height: 24px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              padding: 0 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;

              &.planned {
                background: rgba(148, 163, 184, 0.2);
                border: 1.5px dashed #94A3B8;
                border-radius: 6px;

                .gantt-bar-label {
                  color: #64748B;
                  text-shadow: none;
                }
              }

              // 待料/空闲任务 - 浅灰色虚线框
              &.idle-task,
              &.planned.idle-task {
                background: rgba(241, 245, 249, 0.5);
                border: 1.5px dashed #CBD5E1;
                border-radius: 6px;

                .gantt-bar-label {
                  color: #94A3B8;
                  text-shadow: none;
                }
              }

              // 报警/停机任务 - 橙色/红色斜纹
              &.down-task {
                background: linear-gradient(135deg, #F57C00, #FF9800);
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(245, 124, 0, 0.5);

                &::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 4px,
                    rgba(255, 255, 255, 0.25) 4px,
                    rgba(255, 255, 255, 0.25) 8px
                  );
                }

                .gantt-bar-label {
                  color: #fff;
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                  position: relative;
                  z-index: 1;
                }
              }

              &.running {
                background: linear-gradient(135deg, #1B5E20, #2E7D32);
                box-shadow: 0 0 8px rgba(46, 125, 50, 0.4);
                animation: pulse-running 2s ease-in-out infinite;

                .gantt-bar-label {
                  color: #fff;
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
              }

              &.completed {
                background: linear-gradient(135deg, #64748B, #94A3B8);
                opacity: 0.6;

                .gantt-bar-label {
                  color: #fff;
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
              }

              .gantt-bar-label {
                font-size: 9px;
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
              }
            }
          }
        }

        .gantt-time-marks {
          position: relative;
          height: 20px;
          padding: 0 2px;

          .time-mark {
            position: absolute;
            transform: translateX(-50%);
            font-size: 10px;
            color: #64748B;
            font-weight: 600;
            font-family: 'Roboto Mono', 'Consolas', monospace;
          }
        }
      }
    }

    // 进度条区域
    .progress-section {
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;

        .progress-label {
          font-size: 13px;
          font-weight: 600;
          color: $text-secondary;
        }

        .progress-value {
          font-size: 18px;
          font-weight: 800;
          color: $forest-green;
        }
      }

      .progress-bar-wrapper {
        .progress-bar-track {
          height: 12px;
          background: rgba(15, 23, 42, 0.08);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 6px;

          .progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, $forest-green, $industrial-blue);
            border-radius: 10px;
            position: relative;
            transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);

            .progress-shine {
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

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: $text-tertiary;
          font-feature-settings: 'tnum';

          span:first-child {
            font-family: 'Consolas', 'Monaco', monospace;
          }
        }
      }
    }

    // KPI网格
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      min-height: 0;

      .kpi-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 8px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.04);
        flex: 1;
        min-width: 0;
        overflow: hidden;

        .kpi-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          &.yield {
            background: rgba(46, 125, 50, 0.15);
            color: $forest-green;
          }

          &.oee {
            background: rgba(25, 118, 210, 0.15);
            color: $industrial-blue;
          }

          &.cycle {
            background: rgba(245, 124, 0, 0.15);
            color: $warning-color;
          }

          svg {
            width: 16px;
            height: 16px;
          }
        }

        .kpi-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          flex: 1;
          overflow: hidden;

          .kpi-label {
            font-size: 10px;
            font-weight: 500;
            color: $text-secondary;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
          }

          .kpi-value-wrapper {
            display: flex;
            align-items: baseline;
            gap: 4px;
            min-width: 0;

            .kpi-value {
              font-size: 14px;
              font-weight: 800;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.2;
            }

            .kpi-trend {
              font-size: 11px;
              font-weight: 800;
              line-height: 1;
              flex-shrink: 0;

              &.trend-up {
                color: #2E7D32;
              }

              &.trend-down {
                color: #F57C00;
              }
            }
          }
        }
      }
    }

    // 等宽字体（Monospaced Font）
    .mono-number {
      font-family: 'Roboto Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
      font-feature-settings: 'tnum', 'lnum';
      letter-spacing: 0.5px;
    }

    &:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(255, 255, 255, 0.7);
      border-color: rgba(255, 255, 255, 0.6);
    }
  }
}

@keyframes pulse-lamp {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes blink-alarm {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
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

@keyframes pulse-running {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 8px rgba(46, 125, 50, 0.4);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 12px rgba(46, 125, 50, 0.6);
  }
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

@keyframes blink-dot {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

// 响应式
@media (max-width: 1600px) {
  .core-lines-monitor .lines-grid {
    grid-template-columns: 1fr;
  }
}
</style>

