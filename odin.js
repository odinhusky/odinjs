/**
 * @author odin
 * @description library of js
 */

window.odin = {};
 
/**
 * @author odin
 * @description Helpers for data check and transform.
 */
 
odin.helper = (function () {
  /**
   * @author odin
   * @class helpers
   * @description Checking the para is undefined or null.
   * @param {any} o The value we want to check.
   * @returns {boolean} true or false
   */
  function isUndef(o) {
    return o === undefined || o === null;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking the para is NOT undefined or null.
   * @param {any} o The value we want to check.
   * @returns {boolean} true or false
   */
  function isDef(o) {
    return o !== undefined && o !== null;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking the para is TRUE(boolean).
   * @param {any} o The value we want to check.
   * * @returns {boolean} true or false
   */
  function isTrue(o) {
    return o === true;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking the para is FALUSE(boolean).
   * @param {any} o The value we want to check.
   * @returns {boolean} true or false
   */
  function isFalse(o) {
    return o === false;
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
   * @class helpers
   * @description Check if number is odd.
   * @param {Number} num The value we want to check.
   * @returns {boolean} true or false
   */
  function isOdd(num) {
    return num % 2 === 0 ? false : true;
  }

  /**
   * @author odin
   * @class helpers
   * @description Get the raw type string of a value.
   * @param {any} val The value we want to check.
   * * @returns {string} [object Object]
   */
  var _toString = Object.prototype.toString;

  function toRawType(val) {
    return _toString.call(val).slice(8, -1);
  }

  /**
   * @author odin
   * @class helpers
   * @description  Strict number type check.Only returns true for number(without Infinity and NaN).
   * @param {any} val The value we want to check.
   * @returns {boolean} true or false
   */
  function isNumber(val) {
    return typeof target === 'number' && isFinite(target);
  }

  /**
   * @author odin
   * @class helpers
   * @description  Strict number type check.Only returns true for number(without Infinity and NaN).
   * @param {any} val The value we want to check.
   * @returns {boolean} true or false
   */
  function isNumber2(val) {
    return _toString.call(val) === '[object Number]' && isFinite(target);
  }

  /**
     * @author odin
     * @class helpers
     * @description  Strict object type check.Only returns true for plain JavaScript objects.
     * @example
     * Plain JavaScript Objects:
        * var obj = {};
        * var obj = new Object(); 只有用Object 的建構式才是 Plain JavaScript Objects，其他都不是
        
     * Non Plain JavaScript Objects:
        ==========================
     *  Using a function constructor:
     *  var Obj = function(name) {
            this.name = name;
        }
        var c = new Obj("hello"); 
        ==========================
        Using ES6 class syntax:
        class myObject {
            constructor(name) {
                this.name = name;
            }
        }
        var e = new myObject("hello");
     * @param {any} val The value we want to check.
     * @returns {boolean} true or false
     */
  function isPlainObject(val) {
    return _toString.call(val) === '[object Object]';
  }

  /**
   * @author odin
   * @class helpers
   * @description Quick object check - this is primarily used to tell / Objects from primitive values when we know the value is a JSON - compliant type.
   * @param {any} val The value we want to check.
   * @returns {boolean} true or false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if val is a valid array index.
   * @param {any} val The value we want to check.
   * @returns {boolean} true or false
   */
  function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if val is a Promise.
   * @param {any} val The input value
   * @returns {boolean} true or false
   */
  function isPromise(val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    );
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if the device is Mobile.
   * @returns {boolean} true or false
   */
  function isMobile() {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent,
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4),
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking if the jQuery is existing.
   * @returns {boolean} true or false
   */
  function isjQueryExist(o) {
    return jQuery ? true : false;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking if the Vue is existing.
   * @returns {boolean} true or false
   */
  function isVueExist(o) {
    return Vue ? true : false;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking if the Vue is existing.
   * @returns {boolean} true or false
   */
  function isReactExist(o) {
    return __REACT_DEVTOOLS_APPEND_COMPONENT_STACK__ ? true : false;
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking if this device is IOS
   * @returns {boolean} true or false
   */
  function isIOS() {
    if (navigator && navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author odin
   * @class helpers
   * @description Checking if this device is Android
   * @returns {boolean} true or false
   */
  function isAndroid() {
    if (navigator && navigator.userAgent.match(/Android/i)) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * @author odin
  * @class helpers
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
   * @class helpers
   * @description Convert a value to a string that is actually rendered.
   * @param {any} val The input value
   * @returns {string} string
   */
  function toString(val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val);
  }

  /**
   * @author odin
   * @class helpers
   * @description Convert an input value to a number for persistence. / If the conversion fails, return original string.
   * @param {string} val The input string
   * @returns {number / string / NaN} number / string / NaN
   */
  function toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
  }

  /**
   * @author odin
   * @class helpers
   * @description Convert an input value to a number for persistence. / If the conversion fails, return original string.
   * @param {string} val The input string
   * @param {number} radix between 2 ~ 36
   * @returns {number / string / NaN} number / string / NaN
   */
  function toNumberWithRaix(val, radix) {
    var n = parseFloat(val, radix);
    return isNaN(n) ? val : n;
  }

  /**
   * @author odin
   * @class helpers
   * @description Check whether an object has the property.
   * @param {object} obj Target Object
   * @param {string} keyName The property name
   * @returns {boolean} true or false
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function hasOwn(obj, keyName) {
    return hasOwnProperty.call(obj, keyName);
  }

  /**
   * @author odin
   * @class helpers
   * @description Pick the own property name and value to a new object
   * @param {object} obj input object
   * @returns {object} A new object contains only own property name and value
   */

  function getAllOwnPropertyObj(obj) {
    var filterObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        filterObj.key = obj[key];
      }
    }
    return filterObj;
  }

  /**
   * @author odin
   * @class helpers
   * @description Convert an Array - like object to a real Array.
   * @param list Array like arguments
   * @param start decide which index is the first value of new Array
   * @returns {object} to object extend by _from object
   */
  function arrLikeToArray1(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret;
  }

  /**
   * @author odin
   * @class helpers
   * @description Convert an Array - like object to a real Array.
   * @param list Array like arguments
   * @returns {object} to object extend by _from object
   */
  function arrLikeToArray2(list) {
    return [].slice.call(list);
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if the object is in this array
   * @param arr Array to be checked
   * @param obj Object
   * @returns {boolean} true or false
   */
  function include(arr, obj) {
    return arr.indexOf(obj) != -1;
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if the object is not in this array
   * @param arr Array to be checked
   * @param obj Object
   * @returns {boolean} true or false
   */
  function exclude(arr, obj) {
    return arr.indexOf(obj) == -1;
  }

  /**
   * @author odin
   * @class helpers
   * @description Mix properties into target object.
   * @param to destination Object
   * @param _from from which Object
   * @returns {object} to object extend by _from object
   */
  function extend(to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to;
  }
  /**
   * @author odin
   * @class helpers
   * @description Merge an array of objects into a single object.
   * @param {array} arr input Array
   * @returns {object} new object extend by arr
   */
  function arrToObject(arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res;
  }

  /**
   * @author odin
   * @class helpers
   * @description Always return false.
   * @returns {boolean} false
   */
  function no(a, b, c) {
    return false;
  }

  /**
   * @author odin
   * @class helpers
   * @description Always return true.
   * @returns {boolean} true
   */
  function yes(a, b, c) {
    return true;
  }

  /**
   * @author odin
   * @class helpers
   * @description Return the same value.
   * @param _ input data
   * @returns {any} input data
   */
  function sameValue(_) {
    return _;
  }

  /**
   * @author odin
   * @class helpers
   * @description Check if two values are loosely equal - that is, if they are plain objects, do they have the same shape ?
   * @param {any} a input variable
   * @param {any} b another input variable
   * @returns {boolean} true or false
   */
  function looseEqual(a, b) {
    if (a === b) {
      return true;
    }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return (
            a.length === b.length &&
            a.every(function (e, i) {
              return looseEqual(e, b[i]);
            })
          );
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime();
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return (
            keysA.length === keysB.length &&
            keysA.every(function (key) {
              return looseEqual(a[key], b[key]);
            })
          );
        } else {
          /* istanbul ignore next */
          return false;
        }
      } catch (e) {
        /* istanbul ignore next */
        return false;
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b);
    } else {
      return false;
    }
  }

  /**
   * @author odin
   * @class helpers
   * @description String / JSON to JSON
   * @param {string / json} inputData input data
   * @returns {json} json
   */
  function resJSON(inputData) {
    var res = inputData;
    try {
      res = JSON.prase(res);
    } catch (e) {
      //
    }
    return res;
  }

  /**
   * @author odin
   * @class helpers
   * @description Sort array numbers with positive sequence
   * @param {array} arr input array with numbers
   * @returns {array} array
   */
  function sortNum(arr) {
    return arr.sort(function (a, b) {
      return a - b;
    });
  }

  /**
   * @author odin
   * @class helpers
   * @description Sort array numbers with reverse order
   * @param {array} arr input array with numbers
   * @returns {array} array
   */
  function sortNumReverse(arr) {
    return arr.sort(function (a, b) {
      return b - a;
    });
  }

  /**
   * @author odin
   * @class helpers
   * @description Sort array numbers with positive sequence
   * @param {array} obj input array with numbers
   * @param {string} attr Object attribute key name
   * @returns {object} object
   */
  function sortObjKey(obj, attr) {
    return obj.sort(function (a, b) {
      return a[attr] - b[attr];
    });
  }

  /**
   * @author odin
   * @class helpers
   * @description Sort array numbers with reverse order
   * @param {array} obj input array with numbers
   * @param {string} attr Object attribute key name
   * @returns {object} object
   */
  function sortObjKeyReverse(obj, attr) {
    return obj.sort(function (a, b) {
      return b[attr] - a[attr];
    });
  }

  /**
   * @author odin
   * @class helpers
   * @description Delete Repeat data and return a array(Type of object values are exceptions)
   * @param {array} arr input array
   * @returns {array} array
   */
  function delRepeat(arr) {
    var newArr = [];
    arr.forEach(function (value) {
      if (newArr.indexOf(value) == -1) {
        newArr.push(value);
      }
    });
    return newArr;
  }

  /**
   * @author odin
   * @class helpers
   * @description Reverse input text
   * @param {string} str input string
   * @returns {string} string
   */
  function reverseText(str) {
    return str.split('').reverse().join('');
  }

  /**
   * @author odin
   * @class helpers
   * @description Reverse input text
   * @param {array} arr input array
   * @returns {array} array
   */
  function reverseArray(arr) {
    return arr.reverse();
  }

  /**
   * @author odin
   * @class helpers
   * @description Shallow copy of array or object
   * @param {array / object} val input data of type object
   * @returns {array / object} array / object
   */

  function shallowCopy(val) {
    return Array.isArray(val) ? val.slice() : extend({}, val);
  }

  /**
   * @author odin
   * @class helpers
   * @description Deep copy of array or object
   * @param {array / object} val input data of type object or array
   * @returns {array / object} array / object
   */

  function deepCopy(val) {
    return JSON.parse(JSON.stringify(val));
  }

  /**
   * @author odin
   * @class helpers
   * @description Deep copy of object include !!!!! symbol and undefined value !!!!
   * @param {array / object} obj input data of type object or array
   * @returns {array / object} array / object
   */
  function deeepCopy(obj, cache = new WeakMap()) {
    // 基本型別 & function
    if (obj === null || typeof obj !== 'object') return obj
    // Date 及 RegExp
    if (obj instanceof Date || obj instanceof RegExp) return obj.constructor(obj)
    // 檢查快取
    if (cache.has(obj)) return cache.get(obj)

    // 使用原物件的 constructor
    const copy = new obj.constructor()

    // 先放入 cache 中
    cache.set(obj, copy)
    // 取出所有一般屬性 & 所有 key 為 symbol 的屬性
    ;[...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].forEach(key => {
      copy[key] = deeepCopy(obj[key], cache)
    })

    return copy
  }

  /**
   * @author odin
   * @class helpers
   * @description Get the object key name into array
   * @param {object} obj input data of type object
   * @returns {array} Key name array
   */

  function getObjKeyNameToArray(obj) {
    return Object.keys(obj);
  }

  /**
   * @author odin
   * @class helpers
   * @description Get the object value into array
   * @param {object} obj input data of type object
   * @returns {array} Value array
   */

  function getObjValueToArray(obj) {
    return getObjKeyNameToArray(obj).map(function (keyName) {
      return obj[keyName];
    });
  }

  /**
   * @author odin
   * @class helpers
   * @description 檢查瀏覽器的語系
   * @returns {string}
   */
  function detectLanguage() {
    console.log('detect language');
    let i18nlanguage = '';
    let browserlanguage = (
      navigator.language ||
      navigator.userLanguage ||
      navigator.browserLanguage ||
      navigator.systemLanguage
    ).toLowerCase();
    if (browserlanguage.search(/cn/) != -1) {
      console.log('簡中', browserlanguage);
      i18nlanguage = 'zh-Hans';
    } else if (
      browserlanguage.search(/tw/) != -1 ||
      browserlanguage.search(/hk/) != -1
    ) {
      console.log('繁中', browserlanguage);
      i18nlanguage = 'zh-Hant';
    } else if (browserlanguage.search('en') != -1) {
      console.log('english', browserlanguage);
      i18nlanguage = 'en-US';
    } else {
      console.log('other languages', browserlanguage);
      i18nlanguage = 'zh-Hans';
    }
    return i18nlanguage;
  }

  /**
   * @author odin
   * @class helpers
   * @description 轉換物件為字串
   * @param {object} o 傳入的物件
   * @example
   * { page: '1', size: '2kg', key: undefined } => ?page=1&size=2kg'
   * @returns {string}
   */
  function objectToQueryString(o) {
    return o
      ? Object.entries(o).reduce((str, [key, val], index) => {
          const symbol = str.length === 0 ? '?' : '&';
          str += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
          return str;
        }, '')
      : '';
  }

  /**
   * @author odin
   * @class helpers
   * @description JSON To CSV
   * @param {JSON} arr 傳入的JSON
   * @param {Array} columns
   * @param {String} delimiter 分隔符號，預設是,
   * @example
   * JSONtoCSV(
      [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }],
      ['a', 'b']
    ); // 'a,b\n"1","2"\n"3","4"\n"6",""\n"","7"'
   * @returns {CSV} // 'a,b\n"1","2"\n"3","4"\n"6",""\n"","7"'
   */
  function JSONtoCSV(arr, columns, delimiter = ',') {
    return [
      columns.join(delimiter),
      ...arr.map(obj =>
        columns.reduce(
          (acc, key) =>
            `${acc}${!acc.length ? '' : delimiter}"${!obj[key] ? '' : obj[key]}"`,
          ''
        )
      ),
    ].join('\n');
  }

  /**
   * @author odin
   * @class helpers
   * @description 判斷目前是哪個 瀏覽器(無法判斷IE11 above)
   * @return {string}
   */
  function judgeBrowser() {
    /* eslint-disable */
    let Sys = {};
    let ua = navigator.userAgent.toLowerCase();
    let s;
    (s = ua.match(/msie ([\d.]+)/))
      ? (Sys.ie = s[1])
      : (s = ua.match(/firefox\/([\d.]+)/))
      ? (Sys.firefox = s[1])
      : (s = ua.match(/chrome\/([\d.]+)/))
      ? (Sys.chrome = s[1])
      : (s = ua.match(/opera.([\d.]+)/))
      ? (Sys.opera = s[1])
      : (s = ua.match(/version\/([\d.]+).*safari/))
      ? (Sys.safari = s[1])
      : 0;
    // 測試是哪一種瀏覽器
    if (Sys.ie) return 'IE';
    if (Sys.firefox) return 'firefox';
    if (Sys.chrome) return 'chrome';
    if (Sys.opera) return 'opera';
    if (Sys.safari) return 'safari';
    /* eslint-enable */
  }

/**
 * @author odin
   * @class helpers
 * @description 判斷目前是不是 IE 瀏覽器
 * @return {boolean}}
 */
function isIE() {
  if (
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident/') > 0
  ) {
    return true;
  } else {
    return false;
  }
}

  /**
   * @author odin
   * @class helpers
   * @description 數字 轉 個別 數字字串 的陣列
   * @return {string}
   */
  function numToArr(n) {
    return n.toString().split('');
  }

  /**
   * @author odin
   * @class helpers
   * @param {Any} v -- 要轉換的值
   * @example
   *  transferBollean('true') => true || transferBollean({}) => {}
   * @description 將字串的 'true' || 'false' 轉換成 布林值，其他的值就直接回傳
   * @return {Boolean || Any} 回傳布林值或原本傳入的值
  */
  const transferBoolean = (v) => {
    if(v === 'true' && typeof v === 'string') {
      return true;
    } else if (v === 'false' && typeof v === 'string') {
      return false;
    } else {
      return v;
    }
  }

  /**
   * @author odin
   * @class helpers
   * @param {Object} obj -- 要過濾的物件
   * @param {Array} keyArr -- 要留下的 key 值
   * @description 回傳過濾完成的物件並將將字串的 'true' || 'false' 轉換成 布林值
   * @return {Object} 回傳過濾完成的物件
  */
  const filterObjPropertyByKey = (obj, keyArr) => {
    const newObj = {};

    keyArr.forEach((keyName) => {
      if(obj[keyName] !== undefined) {
        newObj[keyName] = obj[keyName];
      }
    })

    return  newObj;
  }

  /**
   * @author odin
   * @class helpers
   * @param {Array} arr -- 要轉換的陣列
   * @example
   *  [{key: "helper", value: "http://192.168.0.161:18080"},
      {key: "isJobNeedVerify", value: "false"},
      {key: "canMultipleLogin", value: "true"}]

      =>

      {
        canMultipleLogin: "true",
        helper: "http://192.168.0.161:18080",
        isJobNeedVerify: "false"
      }
  * @description 將具有物件屬性的陣列轉換成單一個物件
  * @returns {Object}
  */
  const arrToObj = (arr) => (
    arr.reduce((acc, cur)=> {
      return { ...acc, [cur.key]: cur.value }
    }, {})
  )

  /**
   * @author odin
   * @class helpers
   * @param {ObjectChain} obj -- 要轉換的物件
   * @example
      {
        canMultipleLogin: "true",
        helper: "http://192.168.0.161:18080",
        isJobNeedVerify: "false"
      }

      =>
      [{key: "helper", value: "http://192.168.0.161:18080"},
      {key: "isJobNeedVerify", value: "false"},
      {key: "canMultipleLogin", value: "true"}]
  * @description 將物件轉換成具有物件屬性的陣列
  * @returns {Array}
  */
  const objToArr = (obj) => {
    const keyArr = Object.keys(obj);

    return keyArr.reduce((acc, cur)=> {
      return [ ...acc, { key: cur, value:obj[cur] } ]
    }, [])
  }

  return {
    isUndef,
    isDef,
    isTrue,
    isFalse,
    isPrimitive,
    isOdd,
    toRawType,
    isNumber,
    isNumber2,
    isPlainObject,
    isObject,
    isValidArrayIndex,
    isPromise,
    isMobile,
    isjQueryExist,
    isVueExist,
    isReactExist,
    isIOS,
    isAndroid,
    checkIsEmpty,
    toString,
    toNumber,
    toNumberWithRaix,
    hasOwn,
    getAllOwnPropertyObj,
    arrLikeToArray1,
    arrLikeToArray2,
    include,
    exclude,
    extend,
    arrToObject,
    no,
    yes,
    sameValue,
    looseEqual,
    resJSON,
    sortNum,
    sortNumReverse,
    sortObjKey,
    sortObjKeyReverse,
    delRepeat,
    reverseText,
    reverseArray,
    shallowCopy,
    deepCopy,
    deeepCopy,
    getObjKeyNameToArray,
    getObjValueToArray,
    detectLanguage,
    objectToQueryString,
    judgeBrowser,
    isIE,
    numToArr,
    transferBoolean,
    filterObjPropertyByKey,
    arrToObj,
    objToArr
  };
})();

/**
 * @author odin
 * @description Helpers for data check and transform.
 */

odin.math = (function () {
  /**
   * @author odin
   * @class math
   * @description add ',' with string number
   * @param {number} price - the number which want to be added ,
   * @param {number} fixed - how many digits that you want to fix
   * @returns {string} value with ','
   */
  function priceWithCommas(price, fixed) {
    if (price == null) {
      price = '';
    }

    if (fixed != null && !isNaN(parseFloat(price))) {
      price = parseFloat(price.toString().replace(/,/g, '')).toFixed(fixed);
    }

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * @author odin
   * @class math
   * @description remove ',' with string number
   * @param  {number} price - the number which want to be added ,
   * @returns {string} value without ','
   */
  function priceWithoutCommas(price) {
    return price.toString().replace(/,/g, '');
  }

  /**
   * @author odin
   * @class math
   * @description find the max value among of input array
   * @param {array} arr - input array
   * @returns {number} max number
   */
  function max(arr) {
    return arr.reduce(function (preValue, curValue, index, array) {
      return preValue > curValue ? preValue : curValue;
    });
  }

  /**
   * @author odin
   * @class math
   * @description find the min value among of input array
   * @param {array} arr - input array
   * @returns {number} min number
   */
  function min(arr) {
    return arr.reduce(function (preValue, curValue, index, array) {
      return preValue > curValue ? curValue : preValue;
    });
  }

  /**
   * @author odin
   * @class math
   * @description Get the total from arguments
   * @param {number / array - like} arguments Series of numbers
   * @returns {number} total
   */
  function total() {
    var nums = odin.helper.arrLikeToArray2(arguments);

    var total = nums.reduce(function (acc, val) {
      return acc + val;
    }, 0);
  }

  /**
   * @author odin
   * @class math
   * @description Get the average from arguments
   * @param {number / array - like} arguments Series of numbers
   * @returns {number} average
   */
  function average() {
    return total(arguments) / odin.helper.arrLikeToArray2(arguments).length;
  }

  /**
   * @author odin
   * @class math
   * @description Get the double number of val
   * @param {number} val the number we want to double
   * @returns {number} double number of val
   */
  function double(val) {
    return val * 2;
  }

  /**
   * @author odin
   * @class math
   * @description Get the triple number of val
   * @param {number} val the number we want to triple
   * @returns {number} triple number of val
   */
  function triple(val) {
    return val * 3;
  }

  /**
   * @author odin
   * @class math
   * @description Get the double number of val
   * @param {array} arr The array contains
   * @returns {array} New array of double numbers
   */
  function arrDouble(arr) {
    return (arrDouble = arr.map(function (num) {
      return num * 2;
    }));
  }

  /**
   * @author odin
   * @class math
   * @description Get the triple number of val
   * @param {array} arr The array contains
   * @returns {array} New array of triple numbers
   */
  function arrTriple(val) {
    return (arrDouble = arr.map(function (num) {
      return num * 3;
    }));
  }

  /**
   * @author odin
   * @class math
   * @description 四捨五入(round)
   * @param {number} num The number we want to round
   * @returns {number} Rounded number
   */
  function round(num) {
    return Math.round(num);
  }

  /**
   * @author odin
   * @class math
   * @description 取最大正整數(floor)
   * @param {number} num The number we want to floor
   * @returns {number} Floored number
   */
  function floor(num) {
    return Math.floor(num);
  }

  /**
   * @author odin
   * @class math
   * @description 取最小整數(ceil)
   * @param {number} num The number we want to ceil
   * @returns {number} Ceiled number
   */
  function ceil(num) {
    return Math.ceil(num);
  }

  /**
   * @author odin
   * @class math
   * @description 帶小數的四捨五入(round)
   * @param {number} num The number with decimal whcich we want to round it and cut the digit of decimal
   * @param {number} digit the number we want to leave of decimal
   * @returns {number} Rounded number with specific digit
   */
  function roundDecimal(num, digit) {
    return (
      Math.round(Math.round(val * Math.pow(10, (digit || 0) + 1)) / 10) /
      Math.pow(10, digit || 0)
    );
  }

  /**
   * @author odin
   * @class math
   * @description 絕對值(abs)
   * @param {number} num The number we want to abs
   * @returns {number} Absed number
   */
  function abs(num) {
    return Math.abs(num);
  }

  /**
   * @author odin
   * @class math
   * @description 處理浮點計算問題
   * @param  {number} number - 傳入數字
   * @param  {number} precision - 精確度
   * @returns {number} 處理好的數字
   */
  function dealFloatNumber(number, precision) {
    return parseFloat((+number).toPrecision(precision ? precision : 12));
  }

  /**
   * @author odin
   * @class math
   * @description 加總，傳入數字的序列獲釋陣列的序列，初始值為0
   * @param  {numbers/arrays} arg - two or more numbers/arrays
   * @returns {number} 加總好的數字
   * @example prod(1, 2, 3, 4); // 24
   * @example prod(...[1, 2, 3, 4]); // 24
   */
  function accumulator(...arr) {
    return [...arr].reduce((acc, val) => acc * val, 0);
  }

  return {
    priceWithCommas,
    priceWithoutCommas,
    max,
    min,
    total,
    average,
    double,
    triple,
    arrDouble,
    arrTriple,
    roundDecimal,
    abs,
    ceil,
    round,
    floor,
    dealFloatNumber,
    accumulator,
  };
})();

/**
 * @author odin
 * @description Array Related
 */
odin.array = (function () {
  /**
   * @author odin
   * @class array
   * @description 產生一個 從 0 開始的到 指定數字 陣列
   * @param {number} num 給予指定的數字
   * @returns {array} 數字陣列
   * @example generateArrayToSpecificNumber(5) // [0, 1, 2, 3, 4, 5]
   */
  function generateArrayToSpecificNumber(num) {
    return Array.from(new Array(num), (val, index) => index + 1);
  }

  return {
    generateArrayToSpecificNumber
  }
})();

/**
 * @author odin
 * @description Helpers for URL.
 */

odin.url = (function () {
  /**
   * @author odin
   * @class url
   * @description get the URL
   * @returns {string} URL
   */
  function getUrl() {
    return window.location.href;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁的通訊協定 - get the protocol
   * @returns {string} 通訊協定 - protocol
   */
  function getProtocol() {
    return window.location.protocol;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁的主機名稱, 包含port - get the hostname with post
   * @returns {string} 主機名稱, 包含port - Host
   */
  function getHost() {
    return window.location.host;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁的主機名稱, 不包含port - get the hostname without post
   * @returns {string} 主機名稱, 不包含port - Hostname
   */
  function getHostname() {
    return window.location.hostname;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁的路徑 - get the pathname
   * @returns {string} 網頁的路徑 - pathname
   */
  function getPathname() {
    return window.location.pathname;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁茅點(#)(hashtag) - get the hashtag
   * @returns {string} hashtag
   */
  function getHash() {
    return window.location.hash;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁的port - get the port
   * @returns {string} port
   */
  function getPort() {
    return window.location.port;
  }

  /**
   * @author odin
   * @class url
   * @description 取得目前造訪網頁查詢參數 - get the search
   * @returns {string} search
   */
  function getSearch() {
    return window.location.search;
  }

  /**
   * @author odin
   * @class url
   * @description get the value of the specific parameter name from url
   * @param {string} [url = window.location.search] - url
   * @param {string} name - query parameter name
   * @param {string} [url = window.location.search] - url
   * @returns {string} value
   */
  function getUrlParaByName(name, url) {
    var result, regex, part;

    if (!url) {
      url = window.location.search;
    }

    name = name.replace(/[[\]]/g, '\\$&');
    regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    part = regex.exec(url);

    if (!part) {
      result = null;
    } else if (!part[2]) {
      result = '';
    } else {
      result = decodeURIComponent(part[2].replace(/\+/g, ' '));
    }

    return result;
  }

  /**
   * @author odin
   * @class url
   * @description 改變參數狀態 pushState
   * @param {object} state  - contain the paramName and value
   * @param {string} url - the url we want to add
   */
  function pushState(state, url) {
    var state = state ? state : '';

    var title = '';

    history.pushState(state, title, url);
  }

  /**
   * @author odin
   * @class url
   * @description Generate the FB share link
   * @param {string} url - the url we want to add
   * @returns {string} FB share link
   */
  function generateFBShareLink(url) {
    var fbPrefix = 'http://www.facebook.com/sharer.php?u=';

    return url ? fbPrefix + url : fbPrefix + getUrl();
  }

  /**
   * @author odin
   * @class url
   * @description Generate the Line share link
   * @param {string} url - the url we want to add
   * @returns {string} Line share link
   */
  function generateLineShareLink(url) {
    var linePrefix = 'https://social-plugins.line.me/lineit/share?url=';

    return url ? linePrefix + url : linePrefix + getUrl();
  }

  return {
    getUrl,
    getProtocol,
    getHost,
    getHostname,
    getPathname,
    getHash,
    getPort,
    getSearch,
    getUrlParaByName,
    pushState,
    generateFBShareLink,
    generateLineShareLink,
  };
})();

/**
 * @author odin
 * @description Tools For jQuery
 */

odin.jq = (function () {
  /**
   * @author odin
   * @class jq
   * @description Shallow copy of array or object
   * @param {array / object} val input data of type object
   * @returns {array / object} array / object
   */
  function shallowCopy(val) {
    return Array.isArray(val) ? jQuery.extend([], val) : jQuery.extend({}, val);
  }

  /**
   * @author odin
   * @class jq
   * @description Deep copy of array or object
   * @param {array / object} val input data of type object
   * @returns {array / object} array / object
   */
  function deepCopy(val) {
    return Array.isArray(val)
      ? jQuery.extend(true, [], val)
      : jQuery.extend(true, {}, val);
  }

  /**
   * @author odin
   * @class jq
   * @description
   * @param  {number} time - 秒
   * @param  {number} [term] - 取最大單位項目數
   * @param  {Array[]} [ignore] - 忽略列表(d,h,m,s)
   * @returns {string} 時間文字(日時分秒)
   */
  // function makeTimeStr (time, term, ignore) {

  //     var t = {
  //             days: parseInt(time / 86400),
  //             hours: parseInt((time % 86400) / 3600),
  //             minutes: parseInt(((time % 86400) % 3600) / 60),
  //             seconds: parseInt((time % 86400) % 60)
  //         },
  //         arr = [];

  //     $.each(t, function (k, v) {

  //         var lang = ['日', '時', '分', '秒'];

  //         if (v !== 0 && (!ignore || ignore.indexOf(k.charAt(0)) === -1)) {

  //             arr.push(v + lang[k.substr(0, k.length - 1)]);

  //         }

  //     });

  //     if (term && arr.length > term) {

  //         arr = arr.slice(0, term);

  //     }

  //     return arr.reduce(function (a, b) {

  //         return a + ' ' + b;

  //     });

  // }

  /**
   * @author odin
   * @class jq
   * @description Go to somewhere     * @param {string} target Anchor ID, required
   * @param {number} offset y軸偏移值(pixels, e.g. 50 or -50), optional
   * @param {number} speed 毫秒(1000 == 1秒), optional
   */
  function goTo(anchor, offset, speed) {
    var dis,
      offset = parseFloat(offset) || 0,
      speed = speed || 400;
    if (anchor && document.getElementById(anchor) !== null) {
      dis = $('#' + anchor).offset().top + offset;
    } else {
      dis = 0;
    }
    try {
      $('html, body').animate(
        {
          scrollTop: parseFloat(dis),
        },
        speed,
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * @author odin
   * @class jq
   * @description Go to somewhere
   * @param {string||number} disfromTop Could be number or specific word like "top","bottom","down"
   */
  function scroll(disfromTop) {
    var dis = disfromTop || 0;
    if (dis == 'top') {
      dis = 0;
    } else if (dis == 'bottom' || dis == 'down') {
      dis = document.body.scrollHeight;
    }
    try {
      $('html, body').animate(
        {
          scrollTop: parseFloat(dis),
        },
        400,
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * @author odin
   * @class jq
   * @description Send a Ajax request of with jQuery object
   * @param {object} obj
   * @example
   * {
   *      url: url,
   *      dataType: 'json',
   *      method: 'POST',
   *      data: {
   *          ...
   *      }
   * }
   */
  function sendAjax(obj) {
    var deferred = $.Deferred();

    $.ajax(obj)
      .then(function (res) {
        deferred.resolve(res);
      })
      .catch(function (rej) {
        deferred.resolve(rej);
      });

    return deferred.promise();
  }

  return {
    shallowCopy,
    deepCopy,
    // makeTimeStr,
    goTo,
    scroll,
    sendAjax,
  };
})();

/**
 * @author odin
 * @description Tools For Time
 */

odin.time = (function () {
  /**
   * @author odin
   * @class time
   * @description Get now date object
   * @returns {object} Now date object
   */
  function getNowDateObj() {
    return new Date();
  }

  /**
   * @author odin
   * @class time
   * @description Get now date object
   * @param {any date format} date any date format
   * @returns {object} Specific date object
   */
  function getSpecificDateObj(date) {
    return new Date(date);
  }

  /**
   * @author odin
   * @class time
   * @description Get specific time stamp
   * @param {any date format} date any date format
   * @returns {object} Specific time stamp
   */
  function getSpecificTimeStamp(date) {
    return Date.parse(date);
  }

  /**
   * @author odin
   * @class time
   * @description Plus or Minus days of input Date object
   * @param {object} date Instance of Date Function
   * @param {number} changeDate plus or minus day, eg: 6 or -5
   * @returns {object} Changed Date Object
   */
  function changeDate(date, changeDate) {
    return new Date(date.setDate(date.getDate() + changeDate));
  }

  /**
   * @author odin
   * @class time
   * @description Convert any time format to YYYY-MM-DD
   * @param {timeFormat(TimeStamp / Date Object)} date
   * @param {string} seperator seperate the YYYY-MM-DD, eg: '-', '/', default '-'
   * @returns {string} time string
   */
  function formatDate(date, seperator) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return seperator
      ? [year, month, day].join(seperator ? seperator : '-')
      : [year, month, day].join('-');
  }

  /**
   * @author odin
   * @class time
   * @description Convert any time format to YYYY-MM-DD
   * @param {timeFormat(TimeStamp / Date Object)} date
   * @param {string} seperator seperate the YYYY-MM-DD, eg: '-', '/', default '-'
   * @returns {string} 2020/09/23 17:18:19
   */
  function formatDateTime(date, seperator) {
    let d = new Date(time),
      sec = d.getSeconds(),
      min = d.getMinutes(),
      hour = d.getHours(),
      month = d.getMonth() + 1,
      day = d.getDate(),
      year = d.getFullYear();
  
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;
    if (min < 10) min = '0' + min;
  
    return `${year}${seperator}${month}${seperator}${day} ${hour}:${min}:${sec}`;
  }

  /**
   * @author odin
   * @description 將傳入的秒數轉換成 XX:XX:XX (時分秒)
   * @param {number} seconds 傳入的秒數
   * @return {string} XX:XX:XX or XX:XX
   */
  function formatSeconds(seconds) {
    let sec = parseInt(seconds); // 秒
    let min = 0; // 分
    let hour = 0; // 小時
    let secString, minString, hourString;

    if (sec > 60) {
      min = parseInt(sec / 60);
      sec = parseInt(sec % 60);
      if (min > 60) {
        hour = parseInt(min / 60);
        min = parseInt(min % 60);
      }
    }

    secString = parseInt(sec) < 10 ? '0' + parseInt(sec) : parseInt(sec);

    minString = parseInt(min) < 10 ? '0' + parseInt(min) : parseInt(min);

    hourString = parseInt(hour) > 0 ? parseInt(hour) + ':' : '';

    return `${hourString}${minString}:${secString}`;
  }

  /**
   * @author odin
   * @class time
   * @description 設定這個 timer 的倒數
   * @param {Number} seconds 要倒數的總秒數
   * @param {Function} watch 每秒在倒數的時候要執行的function
   * @param {Function} callback 全部倒數完要做的function
   * @example init => let a = timer(180, watchFunc, callbackFunc);
   * @example stop => a.stop();
   * @example start => a.start();
   * @example stop and execute the callback function => a.shutdown();
   */
  function timer(seconds, watch, callback) {
    let countingSeconds = seconds;
    let timer;

    function start() {
      timer = setInterval(function () {
        // 倒數
        countingSeconds -= 1;
        // console.log('countingSeconds', countingSeconds);

        // 監聽
        if(watch instanceof Function) {
          watch();
        }
        // 倒數結束
        if(countingSeconds === 0) {
          stop();

          if(callback instanceof Function) {
            callback();
          }

        }
      }, 1000);
    }

    function stop() {
      clearInterval(timer);
    }

    function shutdown(){
      clearInterval(timer);
      if(callback instanceof Function) {
        callback();
      }
    }

    start();

    return {
      start,
      stop,
      shutdown
    }
  }



  return {
    getNowDateObj,
    getSpecificDateObj,
    getSpecificTimeStamp,
    formatDate,
    formatDateTime,
    formatSeconds,
    changeDate,
    timer
  };
})();

/**
 * @author odin
 * @description Tools For specific function
 */

odin.tools = (function () {
  /**
   * @author odin
   * @class tools
   * @description 複製文字到剪貼簿中
   * @param {string} id Dom id, this Dom contains the content that we want to copy to the clipboard
   * @param {string} msg after copy done, show the message
   */
  function copyTextToClipboard(id, msg) {
    var TextRange = document.createRange();

    TextRange.selectNode(document.getElementById(id));

    sel = window.getSelection();

    sel.removeAllRanges();

    sel.addRange(TextRange);

    document.execCommand('copy');

    alert(msg ? msg : 'copied!');
  }

  /**
   * @author odin
   * @class tools
   * @description 複製文字到剪貼簿中
   * @param {string} str 要複製到剪貼簿中的文字內容
   */
  function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  /**
   * @author odin
   * @class tools
   * @description Prevent XSS from getting the html input data
   * @param {string} str
   * @returns {string} Transformed string without XSS attack
   */
  function convertHTMLXSS(str) {
    var strArr = str.split('');
    var resultArr = strArr.map(function (character) {
      return character
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    });

    return resultArr.join('');
  }

  /**
   * @author odin
   * @class tools
   * @description Convert 886 mobile phone to the 09XXXXXXXX
   * @param {number} num input phone number
   * @returns {number} Transformed phone number
   */
  function mphoneNormalized(num) {
    num = num.toString();
    // 去886
    if (num.length > 5 && num.indexOf('886') === 0) {
      num = num.substr(3);
    }
    // 加0
    if (num.indexOf('9') === 0) {
      num = '0' + num;
    }
    return num;
  }

  /**
   * @author odin
   * @class tools
   * @description 全形轉半形程式
   * @param val string 傳入要轉換的字串 required
   * @param trimSpace bool => 去除 space, default true
   * @param trimDash bool => 去除 dash - , default true
   */
  function fullToHalf(val, trimSpace, trimDash) {
    var value = val || '',
      result = '',
      i;

    for (i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === 12288) {
        result += ' ';
      } else if (value.charCodeAt(i) > 65280 && value.charCodeAt(i) < 65375) {
        result += String.fromCharCode(value.charCodeAt(i) - 65248);
      } else {
        result += String.fromCharCode(value.charCodeAt(i));
      }
    }

    if (trimSpace || true) result = result.replace(/ /g, '');

    if (trimDash || true) result = result.replace(/-+/g, '');

    return result;
  }

  /**
   * @author odin
   * @class tools
   * @description
   * @param {array} attrs - 屬性陣列
   * @example
   *  [
   *      {
   *          name: 'aaa',
   *          value: 'bbb'
   *      },
   *      {
   *          name: 'ccc',
   *          value: 'ddd'
   *      },
   *  ]
   * @param {Element} ele - 目標DOM元素
   * @returns {Element} element with attrs
   */
  function _setAttrs(ele, attrs) {
    if (Array.isArray(attrs) === false) {
      attrs = [attrs];
    }

    attrs.map(function (attr) {
      ele.setAttribute(attr.name, attr.value);
    });

    return ele;
  }

  /**
   * @author odin
   * @class tools
   * @description 全螢幕顯示
   * @param {Dom} Dom 需要被全螢幕顯示的Dom
   */
  function fullScreen() {
    console.log("fullScreen!");

    if (!checkFullScreen() && Dom.requestFullscreen) {
        Dom.requestFullscreen();
    } else if (!checkFullScreen() && Dom.mozRequestFullScreen) { /* Firefox */
        Dom.mozRequestFullScreen();
    } else if (!checkFullScreen() && Dom.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        Dom.webkitRequestFullscreen();
    } else if (!checkFullScreen() && Dom.msRequestFullscreen) { /* IE/Edge */
        Dom.msRequestFullscreen();
    }

    if (checkFullScreen() && !Dom.requestFullscreen) {
        Dom.exitFullscreen();
    } else if (checkFullScreen() && !Dom.mozRequestFullScreen) { /* Firefox */
        Dom.mozCancelFullScreen();
    } else if (checkFullScreen() && !Dom.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        Dom.webkitCancelFullScreen();
    } else if (checkFullScreen() && !Dom.msRequestFullscreen) { /* IE/Edge */
        Dom.msExitFullscreen();
    }
  }

    /**
   * @author odin
   * @class tools
   * @description 確認是否為全螢幕顯示
   * @retunr boolean
   */
  function checkFullScreen() {
    let isFull = false;

    if (
      (document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled) &&
      window.innerWidth == screen.width &&
      window.innerHeight == screen.height
    ) {
      isFull = true;
    }

    return isFull;
  }

  return {
    copyTextToClipboard,
    copyToClipboard,
    convertHTMLXSS,
    mphoneNormalized,
    fullToHalf,
    _setAttrs,
    fullScreen,
    checkFullScreen,
  };
})();

/**
 * @author odin
 * @description Tools For web moving
 */

odin.actions = (function () {
  /**
   * @author odin
   * @class actions
   * @description Go to Top
   * @param {number} duration 毫秒(1000 == 1秒), required
   */
  function goTop(duration) {
    // cancel if already on top
    if (document.scrollingElement.scrollTop === 0) return;

    const totalScrollDistance = document.scrollingElement.scrollTop;
    let scrollY = totalScrollDistance,
      oldTimestamp = null;

    function step(newTimestamp) {
      if (oldTimestamp !== null) {
        // if duration is 0 scrollY will be -Infinity
        scrollY -=
          (totalScrollDistance * (newTimestamp - oldTimestamp)) / duration;
        if (scrollY <= 0) return (document.scrollingElement.scrollTop = 0);
        document.scrollingElement.scrollTop = scrollY;
      }
      oldTimestamp = newTimestamp;
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  return {
    goTop,
  };
})();

/**
 * @author odin
 * @description Tools For ajax
 */

odin.proxy = (function () {
  /**
   * @author odin
   * @class proxy
   * @description Send a GET request to specific URL
   * @param {string} url request URL
   */
  function get(url) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();

      // 定義方法
      req.open('GET', url);

      req.onload = function () {
        if (req.readyState == 4 && req.status == '200') {
          // 成功要做的事情
          resolve(req.respone);
        } else {
          // 失敗要做的事情
          reject(req);
        }
      };

      // 送出請求
      req.send();
    });
  }

  /**
   * @author odin
   * @class proxy
   * @description Encoded object data to string
   * @param {object} data The data desired to be encoded, eg. {c: 3, a :2} => "c=3&a=2"
   */
  function encodeFormData(data) {
    if (!data) return ''; // 如果傳入為空，直接返回字符串
    var pairs = []; // 保存名/值對
    for (var name in data) {
      // 進行遍歷
      if (!data.hasOwnProperty(name)) continue; // 跳過繼承屬性,指示自身的屬性是否具有該值
      if (typeof data[name] === 'function') continue; // 跳過方法
      var value = data[name].toString(); // 將值轉換成字符串
      name = encodeURIComponent(name.replace('%20', '+'));
      value = encodeURIComponent(value.replace('%20', '+'));
      pairs.push(name + '=' + value); // 記住名值對
    }
    return pairs.join('&');
  }

  /**
   * @author odin
   * @class proxy
   * @description Send a POST request to specific URL
   * @param {string} url request URL
   * @param {string || object} data The data have to be sent to back-end
   * @param {boolean} isJsonType This data is sent by json or encoded string, true === json, false === encoded string
   */
  function post(url, data, isJsonType) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();

      // 定義方法
      req.open('POST', url);

      // 定義 Content-type
      req.setRequestHeader(
        'Content-type',
        isJsonType
          ? 'application/json;charset=UTF-8'
          : 'application/x-www-form-urlencoded',
      );

      req.onload = function () {
        if (req.readyState == 4 && req.status == '200') {
          // 成功要做的事情
          resolve(req.respone);
        } else {
          // 失敗要做的事情
          reject(req);
        }
      };

      // 送出請求
      req.send(isJsonType ? data : encodeFormData(data));
    });
  }

  /**
   * @author odin
   * @class proxy
   * @description 封裝 async/await 的包裝
   * @param {promise} promise promise function
   * @param {function} finallyFunc 結束之後一定會執行的 function
   * @see https://cythilya.github.io/2020/07/22/cleaner-async-javascript-code-without-the-try-catch-mess/
   * @example
   *  async function detectALotOfThings() {
        const [errorA, dataA] = await safeAwait(detectSomethingA(), sayHi);
        const [errorB, dataB] = await safeAwait(detectSomethingB());

        if(errorA) {
          // detectSomethingA error Handling
        }

        if(errorB) {
          // detectSomethingB error Handling
        }
      }
   */
  function safeAwait(promise, finallyFunc) {
    const nativeExceptions = [
      EvalError,
      RangeError,
      ReferenceError,
      SyntaxError,
      TypeError,
      URIError,
    ].filter((except) => typeof except === 'function');

    function throwNative(error) {
      for (const Exception of nativeExceptions) {
        if (error instanceof Exception) throw error;
      }
    }

    return promise
      .then((data) => {
        if (data instanceof Error) {
          throwNative(data);
          return [data];
        }
        return [undefined, data];
      })
      .catch((error) => {
        throwNative(error);
        return [error];
      })
      .finally(() => {
        if (finallyFunc && typeof finallyFunc === 'function') {
          finallyFunc();
        }
      });
  }

  /**
   * @author odin
   * @class proxy
   * @description Parses an HTTP Cookie header string, returning an object of all cookie name-value pairs.
   * @param {string} str HTTP Cookie header string
   * @return {object} // { foo: 'bar', equation: 'E=mc^2' }
   * @example parseCookie('foo=bar; equation=E%3Dmc%5E2');
   */
  function parseCookie(str) {
    return str
            .split(';')
            .map(v => v.split('='))
            .reduce((acc, v) => {
              acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
              return acc;
            }, {});
  }

  /**
   * @author odin
   * @class proxy
   * @description Parses an HTTP Cookie header string, returning an object of all cookie name-value pairs.
   * @param {string} name cookie attr keyName
   * @param {string} val cookie attr value
   * @return {string} // 'foo=bar'
   * @example serializeCookie('foo', 'bar');
   */
  function serializeCookie(name, val) {
    return `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
  }

  return {
    get,
    encodeFormData,
    post,
    safeAwait,
    parseCookie,
    serializeCookie,
  };
})();

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
 * @description Tools For ES6
 */

odin.es6 = (function () {
  /**
   * @author odin
   * @class es6
   * @description Convert an Array - like object to a real Array.
   * @param {array / array-like list} list
   * @param {boolean} isNeedToCutTheSameValue Cut the same value among of the array or array like list
   * @returns {array} array
   */
  function arrLikeToArray(list, isNeedToCutTheSameValue) {
    return isNeedToCutTheSameValue
      ? Array.from(new Set(list))
      : Array.from(list);
  }

  /**
   * @author odin
   * @class es6
   * @description find the max value among of input array
   * @param {array} arr - input array
   * @returns {number} max number
   */
  function max(arr) {
    return Math.max(...arr);
  }

  /**
   * @author odin
   * @class es6
   * @description find the min value among of input array
   * @param {array} arr - input array
   * @returns {number} min number
   */
  function min(arr) {
    return Math.min(...arr);
  }

  /**
   * @author odin
   * @class es6
   * @description Shallow copy of array or object
   * @param {array / object} val input data of type object
   * @returns {array / object} array / object
   */
  function shallowCopy(val) {
    return Object.assign(val);
  }

  /**
   * @author odin
   * @class es6
   * @description Get the average from arguments
   * @param {number / array - like} arguments Series of numbers
   * @returns {number} average
   */
  function average(...nums) {
    return nums.reduce((acc, val) => acc + val, 0) / nums.length;
  }

  /**
   * @author odin
   * @class es6
   * @description Get the total from arguments
   * @param {number / array - like} arguments Series of numbers
   * @returns {number} total
   */
  function total(...nums) {
    return nums.reduce((acc, val) => acc + val, 0);
  }

  /**
   * @author odin
   * @class es6
   * @description Template Literals -- Prevent XSS from getting the html input data
   * @param {Template Literals} TemplateLiterals
   * @returns {string} Transformed string without XSS attack
   */
  function convertHTMLXSS(strings, ...keys) {
    return strings
      .map(
        (str, i) =>
          `${str}${
            keys[i]
              ? `${keys[i]
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#x27;')
                  .replace(/\//g, '&#x2F;')}`
              : ''
          }`,
      )
      .join('');
  }

  /**
     * @author odin
     * @class es6
     * @description Get the specific html attributes string
     * @param {object} obj* 
     * @example {
                    'id': 'abc',
                    'class': '',
                    'data-gg': 'sss'
                }
     * @returns {string} String with html attributes
     */
  function getAttributeString(obj) {
    return odin.helper
      .getObjKeyNameToArray(obj)
      .map((keyName) => ` ${keyName}="${obj[keyName]}"`)
      .join('');
  }

  /**
     * @author odin
     * @class es6
     * @description Get the specific attrs object for the Template Literals
     * @param {object} tagDetail 
     * @example {
                    'tagType': 'span',
                    'attributes': {
                        'id': 'abc',
                        'class': '',
                        'data-gg': 'sss'
                    }
                }
     * @returns {string} string
     */
  function TagAttr(obj) {
    this.tagDetail = obj;
  }

  /**
     * @author odin
     * @class es6
     * @description Add Specific HTML Tag to ${}
     * @param {Template Literals} TemplateLiterals 
     * @returns {string} string with tagged
     * @example
     *
        const obj = {
            tagType: 'span',
            attributes: {
                id: 'abc',
                class: '',
                'data-gg': 'sss',
            },
        };

        // 產生實體，並帶入參數
        const addTag = new odin.es6.TagAttr(obj);

        const name = 'odin';
        const age = 27;
        addTag.addHighLightTag `我是${name},我今年${age}歲`;
    */
  TagAttr.prototype.addHighLightTag = function (strings, ...arg) {
    // console.log('this', this);
    // console.log(strings, ...arg);
    const tagDetail = this.tagDetail;
    return strings
      .map(
        (str, i) =>
          `${str} ${
            arg[i]
              ? `<${tagDetail.tagType}${getAttributeString(
                  tagDetail.attributes,
                )}>${arg[i]}</${tagDetail.tagType}>`
              : ''
          }`,
      )
      .join('');
  };

  /**
   * @author odin
   * @class es6
   * @description 產生單獨唯一的值
   * @type generator
   * @returns {function} generator
   */
  function* idMaker(){
    let i = 0
    while(i++ < i)
      yield Symbol(i)
  }

  return {
    arrLikeToArray,
    max,
    min,
    shallowCopy,
    average,
    total,
    convertHTMLXSS,
    getAttributeString,
    TagAttr,
    idMaker,
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

  return {
    checkEmail,
    checkCellphone,
    checkSameContent,
  };
})();

/**
 * @author odin
 * @description Fun Js
 */

odin.fun = (function () {
  /**
   * @author odin
   * @class fun
   * @description Helping printStar
   * @param {number} num The value we want to make the stars line.
   */
  function judgeNum(num) {
    var flag = false,
      count = 0;
    var data = 0;
    var a = {};

    if (num & 1 && num >= 7) {
      for (var i = 1; ; i++) {
        //判斷num能否滿足奇數迴文數之和
        var listNum = i * i * 2 + 4 * i + 1;
        var maxNum = (i + 1) * (i + 1) * 2 + 4 * (i + 1) + 1;
        //如果在滿足數列中
        if (num == listNum) {
          flag = true;
          count = i;
          break;
        } else if (listNum < num && num < maxNum) {
          //找出小於num數的最大滿足條件值
          data = num - listNum;
          //將差值賦值給a.data
          a.data = data;
          flag = true;
          count = i;
          break;
        }
      }
    } else {
      alert('請輸入正確格式數字');
      data = num;
    }

    a.flag = flag;
    a.count = count;
    return a;
  }

  /**
   * @author odin
   * @class fun
   * @description Get the result variable
   */
  function result(num, str1, str2) {
    if (num === 1) {
      console.log('*');
      return;
    } else {
      var flag = judgeNum(num).flag || 0;
      var count = judgeNum(num).count * 2 + 1;
      var data = judgeNum(num).data;
      var emp, start;
      if (flag) {
        for (var i = 0; i < count; i++) {
          emp = count - (count - i);
          start = count - i * 2;
          var strItem = '';
          if (start < 0) {
            emp = count - i - 1;
            start = Math.abs(start) + 2;
          }

          for (var j = 0; j < emp; j++) {
            strItem += str1;
          }
          //打印
          for (var m = 0; m < start; m++) {
            strItem += str2;
          }
          // //打印後一部分空格
          for (var n = 0; n < emp; n++) {
            strItem += str1;
          }
          //換行
          console.log(strItem + '\n');
        }
      }
      //如果存在差值則打印出差值
      if (data) {
        // document.write(data);
        console.log(data);
      }
    }
  }

  /**
   * @author odin
   * @class fun
   * @description Maxmum Stars at Start and End
   */
  function printStar(stars) {
    if (typeof stars === 'number' && stars % 2 === 1) {
      var totalStar = 0;
      var loopLength = parseInt(stars / 2) + 1;

      for (var i = 0; i < loopLength; i++) {
        if (stars === 1) {
          totalStar += 1;
        } else {
          totalStar += stars * 2;
          stars -= 2;
        }
      }

      console.log('totaStalr', totalStar);

      result(totalStar, ' ', '*');
    } else {
      alert('請輸入奇數數字');
    }
  }

  const morseCode = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',  J: '.---',  K: '-.-',  L: '.-..', M: '--',
    N: '-.',  O: '---', P: '.--.',  Q: '--.-',  R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',  Y: '-.--', Z: '--..', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----', ' ': ' '
  }

  /**
   * @author odin
   * @class fun
   * @param {string} text 字串(可包含空白)
   * @description 將字串翻譯成摩斯密碼
   * @return {string} ..|..
   */
  function translateToMorse (string) {
    return string.toUpperCase().split('').map(letter => morseCode[letter]).join('|');
  }

  /**
   * @author odin
   * @class fun
   * @param {string} code 字串(必須用 | 分隔兩個密碼)
   * @description 將密碼翻譯成英文原文
   * @return {string} 
   */
  function translateToAlphabets (code) {
    const morseReverseObject = {};
    Object.keys(morseCode).forEach(key => {
      morseReverseObject[morseCode[key]] = key;
    })

    return code.split('|').map(letter => morseReverseObject[letter]).join('');
  }

  return {
    printStar,
    translateToMorse,
    translateToAlphabets,
  };
})();

/**
 * @author odin
 * @description About color
 */
odin.color = (function () {
  /**
   * @author odin
   * @class color
   * @param {string} rgbStr -- color string
   * @description Converts an rgb() color string to an object with the values of each color.
   * @return {object} 'hsl(50,10%,10%)' => { hue: 50, saturation: 10, lightness: 10 }
   */
  function toRGBObject(rgbStr) {
    const [red, green, blue] = rgbStr.match(/\d+/g).map(Number);
    return { red, green, blue };
  }

  /**
   * @author odin
   * @class color
   * @param {string} hslStr -- color string
   * @description Converts an hsl() color string to an object with the values of each color.
   * @return {object} 'hsl(50,10%,10%)' => { hue: 50, saturation: 10, lightness: 10 }
   */
  function toHSLObject(hslStr) {
    const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number);
    return { hue, saturation, lightness };
  }

  /**
   * @author odin
   * @class color
   * @param {string} hslStr -- color string
   * @description Converts an hsl() color string to an array of values.
   * @return {array} 'hsl(50,10%,10%)' => [50, 10, 10]
   */
  function toHSLArray(hslStr) {
    return hslStr.match(/\d+/g).map(Number);
  }

  /**
   * @author odin
   * @class color
   * @param {string} rgbStr -- color string
   * @description Converts an rgb() color string to an array of values.
   * @return {array} 'rgb(255,12,0)' => [255, 12, 0]
   */
  function toRGBArray(rgbStr) {
    return rgbStr.match(/\d+/g).map(Number);
  }

  return {
    toRGBObject,
    toHSLObject,
    toHSLArray,
    toRGBArray,
  };
})();

/**
 * @author odin
 * @description CSS Related
 */

odin.css = (function () {
  /**
   * @author odin
   * @class css
   * @param {css stylesheet} css -- css style
   * @description Injects the given CSS code into the current document
   * @example injectCSS('body { background-color: #000 }');
   */
  function injectCSS(css) {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
  }

  /**
   * @author odin
   * @class css
   * @param {Dom} el -- Specific Element Dom
   * @param {string} className -- Specific className
   * @description Checks if the given element has the specified class.
   * @return {boolean} true | false
   * @example hasClass(document.querySelector('p.special'), 'special'); // true
   */
  function hasClass(el, className) {
    return el.classList.contains(className);
  }

  /**
   * @author odin
   * @class css
   * @param {Dom} el -- All Elements have to be shown
   * @description Show all the elements specified.
   * @example show(...document.querySelectorAll('img'));
   */
  function show(...el) {
    [...el].forEach(e => (e.style.display = '');
  }

  /**
   * @author odin
   * @class css
   * @param {Dom} el -- All Elements have to be hide
   * @description Hide all the elements specified.
   * @example hide(document.querySelectorAll('img')); // Hides all <img> elements on the page
   */
  function hide(...el) {
    [...el].forEach(e => (e.style.display = 'none');
  }

  /**
   * @author odin
   * @class css
   * @param {Dom} el -- Specific Element want to be know the value of specific rule name
   * @description Retrieves the value of a CSS rule for the specified element.
   * @example getStyle(document.querySelector('p'), 'font-size'); // '16px'
   */
  function getStyle(el, ruleName) {
    return getComputedStyle(el)[ruleName];
  }

  return {
    injectCSS,
    hasClass,
    show,
    hide,
    getStyle
  };
})();

/**
 * @author odin
 * @description algorithm
 */

odin.algorithm = (function () {

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @description 快速排序陣列中的數字，隨便找一個值當作 pivot，比 pivot 小的放左邊的陣列，大的就放右邊的陣列，之後左右兩邊的陣列在個字做一次這種比較，直到陣列只剩兩個，排序完之後就可以得到排序過後的陣列
   * @example quickSort([4,2,3,3]) => [1,2,3,4]
   */
  function quickSort(arr) {
    if (arr.length < 2) return arr
    const [p, ...ary] = arr
    const left = [], right = []
  
    ary.forEach(c => {
      if (c < p) left.push(c)
      else right.push(c)
    })
  
    return [...quickSort(left), p, ...quickSort(right)]
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @param {number} index1 -- 要交換的第一個數字的索引
   * @param {number} index2 -- 要交換的第二個數字的索引
   * @description 交換用的function
   */
  function swap(arr, index1, index2){
    // 要先把第一個值存下來
    let tmpValue = arr[index1];
    arr[index1] = arr[index2]
    // 假如這邊寫 array[index2] = array[index1]; 那兩個值會是一樣的
    arr[index2] = tmpValue;
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @description Buble Sort -- 一次只比兩個，比較小的放前面，比較大的放後面
   */
  function bubbleSort(arr) {

    let len = arr.length
    let count = 0;

    // 總共比 n -1 輪
    for(let j = 0; j < len - 1; j++){
      // 比較次
      for(let i = 0; i< len - j - 1; i++){
        count ++;
        if(arr[i + 1] < arr[i]){
          swap(arr, i, i + 1)
        }
      }
    }

    console.log(count)
    return arr;
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @description Selection Sort -- 每次選定從第一個開始的數值當基準值，遍歷整個陣列找出目前最小的值，並且跟第一個位置的數字交換位置，之後第二次則拿第二個值開始比較剩餘的陣列，如此不斷重複排序
   */
  function selectionSort(arr){
    let len = arr.length;
    let indexMin;
    // 總共比 n -1 輪
    for(let j = 0; j < len - 1; j++){
      indexMin = j;
      // 比較次
      for(let i = j; i < len; i++){
        if(arr[indexMin] > arr[i]){
          indexMin = i
        }
      }
      // 比完這一輪才交換
      swap(arr, j, indexMin)
    }
    return arr;
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @description Insert Sort -- 一開始排序好前面兩個順序，之後只再取一個進行排序到對的位置，才取下一個
   */
  function insertSort(arr){
    let len = arr.length
    let count = 0;
  
    // 總共比 n -1 輪
    for(let j = 0; j < len - 1; j++){
      // 比較次
      for(let i = j + 1; i > 0 ; i--){
        count ++;
        if(arr[i] < arr[i - 1]){
          swap(arr, i - 1, i)
        }
      }
    }
    console.log(count)
    return arr;
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 包含純數字的陣列
   * @description Merge Sort -- 先把陣列切成一個陣列只有一個內容，之後再跟每個陣列中第一個值比較，小的就放前面
   */
  function mergeSort(arr) {
    /**
     * @author odin
     * @class Merge Sort
     * @param {Array} left -- 左邊的陣列
     * @param {Array} right -- 右邊的陣列
     * @description 合併分開的陣列
     */
    function merge(left, right){
      const result = [];
    
      let il = 0; // record the left position
      let ir = 0; // record the right position
      
      while(il < left.length && ir < right.length){
      
        // 哪邊值比較小就加入進 result
        if(left[il] < right[ir]){
          result.push(left[il]);
          il ++;
        }else{
          result.push(right[ir]);
          ir ++;
        }
      }

      // 只剩左邊陣列就直接加入 result
      while(il < left.length){
        result.push(left[il]);
        il ++;
      }

      // 只剩右邊陣列就直接加入 result
      while(ir < right.length){
        result.push(right[ir]);
        ir ++;
      }

      return result;
    }

    /**
     * @author odin
     * @class Merge Sort
     * @param {Array} array -- 要排序的陣列
     * @description 合併分開的陣列
     */
    function mergeSlice(array){
      const len = array.length;

      // 如果只剩一個值就不用切了
      if( len === 1){
        return array;
      }

      const mid = Math.floor(len/2);
      const leftArray = array.slice(0, mid);
      const rightArray = array.slice(mid, len);

      // 這邊用遞迴一直切切到最後才會一個一個合併
      return merge(mergeSlice(leftArray), mergeSlice(rightArray))
    }

    return mergeSlice(arr);
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} arr -- 排序過後的 array
   * @description Binary Search -- 先從中間找，如果中間目標的內容不符合目標，則比對目前中間值比較，比較大則往左找，比較小則往右找，直到找到為止。
   */
  function binarySearch(arr, target) {
    // 這邊都以 index 為單位
    let start = 0;
    let end = arr.length - 1;
    let mid;

    while (start <= end) {
      //  從中間開始切
      mid = Math.floor((start + end) / 2);
      if (target < arr[mid]) {
        // 往左找
        end = mid - 1;
      } else if (target > arr[mid]) {
        // 往右找
        start = mid + 1;
      } else {
        return mid;
      }
    }
  
    // 如果上面都不符合代表找不到
    return -1;
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} coins -- 硬幣的面額陣列
   * @param {number} amount -- 要達到的金額
   * @description 利用給定的硬幣面額陣列，找出使用最少面額的硬幣數量就能達到給定的金額，如果沒有辦法達到則回傳-1
   * @description [LeetCode #322]
   * @return {number}
   */
  function coinChange(coins, amount) {
    if(!amount || coins.length === 0) {
      return 0;
    }
  
    let out = [0];
    let i, l;
    let index = 1;
  
    while(!out[amount]) {
      out[index] = Infinity;
  
      for(i=0, l=coins.length; i<l; i++) {
  
        if(coins[i] <= index) {
          out[index] = Math.min(out[index], 1 + out[index - coins[i]])
        }
  
      }
  
      index++;
    }
  
    return out[amount] === Infinity ? -1 : out[amount];
  }

  /**
   * @author odin
   * @class algorithm
   * @param {array} numbers -- 給定的排序好的整數陣列
   * @param {number} target -- 目標數值
   * @description [LeetCode ] 167. Two Sum II - Input array is sorted
   * @description 找到陣列中兩個相加的數字剛好等於給定的目標數值，並用陣列印出包含該兩個數值的位置分別是在陣列中的第幾個(非index)
   * @return {number}
   */
  function twoSum(numbers, target) {
    let pointer = 0;
    let ind = numbers.lemgth - 1;

    while(target !== numbers[pointer] + numbers[ind]) {
      target > numbers[pointer] + numbers[ind] ? pointer++ : ind--;
    }

    retrun [pointer+1, ind+1];
  }

  return {
    quickSort,
    bubbleSort,
    selectionSort,
    insertSort,
    mergeSort,
    binarySearch,
    coinChange,
    twoSum
  };
})();

/**
 * @author odin
 * @description Strange Js
 */

odin.bats = (function () {
  /**
   * @author odin
   * @class bats
   * @description Show all list about the js
   */
  function showList() {
    const table = {
      bats1: 'typeof(NaN)',
      bats2: '9999999999999999',
      bats3: '0.1+0.2 == 0.3',
      bats4: 'Math.max()',
      bats5: 'Math.min()',
      bats6: '[]+[]',
      bats7: '[]+{}',
      bats8: '{}+[]',
      bats9: 'true+true+true===3',
      bats10: 'true-true',
      bats11: 'true===1',
      bats12: '(!+[]+[]+![])',
      bats13: '9+"1"',
      bats14: '91-"1"',
      bats15: '[]==0',
      bats16: '"1"/0',
      bats17: '0/0',
      bats18: '0/1',
      bats19: 'Infinity/Infinity',
      bats20: '9007199254740991 + 1 === 9007199254740991 + 2',
      bats21: 'Number.MAX_SAFE_INTEGER',
      bats22: 'Number.MIN_SAFE_INTEGER',
    };
    console.table(table);
  }

  function bats1() {
    console.log(typeof NaN);
  }

  function bats2() {
    console.log(9999999999999999);
  }

  function bats3() {
    console.log(0.1 + 0.2 == 0.3);
  }

  function bats4() {
    console.log(Math.max());
  }

  function bats5() {
    console.log(Math.min());
  }

  function bats6() {
    console.log([] + []);
  }

  function bats7() {
    console.log([] + {});
  }

  function bats8() {
    console.log({} + []);
  }

  function bats9() {
    console.log(true + true + true === 3);
  }

  function bats10() {
    console.log(true - true);
  }

  function bats11() {
    console.log(true === 1);
  }

  function bats12() {
    console.log(!+[] + [] + ![]);
  }

  function bats13() {
    console.log(9 + '1');
  }

  function bats14() {
    console.log(91 - '1');
  }

  function bats15() {
    console.log([] == 0);
  }

  function bats16() {
    console.log('1' / 0);
  }

  function bats17() {
    console.log(0 / 0);
  }

  function bats18() {
    console.log(0 / 1);
  }

  function bats19() {
    console.log(Infinity / Infinity);
  }

  function bats20() {
    console.log(9007199254740991 + 1 === 9007199254740991 + 2);
  }

  function bats21() {
    console.log(Number.MAX_SAFE_INTEGER);
  }

  function bats22() {
    console.log(Number.MIN_SAFE_INTEGER);
  }

  return {
    showList,
    bats1,
    bats2,
    bats3,
    bats4,
    bats5,
    bats6,
    bats7,
    bats8,
    bats9,
    bats10,
    bats11,
    bats12,
    bats13,
    bats14,
    bats15,
    bats16,
    bats17,
    bats18,
    bats19,
    bats20,
    bats21,
    bats22,
  };
})();

/**
 * @author odin
 * @description Tool to manipulate Javascript Set Data
 */

odin.set = (function() {

  /**
   * @author odin
   * @class set
   * @param {set} 多個 set
   * @description 聯集所有傳進來的set
   */
  function unionSets(...sets) {
    let arr = [];
    sets.forEach(item => {
      arr.push(...item)
    });
    return new Set(arr);
  }

  /**
   * @author odin
   * @class set
   * @param {set} firstSet
   * @param {set} otherSet
   * @description 回傳兩個集合中共同有的元素
   */
  function intersectionSets(firstSet, otherSet) {
    // store intersectionSet 
    let intersectionSet = new Set();
    firstSet.forEach(i => {
        if(otherSet.has(i) == true){
            intersectionSet.add(i)
        }
    })
    // get the same value
    return intersectionSet;   
  }

  /**
   * @author odin
   * @class set
   * @param {set} firstSet
   * @param {set} otherSet
   * @description 回傳兩個集合的元素但不包含重覆元素
   */
  function differenceSets(firstSet, otherSet) {
    // store union
    let differenceSet = union(firstSet, otherSet);
    let intersectionSet = intersection(firstSet, otherSet);
    differenceSet.forEach(i => {
        if(intersectionSet.has(i) == true){
            differenceSet.delete(i)
        }
    })
    
    return differenceSet;
  }

  /**
   * @author odin
   * @class set
   * @param {set} firstSet
   * @param {set} otherSet
   * @description 回傳兩個集合的元素但不包含重覆元素
   */
  function subtractingSets(firstSet, otherSet) {
    let subtractingSet = new Set([...firstSet]);
    otherSet.forEach(i => {
        if(subtractingSet.has(i) == true){
            subtractingSet.delete(i)
        }
    })
    return subtractingSet;
  }

  /**
   * @author odin
   * @class set
   * @param {Array} arr
   * @description 檢查該陣列是否有重複的值
   * @returns {boolean}
   */
  function containsDuplicate(arr) {
    return new Set(nums).size < nums.length;
  }

  return {
    unionSets,
    intersectionSets,
    differenceSets,
    subtractingSets,
    containsDuplicate,
  };
})();

/**
 * @author odin
 * @description Demostration to get data from different mode
 */

odin.mode = (function() {

  // feelings: http://demo.nimius.net/debounce_throttle/
  // codepen: https://codepen.io/hannahpun/pen/LqMjQR?editors=1011

  /**
   * @author odin
   * @class mode
   * @param {function} func - callbackFunc
   * @param {number} delay - 要延遲幾秒執行
   * @description 代理模式 -- 等到最後一次function被觸發的時候，才開始計算timeout，等到timeout結束才抓取資料。
   */
  function debounce(func, delay){
    // timeout 初始值
    let timeout = null;
    return function(){
      let context = this;  // 指向 myDebounce 這個 input
      let args = arguments;  // KeyboardEvent
      clearTimeout(timeout)

      timeout = setTimeout(function(){
        func.apply(context, args)
      }, delay)
    }
  }

  /**
   * @author odin
   * @class mode
   * @param {function} func - callbackFunc
   * @param {number} delay - 要延遲幾秒執行
   * @description 代理模式 -- function 被觸發第一次之後設定 timeout，就算在這段時間觸發該function，也不會執行內容，直到timeout結束為止才會在執行另一次。
   */
  function throttle(func, delay){
    let inThrottle;
    let timeout = null;
    return function(){
      let context = this;
      let args = arguments;
      if(!inThrottle){
        // 輸入之後兩秒內都不回進入這邊
        func.apply(context, args)
        inThrottle = true;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          inThrottle = false
        }, delay)
      }
    }
  }

  return {
    debounce,
    throttle,
  }
})();

/**
 * @author odin
 * @description LeetCode 解法
 */

odin.leetcode = (function() {

  /**
   * @author odin
   * @class leetcode
   * @title 7. Reverse Integer
   * @link https://leetcode.com/problems/reverse-integer
   * @param {number} x
   * @return {number}
   */
  var reverse = function (x) {
    if (x === 0) return x;

    let max = Math.pow(2, 31);
    let s = x > 0 ? 1 : -1;
    let r = 0;
    x = Math.abs(x);

    while (x != 0) {
      r = r * 10 + (x % 10);
      x = Math.floor(x / 10);
    }

    if (r > max || r < max * -1) {
      return 0;
    } else {
      return r * s;
    }
  };

  /**
   * @author odin
   * @class leetcode
   * @title 9. Palindrome Number
   * @link https://leetcode.com/problems/palindrome-number/
   * @param {number} x
   * @return {number}
   */
  var isPalindrome = function (x) {
    if (x < 0) return false;
    let dig = 1;

    while (x / dig >= 10) {
      dig *= 10;
    }

    while (x > 0) {
      let f = Math.floor(x / dig);
      let e = x % 10;
      if (f !== e) return false;

      x = Math.floor((x % dig) / 10);
      dig = dig / 100;
    }

    return true;
  };

  return {
    reverse,
    isPalindrome
  }
 })();