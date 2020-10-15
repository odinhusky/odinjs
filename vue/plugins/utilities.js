let odin = {};

/**
 * @author odin
 * @description Tools For localStorage manipulation
 */

odin.localStorage = (function () {
  /**
   * @author odin
   * @class localStorage
   * @description Handle differet act of localStorage
   * @param  {string} act - getItem, setItem, removeItem
   * @param  {string} key
   * @param  {string} value
   */
  function _base(act, key, value) {
    var r = null;

    if (window.localStorage) {
      try {
        r = window.localStorage[act](key, value);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('LocalStorage is not support.');
    }

    return r;
  }

  /**
   * @author odin
   * @class localStorage
   * @description Get the value of specific key name from localStorage
   * @param  {string} key
   */
  function get(key) {
    return _base('getItem', key);
  }

  /**
   * @author odin
   * @class localStorage
   * @description Set the value of specific key name to localStorage
   * @param  {string} key
   * @param  {string} value
   */
  function set(key, value) {
    return _base('setItem', key, value);
  }

  /**
   * @author odin
   * @class localStorage
   * @description Remove the value and key name from localStorage
   * @param  {string} key
   */
  function remove(key) {
    return _base('removeItem', key);
  }

  return {
    get,
    set,
    remove,
  };
})();

/**
 * @author odin
 * @description Tools For localStorage manipulation
 */

odin.sessionStorage = (function () {
  /**
   * @author odin
   * @class sessionStorage
   * @description Handle differet act of sessionStorage
   * @param  {string} act - getItem, setItem, removeItem
   * @param  {string} key
   * @param  {string} value
   */
  function _base(act, key, value) {
    var r = null;

    if (window.sessionStorage) {
      try {
        r = window.sessionStorage[act](key, value);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('sessionStorage is not support.');
    }

    return r;
  }

  /**
   * @author odin
   * @class localStorage
   * @description Get the value of specific key name from localStorage
   * @param  {string} key
   */
  function get(key) {
    return _base('getItem', key);
  }

  /**
   * @author odin
   * @class localStorage
   * @description Set the value of specific key name to localStorage
   * @param  {string} key
   * @param  {string} value
   */
  function set(key, value) {
    return _base('setItem', key, value);
  }

  /**
   * @author odin
   * @class localStorage
   * @description Remove the value and key name from localStorage
   * @param  {string} key
   */
  function remove(key) {
    return _base('removeItem', key);
  }

  return {
    get,
    set,
    remove,
  };
})();

/**
 * @author odin
 * @description Utilities to help to develop
 */
odin.utility = (function () {
  /**
   * @author odin
   * @class utility
   * @description 判斷是否為空的物件
   * @param  {object} o - 傳入物件
   * @returns {boolean}
   */
  function isEmptyObject(o) {
    if (Object.keys(o).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if value is primitive.
   * @param {any} val The value we want to check.
   * @returns {boolean} true or false
   */
  function isPrimitive(val) {
    return (
      typeof val === 'string' ||
      typeof val === 'number' ||
      // $flow-disable-line
      typeof val === 'symbol' ||
      typeof val === 'boolean'
    );
  }

  /**
   * @author odin
   * @class utility
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
   * @class utility
   * @description 取得現在的語系
   * @returns {string}
   */
  function getI18nLanguage() {
    let i18nLanguage = odin.localStorage.get('i18nLanguage');
    if (i18nLanguage) {
      return i18nLanguage;
    } else {
      i18nLanguage = detectLanguage();
      return i18nLanguage;
    }
  }

  /**
   * @author odin
   * @class utility
   * @description 設定語系到localStorage裡面
   * @param {string} i18nLanguage 要設定的語系，不傳入的話就會去抓取localStorage或是偵測瀏覽器語系
   */
  function setI18nLanguage(i18nLanguage) {
    if (i18nLanguage) {
      odin.localStorage.set('i18nLanguage', i18nLanguage);
    } else {
      odin.localStorage.set('i18nLanguage', getI18nLanguage());
    }
  }

  /**
   * @author odin
   * @class utility
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
   * @class utility
   * @description 移除localStorage的i18nLanguage
   */
  function removeI18nLanguage() {
    odin.localStorage.remove('i18nLanguage');
  }

  /**
   * @author odin
   * @class utility
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
   * @class utility
   * @description 取得現在是否有登入
   * @returns {string}} login token
   */
  function getLoginToken() {
    const token =
      odin.localStorage.get('token') || odin.sessionStorage.get('token');
    return token ? token : null;
  }

  /**
   * @author odin
   * @class utility
   * @description 取得現在是否有登入
   * @returns login Data
   */
  function getLoginUserData() {
    const loginData =
      odin.localStorage.get('loginData') ||
      odin.sessionStorage.get('loginData');
    return loginData ? JSON.parse(loginData) : null;
  }

  /**
   * @author odin
   * @class utility
   * @description 登出時清除登入的數據
   */
  function logOutClear() {
    odin.localStorage.remove('loginData');
    odin.sessionStorage.remove('loginData');
    odin.localStorage.remove('token');
    odin.sessionStorage.remove('token');
  }

  /**
   * @author odin
   * @class utility
   * @param {object} thisComponent 這個vue component 指向的this
   * @description 登出時清除登入的數據
   */
  function setLoginDetail(thisComponent) {
    const loginData = getLoginUserData();
    const loginType = loginData['login_type'];
    console.log('loginData =>', loginData);

    thisComponent.loginDetail.loginType = loginType;
    thisComponent.loginDetail.token = getLoginToken();
    thisComponent.loginDetail.app_id = loginData.app_id;
    thisComponent.loginDetail.channel = loginData.channel;
    thisComponent.loginDetail.is_test = loginData.is_test;
    thisComponent.loginDetail.is_teacher = loginData.is_teacher;
    thisComponent.loginDetail.birthday = loginData[loginType].birthday;
    thisComponent.loginDetail.name = loginData[loginType].name;
    thisComponent.loginDetail.email = loginData[loginType].email;
    thisComponent.loginDetail.cellphone = loginData[loginType].cellphone;
    thisComponent.loginDetail.cellphone_info.country_code =
      loginData[loginType].cellphone_info.country_code;
    thisComponent.loginDetail.cellphone_info.phone_number =
      loginData[loginType].cellphone_info.phone_number;
  }

  return {
    isEmptyObject,
    isPrimitive,
    detectLanguage,
    getI18nLanguage,
    setI18nLanguage,
    getAndSetI18nLanguage,
    removeI18nLanguage,
    switchI18nLanguageInVueComponent,
    getLoginToken,
    getLoginUserData,
    logOutClear,
    setLoginDetail,
  };
})();

/**
 * @author odin
 * @description Utilities to check value
 */
odin.check = (function () {
  /**
   * @author odin
   * @class check
   * @description 判斷email是否有符合規則
   * @param  {string} value - 要被檢查的字串
   * @returns {boolean}
   */
  function checkEmail(value) {
    // eslint-disable-next-line
    const rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (value.search(rule) == -1) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @author odin
   * @class check
   * @description 判斷電話號碼是否有符合規則
   * @param  {string} coutryCode - 國碼
   * @param  {string} cellphone - 電話號碼
   * @returns {boolean}
   */
  function checkCellphone(coutryCode, cellphone) {
    if (coutryCode == '+86') {
      if (cellphone.slice(0, 1) != 1 || cellphone.length != 11) {
        return false;
      } else {
        return true;
      }
    } else if (coutryCode == '+886') {
      if (cellphone.slice(0, 2) != '09' || cellphone.length != 10) {
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * @author odin
   * @class check
   * @description 判斷兩個值是否相等
   * @param  {string} value1 - 要比對的值 - 1
   * @param  {string} value2 - 要比對的值 - 2
   * @returns {boolean}
   */
  function checkSameContent(value1, value2) {
    if (value1 === value2) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author odin
   * @class check
   * @description 判斷是否該值為空
   * @param  {Primitive value} value 輸入的值
   * @returns {boolean or null}
   */
  function checkIsEmpty(value) {
    if (value === 0) {
      return false;
    } else {
      if (value && value !== '' && value !== null && value !== undefined) {
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * @author odin
   * @class check
   * @description 判斷兩個值是否相等
   * @param  {string} activeType - 類型
   * @param  {string} targetObj - 要檢查的物件內容
   * @example
   * type = ['checkEmail', 'checkCellphone', 'checkSameContent', 'checkIsEmpty'];
   * targetObj = {
   *    email(檢查項目的屬性名稱): {
   *      type: ['checkEmail', 'checkIsEmpty'],
   *      value(檢查項目的值): 'ddd@gmail.com'
   *    }
   * }
   * @returns {object}
   * @example
   * result = {
   *  isAllPass: {boolean},
   *  unPassName: ['email', 'password']
   *  resultObj: {
   *    email: {
   *      checkEmail: false,
   *      checkIsEmpty: true
   *    }
   *  }
   * }
   */
  // function checkLoginForm(targetObj) {
  //   const result = {
  //     isAllPass: false,
  //     unPassName: [],
  //     resultObj: {},
  //   };
  // }

  /**
   * @author odin
   * @class check
   * @description 判斷是否登入
   * @returns {boolean}
   */
  function isLogin() {
    if (odin.utility.getLoginUserData() === null) {
      return false;
    } else {
      return true;
    }
  }

  return {
    checkEmail,
    checkCellphone,
    checkSameContent,
    checkIsEmpty,
    // checkLoginForm,
    isLogin,
  };
})();

export default odin;
