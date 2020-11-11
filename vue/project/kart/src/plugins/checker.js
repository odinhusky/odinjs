/**
 * @author odin
 * @description Utilities to check value
 */
import { getLoginUserData } from './utility.js';

/**
 * @author odin
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
 * @description 判斷是否為奇數(0視為偶數)
 * @param {Number} num - 傳入的數字
 * @return {boolean} true or false
 */
function isOdd(num) {
  return num % 2 === 0 ? false : true;
}

/**
 * @author odin
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
 * @description 判斷是否登入
 * @returns {boolean}
 */
function checkIsLogin() {
  if (getLoginUserData() === null) {
    return false;
  } else {
    return true;
  }
}

/**
 * @author odin
 * @description 判斷是否物件或陣列是否為空
 * @param {object} o - 傳入的物件或是陣列
 */
function checkObjectIsEmpty(o) {
  if (Object.keys(o).length === 0) {
    return true;
  } else {
    return false;
  }
}

function checkDateFormat(str) {
  var re = new RegExp('^([0-9]{4})[.-]{1}([0-9]{1,2})[.-]{1}([0-9]{1,2})$');
  var strDataValue;
  var infoValidation = true;
  if ((strDataValue = re.exec(str)) != null) {
    var i;
    i = parseFloat(strDataValue[1]);
    if (i <= 0 || i > 9999) {
      /*年*/
      infoValidation = false;
    }
    i = parseFloat(strDataValue[2]);
    if (i <= 0 || i > 12) {
      /*月*/
      infoValidation = false;
    }
    i = parseFloat(strDataValue[3]);
    if (i <= 0 || i > 31) {
      /*日*/
      infoValidation = false;
    }
  } else {
    infoValidation = false;
  }

  return infoValidation;
}

export {
  isEmptyObject,
  isPrimitive,
  isOdd,
  checkEmail,
  checkCellphone,
  checkIsEmpty,
  checkObjectIsEmpty,
  checkIsLogin,
  checkDateFormat,
};
