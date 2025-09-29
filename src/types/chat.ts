export interface ChatHistoryItem {
  id: string
  title: string
}

export interface Message {
  role: string
  content: string
  timestamp: Date
  isMarkdown?: boolean
  createdAt?: string | number | Date
  contentType?: string
  think?: string
  fileName?: string
}
