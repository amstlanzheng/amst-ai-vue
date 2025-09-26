<template>
  <div class="message" :class="{ 'message-user': isUser }">
    <div class="avatar">
      <UserCircleIcon v-if="isUser" class="icon" />
      <ComputerDesktopIcon v-else class="icon" :class="{ 'assistant': !isUser }" />
    </div>
    <div class="content">
      <div class="text-container">
        <button v-if="isUser" class="user-copy-button" @click="copyContent" :title="copyButtonTitle">
          <DocumentDuplicateIcon v-if="!copied" class="copy-icon" />
          <CheckIcon v-else class="copy-icon copied" />
        </button>
        <div class="text" ref="contentRef" v-if="isUser">
          {{ message.content }}
        </div>
        <div class="text markdown-content" ref="contentRef" v-else v-html="processedContent"></div>
      </div>
      <div class="message-footer" v-if="!isUser">
        <button class="copy-button" @click="copyContent" :title="copyButtonTitle">
          <DocumentDuplicateIcon v-if="!copied" class="copy-icon" />
          <CheckIcon v-else class="copy-icon copied" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, ref, watch } from 'vue'
import { marked } from 'marked'
import type { Renderer } from 'marked'
import DOMPurify from 'dompurify'
import { UserCircleIcon, ComputerDesktopIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/vue/24/outline'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const contentRef = ref<HTMLElement | null>(null)
const copied = ref(false)
const copyButtonTitle = computed(() => copied.value ? '已复制' : '复制内容')

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isUser = computed(() => props.message.role === 'user')

// 扩展 marked 渲染器以使链接在新标签页中打开
const renderer = new marked.Renderer()
const originalLinkRenderer = renderer.link
renderer.link = function(options: any) {
  const link = originalLinkRenderer ? originalLinkRenderer.call(this, options) : marked.Renderer.prototype.link.call(this, options)
  return link.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer" ')
}

// 配置 marked - 修复类型问题
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  renderer: renderer
})

// 处理内容
const processContent = (content: string) => {
  if (!content) return ''

  // 分析内容中的 think 标签
  let result = ''
  let isInThinkBlock = false
  let currentBlock = ''

  // 逐字符分析，处理 think 标签
  for (let i = 0; i < content.length; i++) {
    if (content.slice(i, i + 7) === '<think>') {
      isInThinkBlock = true
      if (currentBlock) {
        // 将之前的普通内容转换为 HTML
        result += marked.parse(currentBlock)
      }
      currentBlock = ''
      i += 6 // 跳过 <think>
      continue
    }

    if (content.slice(i, i + 8) === '</think>') {
      isInThinkBlock = false
      // 将 think 块包装在特殊 div 中
      result += `<div class="think-block">${marked.parse(currentBlock)}</div>`
      currentBlock = ''
      i += 7 // 跳过 </think>
      continue
    }

    currentBlock += content[i]
  }

  // 处理剩余内容
  if (currentBlock) {
    if (isInThinkBlock) {
      result += `<div class="think-block">${marked.parse(currentBlock)}</div>`
    } else {
      result += marked.parse(currentBlock)
    }
  }

  // 净化处理后的 HTML
  const cleanHtml = DOMPurify.sanitize(result, {
    ADD_TAGS: ['think'],
    ADD_ATTR: ['target', 'rel', 'class', 'language']
  })
  
  return cleanHtml
}

// 修改计算属性
const processedContent = computed(() => {
  if (!props.message.content) return ''
  return processContent(props.message.content)
})

// 为代码块添加复制功能
const setupCodeBlockCopyButtons = () => {
  if (!contentRef.value) return
  
  const codeBlocks = contentRef.value.querySelectorAll('pre')
  codeBlocks.forEach((block: Element) => {
    // 检查是否已经添加了复制按钮
    if (block.querySelector('.code-copy-button')) return
    
    const code = block.querySelector('code')
    if (!code) return
    
    // 创建包装器
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    
    // 添加复制按钮
    const copyBtn = document.createElement('button')
    copyBtn.className = 'code-copy-button'
    copyBtn.title = '复制代码'
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="code-copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    `
    
    // 添加成功消息
    const successMsg = document.createElement('div')
    successMsg.className = 'copy-success-message'
    successMsg.textContent = '已复制!'
    
    // 组装结构
    wrapper.appendChild(block.cloneNode(true))
    wrapper.appendChild(copyBtn)
    wrapper.appendChild(successMsg)
    
    // 替换原始的 pre 元素
    block.parentNode?.replaceChild(wrapper, block)
    
    // 添加事件监听器
    copyBtn.addEventListener('click', async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        const codeText = code.textContent || ''
        await navigator.clipboard.writeText(codeText)
        
        // 显示成功消息
        successMsg.classList.add('visible')
        setTimeout(() => {
          successMsg.classList.remove('visible')
        }, 2000)
      } catch (err) {
        console.error('复制代码失败:', err)
      }
    })
  })
}

