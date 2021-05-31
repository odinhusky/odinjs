import {
  UPDATE_I18N_LANGUAGE,
  UPDATE_LOGIN_DETAIL,
  UPDATE_LOGOUT_DETAIL,
  FETCH_NOTIFICATION,
  FETCH_COURSES,
  FETCH_COUNTRYCODE_LIST,
  UPDATE_USER_DATA,
  UPDATE_LIVE_COURSE_DATA,
  CLEAR_LIVE_COURSE_DATA,
  UPDATE_RTC_TOKEN_DATA,
  CLEAR_RTC_TOKEN_DATA,
} from '@/store/mutation-types.js';

// mutation拿到資料後，只處理更新state的事情
const mutations = {
  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要變動的語系名稱
   * @description 只更新state中的i18nLanguage內容
   */
  [UPDATE_I18N_LANGUAGE](state, payload) {
    state.i18nLanguage = payload;
  },
  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要變動的 學生/老師 登入詳細資料
   * @description 更新登入者的身份資料
   */
  [UPDATE_USER_DATA](state, payload) {
    state.user.detail.student.name = payload.name;
    state.user.detail.student.email = payload.email;
    state.user.detail.student.birthday = payload.birthday;
    state.user.detail.student.gender = payload.gender;
  },
  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要變動的 學生/老師 登入詳細資料
   * @description 更新登入者的身份資料
   */
  [UPDATE_LOGIN_DETAIL](state, payload) {
    state.user.loginToken = payload.loginToken;
    state.user.type = payload.loginType;
    state.user.detail = payload.loginDetail;
  },
  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @description 登出時移除登入者的身份資料
   */
  [UPDATE_LOGOUT_DETAIL](state) {
    state.user = {
      loginToken: '',
      type: '',
      detail: {},
    };
  },

  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @description 更新使用者點擊直播課程的資料(lessionid, courseIsLive, timeid)到 state 中
   */
  [UPDATE_LIVE_COURSE_DATA](state, payload) {
    state.live = {
      courseIsLive: payload.courseIsLive,
      lessonid: payload.lessonid,
      timeid: payload.timeid,
    };
  },

  /**
   * @author odin
   * @description 清除目前直播課程的資料(lessionid, courseIsLive, timeid)
   */
  [CLEAR_LIVE_COURSE_DATA](state) {
    state.live = {
      courseIsLive: false,
      lessonid: 0,
      timeid: 0,
    };
  },

  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @description 更新使用者點擊直播課程的 RTC Token 到 state 中
   */
  [UPDATE_RTC_TOKEN_DATA](state, payload) {
    state.rtc = {
      appId: payload.app_id,
      channel: payload.channel,
      rtcToken: payload.rtc_token,
      liveNow: payload.now,
      startAt: payload.start_at,
    };
  },

  /**
   * @author odin
   * @description 清除 state 中目前 RTC Token 內的資料
   */
  [CLEAR_RTC_TOKEN_DATA](state) {
    state.rtc = {
      appId: '',
      channel: '',
      rtcToken: '',
      liveNow: '',
      startAt: '',
    };
  },

  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要寫入state的通知資料
   * @description 登出時移除登入者的身份資料
   */
  [FETCH_NOTIFICATION](state, payload) {
    state.notifications = payload;
  },
  /**
   * @author mike
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要寫入state的通知資料
   * @description course data
   */
  [FETCH_COURSES](state, payload) {
    state.course = payload;
  },

  /**
   * @author odin
   * @param {object} state 第一個參數固定是state，也就是上方的state物件
   * @param {string} payload 從actions傳進來要寫入state的通知資料
   * @description 登出時移除登入者的身份資料
   */
  [FETCH_COUNTRYCODE_LIST](state, payload) {
    state.countryCodeList = payload;
  },
};

export default mutations;
