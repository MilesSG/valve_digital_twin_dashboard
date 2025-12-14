<template>
  <div class="panel-icon" :class="`icon-${type}`">
    <!-- 产品分类图标 -->
    <svg v-if="type === 'product'" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#grad-product-1)" />
      <rect x="13" y="3" width="8" height="8" rx="2" fill="url(#grad-product-2)" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="url(#grad-product-3)" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="url(#grad-product-4)" />
      <defs>
        <linearGradient id="grad-product-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
        <linearGradient id="grad-product-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#42A5F5" />
          <stop offset="100%" stop-color="#1976D2" />
        </linearGradient>
        <linearGradient id="grad-product-3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#66BB6A" />
          <stop offset="100%" stop-color="#388E3C" />
        </linearGradient>
        <linearGradient id="grad-product-4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#64B5F6" />
          <stop offset="100%" stop-color="#2196F3" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 库存仪表盘图标 -->
    <svg v-else-if="type === 'inventory'" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
            fill="url(#grad-inventory)" opacity="0.9"/>
      <circle cx="12" cy="13" r="5" fill="url(#grad-inventory-inner)" />
      <path d="M12 8v5l3 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
      <defs>
        <linearGradient id="grad-inventory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#42A5F5" />
          <stop offset="100%" stop-color="#1976D2" />
        </linearGradient>
        <linearGradient id="grad-inventory-inner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 订单统计图标 -->
    <svg v-else-if="type === 'order'" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="18" rx="2" fill="url(#grad-order)" />
      <path d="M8 2v4M16 2v4" stroke="#fff" stroke-width="2" stroke-linecap="round" />
      <circle cx="9" cy="12" r="1.5" fill="#fff" />
      <circle cx="15" cy="12" r="1.5" fill="#fff" />
      <circle cx="9" cy="17" r="1.5" fill="#fff" />
      <circle cx="15" cy="17" r="1.5" fill="#fff" />
      <defs>
        <linearGradient id="grad-order" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#1B5E20" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 生产效率图标 -->
    <svg v-else-if="type === 'production'" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="url(#grad-production)" />
      <path d="M12 8v4l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="12" cy="12" r="2" fill="#fff" />
      <defs>
        <linearGradient id="grad-production" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#42A5F5" />
          <stop offset="100%" stop-color="#0D47A1" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 质量趋势图标 -->
    <svg v-else-if="type === 'quality'" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="url(#grad-quality)" />
      <circle cx="12" cy="10" r="3" fill="#fff" opacity="0.9" />
      <defs>
        <linearGradient id="grad-quality" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="100%" stop-color="#F57C00" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 销售趋势图标 -->
    <svg v-else-if="type === 'sales'" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l4-4 4 4 6-6 4 4" stroke="url(#grad-sales)" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <circle cx="3" cy="17" r="2" fill="#4CAF50" />
      <circle cx="7" cy="13" r="2" fill="#66BB6A" />
      <circle cx="11" cy="17" r="2" fill="#4CAF50" />
      <circle cx="17" cy="11" r="2" fill="#42A5F5" />
      <circle cx="21" cy="15" r="2" fill="#1976D2" />
      <defs>
        <linearGradient id="grad-sales" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#1976D2" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 客户排名图标 -->
    <svg v-else-if="type === 'customer'" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill="url(#grad-customer-1)" />
      <path d="M6 21v-2a6 6 0 0112 0v2" stroke="url(#grad-customer-2)"
            stroke-width="2.5" stroke-linecap="round" fill="none" />
      <defs>
        <linearGradient id="grad-customer-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#42A5F5" />
          <stop offset="100%" stop-color="#1976D2" />
        </linearGradient>
        <linearGradient id="grad-customer-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#2E7D32" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 默认图标 -->
    <svg v-else viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="url(#grad-default)" />
      <defs>
        <linearGradient id="grad-default" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4CAF50" />
          <stop offset="100%" stop-color="#1976D2" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'product' | 'inventory' | 'order' | 'production' | 'quality' | 'sales' | 'customer' | 'default'
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.panel-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  svg {
    width: 18px;
    height: 18px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  &:hover {
    transform: scale(1.1) translateY(-1px);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.12),
      inset 0 1px 3px rgba(255, 255, 255, 0.9);
  }
}
</style>
