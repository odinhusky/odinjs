/**
 * 聊天室展開面板樣式配置
 */
export interface ChatroomPanelStyleObj {
  /**
   * 聊天室面板基礎容器樣式
   * 預設: 'flex flex-col z-[2000]'
   */
  panelClass?: string

  /**
   * 手機版面板樣式
   * 預設: 'chatroom-panel--mobile fixed left-0 right-0 bottom-0 w-full h-[18.75rem] rounded-t-xl'
   */
  mobileClass?: string

  /**
   * 桌面版面板樣式
   * 預設: 'chatroom-panel--desktop fixed right-0 bottom-0 w-[21.25rem] h-screen max-h-[60.625rem] overflow-hidden rounded-[0.625rem]'
   */
  desktopClass?: string

  /**
   * 拖曳遮罩層樣式（僅桌面版）
   * 預設: 'absolute inset-0 z-[9999] flex items-center justify-center bg-[var(--secondary-12)] pointer-events-none'
   */
  dragOverlayClass?: string
}
