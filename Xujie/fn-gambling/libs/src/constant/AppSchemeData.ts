export interface SchemeData {
  scheme: string;
  url: string;
  postShareLink: (shareLink: string, channel: string) => string;
  // android
  // packageName: string;
  // ios
  // bundleId: string;
}

export const AppSchemeData: Record<string, SchemeData> = {
  ['whatsapp']: {
    scheme: 'whatsapp://',
    url: 'https://www.whatsapp.com',
    postShareLink: (shareLink) =>
      `https://api.whatsapp.com/send/?text=${shareLink}&type=custom_url&app_absent=0`,
  },
  ['facebook']: {
    scheme: 'fb://feed',
    url: 'https://www.facebook.com/',
    postShareLink: (shareLink, channel) =>
      `https://www.facebook.com/share_channel/?type=reshare&link=${shareLink}&app_id=${channel}&source_surface=external_reshare&display&hashtag`,
  },
  ['tiktok']: {
    scheme: 'snssdk1128://search/trending',
    url: 'https://www.tiktok.com/',
    postShareLink: (shareLink) => `https://www.tiktok.com`,
  },
  ['twitter']: {
    scheme: 'twitter://timeline',
    url: 'https://x.com/',
    postShareLink: (shareLink) => `https://x.com/intent/post?url=${shareLink}`,
  },
  ['telegram']: {
    scheme: 'tg://msg',
    url: 'https://www.telegram.org/a/',
    postShareLink: (shareLink) => `https://t.me/share/url?url=${shareLink}`,
  },
  ['instagram']: {
    scheme: 'instagram://explore',
    url: 'https://www.instagram.com/',
    postShareLink: (shareLink) => `https://www.instagram.com/`,
  },
  ['youtube']: {
    scheme: 'vnd.youtube://',
    url: 'https://www.youtube.com',
    postShareLink: (shareLink) => `https://www.youtube.com`,
  },
};
