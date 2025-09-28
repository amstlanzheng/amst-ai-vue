anan<template>
  <div class="chat-markdown-container">
    <!-- 主容器布局 -->
    <div class="main-layout">
      <!-- 历史聊天侧边栏 (左侧) -->
      <div class="chat-history-sidebar">
        <div class="sidebar-header">
          <h2>历史对话</h2>
          <!-- 新增会话按钮 -->
          <button class="new-session-button" @click="startNewSession">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新增会话
          </button>
        </div>
        <div class="chat-history-list">
          <div 
            v-for="chat in chatHistory" 
            :key="chat.id"
            class="chat-history-item"
            :class="{ active: currentChatId === chat.id }"
            @click="loadChat(chat.id)"
          >
            <div class="chat-title">{{ chat.title }}</div>
          </div>
          <div v-if="!chatHistory.length" class="empty-history">
            暂无历史对话
          </div>
        </div>
      </div>
      
      <!-- Markdown文档内容区域 (中间) -->
      <div class="markdown-section">
        <!-- 头部区域 -->
        <div class="header">
          <h1>Markdown 聊天助手</h1>
          <p class="subtitle">上传 Markdown 文件并进行智能对话</p>
        </div>

        <!-- 文件上传区域 - 仅在没有上传文件时显示 -->
        <div v-if="!currentMdName" class="upload-area">
          <div class="upload-box" @click="triggerFileUpload">
            <div class="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div class="upload-text">
              <p class="upload-title">拖拽 Markdown 文件到此处</p>
              <p class="upload-subtitle">或点击选择文件</p>
              <p class="upload-hint">(支持 .md 和 .markdown 文件格式)</p>
            </div>
            <input 
              ref="fileInputRef" 
              type="file" 
              accept=".md,.markdown" 
              @change="handleFileChange" 
              style="display: none;"
            >
          </div>

          <!-- 上传状态显示 -->
          <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p>正在上传: {{ uploadingFileName }}</p>
          </div>
        </div>

        <!-- 当前文件信息 -->
        <div v-if="currentMdName" class="current-file-info">
          <div class="file-name">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>{{ currentMdName }}</span>
          </div>
        </div>

        <!-- Markdown 文档内容显示区域 -->
        <div v-if="currentMdContent" class="markdown-content">
          <div class="markdown-header">
            <h3>文档内容</h3>
          </div>
          <div class="markdown-preview-container">
            <MarkdownPreview 
              :content="currentMdContent" 
              :fileName="currentMdName || '文档.md'"
            />
          </div>
        </div>
      </div>
      
      <!-- 聊天对话框区域 (右侧) -->
      <div class="chat-section">
        <!-- 消息区域和输入区域重新排列 -->
        <div class="messages-and-input-container">
          <!-- 消息区域 -->
          <div class="messages-container" ref="messagesRef">
            <div v-if="!currentMessages.length && !isUploading && !currentMdName" class="empty-state">
              <p>上传 Markdown 文件开始对话</p>
            </div>
            <ChatMessage 
              v-for="(message, index) in currentMessages" 
              :key="index" 
              :message="message"
            />
            <div v-if="isStreaming" class="streaming-indicator">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div v-if="currentMdName" class="input-container">
            <div class="input-wrapper">
              <textarea 
                ref="inputRef"
                v-model="userInput"
                @keydown.enter.prevent="handleSendMessage"
                placeholder="输入你的问题... (回车发送)"
                class="message-input"
                :disabled="isStreaming || isUploading"
              ></textarea>
              <button 
                @click="handleSendMessage"
                :disabled="!userInput.trim() || isStreaming || isUploading"
                class="send-button"
                title="发送消息"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import ChatMessage from '../components/ChatMessage.vue';
import MarkdownPreview from '../components/MarkdownPreview.vue';
import { useMarkdownState, useMarkdownChat } from '../composables/useMarkdownChat';
import type { Message, ChatHistoryItem } from '../types/chat';

// 状态定义
const messagesRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const userInput = ref('');
const currentChatId = ref<string | null>(null);
const currentMessages = ref<Message[]>([]);
const chatHistory = ref<ChatHistoryItem[]>([]);

// 使用 Markdown 相关的 composables
const { isUploading, uploadingFileName, currentMdName, currentMdContent } = useMarkdownState();
const isStreaming = ref(false);

