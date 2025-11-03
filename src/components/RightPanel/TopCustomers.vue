<template>
  <div class="top-customers card-neon">
    <div class="section-title-neon">
      <span>重点客户排行</span>
      <div class="title-dot"></div>
    </div>
    <div class="customer-list">
      <div class="customer-item" v-for="(customer, index) in topCustomers" :key="customer.id">
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="customer-info">
          <div class="customer-name">{{ customer.name }}</div>
          <div class="customer-meta">
            <span class="industry">{{ customer.industry }}</span>
            <span class="region">{{ customer.region }}</span>
          </div>
        </div>
        <div class="customer-stats">
          <div class="amount neon-text">¥{{ formatAmount(customer.totalAmount) }}</div>
          <div class="level-badge" :class="`level-${customer.level}`">{{ customer.level }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBusinessStore } from '@/stores/business'

const store = useBusinessStore()

const topCustomers = computed(() => {
  return [...store.customers]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10)
})

function formatAmount(amount: number): string {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toString()
}
</script>

<style lang="scss" scoped>
.top-customers {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  
  .customer-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    
    .customer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      border: 1px solid $card-border;
      transition: all 0.3s ease;
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
        background: $neon-green;
        box-shadow: $glow-neon-subtle;
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
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        flex-shrink: 0;
        
        &.rank-1 {
          background: linear-gradient(135deg, #00E676, #69F0AE);
          color: #FFF;
          box-shadow: $glow-neon-subtle;
        }
        
        &.rank-2 {
          background: linear-gradient(135deg, #64748B, #94A3B8);
          color: #FFF;
        }
        
        &.rank-3 {
          background: linear-gradient(135deg, #94A3B8, #CBD5E1);
          color: #475569;
        }
        
        &:not(.rank-1):not(.rank-2):not(.rank-3) {
          background: #F1F5F9;
          color: #64748B;
          font-weight: 700;
        }
      }
      
      .customer-info {
        flex: 1;
        min-width: 0;
        
        .customer-name {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          margin-bottom: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .customer-meta {
          font-size: 10px;
          color: #94A3B8;
          display: flex;
          gap: 6px;
          
          span {
            padding: 2px 8px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 4px;
          }
        }
      }
      
      .customer-stats {
        text-align: right;
        flex-shrink: 0;
        
        .amount {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 3px;
        }
        
        .level-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 600;
          
          &.level-VIP {
            background: linear-gradient(135deg, #00E676, #69F0AE);
            color: #FFF;
            box-shadow: $glow-neon-subtle;
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

.neon-text {
  color: $neon-green;
  text-shadow: 0 0 8px rgba(0, 230, 118, 0.3);
  font-weight: 700;
}
</style>