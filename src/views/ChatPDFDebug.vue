<template>
  <div class="chat-pdf-debug">
    <h1>ChatPDF Debug Page</h1>
    <p>Current Md Content: "{{ currentMdContent }}"</p>
    <p>Is Uploading: {{ isUploading }}</p>
    <p>Current Messages Count: {{ currentMessages.length }}</p>
    
    <div v-if="!currentMdContent || currentMdContent === ''">
      <h2>Upload Welcome Screen</h2>
      <button @click="simulateUpload">模拟上传文件</button>
    </div>
    
    <div v-else>
      <h2>Chat Interface</h2>
      <p>File Name: {{ currentMdName }}</p>
      <div class="messages">
        <div v-for="(message, index) in currentMessages" :key="index">
          <strong>{{ message.role }}:</strong> {{ message.content }}
        </div>
      </div>
      <div class="input-area">
        <input v-model="userInput" placeholder="Enter your message" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Message } from "../types/chat";

// 状态变量
const currentMdContent = ref("");
const currentMdName = ref("");
const isUploading = ref(false);
const currentMessages = ref<Message[]>([]);
const userInput = ref("");

// 模拟上传文件
const simulateUpload = () => {
  console.log("Simulating file upload");
  isUploading.value = true;
  
  setTimeout(() => {
    currentMdName.value = "test.md";
    currentMdContent.value = "# Test Markdown\n\nThis is a test markdown content.";
    isUploading.value = false;
    console.log("File upload simulated");
  }, 1000);
};

// 发送消息
const sendMessage = () => {
  if (!userInput.value.trim()) return;
  
  // 添加用户消息
  currentMessages.value.push({
    role: "user",
    content: userInput.value,
    timestamp: new Date()
  });
  
  // 模拟AI回复
  setTimeout(() => {
    currentMessages.value.push({
      role: "assistant",
      content: "这是AI的回复。",
      timestamp: new Date()
    });
  }, 500);
  
  userInput.value = "";
};

// 生命周期钩子
onMounted(() => {
  console.log("ChatPDFDebug component mounted");
});
</script>

<style scoped>
.chat-pdf-debug {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.messages {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  max-height: 300px;
  overflow-y: auto;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
