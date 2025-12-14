<template>
  <div class="header-bar-neon">
    <div class="scan-line"></div>
    <div class="header-content">
      <div class="header-left">
        <div class="logo-area">
          <div class="logo-icon neon-glow">
            <el-icon :size="36" color="#2E7D32">
              <Setting />
            </el-icon>
          </div>
          <div class="logo-text">
            <h1 class="company-name neon-text">{{ t('common.company') }}</h1>
            <p class="company-location">{{ t('common.subtitle') }}</p>
          </div>
        </div>
      </div>

      <div class="header-center">
        <div class="title-main neon-text-gradient">{{ t('common.system') }}</div>
        <div class="subtitle">{{ t('common.systemSubtitle') }}</div>
      </div>
      
      <div class="header-right">
        <!-- AI预警面板 -->
        <AIWarningPanel />

        <!-- 语言切换按钮 -->
        <div class="language-toggle" @click="toggleLocale" :title="t('common.language')">
          <el-icon :size="18" color="#64748B"><ChatDotRound /></el-icon>
          <span class="lang-text">{{ currentLocaleName }}</span>
        </div>

        <div class="time-box">
          <div class="time-display neon-text">{{ currentTime }}</div>
          <div class="date-display">{{ currentDate }}</div>
        </div>
        <div class="weather-box">
          <el-icon :size="20" color="#F59E0B"><Sunny /></el-icon>
          <div class="weather-info">
            <span class="temp">28°C</span>
            <span class="status">{{ t('weather.sunny') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatDate } from '@/utils/format'
import { Setting, Sunny, ChatDotRound } from '@element-plus/icons-vue'
import AIWarningPanel from '@/components/AI/AIWarningPanel.vue'
import { useLocale } from '@/hooks/useLocale'

const { t } = useI18n()
const { toggleLocale, currentLocaleName } = useLocale()

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

  // 顶部森林绿扫描线
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $forest-green, transparent);
    animation: scan 5s linear infinite;
    box-shadow: $glow-forest-subtle;
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
    background: linear-gradient(90deg, transparent, $forest-green, transparent);
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
        border: 1px solid rgba(46, 125, 50, 0.2);
        position: relative;

        // 四角装饰线
        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid $forest-green;
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
          border-color: $forest-green;
          box-shadow: $glow-forest-subtle;

          &::before,
          &::after {
            opacity: 1;
            box-shadow: $glow-forest-subtle;
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

    .language-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      border: 1px solid $card-border;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
      min-width: 100px;
      justify-content: center;

      .lang-text {
        font-size: 13px;
        font-weight: 500;
        color: $text-primary;
        min-width: 45px;
        text-align: center;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: $forest-green;
        box-shadow: $glow-forest-subtle;
        transform: translateY(-1px);

        .lang-text {
          color: $forest-green;
        }
      }

      &:active {
        transform: translateY(0);
      }
    }

    .time-box {
      text-align: right;
      padding: 10px 18px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      border: 1px solid $card-border;
      position: relative;

      // 右上角森林绿点缀
      &::after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 4px;
        height: 4px;
        background: $forest-green;
        border-radius: 50%;
        box-shadow: $glow-forest-subtle;
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
    background: $forest-green;
    box-shadow: $glow-forest-subtle;
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
    background: linear-gradient(90deg, transparent, $forest-green, transparent);
    box-shadow: $glow-forest-subtle;
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