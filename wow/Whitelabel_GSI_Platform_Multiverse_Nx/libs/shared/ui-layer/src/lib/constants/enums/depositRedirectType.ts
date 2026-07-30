export enum DEPOSIT_REDIRECT_TYPE_ENUMS {
  /** 僅跳訊息 */
  ALERT_MESSAGE = 0,

  /** 另開URL */
  OPEN_URL,

  /** 開啟HTML */
  OPEN_HTML,

  /** 跳轉qr code 頁面 */
  OPEN_QR_CODE,

  /** Popup message */
  POPUP_MESSAGE = 4,

  /** Crypto wallet result */
  CRYPTO_WALLET = 5
}
