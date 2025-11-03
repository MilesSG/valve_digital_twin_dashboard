<template>
  <div class="ai-chat-assistant">
    <!-- 浮动触发按钮 -->
    <transition name="bounce">
      <button v-if="!isChatOpen" class="chat-trigger-btn" @click="toggleChat">
        <el-icon :size="24">
          <ChatDotRound />
        </el-icon>
        <div class="pulse-ring"></div>
      </button>
    </transition>

    <!-- 聊天窗口 -->
    <transition name="slide-up">
      <div v-if="isChatOpen" class="chat-container" :class="{ 'fullscreen': isFullscreen }">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">
              <el-icon :size="20">
                <MagicStick />
              </el-icon>
            </div>
            <div class="header-info">
              <h3>AI 数据助手</h3>
              <span class="status">
                <span class="status-dot"></span>
                在线
              </span>
            </div>
          </div>
          <div class="header-actions">
            <el-icon class="action-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏模式'">
              <FullScreen v-if="!isFullscreen" />
              <Close v-else />
            </el-icon>
            <el-icon class="action-btn" @click="clearChat" title="清空对话">
              <Delete />
            </el-icon>
            <el-icon class="action-btn" @click="toggleChat" title="关闭">
              <Close />
            </el-icon>
          </div>
        </div>

        <!-- 消息列表 -->
        <div ref="messageContainer" class="chat-messages">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-icon">
              <el-icon :size="48" color="#00E676">
                <ChatDotRound />
              </el-icon>
            </div>
            <h3>你好！我是AI数据助手</h3>
            <p>你可以问我关于生产、销售、订单等数据的问题</p>
            
            <div class="quick-questions">
              <div class="quick-title">快速提问：</div>
              <button
                v-for="(q, idx) in quickQuestions"
                :key="idx"
                class="quick-btn"
                @click="sendQuickQuestion(q)"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <!-- 对话消息 -->
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="message-item"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="message-avatar">
              <el-icon :size="18">
                <MagicStick />
              </el-icon>
            </div>
            
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(msg.content)"></div>
              <div class="message-time">{{ msg.timestamp }}</div>
            </div>

            <div v-if="msg.role === 'user'" class="message-avatar user-avatar">
              <el-icon :size="18">
                <User />
              </el-icon>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-if="isLoading" class="message-item assistant">
            <div class="message-avatar">
              <el-icon :size="18">
                <MagicStick />
              </el-icon>
            </div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="2"
              placeholder="输入你的问题... (Ctrl+Enter 发送)"
              @keydown.ctrl.enter="sendMessage"
              @keydown.meta.enter="sendMessage"
            />
          </div>
          <div class="input-actions">
            <span class="tip">支持询问生产、销售、订单等数据</span>
            <el-button
              type="primary"
              :loading="isLoading"
              :disabled="!inputText.trim()"
              @click="sendMessage"
            >
              <el-icon><Promotion /></el-icon>
              发送
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import {
  ChatDotRound,
  MagicStick,
  Close,
  Delete,
  User,
  Promotion,
  FullScreen
} from '@element-plus/icons-vue'
import { AIService, type ChatMessage } from '@/services/aiService'
import { useBusinessStore } from '@/stores/business'
import { ElMessage } from 'element-plus'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const store = useBusinessStore()
const isChatOpen = ref(false)
const isFullscreen = ref(false)
const inputText = ref('')
const messages = ref<Message[]>([])
const isLoading = ref(false)
const messageContainer = ref<HTMLDivElement>()

const quickQuestions = [
  '今天销售情况如何？',
  '哪条生产线效率最低？',
  '订单完成率是多少？',
  '有哪些异常需要关注？'
]

// 获取当前数据上下文
const contextData = computed(() => ({
  totalOrders: store.stats?.totalOrders || 0,
  totalSales: store.stats?.totalSales || 0,
  totalProducts: store.stats?.totalProducts || 0,
  totalCustomers: store.stats?.totalCustomers || 0,
  processing: store.ordersByStatus?.processing || 0,
  completed: store.ordersByStatus?.completed || 0,
  pending: store.ordersByStatus?.pending || 0
}))

