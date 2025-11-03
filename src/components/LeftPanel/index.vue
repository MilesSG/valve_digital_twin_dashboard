<template>
  <div class="left-panel">
    <DeviceZoneChart />
    <TypeDistribution />
    <DailyStats />
  </div>
</template>

<script setup lang="ts">
import DeviceZoneChart from './DeviceZoneChart.vue'
import TypeDistribution from './TypeDistribution.vue'
import DailyStats from './DailyStats.vue'
</script>

<style lang="scss" scoped>
.left-panel {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>