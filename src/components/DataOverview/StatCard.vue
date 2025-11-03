<template>
  <div class="stat-card-premium" :class="[neonClass, { 'has-growth': growth !== undefined }]">
    <!-- 背景装饰 -->
    <div class="card-decoration">
      <div class="gradient-orb" :style="{ background: neonGradient }"></div>
      <div class="mesh-pattern"></div>
    </div>
    
    <!-- 增长指示器 -->
    <div class="growth-badge" v-if="growth !== undefined" :class="growth >= 0 ? 'positive' : 'negative'">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path v-if="growth >= 0" d="M6 2L10 6L6 6L2 6L6 2Z" :fill="growth >= 0 ? '#00E676' : '#EF5350'" />
        <path v-else d="M6 10L10 6L6 6L2 6L6 10Z" :fill="growth >= 0 ? '#00E676' : '#EF5350'" />
      </svg>
      <span>{{ Math.abs(growth) }}%</span>
    </div>
    
    <!-- 主内容区 -->
    <div class="card-content">
      <div class="stat-label">{{ label }}</div>
      
      <div class="stat-display" ref="numberRef">
        <span class="stat-value" :style="{ color: neonColor }">{{ displayValue }}</span>
        <span class="stat-unit" v-if="unit">{{ unit }}</span>
      </div>
      
      <!-- 进度可视化 -->
      <div class="progress-indicator">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth, background: neonGradient }">
            <div class="progress-glow"></div>
          </div>
        </div>
        <div class="progress-label">{{ progress }}%</div>
      </div>
    </div>
    
    <!-- 底部装饰线 -->
    <div class="bottom-accent" :style="{ background: neonGradient }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { CountUp } from 'countup.js'

interface Props {
  label: string
  value: string | number
  unit?: string
  neonColor: string
  neonGradient: string
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
    countUpInstance = new CountUp(numberRef.value.querySelector('.value')!, numValue, {
      duration: 2,
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
@import '@/styles/variables.scss';

.stat-card-premium {
  height: 150px;
  background: white;
  border-radius: 20px;
  padding: 24px 28px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  
  // 背景装饰
  .card-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    
    .gradient-orb {
      position: absolute;
      top: -60%;
      right: -20%;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      opacity: 0.08;
      filter: blur(40px);
      transition: all 0.6s ease;
    }
    
    .mesh-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0;
      transition: opacity 0.4s;
    }
  }
  
  // 增长徽章
  .growth-badge {
    position: absolute;
    top: 20px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    font-feature-settings: 'tnum';
    backdrop-filter: blur(10px);
    z-index: 2;
    transition: all 0.3s ease;
    
    &.positive {
      background: rgba(0, 230, 118, 0.1);
      color: #00C853;
      border: 1px solid rgba(0, 230, 118, 0.2);
    }
    
    &.negative {
      background: rgba(239, 83, 80, 0.1);
      color: #D32F2F;
      border: 1px solid rgba(239, 83, 80, 0.2);
    }
    
    svg {
      transition: transform 0.3s ease;
    }
  }
  
  // 主内容区
  .card-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 12px;
    
    .stat-label {
      font-size: 13px;
      font-weight: 500;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      opacity: 0.9;
      transition: color 0.3s;
    }
    
    .stat-display {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 8px;
      margin: 4px 0;
      
      .stat-value {
        font-size: 56px;
        font-weight: 800;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
        letter-spacing: -3px;
        font-feature-settings: 'tnum';
        -webkit-font-smoothing: antialiased;
        transition: all 0.3s ease;
      }
      
      .stat-unit {
        font-size: 16px;
        font-weight: 600;
        color: rgba(100, 116, 139, 0.6);
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
    }
    
    .progress-indicator {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
      
      .progress-bar {
        flex: 1;
        height: 6px;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 3px;
        overflow: hidden;
        position: relative;
        
        .progress-fill {
          height: 100%;
          border-radius: 3px;
          position: relative;
          transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 8px rgba(0, 230, 118, 0.3);
          
          .progress-glow {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.5), 
              transparent
            );
            animation: progress-shine 2.5s ease-in-out infinite;
          }
        }
      }
      
      .progress-label {
        font-size: 11px;
        font-weight: 700;
        color: #64748B;
        min-width: 36px;
        text-align: right;
        font-feature-settings: 'tnum';
      }
    }
  }
  
  // 底部装饰线
  .bottom-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  // Hover 效果
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.1);
    
    .card-decoration {
      .gradient-orb {
        opacity: 0.12;
        transform: scale(1.2);
      }
      
      .mesh-pattern {
        opacity: 1;
      }
    }
    
    .growth-badge {
      transform: scale(1.05);
      
      svg {
        transform: translateY(-2px);
      }
    }
    
    .stat-display .stat-value {
      transform: scale(1.02);
    }
    
    .bottom-accent {
      opacity: 1;
    }
  }
  
  // 特殊强调样式
  &.neon-accent {
    border-color: rgba(0, 230, 118, 0.15);
    
    &:hover {
      border-color: rgba(0, 230, 118, 0.3);
      box-shadow: 0 12px 32px rgba(0, 230, 118, 0.12);
      
      .bottom-accent {
        box-shadow: 0 0 20px rgba(0, 230, 118, 0.3);
      }
    }
  }
  
  // 无增长数据时的样式调整
  &:not(.has-growth) {
    .card-content {
      padding-top: 8px;
    }
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

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
