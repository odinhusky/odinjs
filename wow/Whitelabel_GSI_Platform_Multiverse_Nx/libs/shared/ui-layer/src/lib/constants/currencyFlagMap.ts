/**
 * 幣別代碼 → 旗幟圖片路徑 對應表
 * 圖片路徑對應 apps/r017/src/public/images/flag/
 */
export const CURRENCY_FLAG_MAP: Record<string, string> = {
  // 法定貨幣
  THB: "/images/flag/th.webp", // 泰銖 (Thailand)
  MYR: "/images/flag/my.webp", // 馬來西亞令吉 (Malaysia)
  IDR: "/images/flag/id.webp", // 印尼盾 (Indonesia)
  VND: "/images/flag/vi.webp", // 越南盾 (Vietnam)
  PHP: "/images/flag/fil.webp", // 菲律賓披索 (Philippines)
  TWD: "/images/flag/zh-tw.webp", // 新台幣 (Taiwan)
  CNY: "/images/flag/zh-cn.webp", // 人民幣 (China)
  RMB: "/images/flag/zh-cn.webp", // 人民幣 (alias)
  JPY: "/images/flag/jp.webp", // 日圓 (Japan)
  KRW: "/images/flag/ko.webp", // 韓元 (Korea)
  USD: "/images/flag/en.webp", // 美元 (USA)
  BRL: "/images/flag/br.webp", // 巴西雷亞爾 (Brazil)
  INR: "/images/flag/hi.webp", // 印度盧比 (India)
  MMK: "/images/flag/bm.webp", // 緬甸元 (Myanmar)
  BND: "/images/flag/bn.webp", // 汶萊元 (Brunei)
  MXN: "/images/flag/sp.webp", // 墨西哥披索 (Spanish-speaking)
  COP: "/images/flag/sp.webp", // 哥倫比亞披索
  ARS: "/images/flag/ar.webp", // 阿根廷披索 (Arabic/Spanish region)
  EUR: "/images/flag/fr.webp", // 歐元 (France/Europe)
  // 加密貨幣 (無國旗，使用空字串)
  USDT: "",
  BTC: "",
  ETH: "",
  TRX: "",
  BNB: ""
}

/**
 * 取得幣別旗幟圖片路徑，找不到時回傳空字串
 */
export function getCurrencyFlagSrc(currency: string): string {
  return CURRENCY_FLAG_MAP[currency?.toUpperCase()] ?? ""
}