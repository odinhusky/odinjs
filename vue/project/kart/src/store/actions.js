import axios from '../axios';
import {
  fetchBannerImgPath,
  studentLoginPath,
  studentLogoutPath,
  teacherLoginPath,
  teacherLogoutPath,
  notificationPath,
  countryCodeListPath,
} from '@/store/ajax-path.js';
import {
  FETCH_BANNER_IMG_PATH,
  FETCH_NOTIFICATION,
  UPDATE_I18N_LANGUAGE,
  UPDATE_LOGIN_DETAIL,
  UPDATE_LOGOUT_DETAIL,
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
   * @description ES7包裝axios取得 Banner 路徑
   */
  async fetchBannerImgPath(context) {
    const result = await axios.get(fetchBannerImgPath);

    if (result.data) {
      let bannerPath = result.data.data[0].img;
      context.commit(FETCH_BANNER_IMG_PATH, bannerPath);
    }
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
      const loginType = loginDetail.is_teacher ? 'teacher' : 'student';
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
      const loginType =
        loginDetail.login_type === 'teacher' ? 'teacher' : 'student';
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
};

export default actions;
