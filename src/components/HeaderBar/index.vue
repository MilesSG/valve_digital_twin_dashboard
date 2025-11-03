<template>
  <div class="header-bar-neon">
    <div class="scan-line"></div>
    <div class="header-content">
      <div class="header-left">
        <div class="logo-area">
          <div class="logo-icon neon-glow">
            <el-icon :size="36" color="#00E676">
              <Setting />
            </el-icon>
          </div>
          <div class="logo-text">
            <h1 class="company-name neon-text">法尔阀业</h1>
            <p class="company-location">Intelligent Valve Control System</p>
          </div>
        </div>
      </div>
      
      <div class="header-center">
        <div class="title-main neon-text-gradient">数据可视化中心</div>
        <div class="subtitle">Valve Data Visualization Center</div>
      </div>
      
      <div class="header-right">
        <!-- AI预警面板 -->
        <AIWarningPanel />
        
        <div class="time-box">
          <div class="time-display neon-text">{{ currentTime }}</div>
          <div class="date-display">{{ currentDate }}</div>
        </div>
        <div class="weather-box">
          <el-icon :size="20" color="#F59E0B"><Sunny /></el-icon>
          <div class="weather-info">
            <span class="temp">28°C</span>
            <span class="status">晴</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { formatDateTime, formatDate } from '@/utils/format'
import { Setting, Sunny } from '@element-plus/icons-vue'
import AIWarningPanel from '@/components/AI/AIWarningPanel.vue'

const currentTime = ref('')
const currentDate = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = formatDateTime(now, 'HH:mm:ss')
  currentDate.value = formatDate(now)
}

let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.header-bar-neon {
  height: 90px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 251, 252, 0.95) 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid $card-border;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: visible;
  z-index: 100;

  // 顶部荧光绿扫描线
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $neon-green, transparent);
    animation: scan 5s linear infinite;
    box-shadow: $glow-neon-subtle;
  }

  // 装饰性科技线条
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent, $neon-green, transparent);
    opacity: 0.6;
  }

  .header-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    position: relative;
    z-index: 1;
  }

  .header-left {
    .logo-area {
      display: flex;
      align-items: center;
      gap: 16px;

      .logo-icon {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 14px;
        border: 1px solid rgba(0, 230, 118, 0.2);
        position: relative;

        // 四角装饰线
        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid $neon-green;
          opacity: 0.6;
        }

        &::before {
          top: -1px;
          left: -1px;
          border-right: none;
          border-bottom: none;
          border-radius: 4px 0 0 0;
        }

        &::after {
          bottom: -1px;
          right: -1px;
          border-left: none;
          border-top: none;
          border-radius: 0 0 4px 0;
        }

        &:hover {
          border-color: $neon-green;
          box-shadow: $glow-neon-subtle;
          
          &::before,
          &::after {
            opacity: 1;
            box-shadow: $glow-neon-subtle;
          }
        }
      }

      .logo-text {
        .company-name {
          font-size: 30px;
          font-weight: 700;
          margin: 0;
          letter-spacing: 1px;
        }

        .company-location {
          font-size: 12px;
          color: $text-secondary;
          margin: 4px 0 0 0;
          letter-spacing: 2px;
        }
      }
    }
  }

  .header-center {
    text-align: center;

    .title-main {
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 6px;
    }

    .subtitle {
      font-size: 12px;
      color: $text-tertiary;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;
    z-index: 100;

    .time-box {
      text-align: right;
      padding: 10px 18px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      border: 1px solid $card-border;
      position: relative;

      // 右上角荧光绿点缀
      &::after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 4px;
        height: 4px;
        background: $neon-green;
        border-radius: 50%;
        box-shadow: $glow-neon-subtle;
        animation: pulse-dot 2s ease-in-out infinite;
      }

      .time-display {
        font-size: 26px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        letter-spacing: 1.5px;
        margin-bottom: 4px;
      }

      .date-display {
        font-size: 11px;
        color: $text-secondary;
      }
    }

    .weather-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      border: 1px solid $card-border;

      .weather-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .temp {
          font-size: 18px;
          font-weight: 700;
          color: $text-primary;
        }

        .status {
          font-size: 11px;
          color: $text-secondary;
        }
      }
    }
  }
}

.neon-text {
  color: $text-primary;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: $neon-green;
    box-shadow: $glow-neon-subtle;
  }
}

.neon-text-gradient {
  background: linear-gradient(135deg, $text-primary 0%, $primary-color 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $neon-green, transparent);
    box-shadow: $glow-neon-subtle;
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes neon-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>