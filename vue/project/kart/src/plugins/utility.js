/**
 * @author odin
 * @description Utilities to help to develop
 */

/**
 * @author odin
 * @description 檢查瀏覽器的語系
 * @returns {string}
 */
function detectLanguage() {
  console.log('detect language');
  let i18nLanguage = '';
  let browserlanguage = (
    navigator.language ||
    navigator.userLanguage ||
    navigator.browserLanguage ||
    navigator.systemLanguage
  ).toLowerCase();
  if (browserlanguage.search(/cn/) != -1) {
    console.log('簡中', browserlanguage);
    i18nLanguage = 'zh-Hans';
  } else if (
    browserlanguage.search(/tw/) != -1 ||
    browserlanguage.search(/hk/) != -1
  ) {
    console.log('繁中', browserlanguage);
    i18nLanguage = 'zh-Hant';
  } else if (browserlanguage.search('en') != -1) {
    console.log('english', browserlanguage);
    i18nLanguage = 'en-US';
  } else {
    console.log('other languages', browserlanguage);
    i18nLanguage = 'zh-Hans';
  }
  return i18nLanguage;
}

/**
 * @author odin
 * @description 取得現在的語系
 * @returns {string}
 */
function getI18nLanguage() {
  let i18nLanguage = window.localStorage.getItem('i18nLanguage');
  if (i18nLanguage) {
    return i18nLanguage;
  } else {
    i18nLanguage = detectLanguage();
    return i18nLanguage;
  }
}

/**
 * @author odin
 * @description 設定語系到localStorage裡面
 * @param {string} i18nLanguage 要設定的語系，不傳入的話就會去抓取localStorage或是偵測瀏覽器語系
 */
function setI18nLanguage(i18nLanguage) {
  if (i18nLanguage) {
    window.localStorage.setItem('i18nLanguage', i18nLanguage);
  } else {
    window.localStorage.setItem('i18nLanguage', getI18nLanguage());
  }
}

/**
 * @author odin
 * @description 設定語系到localStorage裡面
 * @returns {string}
 */
function getAndSetI18nLanguage() {
  let i18nLanguage = getI18nLanguage();
  setI18nLanguage(i18nLanguage);
  return i18nLanguage;
}

/**
 * @author odin
 * @description 移除localStorage的i18nLanguage
 */
function removeI18nLanguage() {
  window.localStorage.removeItem('i18nLanguage');
}

/**
 * @author odin
 * @description 在Vue-Component中同步修改套件以及localStorage的方法
 * @param  {object} vm Vue Component 的 this
 * @param  {string} i18nLanguage Vue Component 的 thisArg
 */
function switchI18nLanguageInVueComponent(vm, i18nLanguage) {
  // localStorage Setting
  setI18nLanguage(i18nLanguage);

  // i18n Setting
  if (vm) {
    try {
      vm.$i18n.locale = i18nLanguage;
    } catch (e) {
      console.log('switchI18nLanguageInVueComponent error =>', e);
    }
  }
}

/**
 * @author odin
 * @description 取得現在是否有登入
 * @returns {string}} login token
 */
function getLoginToken() {
  const token =
    window.localStorage.getItem('token') ||
    window.sessionStorage.getItem('token');
  return token ? token : null;
}

/**
 * @author odin
 * @description 取得現在是否有登入
 * @returns login Data
 */
function getLoginUserData() {
  const loginDetail =
    window.localStorage.getItem('loginDetail') ||
    window.sessionStorage.getItem('loginDetail');
  return loginDetail ? JSON.parse(loginDetail) : null;
}

/**
 * @author odin
 * @description 取得localStorage || sessionStorage 的使用者類別
 * @returns login type
 */
function getLoginUserType() {
  const loginDetail =
    window.localStorage.getItem('loginDetail') ||
    window.sessionStorage.getItem('loginDetail');

  return loginDetail.login_type;
}

/**
 * @author odin
 * @description 取得localStorage || sessionStorage 的使用者名稱
 * @returns login user name
 */
function getLoginUserName() {
  const loginDetail =
    window.localStorage.getItem('loginDetail') ||
    window.sessionStorage.getItem('loginDetail');

  return loginDetail[loginDetail.login_type].name;
}

/**
 * @author odin
 * @description 取得localStorage || sessionStorage 的使用者email
 * @returns login user name
 */
function getLoginUserEmail() {
  const loginDetail =
    window.localStorage.getItem('loginDetail') ||
    window.sessionStorage.getItem('loginDetail');

  return loginDetail[loginDetail.login_type].email;
}

/**
 * @author odin
 * @description 取得 localStorage 的使用者通知內容
 * @returns notifications
 */
function getNotifications() {
  const vuexState = JSON.parse(window.localStorage.getItem('state'));
  return vuexState.notifications;
}

/**
 * @author odin
 * @description 登出時清除登入的數據
 */
function logoutClear() {
  window.localStorage.removeItem('loginToken');
  window.sessionStorage.removeItem('loginToken');
  window.localStorage.removeItem('loginDetail');
  window.sessionStorage.removeItem('loginDetail');
}

/**
 * @author odin
 * @param {string} name -- 要顯示的名稱
 * @param {object}} err -- 由 catch 接收到的 axios 回傳的錯誤物件
 * @description 顯示 axios 錯誤時的 console.log
 */
function axiosSuccessHint(name, res) {
  console.log(`${name} Success`);
  console.log(`${name} res => `, res);
}

/**
 * @author odin
 * @param {string} name -- 要顯示的名稱
 * @param {object}} err -- 由 catch 接收到的 axios 回傳的錯誤物件
 * @description 顯示 axios 錯誤時的 console.log
 */
function axiosErrorHint(name, err) {
  console.log(`${name} axios error => `, err);
  console.log(`${name} axios error response => `, err.response);

  console.log(
    ` ${name} axios error response message => `,
    err.response.data.message,
  );
}

export {
  detectLanguage,
  getI18nLanguage,
  setI18nLanguage,
  getAndSetI18nLanguage,
  removeI18nLanguage,
  switchI18nLanguageInVueComponent,
  getLoginToken,
  getLoginUserData,
  getLoginUserType,
  getLoginUserName,
  getLoginUserEmail,
  getNotifications,
  logoutClear,
  axiosSuccessHint,
  axiosErrorHint,
};
