<template>
  <div class="ai-warning-panel">
    <!-- 触发按钮 -->
    <el-badge :value="anomalyCount" :hidden="anomalyCount === 0" type="warning">
      <button class="warning-trigger-btn" @click="togglePanel">
        <el-icon :size="20">
          <Warning />
        </el-icon>
        <span>AI预警</span>
      </button>
    </el-badge>

    <!-- 预警面板 -->
    <transition name="slide-fade">
      <div v-if="isPanelOpen" class="warning-panel-container">
        <div class="panel-header">
          <div class="header-left">
            <el-icon :size="20" color="#FFA726">
              <Warning />
            </el-icon>
            <span>智能异常预警</span>
          </div>
          <el-icon class="close-btn" @click="togglePanel">
            <Close />
          </el-icon>
        </div>

        <div class="panel-body">
          <!-- 无异常状态 -->
          <div v-if="anomalies.length === 0" class="empty-state">
            <el-icon :size="48" color="#00E676">
              <CircleCheck />
            </el-icon>
            <p>系统运行正常</p>
            <span>暂无异常预警</span>
          </div>

          <!-- 异常列表 -->
          <div v-else class="anomaly-list">
            <div
              v-for="anomaly in anomalies"
              :key="anomaly.id"
              class="anomaly-item"
              :class="`risk-${anomaly.riskLevel}`"
            >
              <div class="anomaly-header">
                <div class="anomaly-title">
                  <el-icon :size="18">
                    <component :is="getIconByType(anomaly.type)" />
                  </el-icon>
                  <span>{{ anomaly.title }}</span>
                </div>
                <el-tag :type="getTagType(anomaly.riskLevel)" size="small">
                  {{ anomaly.riskLevel }}
                </el-tag>
              </div>

              <div class="anomaly-content">
                <div class="anomaly-value">
                  <span class="label">当前值:</span>
                  <span class="value">{{ anomaly.currentValue }}</span>
                  <span class="normal">正常范围: {{ anomaly.normalRange }}</span>
                </div>
                <p class="anomaly-desc">{{ anomaly.description }}</p>
              </div>

              <!-- AI分析结果 -->
              <div v-if="anomaly.aiAnalysis" class="ai-analysis">
                <div class="analysis-section">
                  <h4>🔍 可能原因</h4>
                  <ul>
                    <li v-for="(cause, idx) in anomaly.aiAnalysis.causes" :key="idx">
                      {{ cause }}
                    </li>
                  </ul>
                </div>

                <div class="analysis-section">
                  <h4>💡 应对建议</h4>
                  <ol>
                    <li v-for="(suggestion, idx) in anomaly.aiAnalysis.suggestions" :key="idx">
                      {{ suggestion }}
                    </li>
                  </ol>
                </div>

                <div v-if="anomaly.aiAnalysis.summary" class="analysis-summary">
                  <el-icon :size="16" color="#00E676">
                    <InfoFilled />
                  </el-icon>
                  <span>{{ anomaly.aiAnalysis.summary }}</span>
                </div>
              </div>

              <!-- 分析按钮 -->
              <div class="anomaly-actions">
                <el-button
                  v-if="!anomaly.aiAnalysis"
                  type="primary"
                  size="small"
                  :loading="anomaly.analyzing"
                  @click="analyzeAnomaly(anomaly)"
                >
                  <el-icon><MagicStick /></el-icon>
                  AI 深度分析
                </el-button>
                <el-button
                  v-else
                  size="small"
                  @click="anomaly.aiAnalysis = null"
                >
                  收起分析
                </el-button>
                <el-button size="small" @click="resolveAnomaly(anomaly.id)">
                  标记已处理
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-footer">
          <el-button size="small" @click="refreshAnomalies">
            <el-icon><Refresh /></el-icon>
            刷新检测
          </el-button>
          <span class="last-check">最后检测: {{ lastCheckTime }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Warning,
  Close,
  CircleCheck,
  InfoFilled,
  MagicStick,
  Refresh,
  TrendCharts,
  Box,
  Document
} from '@element-plus/icons-vue'
import { AIService } from '@/services/aiService'
import { ElMessage } from 'element-plus'

interface Anomaly {
  id: string
  type: 'quality' | 'production' | 'order' | 'sales'
  title: string
  description: string
  currentValue: string
  normalRange: string
  riskLevel: '高' | '中' | '低'
  timestamp: Date
  analyzing?: boolean
  aiAnalysis?: {
    causes: string[]
    suggestions: string[]
    summary: string
    needHistoryCheck: boolean
  }
}

const isPanelOpen = ref(false)
const anomalies = ref<Anomaly[]>([])
const lastCheckTime = ref('')

const anomalyCount = computed(() => anomalies.value.length)

function togglePanel() {
  isPanelOpen.value = !isPanelOpen.value
}

function getIconByType(type: string) {
  const icons = {
    quality: TrendCharts,
    production: Box,
    order: Document,
    sales: TrendCharts
  }
  return icons[type as keyof typeof icons] || Warning
}

function getTagType(riskLevel: string) {
  const types = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return types[riskLevel as keyof typeof types] || 'info'
}

