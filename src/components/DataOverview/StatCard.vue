<template>
  <div class="stat-card-neon" :class="neonClass">
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="icon-area" :style="{ background: iconBg, borderColor: neonColor }">
        <el-icon :size="32" :color="neonColor">
          <component :is="icon" />
        </el-icon>
      </div>
      
      <div class="value-area">
        <div class="stat-value" :style="{ color: neonColor }">
          <span class="number" ref="numberRef">{{ displayValue }}</span>
          <span class="unit" v-if="unit">{{ unit }}</span>
        </div>
        <div class="stat-label">{{ label }}</div>
      </div>
      
      <div class="growth-badge" v-if="growth !== undefined" :class="growth >= 0 ? 'positive' : 'negative'">
        <el-icon :size="14">
          <component :is="growth >= 0 ? 'Top' : 'Bottom'" />
        </el-icon>
        <span>{{ Math.abs(growth) }}%</span>
      </div>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressWidth, background: neonGradient }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { CountUp } from 'countup.js'
import { Top, Bottom } from '@element-plus/icons-vue'

interface Props {
  label: string
  value: string | number
  unit?: string
  icon: any
  neonColor: string
  neonGradient: string
  iconBg: string
  growth?: number
  neonClass?: string
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 75
})

const numberRef = ref<HTMLElement>()
let countUpInstance: CountUp | null = null

const displayValue = computed(() => {
  return typeof props.value === 'number' ? props.value.toLocaleString('zh-CN') : props.value
})

const progressWidth = computed(() => `${props.progress}%`)

function initCountUp() {
  if (!numberRef.value) return
  
  const numValue = typeof props.value === 'string' 
    ? parseFloat(props.value.replace(/,/g, '')) 
    : props.value
  
  if (!isNaN(numValue)) {
    countUpInstance = new CountUp(numberRef.value, numValue, {
      duration: 2.5,
      useEasing: true,
      useGrouping: true,
      separator: ',',
      decimal: '.'
    })
    countUpInstance.start()
  }
}

onMounted(() => {
  setTimeout(initCountUp, 100)
})

watch(() => props.value, () => {
  if (countUpInstance) {
    const numValue = typeof props.value === 'string' 
      ? parseFloat(props.value.replace(/,/g, '')) 
      : props.value
    if (!isNaN(numValue)) {
      countUpInstance.update(numValue)
    }
  }
})
</script>

<style lang="scss" scoped>
.stat-card-neon {
  height: 150px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: $border-radius-lg;
  border: 1px solid $card-border;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  // 顶部装饰线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
    transition: all 0.3s;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.1);

    .progress-fill {
      animation: progress-flow 2s ease infinite;
    }
  }

  &.neon-accent {
    &:hover {
      border-color: rgba(0, 230, 118, 0.4);
      box-shadow: 0 6px 24px rgba(0, 230, 118, 0.15);
    }

    &::before {
      background: linear-gradient(90deg, transparent, $neon-green, transparent);
      box-shadow: $glow-neon-subtle;
    }
  }

  &.neutral {
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }
  }

  .card-content {
    position: relative;
    height: calc(100% - 5px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1;
  }

  .icon-area {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  .value-area {
    .stat-value {
      font-size: 38px;
      font-weight: 700;
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-variant-numeric: tabular-nums;
      margin-bottom: 6px;

      .unit {
        font-size: 18px;
        font-weight: 600;
        opacity: 0.75;
      }
    }

    .stat-label {
      font-size: 14px;
      color: $text-secondary;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .growth-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;

    &.positive {
      color: $neon-green;
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.15);
      box-shadow: $glow-neon-subtle;
    }

    &.negative {
      color: $danger-color;
      background: rgba(239, 83, 80, 0.08);
      border: 1px solid rgba(239, 83, 80, 0.15);
    }
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.04);
    overflow: hidden;

    .progress-fill {
      height: 100%;
      transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 6px currentColor;
      opacity: 0.8;
    }
  }
}

@keyframes progress-flow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>