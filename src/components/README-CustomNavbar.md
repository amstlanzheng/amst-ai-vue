# CustomNavbar 组件使用说明

## 概述
CustomNavbar 是一个高度可定制的导航栏组件，设计风格与项目整体保持一致，完美融入背景。

## 特性
- 🎨 多种样式变体（默认、透明、毛玻璃）
- 📱 完全响应式设计
- 🌙 支持明暗主题切换
- 🔧 高度可定制（支持插槽）
- ✨ 流畅的动画效果

## 基本用法

```vue
<template>
  <CustomNavbar 
    title="我的应用" 
    subtitle="副标题"
  />
</template>

<script setup>
import CustomNavbar from '@/components/CustomNavbar.vue';
</script>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | 'AM AI Hub' | 主标题 |
| subtitle | string | '' | 副标题 |
| showThemeToggle | boolean | true | 是否显示主题切换按钮 |
| variant | 'default' \| 'transparent' \| 'glass' | 'default' | 样式变体 |

## 插槽

### #left
左侧内容插槽
```vue
<template #left>
  <div class="custom-logo">
    <img src="/logo.png" alt="Logo">
    <span>我的品牌</span>
  </div>
</template>
```

### #center
中间内容插槽
```vue
<template #center>
  <div class="search-bar">
    <input type="text" placeholder="搜索...">
  </div>
</template>
```

### #right
右侧内容插槽
```vue
<template #right>
  <div class="user-menu">
    <button>登录</button>
    <button>注册</button>
  </div>
</template>
```

## 样式变体

### 默认样式
```vue
<CustomNavbar title="默认导航栏" />
```

### 透明样式
适合有背景图片的页面
```vue
<CustomNavbar 
  title="透明导航栏" 
  variant="transparent" 
/>
```

### 毛玻璃样式
现代感十足的毛玻璃效果
```vue
<CustomNavbar 
  title="毛玻璃导航栏" 
  variant="glass" 
/>
```

## 完整示例

```vue
<template>
  <CustomNavbar title="我的应用">
    <template #left>
      <div class="brand">
        <h2>🚀 AI Space</h2>
        <span>智能助手平台</span>
      </div>
    </template>

    <template #center>
      <div class="search-box">
        <input type="text" placeholder="搜索功能...">
        <button>🔍</button>
      </div>
    </template>

    <template #right>
      <div class="actions">
        <button>📊</button>
        <button>⚙️</button>
        <button>👤</button>
      </div>
    </template>
  </CustomNavbar>
</template>
```

## 样式定制

组件使用 CSS 变量，可以通过覆盖变量来自定义样式：

```css
.custom-navbar {
  --navbar-height: 80px;
  --navbar-padding: 2rem;
  --brand-color: #1890ff;
}
```

## 响应式断点

- 桌面端：> 768px
- 平板端：≤ 768px
- 手机端：≤ 480px

## 主题支持

组件自动适配项目的明暗主题，使用以下 CSS 变量：
- `--color-background`
- `--color-background-soft`
- `--color-text`
- `--color-border`