async function analyzeAnomaly(anomaly: Anomaly) {
  anomaly.analyzing = true
  
  try {
    const result = await AIService.analyzeAnomaly({
      type: anomaly.title,
      currentValue: parseFloat(anomaly.currentValue),
      normalRange: anomaly.normalRange,
      context: anomaly.description
    })

    // 解析AI返回的JSON
    const analysis = JSON.parse(result)
    anomaly.aiAnalysis = analysis
    
    ElMessage.success('AI分析完成')
  } catch (error) {
    console.error('AI分析失败:', error)
    ElMessage.error('AI分析失败，请稍后重试')
  } finally {
    anomaly.analyzing = false
  }
}

function resolveAnomaly(id: string) {
  const index = anomalies.value.findIndex(a => a.id === id)
  if (index > -1) {
    anomalies.value.splice(index, 1)
    ElMessage.success('已标记为已处理')
  }
}

function refreshAnomalies() {
  detectAnomalies()
  ElMessage.info('正在检测异常...')
}

function detectAnomalies() {
  // 模拟异常检测逻辑（实际应该从store或API获取数据）
  const mockAnomalies: Anomaly[] = []

  // 示例：质量检测异常
  const qualityRate = Math.random() * 100
  if (qualityRate < 90) {
    mockAnomalies.push({
      id: 'quality-001',
      type: 'quality',
      title: '质量合格率偏低',
      description: '过去2小时质量合格率低于标准',
      currentValue: `${qualityRate.toFixed(1)}%`,
      normalRange: '≥95%',
      riskLevel: qualityRate < 85 ? '高' : '中',
      timestamp: new Date()
    })
  }

  // 示例：生产效率异常
  if (Math.random() > 0.7) {
    mockAnomalies.push({
      id: 'prod-001',
      type: 'production',
      title: '闸阀生产线效率下降',
      description: '相比昨日同期下降15%',
      currentValue: '98 件/日',
      normalRange: '110-120 件/日',
      riskLevel: '中',
      timestamp: new Date()
    })
  }

  anomalies.value = mockAnomalies
  lastCheckTime.value = new Date().toLocaleTimeString('zh-CN')
}

onMounted(() => {
  detectAnomalies()
  // 每5分钟自动检测一次
  setInterval(detectAnomalies, 5 * 60 * 1000)
})
</script>

<style lang="scss" scoped>
.ai-warning-panel {
  position: relative;

  .warning-trigger-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(255, 167, 38, 0.1);
    border: 1px solid rgba(255, 167, 38, 0.3);
    border-radius: 8px;
    color: #FFA726;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 167, 38, 0.15);
      border-color: #FFA726;
      box-shadow: 0 4px 12px rgba(255, 167, 38, 0.2);
    }
  }

  .warning-panel-container {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 480px;
    max-height: 600px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    border: 1px solid $card-border;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
    z-index: 9999;
    display: flex;
    flex-direction: column;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid $card-border;

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }

      .close-btn {
        font-size: 20px;
        cursor: pointer;
        color: $text-tertiary;
        transition: color 0.3s;

        &:hover {
          color: $text-primary;
        }
      }
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;

        p {
          margin: 16px 0 8px;
          font-size: 16px;
          font-weight: 600;
          color: $text-primary;
        }

        span {
          font-size: 14px;
          color: $text-tertiary;
        }
      }

      .anomaly-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .anomaly-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border: 1px solid $card-border;
          transition: all 0.3s;

          &.risk-高 {
            border-left: 3px solid #EF5350;
          }

          &.risk-中 {
            border-left: 3px solid #FFA726;
          }

          &.risk-低 {
            border-left: 3px solid #64748B;
          }

          &:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          }

          .anomaly-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .anomaly-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 15px;
              font-weight: 600;
              color: $text-primary;
            }
          }

          .anomaly-content {
            .anomaly-value {
              display: flex;
              align-items: baseline;
              gap: 8px;
              margin-bottom: 8px;
              font-size: 13px;

              .label {
                color: $text-secondary;
              }

              .value {
                font-size: 16px;
                font-weight: 700;
                color: #EF5350;
              }

              .normal {
                color: $text-tertiary;
                font-size: 12px;
              }
            }

            .anomaly-desc {
              font-size: 13px;
              color: $text-secondary;
              line-height: 1.6;
            }
          }

          .ai-analysis {
            margin-top: 16px;
            padding: 12px;
            background: rgba(0, 230, 118, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(0, 230, 118, 0.2);

            .analysis-section {
              margin-bottom: 12px;

              h4 {
                font-size: 13px;
                font-weight: 600;
                color: $text-primary;
                margin-bottom: 8px;
              }

              ul, ol {
                margin: 0;
                padding-left: 20px;

                li {
                  font-size: 13px;
                  color: $text-secondary;
                  line-height: 1.8;
                  margin-bottom: 4px;
                }
              }
            }

            .analysis-summary {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: rgba(255, 255, 255, 0.8);
              border-radius: 6px;
              font-size: 13px;
              color: $text-primary;
              line-height: 1.6;
            }
          }

          .anomaly-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
          }
        }
      }
    }

    .panel-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-top: 1px solid $card-border;

      .last-check {
        font-size: 12px;
        color: $text-tertiary;
      }
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

