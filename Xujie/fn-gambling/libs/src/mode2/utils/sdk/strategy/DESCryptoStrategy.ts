import CryptoJS from "crypto-js";
import {DESCrypto} from "../interface/DESCrypto";

export const DESCryptoStrategy: DESCrypto = {

  /**
   * 加密
   * @param str
   */
  encryption(str: string) {
    const KeyHex = CryptoJS.enc.Utf8.parse('E7wQ#@%wfXfdAnQMT%@77vMu');
    const encrypted = CryptoJS.TripleDES.encrypt(str, KeyHex, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse('3C@L4Xx!'),
    });

    return encrypted.toString(/*CryptoJS.enc.Utf8*/);
  },

  /**
   * 解密
   * @param str
   */
  decrypt(str: string) {
    if (!str) return str;
    const KeyHex = CryptoJS.enc.Utf8.parse('E7wQ#@%wfXfdAnQMT%@77vMu');
    const decrypted = CryptoJS.TripleDES.decrypt(str, KeyHex, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse('3C@L4Xx!'),
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
