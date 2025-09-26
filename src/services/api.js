import API_CONFIG from '../config/api.ts'

const BASE_URL = API_CONFIG.baseURL
export const chatAPI = {
  // 发送聊天消息
  async sendMessage(data, chatId) {
    try {
      const url = new URL(`${BASE_URL}/ai/chat`)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }
      
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        },
        body: data instanceof FormData ? data : 
          new URLSearchParams({ prompt: data })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 获取聊天历史列表
  async getChatHistory(type = 'chat') {
    try {
      const response = await fetch(`${BASE_URL}/ai/history/${type}`, {
        method: 'GET',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const chatIds = await response.json()
      // 转换为前端需要的格式
      return chatIds.map(id => ({
        id,
        title: type === 'pdf' ? `PDF对话 ${id.slice(-6)}` : 
               type === 'service' ? `咨询 ${id.slice(-6)}` :
               `对话 ${id.slice(-6)}`
      }))
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  },

  // 获取特定对话的消息历史
  async getChatMessages(chatId, type = 'chat') {
    try {
      const response = await fetch(`${BASE_URL}/ai/history/${type}/${chatId}`, {
        method: 'GET',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const messages = await response.json()
      // 添加时间戳
      return messages.map(msg => ({
        ...msg,
        timestamp: new Date() // 由于后端没有提供时间戳，这里临时使用当前时间
      }))
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  },

  // 发送游戏消息
  async sendGameMessage(prompt, chatId) {
    try {
      const url = new URL(`${BASE_URL}/ai/game`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 发送客服消息
  async sendServiceMessage(prompt, chatId) {
    try {
      const url = new URL(`${BASE_URL}/ai/service`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.body.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 发送 PDF 问答消息
  async sendMdMessage(prompt, chatId) {
    try {
      const url = new URL(`${BASE_URL}/ai/md/chat`)
      url.searchParams.append('prompt', prompt)
      if (chatId) {
        url.searchParams.append('chatId', chatId)
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 添加凭证支持
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // 返回可读流
      return response.body.getReader()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // 可选：添加一个通用的健康检查或测试方法
  async checkAuth() {
    try {
      const response = await fetch(`${BASE_URL}/ai/auth-check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      })
      
      return response.ok
    } catch (error) {
      console.error('Auth check failed:', error)
      return false
    }
  }
}