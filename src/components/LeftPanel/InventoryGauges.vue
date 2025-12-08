<template>
  <div class="inventory-gauges card-neon">
    <div class="section-title-neon">
      <span>{{ t('leftPanel.inventoryStatus') }}</span>
      <div class="title-dot"></div>
    </div>

    <div class="gauges-grid">
      <div class="gauge-item" v-for="item in inventoryData" :key="item.name">
        <div class="gauge-container">
          <svg :width="gaugeSize" :height="gaugeSize" class="gauge-svg">
            <!-- 背景圆弧 -->
            <path
              :d="getArcPath(gaugeSize / 2, gaugeSize / 2, radius, -135, 135)"
              :stroke="'rgba(0, 0, 0, 0.06)'"
              :stroke-width="strokeWidth"
              fill="none"
              stroke-linecap="round"
            />
            <!-- 进度圆弧 -->
            <path
              :d="getArcPath(gaugeSize / 2, gaugeSize / 2, radius, -135, calculateAngle(item.percentage))"
              :stroke="getGaugeColor(item.percentage)"
              :stroke-width="strokeWidth"
              fill="none"
              stroke-linecap="round"
              class="gauge-progress"
              :style="{ filter: `drop-shadow(0 0 6px ${getGaugeColor(item.percentage)}40)` }"
            />
            <!-- 中心文字 -->
            <text
              :x="gaugeSize / 2"
              :y="gaugeSize / 2 - 4"
              text-anchor="middle"
              dominant-baseline="middle"
              class="gauge-value"
              :fill="getGaugeColor(item.percentage)"
            >
              {{ item.percentage }}%
            </text>
            <text
              :x="gaugeSize / 2"
              :y="gaugeSize / 2 + 16"
              text-anchor="middle"
              dominant-baseline="middle"
              class="gauge-label"
              fill="#94A3B8"
            >
              {{ item.name }}
            </text>
          </svg>
        </div>

        <!-- 状态指示器 -->
        <div class="status-indicator" :class="getStatusClass(item.percentage)">
          <div class="status-dot"></div>
          <span class="status-text">{{ getStatusText(item.percentage) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 仪表盘尺寸配置（苹果风格：简洁、适中）
const gaugeSize = 72
const radius = 26
const strokeWidth = 6 // 加粗线条，提高可见性

// 库存数据 - 只保留4个主要产品
const inventoryData = ref([
  { name: t('product.gateValve'), percentage: 78, target: 100 },
  { name: t('product.ballValve'), percentage: 45, target: 100 },
  { name: t('product.checkValve'), percentage: 92, target: 100 },
  { name: t('product.globeValve'), percentage: 68, target: 100 }
])

// 苹果风格配色方案
function getGaugeColor(percentage: number): string {
  if (percentage >= 75) return '#00E676' // 绿色 - 充足
  if (percentage >= 50) return '#3B82F6' // 蓝色 - 正常
  if (percentage >= 25) return '#FFA726' // 橙色 - 偏低
  return '#EF5350' // 红色 - 不足
}

// 状态等级
function getStatusClass(percentage: number): string {
  if (percentage >= 75) return 'status-good'
  if (percentage >= 50) return 'status-normal'
  if (percentage >= 25) return 'status-low'
  return 'status-critical'
}

// 状态文字
function getStatusText(percentage: number): string {
  if (percentage >= 75) return t('inventory.sufficient')
  if (percentage >= 50) return t('inventory.normal')
  if (percentage >= 25) return t('inventory.low')
  return t('inventory.critical')
}

// 计算角度（-135度到135度，总共270度）
function calculateAngle(percentage: number): number {
  return -135 + (percentage / 100) * 270
}

// 生成SVG圆弧路径
function getArcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ')
}

// 极坐标转笛卡尔坐标
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const angleInRadians = (angle - 90) * Math.PI / 180.0
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.inventory-gauges {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 300px;

  .gauges-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 10px 6px;

      .gauge-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(255, 255, 255, 0.8);
        border-color: rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        transform: translateY(-2px);
      }

      .gauge-container {
        position: relative;

        .gauge-svg {
          .gauge-progress {
            transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .gauge-value {
            font-size: 18px;
            font-weight: 700;
            font-feature-settings: 'tnum';
            font-family: $font-number;
          }

          .gauge-label {
            font-size: 10px;
            font-weight: 600;
          }
        }
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 5px;

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .status-text {
          font-size: 10px;
          font-weight: 600;
        }

        &.status-good {
          background: rgba(0, 230, 118, 0.08);

          .status-dot {
            background: #00E676;
            box-shadow: 0 0 6px rgba(0, 230, 118, 0.5);
          }

          .status-text {
            color: #00C853;
          }
        }

        &.status-normal {
          background: rgba(59, 130, 246, 0.08);

          .status-dot {
            background: #3B82F6;
            box-shadow: 0 0 6px rgba(59, 130, 246, 0.5);
          }

          .status-text {
            color: #2563EB;
          }
        }

        &.status-low {
          background: rgba(255, 167, 38, 0.08);

          .status-dot {
            background: #FFA726;
            box-shadow: 0 0 6px rgba(255, 167, 38, 0.5);
          }

          .status-text {
            color: #F57C00;
          }
        }

        &.status-critical {
          background: rgba(239, 83, 80, 0.08);

          .status-dot {
            background: #EF5350;
            box-shadow: 0 0 6px rgba(239, 83, 80, 0.5);
          }

          .status-text {
            color: #D32F2F;
          }
        }
      }
    }
  }
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}
</style>
