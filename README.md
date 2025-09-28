# AI Hub

AI Hub 是一个基于 Vue 3 的 Web 应用程序，提供各种 AI 驱动的功能，包括聊天功能、PDF 交互和专业工具。

## 功能特性

- **AI 聊天**: 具备 AI 能力的通用聊天界面，支撑多模态
- **Markdown 交互**: 上传并与 Markdown 文档进行聊天
- **游戏聊天**: 专门用于角色扮演相关对话的聊天功能
- **客户服务**: 扮演卖课的客服支持聊天界面

## 技术栈

- Vue 3 Composition API
- TypeScript
- Vite
- Sass 用于样式设计
- Vue Router 用于导航
- Pinia 用于状态管理
- Axios 用于 HTTP 请求
- WebViewer 用于文档查看
- Heroicons 用于图标

## 前置要求

- Node.js 版本 16.x.x 或更高
- npm 版本 8.x.x 或更高

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

默认情况下，开发服务器将在 http://localhost:5173 上启动。

## 构建

```bash
npm run build
```

构建后的文件将位于 `dist` 目录中，可以部署到任何静态文件服务器上。

## 部署

对于 SSL 部署，请确保更新项目配置中的根域名。

## 配置

项目使用集中式 API 配置，可以在 `src/config/api.ts` 中找到。
您可以通过修改此文件在开发和生产环境之间切换。

## 项目结构

```
src/
├── assets/              # 静态资源文件
├── components/          # 可复用的 Vue 组件
├── config/              # 配置文件
├── layouts/             # 布局组件
├── router/              # 路由配置
├── services/            # API 服务层
├── stores/              # Pinia 状态管理
├── utils/               # 工具函数
├── views/               # 页面视图组件
├── App.vue             # 根组件
├── main.ts             # 应用入口文件
└── ...
```

## 后续计划

1. 统一部分信息到.env文件
2. 修改流式数据处理方式
3. 优化用户相关功能