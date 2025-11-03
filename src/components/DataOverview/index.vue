<template>
  <div class="data-overview-premium">
    <StatCard
      label="月度订单"
      :value="stats?.totalOrders || 0"
      unit="单"
      neon-color="#475569"
      neon-gradient="linear-gradient(135deg, #475569, #64748B)"
      :growth="stats?.orderGrowth"
      neon-class="neutral"
      :progress="82"
    />
    <StatCard
      label="销售额"
      :value="formatMoney(stats?.totalSales || 0)"
      unit="元"
      neon-color="#00E676"
      neon-gradient="linear-gradient(135deg, #00E676, #69F0AE)"
      :growth="stats?.salesGrowth"
      neon-class="neon-accent"
      :progress="95"
    />
    <StatCard
      label="生产产量"
      :value="stats?.totalProduction || 0"
      unit="件"
      neon-color="#64748B"
      neon-gradient="linear-gradient(135deg, #64748B, #94A3B8)"
      :growth="stats?.productionGrowth || 0"
      neon-class="neutral"
      :progress="88"
    />
    <StatCard
      label="客户总数"
      :value="stats?.totalCustomers || 0"
      unit="家"
      neon-color="#475569"
      neon-gradient="linear-gradient(135deg, #475569, #64748B)"
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
.data-overview-premium {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 4px;
  
  // 为卡片添加错落的入场动画
  @for $i from 1 through 4 {
    > :nth-child(#{$i}) {
      animation: card-fade-in 0.6s ease-out #{$i * 0.1}s both;
    }
  }
}

@keyframes card-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式调整
@media (max-width: 1400px) {
  .data-overview-premium {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .data-overview-premium {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>