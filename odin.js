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
        return o === undefined || o === null
    }

    /**
     * @author odin
     * @class helpers
     * @description Checking the para is NOT undefined or null.
     * @param {any} o The value we want to check.
     * @returns {boolean} true or false
     */
    function isDef(o) {
        return o !== undefined && o !== null
    }

    /**
     * @author odin
     * @class helpers
     * @description Checking the para is TRUE(boolean).
     * @param {any} o The value we want to check.
     * * @returns {boolean} true or false
     */
    function isTrue(o) {
        return o === true
    }

    /**
     * @author odin
     * @class helpers
     * @description Checking the para is FALUSE(boolean).
     * @param {any} o The value we want to check.
     * @returns {boolean} true or false
     */
    function isFalse(o) {
        return o === false
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
        )
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
        return _toString.call(val).slice(8, -1)
    }

    /**
     * @author odin
     * @class helpers
     * @description  Strict object type check.Only returns true for plain JavaScript objects.
     * @param {any} val The value we want to check.
     * @returns {boolean} true or false
     */
    function isPlainObject(val) {
        return _toString.call(val) === '[object Object]'
    }

    /**
     * @author odin
     * @class helpers
     * @description Quick object check - this is primarily used to tell / Objects from primitive values when we know the value is a JSON - compliant type.
     * @param {any} val The value we want to check.
     * @returns {boolean} true or false
     */
    function isObject(val) {
        return val !== null && typeof val === 'object'
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
        return n >= 0 && Math.floor(n) === n && isFinite(val)
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
        )
    }

    /**
     * @author odin
     * @class helpers
     * @description Convert a value to a string that is actually rendered.
     * @param {any} val The input value
     * @returns {string} string
     */
    function toString(val) {
        return val == null ?
            '' :
            Array.isArray(val) || (isPlainObject(val) && val.toString === _toString) ?
            JSON.stringify(val, null, 2) :
            String(val)
    }

    /**
     * @author odin
     * @class helpers
     * @description Convert an input value to a number for persistence. / If the conversion fails, return original string.
     * @param {string} val The input string
     * @returns {number / string} number / string
     */
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
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
        return hasOwnProperty.call(obj, keyName)
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
        return ret
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
     * @description Mix properties into target object.
     * @param to destination Object
     * @param _from from which Object
     * @returns {object} to object extend by _from object
     */
    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
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
        return res
    }

    /**
     * @author odin
     * @class helpers
     * @description Always return false.
     * @returns {boolean} false
     */
    function no (a, b, c) {
        return false;
    };

    /**
     * @author odin
     * @class helpers
     * @description Always return true.
     * @returns {boolean} true
     */
    function yes(a, b, c) {
        return true;
    };

    /**
     * @author odin
     * @class helpers
     * @description Return the same value.
     * @param _ input data
     * @returns {any} input data
     */
    function sameValue (_) {
        return _;
    };

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
            return true
        }
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {
            try {
                var isArrayA = Array.isArray(a);
                var isArrayB = Array.isArray(b);
                if (isArrayA && isArrayB) {
                    return a.length === b.length && a.every(function (e, i) {
                        return looseEqual(e, b[i])
                    })
                } else if (a instanceof Date && b instanceof Date) {
                    return a.getTime() === b.getTime()
                } else if (!isArrayA && !isArrayB) {
                    var keysA = Object.keys(a);
                    var keysB = Object.keys(b);
                    return keysA.length === keysB.length && keysA.every(function (key) {
                        return looseEqual(a[key], b[key])
                    })
                } else {
                    /* istanbul ignore next */
                    return false
                }
            } catch (e) {
                /* istanbul ignore next */
                return false
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
        } else {
            return false
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
     * @param {array / object} val input data of type object
     * @returns {array / object} array / object
     */

    function deepCopy(val) {

        return JSON.parse(JSON.stringify(val));

    }

    return {
        isUndef,
        isDef,
        isTrue,
        isFalse,
        isPrimitive,
        toRawType,
        isPlainObject,
        isObject,
        isValidArrayIndex,
        isPromise,
        toString,
        toNumber,
        hasOwn,
        getAllOwnPropertyObj,
        arrLikeToArray1,
        arrLikeToArray2,
        extend,
        arrToObject,
        no,
        yes,
        sameValue,
        looseEqual,
        resJSON,
        reverseText,
        shallowCopy,
        deepCopy
    }

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
        })

    }

    return {
        priceWithCommas,
        priceWithoutCommas,
        max,
        min
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
     * @description get the value of the specific parameter name from url
     * @param {string} [url = window.location.search] - url
     * @param {string} name - query parameter name
     * @param {string} [url = window.location.search] - url
     * @returns {string} value
     */
    function getUrlParaByName(name, url) {

        var result,
            regex,
            part;

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

    return {
        getUrlParaByName
    }

})();

/**
 * @author odin
 * @description Tools For jQuery 
 */

odin.jq = (function () {

    /**
     * @author odin
     * @class jq
     * @description Checking if the jQuery is existing.
     * @returns {boolean} true or false
     */
    function isjQeryExist(o) {
        return jQuery ? true : false;
    }

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
        return Array.isArray(val) ? jQuery.extend(true, [], val) : jQuery.extend(true, {}, val);
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

    return {
        isjQeryExist,
        shallowCopy,
        deepCopy,
        // makeTimeStr
    };

})();

/**
 * @author odin
 * @description Tools For ES6 
 */

odin.es6 = (function () {

    /**
     * @author odin
     * @class url
     * @description Convert an Array - like object to a real Array. 
     * @param {array / array-like list} list
     * @param {boolean} isNeedToCutTheSameValue Cut the same value among of the array or array like list 
     * @returns {array} array
     */
    function arrLikeToArrayEs6(list, isNeedToCutTheSameValue) {

        return isNeedToCutTheSameValue ? Array.from(new Set(list)) : Array.from(list);

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
    function shallowCopy (val) {
        return Object.assign(val);
    }

    return {
        arrLikeToArrayEs6,
        max,
        min,
        shallowCopy,
    };

})();