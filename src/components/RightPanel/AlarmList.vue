<template>
  <div class="alarm-list card">
    <div class="section-title">实时告警列表</div>
    <div class="list-container" ref="listContainerRef">
      <transition-group name="alarm-fade">
        <div
          v-for="alarm in displayAlarms"
          :key="alarm.id"
          class="alarm-item"
          :class="`alarm-${alarm.level}`"
        >
          <div class="alarm-left">
            <div class="level-indicator" :class="`indicator-${alarm.level}`">
              <div class="pulse-ring"></div>
            </div>
            <div class="alarm-info">
              <div class="alarm-header">
                <span class="device-id">{{ alarm.deviceId }}</span>
                <span class="alarm-time">{{ formatDateTime(alarm.time, 'HH:mm:ss') }}</span>
              </div>
              <div class="alarm-message">{{ alarm.message }}</div>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-if="displayAlarms.length === 0" class="empty-state">
        <el-icon :size="48" color="#718096"><WarnTriangleFilled /></el-icon>
        <span>暂无告警信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMonitorStore } from '@/stores/monitor'
import { formatDateTime } from '@/utils/format'
import { WarnTriangleFilled } from '@element-plus/icons-vue'

const store = useMonitorStore()
const listContainerRef = ref<HTMLDivElement>()

const displayAlarms = computed(() => {
  return store.alarms.slice(0, 6)
})
</script>

<style lang="scss" scoped>
.alarm-list {
  height: 220px;
  display: flex;
  flex-direction: column;

  .list-container {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    .alarm-item {
      position: relative;
      padding: 14px;
      margin-bottom: 10px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      border-left: 3px solid;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(74, 158, 255, 0.1);
        transform: translateX(4px);
      }

      &.alarm-error {
        border-left-color: #FF4D4F;
      }

      &.alarm-warning {
        border-left-color: #FAAD14;
      }

      &.alarm-info {
        border-left-color: #4A9EFF;
      }

      .alarm-left {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .level-indicator {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;

          .pulse-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: pulse-ring 1.5s ease-out infinite;
          }

          &.indicator-error {
            background: #FF4D4F;
            box-shadow: 0 0 10px rgba(255, 77, 79, 0.6);

            .pulse-ring {
              border: 2px solid #FF4D4F;
            }
          }

          &.indicator-warning {
            background: #FAAD14;
            box-shadow: 0 0 10px rgba(250, 173, 20, 0.6);

            .pulse-ring {
              border: 2px solid #FAAD14;
            }
          }

          &.indicator-info {
            background: #4A9EFF;
            box-shadow: 0 0 10px rgba(74, 158, 255, 0.6);

            .pulse-ring {
              border: 2px solid #4A9EFF;
            }
          }
        }

        .alarm-info {
          flex: 1;
          min-width: 0;

          .alarm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;

            .device-id {
              font-size: 13px;
              font-weight: 600;
              color: #FFFFFF;
            }

            .alarm-time {
              font-size: 11px;
              color: #718096;
              font-variant-numeric: tabular-nums;
            }
          }

          .alarm-message {
            font-size: 12px;
            color: #A0AEC0;
            line-height: 1.5;
          }
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
      color: #718096;
      font-size: 14px;
    }
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.alarm-fade-enter-active,
.alarm-fade-leave-active {
  transition: all 0.5s ease;
}

.alarm-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.alarm-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.alarm-fade-move {
  transition: transform 0.5s ease;
}
</style>