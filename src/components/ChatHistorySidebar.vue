<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <a href="#" class="logo-link" @click="handleLogoClick">
        <DocumentTextIcon class="logo" />
        <h1 class="title">ChatMD</h1>
      </a>
    </div>

    <div class="history-list">
      <div class="history-header">
        <span>历史记录</span>
        <button class="new-chat-btn" @click="startNewChat">
          <PlusIcon class="icon" />
          新聊天
        </button>
      </div>
      <div
        v-for="chat in chatHistory"
        :key="chat.id"
        class="history-item"
        :class="{ active: currentChatId === chat.id }"
        @click="loadChat(chat.id)"
      >
        <DocumentTextIcon class="icon" />
        <span class="title">{{ chat.title || "Markdown对话" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { ChatHistoryItem } from '../types/chat'

defineProps<{
  chatHistory: ChatHistoryItem[]
  currentChatId: string | null
}>()

const emit = defineEmits<{
  (e: 'load-chat', chatId: string): void
  (e: 'new-chat'): void
  (e: 'logo-click', event: Event): void
}>()

const loadChat = (chatId: string) => {
  emit('load-chat', chatId)
}

const startNewChat = () => {
  emit('new-chat')
}

const handleLogoClick = (event: Event) => {
  emit('logo-click', event)
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .sidebar-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    .logo-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }

    .logo {
      width: 2rem;
      height: 2rem;
      color: #9333ea;
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(120deg, #9333ea 0%, #c026d3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;

    .history-header {
      padding: 0.5rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 0.875rem;
        font-weight: 500;
        color: #666;
        text-transform: uppercase;
      }

      .new-chat-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 0.5rem;
        background: #9333ea;
        color: white;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #7e22ce;
        }

        .icon {
          width: 1rem;
          height: 1rem;
        }
      }
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      &.active {
        background: rgba(147, 51, 234, 0.1);

        .icon {
          color: #9333ea;
        }

        .title {
          color: #9333ea;
        }
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
        color: #666;
      }

      .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }
    }
  }
}

.dark .sidebar {
  background: rgba(40, 40, 40, 0.95);

  .sidebar-header {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }

  .history-list {
    .history-header {
      span {
        color: #999;
      }

      .new-chat-btn {
        background: rgba(147, 51, 234, 0.8);

        &:hover {
          background: #9333ea;
        }
      }
    }

    .history-item {
      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      &.active {
        background: rgba(147, 51, 234, 0.15);
      }

      .icon {
        color: #999;
      }

      .title {
        color: #fff;
      }
    }
  }
}
</style>
