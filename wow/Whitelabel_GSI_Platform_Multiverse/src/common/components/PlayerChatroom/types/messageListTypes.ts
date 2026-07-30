/**
 * MessageList 樣式物件型別定義
 */
export interface MessageListStyleObj {
  // 容器樣式
  container?: string

  // 訊息包裝器樣式（根據發送者區分）
  messageWrapper?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }

  // 訊息項目樣式（根據發送者區分）
  messageItem?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }

  // 發送者名稱樣式（根據發送者區分）
  messageSender?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }

  // 訊息內容樣式（根據發送者區分）
  messageContent?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }

  // 圖片容器樣式（根據發送者區分）
  messageImages?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }

  // 單張圖片樣式（根據發送者區分）
  messageImage?: {
    self?: string // 自己的訊息
    other?: string // 別人的訊息
  }
}
