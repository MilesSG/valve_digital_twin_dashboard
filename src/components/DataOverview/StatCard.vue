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
        <!-- CountUp 需要一个稳定的选择器 -->
        <span class="stat-value value" :style="{ color: neonColor }">{{ displayValue }}</span>
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
  // 固定高度在某些分辨率/缩放下会裁掉底部进度条：改为最小高度 + 自适应
  min-height: 182px;
  height: auto;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  border-radius: 24px;
  padding: 22px 28px 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(24px) saturate(190%);
  -webkit-backdrop-filter: blur(24px) saturate(190%);
  
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
  
  // 增长徽章 - 加大字号
  .growth-badge {
    position: absolute;
    top: 18px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 800;
    font-feature-settings: 'tnum';
    backdrop-filter: blur(16px);
    z-index: 2;
    transition: all 0.3s ease;

    &.positive {
      background: rgba(46, 125, 50, 0.15);
      color: $forest-green-dark;
      border: 1.5px solid rgba(46, 125, 50, 0.3);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
    }

    &.negative {
      background: rgba(211, 47, 47, 0.15);
      color: $danger-color;
      border: 1.5px solid rgba(211, 47, 47, 0.3);
      box-shadow: 0 4px 12px rgba(211, 47, 47, 0.15);
    }

    svg {
      width: 14px;
      height: 14px;
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
    // 从上往下排，避免数值过大把进度条挤出卡片导致裁切
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    gap: 10px;

    .stat-label {
      font-size: 17px;
      font-weight: 800;
      color: #334155;
      text-transform: none;
      letter-spacing: 0.2px;
      opacity: 1;
      transition: all 0.3s;
      margin-bottom: 2px;
      // 避免标题被右上角增长徽章“压住”
      padding-right: 96px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stat-display {
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
      gap: 10px;
      margin: 4px 0 0 0;
      width: 100%;
      min-width: 0;

      .stat-value {
        // 兼顾不同屏幕宽度：避免字号过大导致内容溢出/裁切
        font-size: clamp(44px, 3.8vw, 64px);
        font-weight: 800;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
        letter-spacing: -2px;
        font-feature-settings: 'tnum';
        -webkit-font-smoothing: antialiased;
        color: $forest-green;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
      }

      .stat-unit {
        font-size: 18px;
        font-weight: 800;
        color: #475569;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }
    }
    
    .progress-indicator {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
      // 固定在底部，保证一定可见
      margin-top: auto;
      padding-top: 10px;

      .progress-bar {
        flex: 1;
        height: 12px;
        background: rgba(15, 23, 42, 0.12);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.12);

        .progress-fill {
          height: 100%;
          border-radius: 8px;
          position: relative;
          transition: width 1.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(90deg, $forest-green 0%, $industrial-blue 100%);
          box-shadow: 0 3px 10px rgba(46, 125, 50, 0.35), 0 0 16px rgba(25, 118, 210, 0.25);

          .progress-glow {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg,
              transparent,
              rgba(255, 255, 255, 0.7),
              transparent
            );
            animation: progress-shine 3s ease-in-out infinite;
          }
        }
      }

      .progress-label {
        font-size: 15px;
        font-weight: 800;
        color: #0F172A;
        min-width: 44px;
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
    height: 4px;
    opacity: 0.65;
    transition: opacity 0.4s ease;
  }
  
  // Hover 效果 - 更强烈的视觉反馈
  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12),
                inset 0 2px 8px rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.6);

    .card-decoration {
      .gradient-orb {
        opacity: 0.18;
        transform: scale(1.4) rotate(60deg);
      }

      .mesh-pattern {
        opacity: 1;
      }
    }

    .growth-badge {
      transform: scale(1.1);

      svg {
        transform: translateY(-3px) scale(1.1);
      }
    }

    .stat-display .stat-value {
      transform: scale(1.05);
      color: $forest-green-dark;
      text-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
    }

    .bottom-accent {
      opacity: 1;
    }
  }

  // 特殊强调样式
  &.neon-accent {
    border-color: rgba(46, 125, 50, 0.2);

    &:hover {
      border-color: rgba(46, 125, 50, 0.35);
      box-shadow: 0 16px 48px rgba(46, 125, 50, 0.15),
                  0 0 24px rgba(25, 118, 210, 0.1);

      .bottom-accent {
        box-shadow: 0 0 20px rgba(46, 125, 50, 0.4),
                    0 0 12px rgba(25, 118, 210, 0.3);
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

@media (max-width: 1400px) {
  .stat-card-premium {
    padding: 20px 22px 18px;

    .card-content {
      .stat-label {
        font-size: 16px;
        padding-right: 90px;
      }

      .stat-display {
        .stat-unit {
          font-size: 16px;
        }
      }
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
