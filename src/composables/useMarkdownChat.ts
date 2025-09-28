import { ref, nextTick } from 'vue';
import { chatAPI } from '../services/api';
import type { Message, ChatHistoryItem } from '../types/chat';
import API_CONFIG from '../config/api';
import type { Ref } from 'vue';

// Markdown 聊天状态管理
export const useMarkdownState = () => {
  const isUploading = ref(false);
  const uploadingFileName = ref('');
  const currentMdName = ref('');
  const currentMdContent = ref('');

  return {
    isUploading,
    uploadingFileName,
    currentMdName,
    currentMdContent
  };
};

// Markdown 聊天核心逻辑
export const useMarkdownChatCore = (
  currentMessages: Ref<Message[]>,
  chatHistory: Ref<ChatHistoryItem[]>,
  currentChatId: Ref<string | null>,
  isUploading: Ref<boolean>,
  uploadingFileName: Ref<string>,
  currentMdName: Ref<string>,
  currentMdContent: Ref<string>,
  isStreaming: Ref<boolean>,
  messagesRef: Ref<HTMLElement | null>
) => {
  // API 配置
  const BASE_URL = API_CONFIG.baseURL;

  // 滚动到底部
  const scrollToBottom = async () => {
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  };

  // 清理资源
  const cleanupResources = () => {
    currentMdName.value = '';
    currentMdContent.value = '';
    currentMessages.value = [];
    currentChatId.value = null;
    isUploading.value = false;
    uploadingFileName.value = '';
    isStreaming.value = false;

    // 重置滚动位置
    if (messagesRef.value) {
      messagesRef.value.scrollTop = 0;
    }
  };

  // 加载聊天记录
  const loadChat = async (chatId: string) => {
    console.log('查询聊天记录，Loading chat...');
    if (!chatId) return;

    cleanupResources();
    currentChatId.value = chatId;

    try {
      // 加载消息历史
      const messages = await chatAPI.getChatMessages(chatId, 'md');
      currentMessages.value = messages.map((msg) => ({
        ...msg,
        isMarkdown: msg.role === 'assistant',
      }));

      // 从服务器获取 Markdown 文件下载链接
      const response = await fetch(`${BASE_URL}/ai/md/file/${chatId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('获取 Markdown 失败');

      // 解析 JSON 响应以获取下载链接和文件名
      const result = await response.json();
      if (result.code !== 1) throw new Error('获取文件下载链接失败');

      console.log('文件下载链接:', result.data);
      // 从响应中获取文件名和下载链接
      let filename = 'document.md';
      if (result.data.fileName) {
        filename = result.data.fileName;
      } else if (result.data.fileUrl) {
        // 从下载链接中提取文件名
        try {
          const url = new URL(result.data.fileUrl);
          const pathParts = url.pathname.split('/');
          if (pathParts.length > 0) {
            const lastPart = pathParts[pathParts.length - 1];
            if (lastPart) {
              filename = lastPart;
              console.log('文件名:', filename);
            }
          }
        } catch (e) {
          console.warn('无法从URL解析文件名:', e);
        }
      }

      // 更新当前文件名和历史记录中的标题
      currentMdName.value = filename;
      const chatIndex = chatHistory.value.findIndex((c) => c.id === chatId);
      if (chatIndex !== -1) {
        chatHistory.value[chatIndex].title = filename;
      }

      // 下载文件内容
      const fileUrl = result.data.fileUrl || result.data;
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) throw new Error('下载文件失败');
      const text = await fileResponse.text();
      currentMdContent.value = text;
    } catch (error) {
      console.error('加载失败:', error);
      const errorMessage = {
        role: 'assistant',
        content: '加载失败，请重试。',
        timestamp: new Date(),
        isMarkdown: true,
      };
      currentMessages.value.push(errorMessage);
    }
  };

  // 加载聊天历史
  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history...');
      const history = await chatAPI.getChatHistory('md');
      console.log('Chat history loaded:', history);
      chatHistory.value = history || [];
    } catch (error) {
      console.error('加载聊天历史失败:', error);
      chatHistory.value = [];
    }
  };

  return {
    loadChat,
    loadChatHistory,
    cleanupResources,
    scrollToBottom
  };
};

// Markdown 文件处理逻辑
export const useMarkdownFileHandling = (
  currentMessages: Ref<Message[]>,
  chatHistory: Ref<ChatHistoryItem[]>,
  currentChatId: Ref<string | null>,
  isUploading: Ref<boolean>,
  uploadingFileName: Ref<string>,
  currentMdName: Ref<string>,
  currentMdContent: Ref<string>
) => {
  const BASE_URL = API_CONFIG.baseURL;

  // 处理文件选择
  const handleFileSelected = async (file: File) => {
    // 检查是否为 Markdown 文件
    if (
      !file.type.includes('markdown') &&
      !file.name.match(/\.(md|markdown)$/i)
    ) {
      alert('请上传 Markdown 文件');
      return;
    }

    // 设置上传状态和文件名
    isUploading.value = true;
    uploadingFileName.value = file.name;

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('file', file);

      // 生成临时 chatId 或使用现有的
      const uploadChatId = currentChatId.value || `md_${Date.now()}`;

      // 发送上传请求
      const response = await fetch(`${BASE_URL}/ai/md/upload/${uploadChatId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.status}`);
      }

      const data = await response.json();
      const text = await file.text();

      // 保存聊天 ID 和文件名
      const chatId = data.chatId || uploadChatId;
      currentChatId.value = chatId;
      currentMdName.value = file.name;
      currentMdContent.value = text;

      // 添加到聊天历史
      const newChat = {
        id: chatId,
        title: `Markdown对话: ${file.name.slice(0, 20)}${
          file.name.length > 20 ? '...' : ''
        }`,
      };

      // 更新聊天历史 - 避免重复添加
      if (!chatHistory.value.some((chat) => chat.id === chatId)) {
        chatHistory.value = [newChat, ...chatHistory.value];
      }

      // 清空消息
      currentMessages.value = [];

      // 添加系统消息
      currentMessages.value.push({
        role: 'assistant',
        content: `已上传 Markdown 文件: ${file.name}。您可以开始提问了。`,
        timestamp: new Date(),
        isMarkdown: true,
      });
    } catch (error) {
      console.error('上传失败:', error);
      alert('文件上传失败，请重试');
    } finally {
      isUploading.value = false;
      uploadingFileName.value = '';
    }
  };

  return {
    handleFileSelected
  };
};

// Markdown 消息发送逻辑
export const useMarkdownMessaging = (
  currentMessages: Ref<Message[]>,
  currentChatId: Ref<string | null>,
  isStreaming: Ref<boolean>,
  messagesRef: Ref<HTMLElement | null>
) => {
  const BASE_URL = API_CONFIG.baseURL;

  // 发送消息
  const sendMessage = async (
    userInput: string,
    inputRef: HTMLTextAreaElement | null
  ) => {
    if (!userInput.trim() || isStreaming.value) return;

    // 添加用户消息到聊天记录
    const userMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };
    currentMessages.value.push(userMessage);

    // 清空输入框并调整高度
    if (inputRef) {
      inputRef.style.height = 'auto';
    }

    // 滚动到底部
    await nextTick();
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }

    // 添加一个空的助手消息作为流式响应的容器
    const assistantMessageIndex = currentMessages.value.length;
    currentMessages.value.push({
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isMarkdown: true,
    });

    try {
      isStreaming.value = true;

      // 发送请求到服务器
      const url = new URL(`${BASE_URL}/ai/md/chat`);
      url.searchParams.append('prompt', userInput);
      if (currentChatId.value) {
        url.searchParams.append('chatId', currentChatId.value);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // 返回可读流
      if (!response.body) {
        throw new Error('Response body is null');
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      // 处理流式响应
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          // 更安全的方式更新消息内容，确保响应式更新正确触发
          if (currentMessages.value[assistantMessageIndex]) {
            // 创建新对象并保留原引用，避免完全替换
            const updatedMessage = {
              ...currentMessages.value[assistantMessageIndex],
              content: result,
              timestamp: new Date()
            };
            // 替换整个数组以确保响应式系统能检测到变化
            currentMessages.value = [
              ...currentMessages.value.slice(0, assistantMessageIndex),
              updatedMessage,
              ...currentMessages.value.slice(assistantMessageIndex + 1)
            ];
          }

          // 确保 DOM 更新并滚动到底部
          await nextTick();
          if (messagesRef.value) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
          }
        }
    } catch (error) {
      console.error('发送消息失败:', error);
      currentMessages.value[assistantMessageIndex] = {
        role: 'assistant',
        content: '发送消息失败，请重试。',
        timestamp: new Date(),
        isMarkdown: true,
      };
    } finally {
      isStreaming.value = false;
      await nextTick();
      if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
      }
    }
  };

  return {
    sendMessage
  };
};

// 主要的 Markdown 聊天 composable（保持向后兼容）
export const useMarkdownChat = (
  currentMessages: Ref<Message[]>,
  chatHistory: Ref<ChatHistoryItem[]>,
  currentChatId: Ref<string | null>,
  isUploading: Ref<boolean>,
  uploadingFileName: Ref<string>,
  currentMdName: Ref<string>,
  currentMdContent: Ref<string>,
  isStreaming: Ref<boolean>,
  messagesRef: Ref<HTMLElement | null>
) => {
  const { loadChat, loadChatHistory, cleanupResources, scrollToBottom } = useMarkdownChatCore(
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

  const { handleFileSelected } = useMarkdownFileHandling(
    currentMessages,
    chatHistory,
    currentChatId,
    isUploading,
    uploadingFileName,
    currentMdName,
    currentMdContent
  );

  const { sendMessage } = useMarkdownMessaging(
    currentMessages,
    currentChatId,
    isStreaming,
    messagesRef
  );

  return {
    loadChat,
    loadChatHistory,
    handleFileSelected,
    sendMessage,
    cleanupResources,
    scrollToBottom
  };
};