// 在内容更新后手动应用高亮和设置复制按钮
const highlightCode = async () => {
  await nextTick()
  if (contentRef.value) {
    // 高亮代码
    contentRef.value.querySelectorAll('pre code').forEach((block: Element) => {
      hljs.highlightElement(block as HTMLElement)
    })
    
    // 设置代码块复制按钮
    setupCodeBlockCopyButtons()
  }
}

// 复制内容到剪贴板
const copyContent = async () => {
  try {
    // 获取纯文本内容
    let textToCopy = props.message.content
    
    // 如果是AI回复，需要去除HTML标签
    if (!isUser.value && contentRef.value) {
      textToCopy = contentRef.value.textContent || contentRef.value.innerText || ''
    }
    
    await navigator.clipboard.writeText(textToCopy)
    copied.value = true
    
    // 3秒后重置复制状态
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 监听内容变化
watch(() => props.message.content, () => {
  if (!isUser.value) {
    highlightCode()
  }
})

// 初始化时也执行一次
onMounted(() => {
  if (!isUser.value) {
    highlightCode()
  }
})

const formatTime = (timestamp: number) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString()
}
</script>

<style scoped>
.message {
  display: flex;
  gap: 8px;
  padding: 2px 12px;
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-user {
  flex-direction: row-reverse;
}

.avatar {
  width: 28px;
  height: 28px;
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
  background-color: #e0f2fe;
}

.icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.message-user .icon {
  color: #0ea5e9;
}

.content {
  display: flex;
  flex-direction: column;
  max-width: 85%;
  width: fit-content !important;
  height: auto !important;
  overflow: hidden;
  flex-shrink: 0;
}

.message-user .content {
  align-items: flex-end;
  width: fit-content !important;
  height: auto !important;
  flex-shrink: 0;
}

.text-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: fit-content !important;
  height: auto !important;
  flex-shrink: 0;
}

.message-user .text-container {
  width: fit-content !important;
  height: auto !important;
  flex-shrink: 0;
  justify-content: flex-end;
}

.text {
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid #e5e7eb;
  max-width: fit-content !important;
  width: fit-content !important;
  height: auto !important;
  margin: 0;
  overflow: hidden;
  flex-shrink: 0;
  display: inline-block;
}

.message-user .text {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-bottom-right-radius: 4px;
  width: fit-content !important;
  max-width: fit-content !important;
  height: auto !important;
  min-width: 0 !important;
  flex: 0 0 auto !important;
}

.text.markdown-content {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border-bottom-left-radius: 4px;
  max-width: 100%;
  width: auto;
  height: auto;
  margin: 0;
  overflow: hidden;
}

.message-user .text.markdown-content {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 16px;
  overflow: hidden;
}

.think-block {
  background-color: #f0f9ff;
  border-left: 2px solid #0ea5e9;
  padding: 6px 10px;
  margin: 6px 0;
  border-radius: 0 6px 6px 0;
  font-style: italic;
  color: #0369a1;
  max-width: fit-content;
  width: fit-content;
  height: auto;
  overflow: hidden;
}

.think-block p {
  margin: 0;
}

/* Copy button styles */
.user-copy-button, .copy-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.6;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}

.user-copy-button:hover, .copy-button:hover {
  background-color: #f3f4f6;
  opacity: 1;
}

.message-user .user-copy-button:hover, .message-user .copy-button:hover {
  background-color: #e0f2fe;
}

.copy-icon {
  width: 13px;
  height: 13px;
  color: #6b7280;
}

.message-user .copy-icon {
  color: #0ea5e9;
}

.copied {
  color: #10b981;
}

.message-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 2px;
  margin-bottom: 0;
  width: fit-content;
  height: auto;
}

.message-user .message-footer {
  justify-content: flex-end;
}

/* Code block styles */
.markdown-content :deep(pre) {
  margin: 6px 0;
  border-radius: 6px;
  overflow: hidden;
}

.markdown-content :deep(code) {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
}

.markdown-content :deep(pre code) {
  padding: 8px;
  line-height: 1.4;
}

.code-block-wrapper {
  position: relative;
  margin: 6px 0;
}

.code-copy-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
  z-index: 10;
}

.code-copy-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.code-copy-icon {
  width: 13px;
  height: 13px;
}

.copy-success-message {
  position: absolute;
  top: 4px;
  right: 34px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 10;
}

.copy-success-message.visible {
  opacity: 1;
}

/* Markdown content styles */
.markdown-content :deep(p) {
  margin: 3px 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin: 8px 0 3px;
  font-weight: 600;
}

.markdown-content :deep(h1) {
  font-size: 1.3em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 3px;
}

.markdown-content :deep(h2) {
  font-size: 1.15em;
}

.markdown-content :deep(h3) {
  font-size: 1.05em;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 14px;
  margin: 3px 0;
}

.markdown-content :deep(li) {
  margin: 1px 0;
}

.markdown-content :deep(blockquote) {
  border-left: 2px solid #d1d5db;
  padding-left: 10px;
  margin: 3px 0;
  color: #4b5563;
}

.markdown-content :deep(a) {
  color: #0ea5e9;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 6px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 4px 6px;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

.markdown-content :deep(tr:nth-child(even)) {
  background-color: #f9fafb;
}
</style>