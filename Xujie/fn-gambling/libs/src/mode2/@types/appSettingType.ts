export interface AppSetting {
  appId?: string; // 渠道 ID
  deviceId?: string; // apk  in app webview deviceID
  fbp?: string; // pixel
  fbc?: string; // pixel
  pixelId?: string; // pixel
  accessToken?: string; // pixel

  // Facebook 動態URL占位符
  // 置入廣告動態網址參數
  adId?: string;
  adsetId?: string;
  campaignId?: string;
  adName?: string;
  adsetName?: string;
  campaignName?: string;
  placement?: string;
  siteSourceName?: string;

  // 落地頁來的
  postHogDistinctId?: string;

  // 邀請頁來的邀請碼
  referralCode: string;
  downloadFrom: string; // pop
}
