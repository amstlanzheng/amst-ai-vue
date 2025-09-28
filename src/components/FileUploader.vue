<template>
  <div
    class="drop-zone"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    :class="{
      dragging: isDragging,
      uploading: isUploading,
    }"
  >
    <div class="upload-content">
      <!-- 添加上传状态显示 -->
      <div v-if="isUploading" class="upload-status">
        <div class="spinner"></div>
        <div class="upload-progress">
          <p class="status-text">正在上传文件...</p>
          <p class="filename">{{ uploadingFileName }}</p>
        </div>
      </div>
      <template v-else>
        <DocumentArrowUpIcon class="upload-icon" />
        <p class="upload-text">点击上传，或将Markdown文件拖拽到此处</p>
        <input
          type="file"
          :accept="accept"
          @change="handleFileChange"
          :disabled="isUploading"
          class="file-input"
          ref="fileInput"
        />
        <button
          class="upload-button"
          :class="{ uploading: isUploading }"
          @click="triggerFileInput"
          :disabled="isUploading"
        >
          <ArrowUpTrayIcon class="icon" />
          {{ uploadButtonText }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DocumentArrowUpIcon,
  ArrowUpTrayIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  accept?: string
  uploadButtonText?: string
  isUploading: boolean
  uploadingFileName: string
}>()

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  const file = files[0]
  validateAndEmitFile(file)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const file = files[0]
  validateAndEmitFile(file)
  
  // 清空文件输入，允许重新选择同一文件
  if (target) {
    target.value = ''
  }
}

const validateAndEmitFile = (file: File) => {
  // 检查文件类型
  if (props.accept) {
    const acceptedTypes = props.accept.split(',').map(type => type.trim())
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      return file.type.includes(type)
    })
    
    if (!isAccepted) {
      alert(`请上传支持的文件类型: ${acceptedTypes.join(', ')}`)
      return
    }
  }
  
  emit('file-selected', file)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<style scoped lang="scss">
.drop-zone {
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  &.dragging {
    border-color: #9333ea;
    background: rgba(147, 51, 234, 0.05);
  }

  &.uploading {
    border-style: dashed;
    border-color: #007cf0;
    background: rgba(0, 124, 240, 0.05);
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;

    .upload-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(0, 124, 240, 0.1);
        border-left-color: #007cf0;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .upload-progress {
        text-align: center;

        .status-text {
          font-size: 1.25rem;
          color: #007cf0;
          margin-bottom: 0.5rem;
        }

        .filename {
          font-size: 0.875rem;
          color: #666;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .upload-icon {
      width: 4rem;
      height: 4rem;
      color: #9333ea;
    }

    .upload-text {
      font-size: 1.25rem;
      color: #666;
    }

    .file-input {
      display: none;
    }

    .upload-button {
      background: #9333ea;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: #7e22ce;
      }

      &.uploading {
        background: #9333ea80;
        cursor: not-allowed;
      }

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}

.dark .drop-zone {
  border-color: #444;
  background: rgba(40, 40, 40, 0.5);

  &.dragging {
    border-color: #9333ea;
    background: rgba(147, 51, 234, 0.1);
  }

  &.uploading {
    border-color: #007cf0;
    background: rgba(0, 124, 240, 0.1);
  }

  .upload-content {
    .upload-status {
      .spinner {
        border-color: rgba(0, 124, 240, 0.2);
        border-left-color: #007cf0;
      }

      .upload-progress {
        .status-text {
          color: #007cf0;
        }

        .filename {
          color: #999;
        }
      }
    }

    .upload-text {
      color: #ccc;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
