<template>
  <div class="right-panel">
    <RealtimeGauge />
    <TrendChart />
    <AlarmList />
  </div>
</template>

<script setup lang="ts">
import RealtimeGauge from './RealtimeGauge.vue'
import TrendChart from './TrendChart.vue'
import AlarmList from './AlarmList.vue'
</script>

<style lang="scss" scoped>
.right-panel {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>