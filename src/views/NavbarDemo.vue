<template>
  <div class="navbar-demo">
    <!-- 默认样式 -->
    <div class="demo-section default-bg">
      <CustomNavbar 
        title="透明导航栏" 
        subtitle="完全透明背景，完美融入任何背景"
      />
    </div>

    <!-- 透明样式 -->
    <div class="demo-section transparent-bg">
      <CustomNavbar 
        title="透明导航栏" 
        subtitle="透明背景，适合图片背景"
        variant="transparent"
      />
    </div>

    <!-- 毛玻璃样式 -->
    <div class="demo-section glass-bg">
      <CustomNavbar 
        title="毛玻璃导航栏" 
        subtitle="毛玻璃效果，现代感十足"
        variant="glass"
      />
    </div>

    <!-- 自定义内容 -->
    <CustomNavbar title="自定义导航栏">
      <template #left>
        <div class="custom-left">
          <div class="logo-icon">🚀</div>
          <div class="logo-text">
            <h3>AI Space</h3>
            <span>智能助手平台</span>
          </div>
        </div>
      </template>

      <template #center>
        <div class="search-box">
          <input type="text" placeholder="搜索功能..." class="search-input">
          <button class="search-btn">🔍</button>
        </div>
      </template>

      <template #right>
        <div class="custom-actions">
          <button class="action-btn">📊</button>
          <button class="action-btn">⚙️</button>
          <button class="action-btn">👤</button>
        </div>
      </template>
    </CustomNavbar>

    <!-- 内容区域 -->
    <div class="content-area">
      <h2>透明导航栏样式展示</h2>
      <p>这个页面展示了不同变体的自定义导航栏组件，默认完全透明背景，完美融入任何背景。</p>
      
      <div class="features">
        <div class="feature-card">
          <h3>🎨 透明设计</h3>
          <p>默认完全透明背景，完美融入任何背景</p>
        </div>
        <div class="feature-card">
          <h3>📱 响应式设计</h3>
          <p>完美适配各种屏幕尺寸</p>
        </div>
        <div class="feature-card">
          <h3>🌙 主题支持</h3>
          <p>支持明暗主题自动切换</p>
        </div>
        <div class="feature-card">
          <h3>🔧 高度可定制</h3>
          <p>支持插槽自定义内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomNavbar from '@/components/CustomNavbar.vue';
</script>

<style scoped lang="scss">
.navbar-demo {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.demo-section {
  height: 200px;
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  padding: 2rem;
  
  &.default-bg {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    color: white;
  }
  
  &.transparent-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.glass-bg {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
}

.content-area {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }
  
  p {
    font-size: 1.1rem;
    color: var(--color-text);
    opacity: 0.8;
    margin-bottom: 2rem;
  }
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  
  p {
    color: var(--color-text);
    opacity: 0.7;
    margin: 0;
  }
}

// 自定义内容样式
.custom-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .logo-icon {
    font-size: 2rem;
  }
  
  .logo-text {
    display: flex;
    flex-direction: column;
    
    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #1890ff;
    }
    
    span {
      font-size: 0.8rem;
      color: var(--color-text);
      opacity: 0.7;
    }
  }
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  min-width: 300px;
  
  .search-input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    color: var(--color-text);
    font-size: 0.9rem;
    
    &::placeholder {
      color: var(--color-text);
      opacity: 0.5;
    }
  }
  
  .search-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--color-text);
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
}

.custom-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .action-btn {
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: var(--color-background-mute);
      transform: scale(1.05);
    }
  }
}

// 暗色主题
.dark {
  .feature-card {
    background: var(--color-background-soft);
    border-color: var(--color-border);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
  
  .search-box {
    background: var(--color-background-soft);
    border-color: var(--color-border);
  }
  
  .action-btn {
    background: var(--color-background-soft);
    border-color: var(--color-border);
    
    &:hover {
      background: var(--color-background-mute);
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .demo-section {
    height: 150px;
    padding: 1rem;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .search-box {
    min-width: 200px;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
