import { ref, nextTick } from 'vue';
import type { Message, ChatHistoryItem } from '../types/chat';
import type { Ref } from 'vue';

// 消息相关状态
export const useMessages = () => {
  const messagesRef: Ref<HTMLElement | null> = ref(null);
  const currentMessages: Ref<Message[]> = ref([]);
  const isStreaming = ref(false);
  
  console.log("Initializing useMessages composable");

  // 滚动到底部
  const scrollToBottom = async () => {
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  };

  return {
    messagesRef,
    currentMessages,
    isStreaming,
    scrollToBottom
  };
};

// 输入相关状态
export const useInput = () => {
  const inputRef: Ref<HTMLTextAreaElement | null> = ref(null);
  const userInput = ref("");

  console.log("Initializing useInput composable");

  // 自动调整输入框高度
  const adjustTextareaHeight = () => {
    const textarea = inputRef.value;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // 监听输入变化以调整文本框高度
  const handleInput = () => {
    adjustTextareaHeight();
  };

  return {
    inputRef,
    userInput,
    adjustTextareaHeight,
    handleInput
  };
};

// 文件上传相关状态
export const useFileUpload = () => {
  const isUploading = ref(false);
  const uploadingFileName = ref("");
  const currentMdName = ref("");
  const currentMdContent = ref("");

  console.log("Initializing useFileUpload composable");

  return {
    isUploading,
    uploadingFileName,
    currentMdName,
    currentMdContent
  };
};

// 聊天历史相关状态
export const useChatHistory = () => {
  const chatHistory: Ref<ChatHistoryItem[]> = ref([]);
  const currentChatId = ref<string | null>(null);

  console.log("Initializing useChatHistory composable");

  return {
    chatHistory,
    currentChatId
  };
};