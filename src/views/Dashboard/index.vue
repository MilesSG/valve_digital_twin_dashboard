<template>
  <div class="dashboard-neon">
    <!-- 动态背景 -->
    <div class="bg-animated">
      <div class="grid-pattern"></div>
      <div class="neon-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>

    <!-- 顶部导航 -->
    <HeaderBar />

    <!-- AI对话助手 -->
    <AIChatAssistant />

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 数据概览 -->
      <div class="overview-section fade-in">
        <DataOverview />
      </div>

      <!-- 数据可视化区域 -->
      <div class="visualization-grid fade-in">
        <!-- 左侧 -->
        <div class="left-section">
          <ProductDisplay />
          <OrderStatistics />
        </div>

        <!-- 中间 - 多个数据可视化图表 -->
        <div class="center-section">
          <ProductionChart />
          <QualityChart />
        </div>

        <!-- 右侧 -->
        <div class="right-section">
          <SalesTrend />
          <TopCustomers />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import DataOverview from '@/components/DataOverview/index.vue'
import ProductDisplay from '@/components/LeftPanel/ProductDisplay.vue'
import OrderStatistics from '@/components/LeftPanel/OrderStatistics.vue'
import ProductionChart from '@/components/CenterPanel/ProductionChart.vue'
import QualityChart from '@/components/CenterPanel/QualityChart.vue'
import SalesTrend from '@/components/RightPanel/SalesTrend.vue'
import TopCustomers from '@/components/RightPanel/TopCustomers.vue'
import AIChatAssistant from '@/components/AI/AIChatAssistant.vue'
import { useDataRefresh } from '@/hooks/useDataRefresh'

useDataRefresh(10000)

onMounted(() => {
  // 页面加载动画
  const elements = document.querySelectorAll('.fade-in')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('active')
    }, index * 200)
  })
})
</script>

<style lang="scss" scoped>
.dashboard-neon {
  width: 100vw;
  height: 100vh;
  background: $bg-primary;
  position: relative;
  overflow: hidden;

  .bg-animated {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridMove 50s linear infinite;
    }

    .neon-orbs {
      position: absolute;
      inset: 0;

      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.04;
        animation: float 30s ease-in-out infinite;

        &.orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, $neon-green, transparent);
          top: -15%;
          right: -10%;
        }

        &.orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, $primary-color, transparent);
          bottom: -15%;
          left: -10%;
          animation-delay: -12s;
        }

        &.orb-3 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, $neon-green, transparent);
          top: 35%;
          left: 35%;
          animation-delay: -20s;
        }
      }
    }
  }

  .main-content {
    height: calc(100vh - 90px);
    padding: 20px 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  .overview-section {
    flex-shrink: 0;
  }

  .visualization-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 320px 1fr 340px;
    gap: 20px;
    min-height: 0;

    .left-section,
    .right-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .center-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
    }
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  &.active {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(60px, 60px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}
</style>