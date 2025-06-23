import sdkUtils from '@mode2/utils/sdk';

// 投放創意廣告組資訊;
export const getPlaceAdvertisementInfo = () => {
  // 會是被覆寫在apk內的setting.json
  const appSetting = sdkUtils.getAppSetting();

  // 是廣告連結 deepLink 喚醒
  // sdkUtils.getDeepLinkAppSetting()  需要即時獲取，有apk內行為邏輯
  const setting = sdkUtils.getDeepLinkAppSetting()
    ? sdkUtils.getDeepLinkAppSetting()
    : appSetting;

  return {
    fbc: setting?.fbc || '',
    fbp: setting?.fbp || '',
    mmpParameter: {
      adId: setting?.adId || '',
      adName: setting?.adName || '',
      adSetId: setting?.adsetId || '',
      adSetName: setting?.adsetName || '',
      campaignId: setting?.campaignId || '',
      campaignName: setting?.campaignName || '',
      placement: setting?.placement || '',
      siteSourceName: setting?.siteSourceName || '',
    },
  };
};