const { 
  handleFileSelected, 
  sendMessage, 
  cleanupResources,
  scrollToBottom,
  loadChat,
  loadChatHistory,
  startNewChat
} = useMarkdownChat(
  currentMessages,
  chatHistory,
  currentChatId,
  isUploading,
  uploadingFileName,
  currentMdName,
  currentMdContent,
  isStreaming,
  messagesRef
);

// 触发文件上传
const triggerFileUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    handleFileSelected(target.files[0]);
    // 清空 input 以允许重复上传同一文件
    target.value = '';
  }
};

// 发送消息
const handleSendMessage = async () => {
  if (!userInput.value.trim() || isStreaming.value) return;
  
  await sendMessage(userInput.value.trim(), inputRef.value);
  userInput.value = '';
  
  // 重置输入框高度
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
  }
};

// 新增会话
const startNewSession = () => {
  startNewChat();
};

// 处理清理事件
const handleCleanup = () => {
  cleanupResources();
};

// 生命周期钩子
onMounted(() => {
  console.log('ChatMarkdown 组件已挂载');
  window.addEventListener('cleanupChatMarkdown', handleCleanup);
  
  // 加载历史聊天记录
  loadChatHistory();
  
  // 自动聚焦到输入框（如果已上传文件）
  if (currentMdName.value && inputRef.value) {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

onUnmounted(() => {
  console.log('ChatMarkdown 组件已卸载');
  window.removeEventListener('cleanupChatMarkdown', handleCleanup);
});
</script>

<style scoped>
.chat-markdown-container {
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
  padding-bottom: 104px; /* 添加底部内边距避免被底部栏遮挡 */
}

/* 主布局样式 */
.main-layout {
  display: flex;
  width: 100%;
  gap: 15px;
  height: 100%;
  align-items: stretch;
  flex: 1;
}

/* 聊天历史侧边栏样式 */
.chat-history-sidebar {
  width: 20%;
  min-width: 220px;
  max-width: 300px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.new-session-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.new-session-button:hover {
  background-color: #2563eb;
}

.chat-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-history-item {
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8fafc;
}

.chat-history-item:hover {
  background-color: #e2e8f0;
}

.chat-history-item.active {
  background-color: #dbeafe;
  border-left: 3px solid #3b82f6;
}

.chat-title {
  font-size: 14px;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-history {
  padding: 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

/* Markdown文档区域样式 */
.markdown-section {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* 防止内容溢出 */
}

/* 聊天区域样式 */
.chat-section {
  width: 25%;
  min-width: 280px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 消息和输入容器 */
.messages-and-input-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex: 1;
}

/* 消息区域样式 */
.messages-container {
  overflow-y: auto;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  flex: 1;
  min-height: 150px;
  margin-bottom: 16px;
}

/* 输入区域样式 */
.input-container {
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  border-top: none;
  box-shadow: none;
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0;
}

.message-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #ffffff;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.message-input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.send-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.send-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: block;
  width: 100%;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  display: block;
  width: 100%;
}

/* 上传区域样式 */
.upload-area {
  margin-bottom: 24px;
  flex-shrink: 0; /* 防止上传区域被压缩 */
}

.upload-box {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-icon {
  margin-bottom: 16px;
  color: #64748b;
}

.upload-text .upload-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.upload-text .upload-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.upload-text .upload-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.upload-progress {
  margin-top: 12px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  animation: progress-animation 1.5s ease-in-out infinite;
}

@keyframes progress-animation {
  0% { width: 0%; }
  50% { width: 50%; }
  100% { width: 100%; }
}

.upload-progress p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 当前文件信息样式 */
.current-file-info {
  background-color: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 防止文件信息区域被压缩 */
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
}

/* Markdown 内容区域样式 */
.markdown-content {
  margin-bottom: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止内容溢出 */
}

.markdown-header {
  margin-bottom: 12px;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.markdown-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* 为 MarkdownPreview 组件添加滚动 */
.markdown-preview-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background-color: #ffffff;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .chat-section {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .chat-markdown-container {
    padding: 10px;
  }
  
  .main-layout {
    flex-direction: column;
  }
  
  .chat-history-sidebar,
  .chat-section {
    width: 100%;
    height: auto;
  }
  
  .header h1 {
    font-size: 24px;
  }
}
</style>