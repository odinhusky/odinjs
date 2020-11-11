import {
  UPDATE_I18N_LANGUAGE,
  FETCH_BANNER_IMG_PATH,
  UPDATE_LOGIN_DETAIL,
  UPDATE_LOGOUT_DETAIL,
  FETCH_NOTIFICATION,
  FETCH_COURSES,
  FETCH_COUNTRYCODE_LIST,
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
   * @param {string} payload 從actions傳進來要變動的banner名稱
   * @description 只更新state中的i18nLanguage內容
   */
  [FETCH_BANNER_IMG_PATH](state, payload) {
    state.indexBannerPath = payload;
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
