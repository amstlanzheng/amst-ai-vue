export interface ChatHistoryItem {
  id: string
  title: string
}

export interface Message {
  role: string
  content: string
  timestamp: Date
  isMarkdown?: boolean
}
