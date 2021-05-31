import { getAndSetI18nLanguage } from '@/plugins/utility.js';

const state = {
  i18nLanguage: getAndSetI18nLanguage(),
  notifications: [],
  user: {
    loginToken: '',
    type: '',
    detail: {},
  },
  countryCodeList: [],
  // 直播課程會用到的資料
  live: {
    courseIsLive: false,
    lessonid: 0,
    timeid: 0,
  },
  // 打完 rtc api 拿到的資料
  rtc: {
    appId: '',
    channel: '',
    rtcToken: '',
    liveNow: '',
    startAt: '',
  },
};

export default state;
