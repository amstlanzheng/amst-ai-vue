<template>
  <div class="markdown-preview">
    <div class="preview-header">
      <DocumentTextIcon class="icon" />
      <span class="filename">{{ fileName }}</span>
    </div>
    <div class="preview-content" v-html="sanitizedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  content: string
  fileName: string
}>()

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 计算渲染后的Markdown内容
const sanitizedContent = computed(() => {
  if (!props.content) return ''
  const parsedContent = marked.parse(props.content) as string
  return DOMPurify.sanitize(parsedContent)
})
</script>

<style scoped lang="scss">
.markdown-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;

  .preview-header {
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f8f9fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .icon {
      width: 1.5rem;
      height: 1.5rem;
      color: #666;
    }

    .filename {
      flex: 1;
      font-weight: 500;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .preview-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
}

.dark .markdown-preview {
  border-right-color: rgba(255, 255, 255, 0.1);
  background: #1a1a1a;

  .preview-header {
    background: rgba(30, 30, 30, 0.98);
    border-bottom-color: rgba(255, 255, 255, 0.1);

    .icon {
      color: #999;
    }

    .filename {
      color: #fff;
    }
  }

  .preview-content {
    color: #fff;
  }
}
</style>
