export interface DESCrypto {

  /**
   * 加密
   * @param str
   */
  encryption(str: string): string

  /**
   * 解密
   * @param str
   */
  decrypt(str: string): string

}
