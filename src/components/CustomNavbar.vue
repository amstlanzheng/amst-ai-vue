<template>
  <div class="custom-navbar" :class="{ 'dark': isDark }">
    <div class="navbar-content">
      <!-- 左侧内容 -->
      <div class="navbar-left">
        <slot name="left">
          <div class="navbar-brand">
            <h2 class="brand-title">{{ title }}</h2>
            <p class="brand-subtitle" v-if="subtitle">{{ subtitle }}</p>
          </div>
        </slot>
      </div>

      <!-- 中间内容 -->
      <div class="navbar-center" v-if="$slots.center">
        <slot name="center"></slot>
      </div>

      <!-- 右侧内容 -->
      <div class="navbar-right">
        <slot name="right">
          <div class="navbar-actions">
            <button 
              v-if="showThemeToggle"
              @click="toggleTheme" 
              class="theme-toggle"
              :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            >
              <SunIcon v-if="isDark" class="icon" />
              <MoonIcon v-else class="icon" />
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

interface Props {
  title?: string;
  subtitle?: string;
  showThemeToggle?: boolean;
  variant?: 'default' | 'transparent' | 'glass';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'AM AI Hub',
  subtitle: '',
  showThemeToggle: true,
  variant: 'default'
});

const isDark = useDark();
const toggleTheme = useToggle(isDark);
</script>

<style scoped lang="scss">
.custom-navbar {
  width: 100%;
  background: transparent;
  border-bottom: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  // 透明变体
  &.variant-transparent {
    background: transparent;
    border-bottom: none;
  }

  // 毛玻璃变体
  &.variant-glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 80px;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .navbar-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    min-width: 0;
  }

  .navbar-brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;

    .brand-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1890ff;
      margin: 0;
      line-height: 1.2;
      background: linear-gradient(45deg, #1890ff, #40a9ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 0.75rem;
      color: var(--color-text);
      opacity: 0.7;
      margin: 0;
      font-weight: 400;
    }
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      transform: scale(1.05);
    }

    .dark &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .icon {
      width: 20px;
      height: 20px;
      transition: transform 0.2s ease;
    }

    &:hover .icon {
      transform: rotate(15deg);
    }
  }

  // 暗色主题
  &.dark {
    background: transparent;
    border-bottom: none;

    &.variant-glass {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .brand-title {
      background: linear-gradient(45deg, #40a9ff, #69c0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  // 响应式设计
  @media screen and (max-width: 768px) {
    .navbar-content {
      padding: 0 1rem;
    }

    .navbar-brand {
      .brand-title {
        font-size: 1.25rem;
      }

      .brand-subtitle {
        font-size: 0.7rem;
      }
    }

    .theme-toggle {
      width: 36px;
      height: 36px;
      padding: 0.4rem;

      .icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  @media screen and (max-width: 480px) {
    .navbar-content {
      padding: 0 0.75rem;
    }

    .navbar-brand {
      .brand-title {
        font-size: 1.1rem;
      }
    }
  }
}

// 全局样式覆盖
:global(.variant-transparent) {
  .custom-navbar {
    background: transparent;
    border-bottom: none;
  }
}

:global(.variant-glass) {
  .custom-navbar {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .dark & {
    background: rgba(0, 0, 0, 0.8);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
}

// 默认透明样式
:global(.custom-navbar) {
  background: transparent !important;
  border-bottom: none !important;
}
</style>
