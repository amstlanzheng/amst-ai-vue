<template>
  <div :class="['message', { 'message-user': message.role === 'user' }]">
    <div class="avatar">
      <n-icon :component="message.role === 'user' ? UserIcon : BotIcon" />
    </div>
    
    <div class="content">
      <div class="time-name">
        <span class="name">{{ message.role === 'user' ? '你' : '小助手' }}</span>
        <span v-if="message.createdAt && formatTime(message.createdAt)" class="time">{{ formatTime(message.createdAt) }}</span>
      </div>
      
      <div class="text-container">
        <div :class="['text', { 'markdown-content': message.contentType === 'text' }]">
          <template v-if="message.contentType === 'text'">
            <MarkdownPreview :content="message.content" :fileName="message.fileName || 'file.md'" />
          </template>
          <template v-else>
            {{ message.content }}
          </template>
        </div>
        
        <button 
          v-if="message.role !== 'user' && !isLoading" 
          class="copy-button" 
          @click="copyToClipboard"
          :title="copied ? '已复制' : '复制消息'"
        >
          <n-icon :component="copied ? CheckIcon : CopyIcon" />
        </button>
      </div>
      
      <div v-if="message.think" class="think-block">
        <span>{{ message.think }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Copy, CheckmarkCircle, Send, PersonCircle } from '@vicons/ionicons5';
import { NIcon } from 'naive-ui';
import MarkdownPreview from './MarkdownPreview.vue';
import type { Message } from '@/types/chat';

const props = defineProps<{
  message: Message;
  isLoading?: boolean;
}>();

const copied = ref(false);
const CopyIcon = Copy;
const CheckIcon = CheckmarkCircle;
const BotIcon = Send;
const UserIcon = PersonCircle;

function formatTime(timestamp: string | number | Date) {
  // 处理可能的无效时间戳
  if (!timestamp) {
    return ''; // 返回空字符串而不是 --:--
  }
  
  let date: Date;
  
  // 根据不同类型的时间戳创建Date对象
  if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (typeof timestamp === 'number') {
    // 如果是数字，假设是毫秒时间戳
    date = new Date(timestamp);
  } else {
    date = timestamp;
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return ''; // 返回空字符串而不是 --:--
  }
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function copyToClipboard() {
  if (props.message.content) {
    navigator.clipboard.writeText(props.message.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}

onMounted(() => {
  // 组件挂载后的逻辑
});
</script>

<style scoped>
.message {
  display: flex;
  gap: 12px;
  padding: 6px 16px;
  animation: fadeIn 0.2s ease-in;
  max-height: fit-content;
  height: fit-content;
  margin-bottom: 8px;
}

/* 当消息连续来自同一角色时，减少间距 */
.message:not(:first-child) {
  margin-bottom: 8px;
}

.message + .message {
  margin-top: 0px;
}

/* 专门控制用户消息和系统消息之间的间距 */
.message-user + .message:not(.message-user) {
  margin-top: 4px;
}

.message:not(.message-user) + .message-user {
  margin-top: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-user {
  flex-direction: row-reverse;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #f3f4f6;
  align-self: flex-start;
  margin-top: 2px;
}

.message-user .avatar {
  background-color: #dbeafe;
}

.icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.message-user .icon {
  color: #2563eb;
}

.content {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.message-user .content {
  align-items: flex-end;
}

.time-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.name {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.time {
  font-size: 12px;
  color: #9ca3af;
}

.text-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  height: fit-content;
  overflow: visible;
}

.message-user .text-container {
  justify-content: flex-end;
}

.text {
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid #e5e7eb;
  margin: 0;
  overflow: hidden;
  display: inline-block;
  height: fit-content;
  max-height: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-user .text {
  background-color: #dbeafe;
  border: 1px solid #bfdbfe;
  border-bottom-right-radius: 4px;
  color: #1e3a8a;
}

.text.markdown-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 4px;
  max-width: 100%;
  width: auto;
  height: fit-content;
  margin: 0;
  overflow: hidden;
  padding: 0;
}

.message-user .text.markdown-content {
  background-color: #dbeafe;
  border: 1px solid #bfdbfe;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 14px;
  overflow: hidden;
}

.think-block {
  background-color: #eff6ff;
  border-left: 3px solid #3b82f6;
  padding: 6px 10px;
  margin: 6px 0;
  border-radius: 0 6px 6px 0;
  font-style: italic;
  font-size: 13px;
  color: #374151;
}

.message-user .think-block {
  border-left: none;
  border-right: 3px solid #3b82f6;
  border-radius: 6px 0 0 6px;
  text-align: right;
}

.copy-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 4px;
}

.copy-button:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.message-user .copy-button {
  margin-left: 0;
  margin-right: 6px;
}

/* 暗黑模式适配 */
.dark .message {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .avatar {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark .message-user .avatar {
  background-color: rgba(59, 130, 246, 0.2);
}

.dark .icon {
  color: rgba(255, 255, 255, 0.7);
}

.dark .message-user .icon {
  color: #3b82f6;
}

.dark .text {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.dark .message-user .text {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

.dark .think-block {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
  color: rgba(255, 255, 255, 0.8);
}

.dark .copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>