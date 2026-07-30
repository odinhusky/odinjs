export enum OPEN_GAME_MODE_ENUMS {
  /** 跑預設開啟遊戲方式的邏輯 */
  DEFAULT = 0,

  /** 強制以「遊戲彈窗 + iframe」開啟遊戲 */
  FORCE_USE_GAME_DIALOG = 1,

  /** 強制以「另開新分頁」開啟遊戲 */
  FORCE_USE_NEW_TAB = 2,

  /** 強制以「本頁跳轉」開啟遊戲 */
  FORCE_USE_HREF = 3,

  /** 強制以「自定義的route page」開啟遊戲 */
  FORCE_USE_ROUTE = 4
}
