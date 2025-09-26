declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/services/api' {
  import type { ChatAPI } from '@/services/api.d.ts'
  export const chatAPI: ChatAPI
}

declare module '@/services/api.js' {
  import type { ChatAPI } from '@/services/api.d.ts'
  export const chatAPI: ChatAPI
}