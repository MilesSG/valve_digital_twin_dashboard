<template>
  <div class="data-overview-neon">
    <StatCard
      label="月度订单"
      :value="stats?.totalOrders || 0"
      unit="单"
      :icon="DocumentChecked"
      neon-color="#475569"
      neon-gradient="linear-gradient(135deg, #475569, #64748B)"
      icon-bg="linear-gradient(135deg, rgba(71, 85, 105, 0.08), rgba(100, 116, 139, 0.05))"
      :growth="stats?.orderGrowth"
      neon-class="neutral"
      :progress="82"
    />
    <StatCard
      label="销售额"
      :value="formatMoney(stats?.totalSales || 0)"
      unit="元"
      :icon="TrendCharts"
      neon-color="#00E676"
      neon-gradient="linear-gradient(135deg, #00E676, #69F0AE)"
      icon-bg="linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(105, 240, 174, 0.06))"
      :growth="stats?.salesGrowth"
      neon-class="neon-accent"
      :progress="95"
    />
    <StatCard
      label="生产产量"
      :value="stats?.totalProducts || 0"
      unit="件"
      :icon="Box"
      neon-color="#64748B"
      neon-gradient="linear-gradient(135deg, #64748B, #94A3B8)"
      icon-bg="linear-gradient(135deg, rgba(100, 116, 139, 0.08), rgba(148, 163, 184, 0.05))"
      :growth="12.5"
      neon-class="neutral"
      :progress="88"
    />
    <StatCard
      label="客户总数"
      :value="stats?.totalCustomers || 0"
      unit="家"
      :icon="User"
      neon-color="#475569"
      neon-gradient="linear-gradient(135deg, #475569, #64748B)"
      icon-bg="linear-gradient(135deg, rgba(71, 85, 105, 0.08), rgba(100, 116, 139, 0.05))"
      :growth="stats?.customerGrowth"
      neon-class="neutral"
      :progress="76"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBusinessStore } from '@/stores/business'
import StatCard from './StatCard.vue'
import { DocumentChecked, TrendCharts, User, Box } from '@element-plus/icons-vue'

const store = useBusinessStore()
const stats = computed(() => store.stats)

function formatMoney(value: number): string {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿'
  } else if (value >= 10000) {
    return (value / 10000).toFixed(0) + '万'
  }
  return value.toString()
}
</script>

<style lang="scss" scoped>
.data-overview-neon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>