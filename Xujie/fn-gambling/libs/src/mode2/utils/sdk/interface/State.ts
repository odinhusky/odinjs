export interface State {
  /**
   * 即時判斷是否有登入 [!isEmpty(Token)]
   */
  isCurrentLogin(): boolean;

}
