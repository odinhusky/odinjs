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

    function isUndef(o) {
        return o === undefined || o === null
    }

    function isDef(o) {
        return o !== undefined && o !== null
    }

    function isTrue(o) {
        return o === true
    }

    function isFalse(o) {
        return o === false
    }

    /**
     * Check if value is primitive.
     */
    function isPrimitive(value) {
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            // $flow-disable-line
            typeof value === 'symbol' ||
            typeof value === 'boolean'
        )
    }

    /**
     * Get the raw type string of a value, e.g., [object Object].
     */
    var _toString = Object.prototype.toString;

    function toRawType(value) {
        return _toString.call(value).slice(8, -1)
    }

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]'
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject(obj) {
        return obj !== null && typeof obj === 'object'
    }

    /**
     * Check if val is a valid array index.
     */
    function isValidArrayIndex(val) {
        var n = parseFloat(String(val));
        return n >= 0 && Math.floor(n) === n && isFinite(val)
    }

    function isPromise(val) {
        return (
            isDef(val) &&
            typeof val.then === 'function' &&
            typeof val.catch === 'function'
        )
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString(val) {
        return val == null ?
            '' :
            Array.isArray(val) || (isPlainObject(val) && val.toString === _toString) ?
            JSON.stringify(val, null, 2) :
            String(val)
    }

    /**
     * Convert an input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n
    }

    /**
     * Check whether an object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, keyName) {
        return hasOwnProperty.call(obj, keyName)
    }

    /**
     * @author odin
     * @class helpers
     * @description Convert an Array - like object to a real Array.
     * @param list Array like 
     * @param start decide which index is the first value of new Array
     */
    function toArray(list, start) {
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
     * @description Mix properties into target object.
     * @param to destination Object
     * @param _from from which Object
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
     * @description Merge an Array of Objects into a single Object.
     * @param arr input Array
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
     * Always return false.
     */
    function no (a, b, c) {
        return false;
    };

    /**
     * Always return true.
     */
    function yes(a, b, c) {
        return true;
    };

    /* eslint-enable no-unused-vars */

    /**
     * Return the same value.
     */
    function sameValue (_) {
        return _;
    };

    /**
     * @author odin
     * @class helpers
     * @description Check
     if two values are loosely equal - that is,
         if they are plain objects, do they have the same shape ?
     * @param a input variable
     * @param a another input variable
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

    // String/JSON to JSON
    function resJSON(inputData) {

        var res = inputData;

        try {

            res = JSON.prase(res);

        } catch (e) {

            //

        }

        return res;

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
        toArray,
        extend,
        arrToObject,
        no,
        yes,
        sameValue,
        looseEqual,
        resJSON
    }
})();

/**
 * @author odin
 * @description Helpers for data check and transform.
 */

odin.math = (function () {

    /**
     * @author odin
     * @class helpers
     * @description add ',' with string number
     * @param  {number} price - the number which want to be added ,
     * @param  {number} fixed - how many digits that you want to fix
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
     * @class helpers
     * @description remove ',' with string number
     * @param  {number} price - the number which want to be added ,
     * @returns {string} value without ','
     */
    function priceWithoutCommas(price) {

        return price.toString().replace(/,/g, '');

    }

    return {
        priceWithCommas,
        priceWithoutCommas
    }

})();

/**
 * @author odin
 * @description Helpers for URL.
 */

odin.url = (function () {

    /**
     * @author odin
     * @class helpers
     * @description get the value of the specific parameter name from url
     * @param  {string} [url = window.location.search] - url
     * @param  {string} name - query parameter name
     * @param  {string} [url = window.location.search] - url
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
        // makeTimeStr
    };

})();