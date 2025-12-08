<template>
  <div class="top-customers card-neon">
    <div class="section-title-neon">
      <span>{{ t('rightPanel.topCustomersRank') }}</span>
      <div class="title-dot"></div>
      <div class="scroll-indicator">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M7 12l-2.5-2.5M7 12l2.5-2.5" stroke="#00E676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        </svg>
      </div>
    </div>
    <div class="customer-list-wrapper">
      <div class="customer-list" ref="customerListRef" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
        <div class="customer-item"
             v-for="(customer, index) in displayCustomers"
             :key="`${customer.id}-${index}`">
          <div class="rank-badge" :class="getRankClass(customer.rank)">
            <span>{{ customer.rank }}</span>
          </div>
          <div class="customer-info">
            <div class="customer-name">{{ customer.name }}</div>
            <div class="customer-meta">
              <span class="contact">{{ customer.contact }}</span>
              <span class="orders">{{ customer.orderCount }}单</span>
            </div>
          </div>
          <div class="customer-stats">
            <div class="amount neon-text">¥{{ formatAmount(customer.amount) }}</div>
            <div class="level-badge" :class="`level-${customer.level}`">{{ customer.level }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const customerListRef = ref<HTMLElement>()
const isPaused = ref(false)

// 扩展的客户数据 - 20个客户
const allCustomers = [
  { id: 1, rank: 1, name: '上海华东石化', contact: '张总', orderCount: 45, amount: 125.0, level: 'VIP' },
  { id: 2, rank: 2, name: '江苏长江电力', contact: '李总', orderCount: 38, amount: 98.0, level: 'A' },
  { id: 3, rank: 3, name: '浙江能源集团', contact: '王总', orderCount: 32, amount: 85.0, level: 'A' },
  { id: 4, rank: 4, name: '安徽电力公司', contact: '赵总', orderCount: 28, amount: 72.0, level: 'A' },
  { id: 5, rank: 5, name: '山东石化集团', contact: '刘总', orderCount: 25, amount: 65.0, level: 'B' },
  { id: 6, rank: 6, name: '江西燃气公司', contact: '陈总', orderCount: 22, amount: 52.0, level: 'B' },
  { id: 7, rank: 7, name: '福建化工集团', contact: '周总', orderCount: 18, amount: 45.0, level: 'B' },
  { id: 8, rank: 8, name: '湖南电力公司', contact: '吴总', orderCount: 15, amount: 38.0, level: 'B' },
  { id: 9, rank: 9, name: '河南石油公司', contact: '郑总', orderCount: 14, amount: 35.0, level: 'C' },
  { id: 10, rank: 10, name: '湖北能源集团', contact: '孙总', orderCount: 12, amount: 32.0, level: 'C' },
  { id: 11, rank: 11, name: '广东化工集团', contact: '林总', orderCount: 11, amount: 29.0, level: 'C' },
  { id: 12, rank: 12, name: '四川燃气公司', contact: '黄总', orderCount: 10, amount: 26.0, level: 'C' },
  { id: 13, rank: 13, name: '重庆石化集团', contact: '杨总', orderCount: 9, amount: 23.0, level: 'C' },
  { id: 14, rank: 14, name: '贵州电力公司', contact: '徐总', orderCount: 8, amount: 20.0, level: 'C' },
  { id: 15, rank: 15, name: '云南能源集团', contact: '马总', orderCount: 7, amount: 18.0, level: 'C' },
  { id: 16, rank: 16, name: '陕西石油公司', contact: '冯总', orderCount: 6, amount: 15.0, level: 'C' },
  { id: 17, rank: 17, name: '甘肃燃气公司', contact: '朱总', orderCount: 5, amount: 12.0, level: 'C' },
  { id: 18, rank: 18, name: '宁夏化工集团', contact: '胡总', orderCount: 4, amount: 10.0, level: 'C' },
  { id: 19, rank: 19, name: '青海电力公司', contact: '许总', orderCount: 3, amount: 8.0, level: 'C' },
  { id: 20, rank: 20, name: '新疆石油集团', contact: '何总', orderCount: 2, amount: 6.0, level: 'C' }
]

// 双倍数据用于无缝循环
const displayCustomers = computed(() => {
  return [...allCustomers, ...allCustomers]
})

function getRankClass(rank: number): string {
  return `rank-${rank}`
}

function formatAmount(amount: number): string {
  return amount.toFixed(1) + '万'
}

function pauseScroll() {
  isPaused.value = true
  if (customerListRef.value) {
    customerListRef.value.style.animationPlayState = 'paused'
  }
}

function resumeScroll() {
  isPaused.value = false
  if (customerListRef.value) {
    customerListRef.value.style.animationPlayState = 'running'
  }
}
</script>

<style lang="scss" scoped>
.top-customers {
  flex-shrink: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .section-title-neon {
    position: relative;

    .scroll-indicator {
      margin-left: auto;
      animation: bounce 2s ease-in-out infinite;
    }
  }

  .customer-list-wrapper {
    flex: 1;
    max-height: 540px; // 限制最大高度
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%);

    .customer-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      animation: scroll-up 60s linear infinite;

      &:hover {
        animation-play-state: paused;
      }

      .customer-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        flex-shrink: 0;

        // 左侧装饰线
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 0;
          background: #00E676;
          box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);
          transition: height 0.3s ease;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(4px);
          border-color: rgba(0, 230, 118, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

          &::before {
            height: 60%;
          }
        }

        .rank-badge {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 11px;
          flex-shrink: 0;

          &.rank-1 {
            background: linear-gradient(135deg, #00E676, #69F0AE);
            color: #FFF;
            box-shadow: 0 0 12px rgba(0, 230, 118, 0.4);
          }

          &.rank-2 {
            background: linear-gradient(135deg, #64748B, #94A3B8);
            color: #FFF;
          }

          &.rank-3 {
            background: linear-gradient(135deg, #94A3B8, #CBD5E1);
            color: #475569;
          }

          &[class*="rank-"]:not(.rank-1):not(.rank-2):not(.rank-3) {
            background: #F1F5F9;
            color: #64748B;
            font-weight: 600;
          }
        }

        .customer-info {
          flex: 1;
          min-width: 0;

          .customer-name {
            font-size: 11px;
            font-weight: 600;
            color: #1E293B;
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .customer-meta {
            font-size: 9px;
            color: #94A3B8;
            display: flex;
            gap: 4px;

            span {
              padding: 1px 5px;
              background: rgba(0, 0, 0, 0.04);
              border-radius: 3px;
            }
          }
        }

        .customer-stats {
          text-align: right;
          flex-shrink: 0;

          .amount {
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 2px;
          }

          .level-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;

            &.level-VIP {
              background: linear-gradient(135deg, #00E676, #69F0AE);
              color: #FFF;
              box-shadow: 0 0 8px rgba(0, 230, 118, 0.3);
            }

            &.level-A {
              background: linear-gradient(135deg, #64748B, #94A3B8);
              color: #FFF;
            }

            &.level-B {
              background: rgba(148, 163, 184, 0.15);
              color: #475569;
            }

            &.level-C {
              background: #F1F5F9;
              color: #64748B;
            }
          }
        }
      }
    }
  }
}

.neon-text {
  color: #00E676;
  text-shadow: 0 0 8px rgba(0, 230, 118, 0.3);
  font-weight: 700;
}

// 滚动动画
@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

// 指示器弹跳动画
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}
</style>
