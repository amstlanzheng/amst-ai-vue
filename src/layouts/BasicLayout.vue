<template>
  <div class="basic-layout" :class="{ dark: isDark }">
    <n-layout position="relative" style="min-height: 100vh;">
      <n-layout-header class="header" bordered style="height: 80px; overflow: hidden;">
        <div class="navbar">
          <router-link to="/home" class="logo">AM AI Hub</router-link>
          <div class="spacer"></div>
          <div class="user-info"> 
            <UserHeader></UserHeader>
          </div>
          <button @click="toggleDark()" class="theme-toggle">
            <SunIcon v-if="isDark" class="icon" />
            <MoonIcon v-else class="icon" />
          </button>
        </div>
      </n-layout-header>
      <n-layout-content class="content">
        <div class="app">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </n-layout-content>
      <n-layout-footer class="footer">
        <div class="footer-content">
          <a class="footer-copyright" href="https://www.lanzhs.cn/" target="_blank">
            <span class="web-name">编程网站 BY AMSTLAN</span>
            <span class="link-icon">↗</span> 
            <span>© 2024 AMSTLAN. All rights reserved.</span>
          </a>
        </div>
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useDark, useToggle } from "@vueuse/core";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import { ref } from "vue";
import UserHeader from "@/components/UserHeader.vue";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();

// 添加全局状态来跟踪当前路由
const currentRoute = ref(router.currentRoute.value.path);

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  // 如果是从 ChatPDF 页面离开
  if (from.path === "/chat-pdf") {
    // 触发一个自定义事件，让 ChatPDF 组件知道要清理资源
    window.dispatchEvent(new CustomEvent("cleanupChatPDF"));
  }
  currentRoute.value = to.path;
  next();
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--color-text);
  background: var(--color-background);
  min-height: 100vh;
  transition: color 0.3s ease, background-color 0.3s ease;
}

/* 全局夜间模式支持 */
.dark {
  color: var(--color-text);
  background: var(--color-background);
}

.app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

.basic-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background: var(--color-background);
    height: 80px;
    min-width: 768px;
    overflow: hidden;
    border-bottom: 1px solid var(--color-border);
    width: 100%;

    .logo {
      font-size: 1.5rem;
      font-weight: 500;
      text-decoration: none;
      color: #1890ff; /* 蓝色 */
      white-space: nowrap;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      &:hover {
        color: #40a9ff; /* 悬停时的浅蓝色 */
      }
    }

    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      .icon {
        width: 20px;
        height: 20px;
        color: var(--color-text);
        transition: all 0.3s ease;
      }

      &:hover .icon {
        color: #1890ff;
      }
    }

    .dark & {
      .theme-toggle {
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        &:hover .icon {
          color: #40a9ff;
        }
      }
    }

    .dark & {
      background: var(--color-background);
      border-bottom: 1px solid var(--color-border);
    }
  }

  .footer { 
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(135, 208, 104, 0.02) 100%);
    text-align: center;
    min-height: 40px;
    padding: 0 2rem;
    flex-shrink: 0;
    border-top: 1px solid rgba(24, 144, 255, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(10px);
    margin-top: auto; /* 将页脚推到底部 */
    display: flex;
    align-items: center;
    justify-content: center;
    
    // 添加装饰性背景元素
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(24, 144, 255, 0.3) 50%, transparent 100%);
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      position: relative;
    
    }
    
    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: var(--color-text);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 12px 20px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(135, 208, 104, 0.08) 100%);
      border: 1px solid rgba(24, 144, 255, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      
      // 添加悬停效果
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      &:hover {
        background: linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(135, 208, 104, 0.15) 100%);
        border-color: rgba(24, 144, 255, 0.3);
        color: #1890ff;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(24, 144, 255, 0.15);
        
        &::before {
          left: 100%;
        }
      }
      
      .web-name {
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        position: relative;
        z-index: 1;
      }
      
      .link-icon {
        font-size: 0.8rem;
        opacity: 0.7;
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
      }
      
      &:hover .link-icon {
        opacity: 1;
        transform: translateX(2px) translateY(-1px);
      }
    }
    
    .footer-divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, rgba(24, 144, 255, 0.4) 50%, transparent 100%);
      border-radius: 2px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 4px;
        background: rgba(24, 144, 255, 0.6);
        border-radius: 50%;
      }
    }
    
    .footer-copyright {
      color: var(--color-text);
      font-size: 0.75rem;
      opacity: 0.7;
      margin: 0;
      font-weight: 400;
      letter-spacing: 0.5px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &::before {
        content: '✨';
        margin-right: 6px;
        opacity: 0.6;
      }
    }
    
    // 暗色主题优化
    .dark & {
      background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(135, 208, 104, 0.05) 100%);
      border-top-color: rgba(24, 144, 255, 0.2);
      
      &::before {
        background: linear-gradient(90deg, transparent 0%, rgba(24, 144, 255, 0.4) 50%, transparent 100%);
      }
      
      .footer-link {
        background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(135, 208, 104, 0.1) 100%);
        border-color: rgba(24, 144, 255, 0.2);
        
        &:hover {
          background: linear-gradient(135deg, rgba(24, 144, 255, 0.2) 0%, rgba(135, 208, 104, 0.2) 100%);
          border-color: rgba(24, 144, 255, 0.4);
          color: #40a9ff;
          box-shadow: 0 8px 25px rgba(24, 144, 255, 0.2);
        }
      }
      
      .footer-divider {
        background: linear-gradient(90deg, transparent 0%, rgba(24, 144, 255, 0.5) 50%, transparent 100%);
        
        &::after {
          background: rgba(24, 144, 255, 0.7);
        }
      }
    }
  }
  
  .content {
    background: var(--color-background);
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 25px;
  }
  
  .header {
    background: var(--color-background);
    color: var(--color-text);
    padding-inline: 0;
    height: 80px;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.spacer {
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 100px;
}

.n-layout-header.header {
  position: relative !important;
}

.navbar .user-info {
  flex-shrink: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  height: 100%;
  width: auto;
  min-width: 150px;
  justify-content: flex-end;
}
  
.user-header-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: 1200px) {
  .navbar {
    padding: 0 1.5rem;
  }
}

@media screen and (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
    min-width: auto;
  }
  
  .basic-layout {
    width: 100%;
    max-width: none;
  }
  
  .logo {
    font-size: 1.25rem;
  }
  
  .footer {
    padding: 0 1rem;
    min-height: 25px;
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(135, 208, 104, 0.02) 100%);
    border-top: 1px solid rgba(24, 144, 255, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    
    .footer-content {
      gap: 12px;
    }
    
    .footer-link {
      font-size: 0.8rem;
      padding: 4px 8px;
      border-radius: 8px;
    }
    
    .footer-copyright {
      font-size: 0.65rem;
    }
    
    .footer-divider {
      width: 40px;
      height: 1px;
    }
  }
  
  .content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding-bottom: 25px;
  }
  
  .app {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
  
  .footer {
    min-height: 25px;
    padding: 0 1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>