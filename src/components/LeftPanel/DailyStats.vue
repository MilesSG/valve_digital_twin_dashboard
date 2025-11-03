<template>
  <div class="daily-stats card">
    <div class="section-title">今日运行数据</div>
    <div class="stats-grid">
      <div class="stat-item" v-for="(item, index) in statsData" :key="index" :style="{ background: item.bg }">
        <div class="stat-icon-wrapper" :style="{ background: item.iconBg }">
          <el-icon :size="22" :color="item.color">
            <component :is="item.icon" />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value" :style="{ color: item.color }">
            {{ item.value }}<span class="unit">{{ item.unit }}</span>
          </div>
        </div>
        <div class="glow" :style="{ background: item.glowColor }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMonitorStore } from '@/stores/monitor'
import { formatNumber } from '@/utils/format'
import { Switch, DataLine, TrendCharts, Lightning } from '@element-plus/icons-vue'

const store = useMonitorStore()

const statsData = computed(() => [
  {
    label: '开关次数',
    value: formatNumber(store.stats?.switchCount || 0),
    unit: '',
    icon: Switch,
    color: '#4A9EFF',
    iconBg: 'rgba(74, 158, 255, 0.15)',
    bg: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1), rgba(74, 158, 255, 0.05))',
    glowColor: 'rgba(74, 158, 255, 0.2)'
  },
  {
    label: '累计流量',
    value: formatNumber(store.stats?.totalFlow || 0),
    unit: 'L',
    icon: DataLine,
    color: '#52C41A',
    iconBg: 'rgba(82, 196, 26, 0.15)',
    bg: 'linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05))',
    glowColor: 'rgba(82, 196, 26, 0.2)'
  },
  {
    label: '平均压力',
    value: store.stats?.avgPressure?.toFixed(2) || 0,
    unit: 'MPa',
    icon: TrendCharts,
    color: '#FAAD14',
    iconBg: 'rgba(250, 173, 20, 0.15)',
    bg: 'linear-gradient(135deg, rgba(250, 173, 20, 0.1), rgba(250, 173, 20, 0.05))',
    glowColor: 'rgba(250, 173, 20, 0.2)'
  },
  {
    label: '能耗统计',
    value: formatNumber(store.stats?.energyConsumption || 0),
    unit: 'kWh',
    icon: Lightning,
    color: '#13C2C2',
    iconBg: 'rgba(19, 194, 194, 0.15)',
    bg: 'linear-gradient(135deg, rgba(19, 194, 194, 0.1), rgba(19, 194, 194, 0.05))',
    glowColor: 'rgba(19, 194, 194, 0.2)'
  }
])
</script>

<style lang="scss" scoped>
.daily-stats {
  height: 200px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .stat-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(74, 158, 255, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;

      &:hover {
        border-color: rgba(74, 158, 255, 0.3);
        transform: translateY(-2px);

        .glow {
          opacity: 1;
        }
      }

      .stat-icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .stat-content {
        flex: 1;
        min-width: 0;

        .stat-label {
          font-size: 12px;
          color: #A0AEC0;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;

          .unit {
            font-size: 11px;
            margin-left: 4px;
            color: #718096;
            font-weight: 400;
          }
        }
      }

      .glow {
        position: absolute;
        top: 50%;
        right: -50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
      }
    }
  }
}
</style>