function toggleChat() {
  isChatOpen.value = !isChatOpen.value
  if (!isChatOpen.value) {
    isFullscreen.value = false // 关闭时退出全屏
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function clearChat() {
  messages.value = []
  ElMessage.info('对话已清空')
}

async function sendMessage() {
  if (!inputText.value.trim() || isLoading.value) return

  const question = inputText.value.trim()
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: question,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })

  inputText.value = ''
  scrollToBottom()

  // 调用AI
  isLoading.value = true
  
  try {
    // 构建对话历史
    const conversationHistory: ChatMessage[] = messages.value
      .slice(-6) // 只保留最近3轮对话
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    const response = await AIService.queryData(
      question,
      contextData.value,
      conversationHistory
    )

    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })

    scrollToBottom()
  } catch (error) {
    console.error('AI回复失败:', error)
    ElMessage.error('AI暂时无法回复，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

function sendQuickQuestion(question: string) {
  inputText.value = question
  sendMessage()
}

function formatMessage(content: string): string {
  // 简单的markdown格式化
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}
</script>

<style lang="scss" scoped>
.ai-chat-assistant {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 2000;

  .chat-trigger-btn {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00E676, #69F0AE);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 230, 118, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(0, 230, 118, 0.5);
    }

    .pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid #00E676;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      opacity: 0.6;
    }
  }

  .chat-container {
    width: 600px;
    height: 750px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 20px;
    border: 1px solid $card-border;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.fullscreen {
      width: 90vw;
      height: 90vh;
      max-width: 1400px;
      max-height: 900px;
      border-radius: 24px;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #00E676, #69F0AE);
      color: white;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-info {
          h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            opacity: 0.9;
            margin-top: 2px;

            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: white;
              animation: pulse 2s ease infinite;
            }
          }
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .action-btn {
          font-size: 20px;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.3s;

          &:hover {
            opacity: 1;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: linear-gradient(180deg, rgba(250, 251, 252, 1) 0%, rgba(255, 255, 255, 1) 100%);

      .welcome-message {
        text-align: center;
        padding: 40px 20px;

        .welcome-icon {
          margin-bottom: 20px;
        }

        h3 {
          margin: 0 0 10px;
          font-size: 20px;
          font-weight: 600;
          color: $text-primary;
        }

        p {
          margin: 0 0 28px;
          font-size: 15px;
          color: $text-secondary;
          line-height: 1.6;
        }

        .quick-questions {
          .quick-title {
            font-size: 14px;
            font-weight: 500;
            color: $text-secondary;
            margin-bottom: 14px;
            text-align: left;
          }

          .quick-btn {
            display: block;
            width: 100%;
            padding: 12px 18px;
            margin-bottom: 10px;
            background: white;
            border: 1px solid $card-border;
            border-radius: 8px;
            color: $text-primary;
            font-size: 14px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #00E676;
              background: rgba(0, 230, 118, 0.05);
              transform: translateX(4px);
            }
          }
        }
      }

      .message-item {
        display: flex;
        gap: 14px;
        margin-bottom: 20px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            background: linear-gradient(135deg, #00E676, #69F0AE);
            color: white;
            border-radius: 16px 16px 4px 16px;

            .message-text {
              font-size: 15px;
              line-height: 1.7;
            }

            .message-time {
              text-align: right;
              opacity: 0.8;
            }
          }
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00E676, #69F0AE);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          &.user-avatar {
            background: linear-gradient(135deg, #64748B, #94A3B8);
          }
        }

        .message-content {
          max-width: 75%;
          padding: 14px 18px;
          background: white;
          border-radius: 16px 16px 16px 4px;
          border: 1px solid $card-border;

          .message-text {
            font-size: 15px;
            line-height: 1.7;
            color: $text-primary;
            word-wrap: break-word;

            :deep(strong) {
              color: #00E676;
              font-weight: 600;
            }
          }

          .message-time {
            font-size: 12px;
            color: $text-tertiary;
            margin-top: 8px;
          }

          .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 4px 0;

            span {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #00E676;
              animation: typing 1.4s infinite;

              &:nth-child(2) {
                animation-delay: 0.2s;
              }

              &:nth-child(3) {
                animation-delay: 0.4s;
              }
            }
          }
        }
      }
    }

    .chat-input-area {
      padding: 16px;
      background: white;
      border-top: 1px solid $card-border;

      .input-wrapper {
        margin-bottom: 12px;

        :deep(.el-textarea__inner) {
          border-radius: 10px;
          border-color: $card-border;
          resize: none;
          font-size: 15px;
          line-height: 1.6;
          padding: 12px 14px;

          &:focus {
            border-color: #00E676;
          }
        }
      }

      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tip {
          font-size: 13px;
          color: $text-tertiary;
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-out 0.3s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  to {
    transform: scale(0);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>

