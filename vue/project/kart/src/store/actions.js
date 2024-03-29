import axios from '../axios';
import {
  studentLoginPath,
  studentLogoutPath,
  teacherLoginPath,
  teacherLogoutPath,
  notificationPath,
  countryCodeListPath,
  fetchIsTestPath,
  fetchNotTestPath,
} from '@/store/ajax-path.js';
import {
  FETCH_NOTIFICATION,
  UPDATE_I18N_LANGUAGE,
  UPDATE_LOGIN_DETAIL,
  UPDATE_LOGOUT_DETAIL,
  UPDATE_USER_DATA,
  UPDATE_LIVE_COURSE_DATA,
  UPDATE_RTC_TOKEN_DATA,
  CLEAR_LIVE_COURSE_DATA,
  CLEAR_RTC_TOKEN_DATA,
} from '@/store/mutation-types';

// action 作非同步的行為，把資料commit給mutation
// action 的第一個參數一定是context, 第二個是由元件dispatch進來的值，可以稱做 status 或是 payload
const actions = {
  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的語系名稱
   * @description 經由dispatch觸發，利用commit把資料給mutation，同時修改localStorage的語系
   */
  updateI18nLanguage(context, payload) {
    context.commit(UPDATE_I18N_LANGUAGE, payload);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的使用者資料
   * @description 更新因為修改學生資料而變動的使用者資料欄位
   */
  updateUserData(context, payload) {
    context.commit(UPDATE_USER_DATA, payload);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的使用者資料
   * @description 更新要準備進入直播前，選擇的直播課程資料(lessionid, courseIsLive, timeid)
   */
  updateLiveCourseData(context, payload) {
    context.commit(UPDATE_LIVE_COURSE_DATA, payload);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的使用者資料
   * @description 清除直播課程的資料(lessionid, courseIsLive, timeid)
   */
  clearLiveCourseData(context) {
    context.commit(CLEAR_LIVE_COURSE_DATA);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的使用者資料
   * @description 清除直播課程的資料(RTC Token)
   */
  clearRTCTokenData(context) {
    context.commit(CLEAR_RTC_TOKEN_DATA);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {object} data 要傳入的 data 物件
   * @description 學生登入，同時把資料紀錄到 Vuex 以及 localStorgage / sessionStorage 裡
   */
  async studentLogin(context, payload) {
    const result = await axios({
      url: studentLoginPath,
      method: 'post',
      data: payload.data,
    });

    if (result.data) {
      const loginToken = `${result.data.data.token.token_type} ${result.data.data.token.access_token}`;
      const loginDetail = result.data.data;
      const loginType = 'student';
      const mutationPayload = {
        loginToken,
        loginType,
        loginDetail,
      };

      // 存資料到Storage
      if (payload.rememberMe) {
        window.localStorage.setItem('loginToken', loginToken);
        window.localStorage.setItem('loginDetail', JSON.stringify(loginDetail));
      } else {
        window.sessionStorage.setItem('loginToken', loginToken);
        window.sessionStorage.setItem(
          'loginDetail',
          JSON.stringify(loginDetail),
        );
      }

      context.commit(UPDATE_LOGIN_DETAIL, mutationPayload);
    }
  },
  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {object} payload 要傳入的 data 物件
   * @description 老師登入，同時把資料紀錄到 Vuex 以及 localStorgage / sessionStorage 裡
   */
  async teacherLogin(context, payload) {
    const result = await axios({
      url: teacherLoginPath,
      method: 'post',
      data: payload.data,
    });

    if (result.data) {
      const loginToken = `${result.data.data.token.token_type} ${result.data.data.token.access_token}`;
      const loginDetail = result.data.data;
      const loginType = 'teacher';
      const mutationPayload = {
        loginToken,
        loginType,
        loginDetail,
      };

      // 存資料到Storage
      if (payload.rememberMe) {
        window.localStorage.setItem('loginToken', loginToken);
        window.localStorage.setItem('loginDetail', JSON.stringify(loginDetail));
      } else {
        window.sessionStorage.setItem('loginToken', loginToken);
        window.sessionStorage.setItem(
          'loginDetail',
          JSON.stringify(loginDetail),
        );
      }

      context.commit(UPDATE_LOGIN_DETAIL, mutationPayload);
    }
  },
  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @description 學生/老師 登出，Vuex 以及 localStorage / sessionStorage 的資料都清空
   */
  async logout(context) {
    const type = context.state.user.type;
    const logoutPath =
      type === 'teacher' ? teacherLogoutPath : studentLogoutPath;
    const loginToken = context.state.user.loginToken;

    const result = await axios({
      url: logoutPath,
      method: 'post',
      headers: {
        Authorization: loginToken,
      },
    });

    if (result.data.data.status === 'success') {
      console.log('action logout success');
    } else {
      console.log('action logout fail');
    }

    // 不管成功還是失敗都要移除相關的資料
    window.localStorage.removeItem('loginToken');
    window.localStorage.removeItem('loginDetail');
    window.sessionStorage.removeItem('loginToken');
    window.sessionStorage.removeItem('loginDetail');
    context.commit(UPDATE_LOGOUT_DETAIL);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @description Vuex 以及 localStorage / sessionStorage 的資料都清空
   */
  async logoutWithoutAjax(context) {
    // 不管成功還是失敗都要移除相關的資料
    window.localStorage.removeItem('loginToken');
    window.localStorage.removeItem('loginDetail');
    window.sessionStorage.removeItem('loginToken');
    window.sessionStorage.removeItem('loginDetail');
    context.commit(UPDATE_LOGOUT_DETAIL);
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @description 取得通知的資料
   */
  async fetchNotifications(context) {
    const loginToken = context.state.user.loginToken;

    const result = await axios({
      url: notificationPath,
      method: 'get',
      headers: {
        Authorization: loginToken,
      },
    });

    if (result.data.data) {
      context.commit(FETCH_NOTIFICATION, result.data.data);
    }
  },

  /**
   * @author odin
   * @description 獲得國碼列表
   */
  async fetchCountryCodeList(context) {
    try {
      const res = await axios.get(countryCodeListPath);

      if (res.data.data || res.data.status) {
        console.log('fetchCountryCodeList Success');
        console.log('fetchCountryCodeList res => ', res);

        context.commit('FETCH_COUNTRYCODE_LIST', res.data.data);
      }
    } catch (err) {
      console.log(
        'fetchCountryCodeList axios error response => ',
        err.response,
      );
      console.log(
        'fetchCountryCodeList axios error response message=> ',
        err.response.data.message,
      );
    }
  },

  /**
   * @author odin
   * @param {object} context 第一個參數固定是context
   * @param {string} payload 傳進來要變動的使用者資料(在這邊是isTest)
   * @description 取得RTC Token
   */
  async fetchRTCToken(context, payload) {
    const isTest = payload;
    const lessonid = context.state.live.lessonid;
    const timeid = context.state.live.timeid;
    const loginToken = context.state.user.loginToken;

    let apiPath = `${
      isTest ? fetchIsTestPath : fetchNotTestPath
    }/${lessonid}/times/${timeid}/token`;

    console.log('apiPath', apiPath);

    try {
      const res = await axios({
        url: apiPath,
        method: 'post',
        headers: {
          Authorization: loginToken,
        },
      });

      if (res.data.data || res.data.status) {
        console.log('fetchRTCToken Success');
        console.log('fetchRTCToken res => ', res);
        context.commit(UPDATE_RTC_TOKEN_DATA, res.data.data);
      }
    } catch (err) {
      console.log('fetchRTCToken axios error response => ', err.response);
      console.log(
        'fetchRTCToken axios error response message=> ',
        err.response.data.message,
      );
    }
  },
};

export default actions;
