// Type definitions for api.js module

export interface ChatAPI {
  sendMessage: (data: any, chatId?: string) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  getChatHistory: (type?: string) => Promise<{ id: string; title: string }[]>;
  getChatMessages: (chatId: string, type?: string) => Promise<any[]>;
  sendGameMessage: (prompt: string, chatId?: string) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  sendServiceMessage: (prompt: string, chatId?: string) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  sendMdMessage: (prompt: string, chatId?: string) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  checkAuth: () => Promise<boolean>;
}

export const chatAPI: ChatAPI;