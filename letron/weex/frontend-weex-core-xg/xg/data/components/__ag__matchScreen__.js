// { "framework": "Vue"} 

!function(e){function t(r){if(a[r])return a[r].exports;var _=a[r]={i:r,l:!1,exports:{}};return e[r].call(_.exports,_,_.exports,t),_.l=!0,_.exports}var a={};t.m=e,t.c=a,t.d=function(e,a,r){t.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(a,"a",a),a},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=264)}({0:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var _="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=a(8),n=r(o),i=a(1),u=r(i),s=a(11),l=r(s),f=a(2),d=r(f),c=a(3),h=r(c),g=a(4),p=r(g),m={},v=void 0,y=weex.requireModule(d.default.__ag__net__),S=weex.requireModule(d.default.__ag__store__),E=weex.requireModule(d.default.__ag__value__),H=weex.requireModule(d.default.__ag__key__),b=weex.requireModule(d.default.__ag__device__);m.brand=u.default.brand,m.dt=1,"Web"==WXEnvironment.platform&&(m.dt=3);var A=void 0;m.platform="ios",m.mergeJoin=function(e){e.forEach(function(e){if(e.joinMap)for(var t in e.joinMap){var a=e.joinMap[t];void 0===e[t]&&(e[t]=a)}})},m.generateUrl=function(e){var t=e.includes("?")?"&":"?",a=Date.now()/1e3^0,r=h.default.__ag__hmacSha256Sync__(e+a,"uinapveppygeotoyqmtrcdhuzdfukvsx");return e+t+"verify="+a+"-"+encodeURIComponent(r)};m.urlsecret=function(e,t,a){var r=Math.floor(Date.now()/1e3),_=m.dt,o=u.default.verIndex,n=u.default.channel[m.platform],i=u.default.brand,s="0";y&&(s=h.default.__ag__check__()?"1":"0");var f=void 0;b&&(f=encodeURIComponent(m.base64(h.default.__ag__getDeviceName__())));var d=encodeURIComponent(a),c=i+","+_+","+o+","+n+","+d+","+r+","+s+","+f;return c+","+l.default.sha256(c+"526dc69734aaacba8481c479f3cb2cd7")},m.isEqualList=function(e,t){if(!t||!t.length)return[];if(!e||!e.length)return t;var a={};for(var r in t){var _=t[r];a[_.id]=_}var o=[];for(var n in e){var i=e[n],u=a[i.id];u&&u.id&&(m.isEqual(u,i)?o.push(i):o.push(u))}var s={};for(var l in e){var f=e[l];s[f.id]=f}for(var d in t){var c=t[d],h=s[c.id];h&&h.id||o.push(c)}return o},m.isEqual=function(e,t){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return e===t;if(Object.prototype.toString.call(e)!==Object.prototype.toString.call(t))return!1;switch(Object.prototype.toString.call(e)){case"[object RegExp]":case"[object String]":return""+e==""+t;case"[object Number]":return+e!=+e?+t!=+t:0==+e?1/+e==1/t:+e==+t;case"[object Date]":case"[object Boolean]":return+e==+t;case"[object Array]":for(var a=0;a<e.length;a++)if(!m.isEqual(e[a],t[a]))return!1;return!0;case"[object Object]":for(var r=Object.keys(e),_=0;_<r.length;_++)if(!m.isEqual(e[r[_]],t[r[_]]))return!1;r=Object.keys(t);for(var o=0;o<r.length;o++)if(!m.isEqual(e[r[o]],t[r[o]]))return!1;return!0;default:return!1}},m.numberReadable=function(e){return e?e>=1e4?Math.floor(e/1e4).toFixed(1)+"万":e:""},m.copyToClipboard=function(e){window.clipboardData?window.clipboardData.setData("text",e):(function(e){document.oncopy=function(t){t.clipboardData.setData("text",e),t.preventDefault(),document.oncopy=null}}(e),document.execCommand("Copy"))},m.url=function(e){return e?0==e.indexOf("http")?e:u.default.download+e:""},m.navigateTo=function(e,t,a){if(a=a||{},t){var r="?";for(var _ in t)e+=r+_+"="+t[_],r="&"}a.url=e},m.arrayContains=function(e,t){for(var a in e)if(e[a]==t)return!0;return!1},m.arrayRemove=function(e,t){var a=e.indexOf(t);a>-1&&e.splice(a,1)},m.message=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1.5;e&&(v||(v=weex.requireModule("modal")),v.toast({message:e,duration:t}))},m.error=function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1],arguments.length>2&&void 0!==arguments[2]&&arguments[2]},m.confirm=function(e,t,a,r){},m.back=function(e){},m.formatNumber=function(e){return e>9?e.toString():"0"+e},m.formatTime=function(e){if("string"==typeof e){var t=e.split(/[-:\s]+/);return t[3]+":"+t[4]}e=new Date(e);var a=e.getHours(),r=e.getMinutes();return e.getSeconds(),[a,r].map(m.formatNumber).join(":")},m.formatDateTime=function(e){if("string"==typeof e){var t=e.split(/[-:\s]+/);return t[1]+"-"+t[2]+" "+t[3]+":"+t[4]+":"+t[5]}e=new Date(e);var a=e.getFullYear(),r=e.getMonth()+1,_=e.getDate(),o=e.getHours(),n=e.getMinutes(),i=e.getSeconds();return[a,r,_].map(m.formatNumber).join("-")+" "+[o,n,i].map(m.formatNumber).join(":")},m.formatDate=function(e){if("string"==typeof e){var t=e.split(/[-:\s]+/);return t[1]+"月"+t[2]+"日"}e=new Date(e);var a=e.getMonth()+1,r=e.getDate();return a+"月"+r+"日"},m.forTypeDate=function(e){if("string"==typeof e){var t=e.split(/[-:\s]+/);return t[1]+"/"+t[2]}return e=new Date(e),e.getMonth()+1+"/"+e.getDate()},m.formatDay=function(e){e=new Date(e);var t=e.getDay();return n.default.day[t]},m.parseDate=function(e){return e?("string"==typeof e&&(e=e.replace(/-/g,"/")),new Date(e)):""};var R=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"yyyy-MM-dd";if(!e)return"";"string"==typeof e&&(e=e.replace(/-/g,"/")),e=new Date(e);var a={"M+":e.getMonth()+1,"d+":e.getDate(),"H+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"S+":e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(var r in a)new RegExp("("+r+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[r]:("00"+a[r]).substr(String(a[r]).length)));return t};m.simpleDateTime=function(e){if(!e)return"";"string"==typeof e&&(e=e.replace(/-/g,"/")),e=new Date(e);var t=e.getTime();return(new Date).getTime()-t<864e5?R(e,"HH:mm"):R(e,"yyyy-MM-dd")},m.dateFormat=R,m.api=function(e,t){return new Promise(function(a,r){e(t).then(function(e){m.message(e.message),a(e)}).catch(function(e){m.error(e.message)})})},m.json=function(e){if(e&&"string"==typeof e&&"{"==e.charAt(0)&&"}"==e.charAt(e.length-1))try{return JSON.parse(e)}catch(e){}return e},m.toStirng=function(e){try{return JSON.stringify(e)}catch(e){}return e},m.debounce=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200;e.debounce&&clearTimeout(e.debounce),e.debounce=setTimeout(function(){e.debounce=void 0,e()},t)},m.throttle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:200;e.throttle||(e.throttle=!0,setTimeout(function(){e.throttle=void 0,e()},t))},m.pushAll=function(e,t,a,r){a?t.forEach(function(t){n.default.listUserTask.forEach(function(a){if(a.id==t.id)return t.img=a.img,t.completeImg=a.completeImg,1==t.id?(t.status=1,t.img=a.completeImg):r&&r.id&&10001==t.id?(t.status=1,t.img=a.completeImg):t.status=a.status,void e.push(t)})}):t.forEach(function(t){e.push(t)})},m.formatWeek=function(e){return["星期日","星期一","星期二","星期三","星期四","星期五","星期六"][m.parseDate(e).getDay()]},m.formatWeeks=function(e){return["周日","周一","周二","周三","周四","周五","周六"][m.parseDate(e).getDay()]},m.formatToDate=function(e){if(!e)return"";"string"==typeof e&&(e=e.replace(/-/g,"/"));var t=36e5,a=864e5,r=2592e5,_=new Date;e=new Date(e);var o=_-e,n="";if(o<t)n=Math.floor(o/1e3/60)+"分钟前";else if(o<a)n=Math.floor(o/t)+"小时前";else{if(o<r)return this.formatDate(e);n=Math.floor(o/a)+"天前"}return n},m.keyboardHeight=function(e){return e?e.keyboardSize&&e.keyboardSize.height?e.keyboardSize.height:e.keyboardSize?e.keyboardSize:0:0},m.getJumpBaseUrl=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=weex.config.bundleUrl;a=new String(a);var r,o;if("android"==WXEnvironment.platform)r=a.substring(0,a.lastIndexOf("/")+1),o=r+e+".js";else if("iOS"==WXEnvironment.platform)r=a.substring(0,a.lastIndexOf("/")+1),o=r+e+".js";else{var n="localhost:8081",i=/\/\/([^\/]+?)\//.exec(a);i&&i.length>=2&&(n=i[1]),r=("undefined"==typeof window||_(window),"http://"+n+"/"),o=r+e+".html"}return Object.values(t).length>0&&(o+=m.parseData(t)),o},m.parseData=function(e){if(!(Object.values(e).length<=0)){var t="";for(var a in e){var r=e[a];t.length>0?t+="&"+a+"="+r:t="?"+a+"="+r}return t}},m.getPush=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};A||(A=weex.requireModule("navigator")),A.push({url:m.getJumpBaseUrl(e,t),animated:"true"},function(e){})},m.pop=function(){A||(A=weex.requireModule("navigator")),A.pop({animated:"true"},function(e){})},m.getUrlParam=function(e){var t=void 0,a=void 0,r={},_=e,o=_.indexOf("?");_=_.substr(o+1);for(var n=_.split("&"),i=0;i<n.length;i++)(o=n[i].indexOf("="))>0&&(t=n[i].substring(0,o),a=n[i].substr(o+1),r[t]=a);return r},m.base62=function(e){if(!e)return"";if(isNaN(e))return"";for(var t="";t="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(e%62)+t,e=Math.floor(e/62););return t};var C="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";m.base64=function(e){var t="",a=void 0,r=void 0,_=void 0,o=void 0,n=void 0,i=void 0,u=void 0,s=0;for(e=m._utf8_encode(e);s<e.length;)a=e.charCodeAt(s++),r=e.charCodeAt(s++),_=e.charCodeAt(s++),o=a>>2,n=(3&a)<<4|r>>4,i=(15&r)<<2|_>>6,u=63&_,isNaN(r)?i=u=64:isNaN(_)&&(u=64),t=t+C.charAt(o)+C.charAt(n)+C.charAt(i)+C.charAt(u);return t},m._utf8_encode=function(e){e=e.replace(/\r\n/g,"\n");for(var t="",a=0;a<e.length;a++){var r=e.charCodeAt(a);r<128?t+=String.fromCharCode(r):r>127&&r<2048?(t+=String.fromCharCode(r>>6|192),t+=String.fromCharCode(63&r|128)):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128),t+=String.fromCharCode(63&r|128))}return t},m.iconfontUtils=function(){var e=weex.requireModule("dom"),t=WXEnvironment.platform,a=void 0;a="android"==t||"iOS"==t?"url('local:///xg2.ttf')":"url('https://at.alicdn.com/t/c/font_3744412_si354vz0kn.woff2?t=1667358828928')",e.addRule("fontFace",{fontFamily:"iconfont",src:a})},m.getItem=function(e){var t="";return H&&"guestToken"==e&&(t=m.json(h.default.__ag__getKey__(e)))?(m.setItem(e,t),t):S&&(t=m.json(h.default.__ag__getStore__(e)))?t:E&&(t=m.json(h.default.__ag__getValue__(e)))?t:("Web"==WXEnvironment.platform&&localStorage&&(t=m.json(localStorage.getItem(e))),t)},m.setItem=function(e,t){S&&h.default.__ag__setStore__(e,t),E&&h.default.__ag__setValue__(e,t),H&&"guestToken"==e&&h.default.__ag__setKey__(e,t),"Web"==WXEnvironment.platform&&localStorage&&localStorage.setItem(e,t)},m.isVolume=function(){return h.default.__ag__isVolume__()},m.getVolume=function(){return h.default.__ag__getVolume__()},m.setVolume=function(e){h.default.__ag__setVolume__(e)},m.setLandscape=function(e){h.default.__ag__setLandscape__(e)},m.setAudioCategory=function(e){h.default.__ag__setAudioCategory__(e)},m.setStatusBarStyle=function(e){h.default.__ag__setStatusBarStyle__(e)},m.__ag__checkModule__=function(){var e=["@module/"+d.default.__ag__device__,"@module/"+d.default.__ag__net__,"@module/"+d.default.__ag__download__,"@module/"+d.default.__ag__value__,"@module/"+d.default.__ag__store__,"@module/"+d.default.__ag__key__,"@module/"+d.default.__ag__crypto__,"@module/"+d.default.__ag__nav__,"@module/"+d.default.__ag__openInstall__,"@module/"+d.default.__ag__imageCropPicker__,"@module/"+d.default.__ag__crypto__+"."+p.default.hmacSha256Sync,"@module/"+d.default.__ag__device__+"."+p.default.getLandscape,"@module/"+d.default.__ag__device__+"."+p.default.setLandscape,"@module/"+d.default.__ag__device__+"."+p.default.setBadge,"@module/"+d.default.__ag__device__+"."+p.default.setStatusBarStyle,"@module/"+d.default.__ag__device__+"."+p.default.vibrate,"@module/"+d.default.__ag__device__+"."+p.default.getDeviceName,"@module/"+d.default.__ag__device__+"."+p.default.setVolume,"@module/"+d.default.__ag__device__+"."+p.default.getVolume,"@module/"+d.default.__ag__device__+"."+p.default.setAudioCategory,"@module/"+d.default.__ag__download__+"."+p.default.download,"@module/"+d.default.__ag__download__+"."+p.default.update,"@module/"+d.default.__ag__download__+"."+p.default.updateUrl,"@module/"+d.default.__ag__store__+"."+p.default.sgetItem,"@module/"+d.default.__ag__store__+"."+p.default.ssetItem,"@module/"+d.default.__ag__value__+"."+p.default.vgetItem,"@module/"+d.default.__ag__value__+"."+p.default.vsetItem,"@module/"+d.default.__ag__key__+"."+p.default.kgetItem,"@module/"+d.default.__ag__key__+"."+p.default.ksetItem,"@module/"+d.default.__ag__key__+"."+p.default.removeKeyItem,"@module/"+d.default.__ag__nav__+"."+p.default.open,"@module/"+d.default.__ag__net__+"."+p.default.check,"@module/"+d.default.__ag__openInstall__+"."+p.default.oiopen,"@module/"+d.default.__ag__openInstall__+"."+p.default.regist,"@module/"+d.default.__ag__openInstall__+"."+p.default.report],t=weex.requireModule(d.default.__ag__net__)[p.default.check],a=t(),r=[],_=[];for(var o in e){var n=e[o];weex.supports(n)?r.push(n):_.push(n)}return"check:"+t+"\nvpn:"+a+"\nfalse："+_.join("\n")+"\n--------------------------------\ntrue："+r.join("\n")},t.default=m},1:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={};r.web="https://liosIsraelt.xyz",r.verIndex=4090002,r.version="4.9.2",r.channel={ios:"bl-ios"},r.hard="播龙体育",r.brand="5";var _="apeqtmo1tq91.xyz",o="api";r.agreement="liosIsraelt.xyz",r.dev=!1,r.host="https://"+o+"."+_,r.portal="https://m.blty25.com",r.upload="https://"+o+"."+_+"/api?method=upload",r.download="https://file.br.syruicxikj.cn/file/",r.logo="static/zf-logo5.png",r.aboutLogo="static/zf-logo2.png",r.dev=!0,t.default=r},10:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=[["Philippines","菲律宾","PH",63,0],["China","中国大陆","CN",86,0],["Hongkong","香港","HK",852,0],["Thailand","泰国","TH",66,-1],["Macao","澳门","MO",853,0],["Malaysia","马来西亚","MY",60,-.5],["Singapore","新加坡","SG",65,.3],["Taiwan","台湾省","TW",886,0],["Vietnam","越南","VN",84,-1]];t.default=r},11:function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
!function(){"use strict";function Sha256(e,t){t?(blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],e?(this.h0=3238371032,this.h1=914150663,this.h2=812702999,this.h3=4144912697,this.h4=4290775857,this.h5=1750603025,this.h6=1694076839,this.h7=3204075428):(this.h0=1779033703,this.h1=3144134277,this.h2=1013904242,this.h3=2773480762,this.h4=1359893119,this.h5=2600822924,this.h6=528734635,this.h7=1541459225),this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0,this.is224=e}function HmacSha256(e,t,a){var r,_=typeof e;if("string"===_){var o,n=[],i=e.length,u=0;for(r=0;r<i;++r)o=e.charCodeAt(r),o<128?n[u++]=o:o<2048?(n[u++]=192|o>>6,n[u++]=128|63&o):o<55296||o>=57344?(n[u++]=224|o>>12,n[u++]=128|o>>6&63,n[u++]=128|63&o):(o=65536+((1023&o)<<10|1023&e.charCodeAt(++r)),n[u++]=240|o>>18,n[u++]=128|o>>12&63,n[u++]=128|o>>6&63,n[u++]=128|63&o);e=n}else{if("object"!==_)throw new Error(ERROR);if(null===e)throw new Error(ERROR);if(ARRAY_BUFFER&&e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(!(Array.isArray(e)||ARRAY_BUFFER&&ArrayBuffer.isView(e)))throw new Error(ERROR)}e.length>64&&(e=new Sha256(t,!0).update(e).array());var s=[],l=[];for(r=0;r<64;++r){var f=e[r]||0;s[r]=92^f,l[r]=54^f}Sha256.call(this,t,a),this.update(l),this.oKeyPad=s,this.inner=!0,this.sharedMemory=a}var ERROR="input is invalid type",WINDOW="object"==typeof window,root=WINDOW?window:{};root.JS_SHA256_NO_WINDOW&&(WINDOW=!1);var WEB_WORKER=!WINDOW&&"object"==typeof self,NODE_JS=!root.JS_SHA256_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;NODE_JS?root=global:WEB_WORKER&&(root=self);var COMMON_JS=!root.JS_SHA256_NO_COMMON_JS&&"object"==typeof module&&module.exports,AMD=__webpack_require__(12),ARRAY_BUFFER=!root.JS_SHA256_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,HEX_CHARS="0123456789abcdef".split(""),EXTRA=[-2147483648,8388608,32768,128],SHIFT=[24,16,8,0],K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],OUTPUT_TYPES=["hex","array","digest","arrayBuffer"],blocks=[];!root.JS_SHA256_NO_NODE_JS&&Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),!ARRAY_BUFFER||!root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(e){return"object"==typeof e&&e.buffer&&e.buffer.constructor===ArrayBuffer});var createOutputMethod=function(e,t){return function(a){return new Sha256(t,!0).update(a)[e]()}},createMethod=function(e){var t=createOutputMethod("hex",e);NODE_JS&&(t=nodeWrap(t,e)),t.create=function(){return new Sha256(e)},t.update=function(e){return t.create().update(e)};for(var a=0;a<OUTPUT_TYPES.length;++a){var r=OUTPUT_TYPES[a];t[r]=createOutputMethod(r,e)}return t},nodeWrap=function(method,is224){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),algorithm=is224?"sha224":"sha256",nodeMethod=function(e){if("string"==typeof e)return crypto.createHash(algorithm).update(e,"utf8").digest("hex");if(null===e||void 0===e)throw new Error(ERROR);return e.constructor===ArrayBuffer&&(e=new Uint8Array(e)),Array.isArray(e)||ArrayBuffer.isView(e)||e.constructor===Buffer?crypto.createHash(algorithm).update(new Buffer(e)).digest("hex"):method(e)};return nodeMethod},createHmacOutputMethod=function(e,t){return function(a,r){return new HmacSha256(a,t,!0).update(r)[e]()}},createHmacMethod=function(e){var t=createHmacOutputMethod("hex",e);t.create=function(t){return new HmacSha256(t,e)},t.update=function(e,a){return t.create(e).update(a)};for(var a=0;a<OUTPUT_TYPES.length;++a){var r=OUTPUT_TYPES[a];t[r]=createHmacOutputMethod(r,e)}return t};Sha256.prototype.update=function(e){if(!this.finalized){var t,a=typeof e;if("string"!==a){if("object"!==a)throw new Error(ERROR);if(null===e)throw new Error(ERROR);if(ARRAY_BUFFER&&e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(!(Array.isArray(e)||ARRAY_BUFFER&&ArrayBuffer.isView(e)))throw new Error(ERROR);t=!0}for(var r,_,o=0,n=e.length,i=this.blocks;o<n;){if(this.hashed&&(this.hashed=!1,i[0]=this.block,i[16]=i[1]=i[2]=i[3]=i[4]=i[5]=i[6]=i[7]=i[8]=i[9]=i[10]=i[11]=i[12]=i[13]=i[14]=i[15]=0),t)for(_=this.start;o<n&&_<64;++o)i[_>>2]|=e[o]<<SHIFT[3&_++];else for(_=this.start;o<n&&_<64;++o)r=e.charCodeAt(o),r<128?i[_>>2]|=r<<SHIFT[3&_++]:r<2048?(i[_>>2]|=(192|r>>6)<<SHIFT[3&_++],i[_>>2]|=(128|63&r)<<SHIFT[3&_++]):r<55296||r>=57344?(i[_>>2]|=(224|r>>12)<<SHIFT[3&_++],i[_>>2]|=(128|r>>6&63)<<SHIFT[3&_++],i[_>>2]|=(128|63&r)<<SHIFT[3&_++]):(r=65536+((1023&r)<<10|1023&e.charCodeAt(++o)),i[_>>2]|=(240|r>>18)<<SHIFT[3&_++],i[_>>2]|=(128|r>>12&63)<<SHIFT[3&_++],i[_>>2]|=(128|r>>6&63)<<SHIFT[3&_++],i[_>>2]|=(128|63&r)<<SHIFT[3&_++]);this.lastByteIndex=_,this.bytes+=_-this.start,_>=64?(this.block=i[16],this.start=_-64,this.hash(),this.hashed=!0):this.start=_}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},Sha256.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var e=this.blocks,t=this.lastByteIndex;e[16]=this.block,e[t>>2]|=EXTRA[3&t],this.block=e[16],t>=56&&(this.hashed||this.hash(),e[0]=this.block,e[16]=e[1]=e[2]=e[3]=e[4]=e[5]=e[6]=e[7]=e[8]=e[9]=e[10]=e[11]=e[12]=e[13]=e[14]=e[15]=0),e[14]=this.hBytes<<3|this.bytes>>>29,e[15]=this.bytes<<3,this.hash()}},Sha256.prototype.hash=function(){var e,t,a,r,_,o,n,i,u,s,l,f=this.h0,d=this.h1,c=this.h2,h=this.h3,g=this.h4,p=this.h5,m=this.h6,v=this.h7,y=this.blocks;for(e=16;e<64;++e)_=y[e-15],t=(_>>>7|_<<25)^(_>>>18|_<<14)^_>>>3,_=y[e-2],a=(_>>>17|_<<15)^(_>>>19|_<<13)^_>>>10,y[e]=y[e-16]+t+y[e-7]+a<<0;for(l=d&c,e=0;e<64;e+=4)this.first?(this.is224?(i=300032,_=y[0]-1413257819,v=_-150054599<<0,h=_+24177077<<0):(i=704751109,_=y[0]-210244248,v=_-1521486534<<0,h=_+143694565<<0),this.first=!1):(t=(f>>>2|f<<30)^(f>>>13|f<<19)^(f>>>22|f<<10),a=(g>>>6|g<<26)^(g>>>11|g<<21)^(g>>>25|g<<7),i=f&d,r=i^f&c^l,n=g&p^~g&m,_=v+a+n+K[e]+y[e],o=t+r,v=h+_<<0,h=_+o<<0),t=(h>>>2|h<<30)^(h>>>13|h<<19)^(h>>>22|h<<10),a=(v>>>6|v<<26)^(v>>>11|v<<21)^(v>>>25|v<<7),u=h&f,r=u^h&d^i,n=v&g^~v&p,_=m+a+n+K[e+1]+y[e+1],o=t+r,m=c+_<<0,c=_+o<<0,t=(c>>>2|c<<30)^(c>>>13|c<<19)^(c>>>22|c<<10),a=(m>>>6|m<<26)^(m>>>11|m<<21)^(m>>>25|m<<7),s=c&h,r=s^c&f^u,n=m&v^~m&g,_=p+a+n+K[e+2]+y[e+2],o=t+r,p=d+_<<0,d=_+o<<0,t=(d>>>2|d<<30)^(d>>>13|d<<19)^(d>>>22|d<<10),a=(p>>>6|p<<26)^(p>>>11|p<<21)^(p>>>25|p<<7),l=d&c,r=l^d&h^s,n=p&m^~p&v,_=g+a+n+K[e+3]+y[e+3],o=t+r,g=f+_<<0,f=_+o<<0;this.h0=this.h0+f<<0,this.h1=this.h1+d<<0,this.h2=this.h2+c<<0,this.h3=this.h3+h<<0,this.h4=this.h4+g<<0,this.h5=this.h5+p<<0,this.h6=this.h6+m<<0,this.h7=this.h7+v<<0},Sha256.prototype.hex=function(){this.finalize();var e=this.h0,t=this.h1,a=this.h2,r=this.h3,_=this.h4,o=this.h5,n=this.h6,i=this.h7,u=HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[a>>28&15]+HEX_CHARS[a>>24&15]+HEX_CHARS[a>>20&15]+HEX_CHARS[a>>16&15]+HEX_CHARS[a>>12&15]+HEX_CHARS[a>>8&15]+HEX_CHARS[a>>4&15]+HEX_CHARS[15&a]+HEX_CHARS[r>>28&15]+HEX_CHARS[r>>24&15]+HEX_CHARS[r>>20&15]+HEX_CHARS[r>>16&15]+HEX_CHARS[r>>12&15]+HEX_CHARS[r>>8&15]+HEX_CHARS[r>>4&15]+HEX_CHARS[15&r]+HEX_CHARS[_>>28&15]+HEX_CHARS[_>>24&15]+HEX_CHARS[_>>20&15]+HEX_CHARS[_>>16&15]+HEX_CHARS[_>>12&15]+HEX_CHARS[_>>8&15]+HEX_CHARS[_>>4&15]+HEX_CHARS[15&_]+HEX_CHARS[o>>28&15]+HEX_CHARS[o>>24&15]+HEX_CHARS[o>>20&15]+HEX_CHARS[o>>16&15]+HEX_CHARS[o>>12&15]+HEX_CHARS[o>>8&15]+HEX_CHARS[o>>4&15]+HEX_CHARS[15&o]+HEX_CHARS[n>>28&15]+HEX_CHARS[n>>24&15]+HEX_CHARS[n>>20&15]+HEX_CHARS[n>>16&15]+HEX_CHARS[n>>12&15]+HEX_CHARS[n>>8&15]+HEX_CHARS[n>>4&15]+HEX_CHARS[15&n];return this.is224||(u+=HEX_CHARS[i>>28&15]+HEX_CHARS[i>>24&15]+HEX_CHARS[i>>20&15]+HEX_CHARS[i>>16&15]+HEX_CHARS[i>>12&15]+HEX_CHARS[i>>8&15]+HEX_CHARS[i>>4&15]+HEX_CHARS[15&i]),u},Sha256.prototype.toString=Sha256.prototype.hex,Sha256.prototype.digest=function(){this.finalize();var e=this.h0,t=this.h1,a=this.h2,r=this.h3,_=this.h4,o=this.h5,n=this.h6,i=this.h7,u=[e>>24&255,e>>16&255,e>>8&255,255&e,t>>24&255,t>>16&255,t>>8&255,255&t,a>>24&255,a>>16&255,a>>8&255,255&a,r>>24&255,r>>16&255,r>>8&255,255&r,_>>24&255,_>>16&255,_>>8&255,255&_,o>>24&255,o>>16&255,o>>8&255,255&o,n>>24&255,n>>16&255,n>>8&255,255&n];return this.is224||u.push(i>>24&255,i>>16&255,i>>8&255,255&i),u},Sha256.prototype.array=Sha256.prototype.digest,Sha256.prototype.arrayBuffer=function(){this.finalize();var e=new ArrayBuffer(this.is224?28:32),t=new DataView(e);return t.setUint32(0,this.h0),t.setUint32(4,this.h1),t.setUint32(8,this.h2),t.setUint32(12,this.h3),t.setUint32(16,this.h4),t.setUint32(20,this.h5),t.setUint32(24,this.h6),this.is224||t.setUint32(28,this.h7),e},HmacSha256.prototype=new Sha256,HmacSha256.prototype.finalize=function(){if(Sha256.prototype.finalize.call(this),this.inner){this.inner=!1;var e=this.array();Sha256.call(this,this.is224,this.sharedMemory),this.update(this.oKeyPad),this.update(e),Sha256.prototype.finalize.call(this)}};var exports=createMethod();exports.sha256=exports,exports.sha224=createMethod(!0),exports.sha256.hmac=createHmacMethod(),exports.sha224.hmac=createHmacMethod(!0),COMMON_JS?module.exports=exports:(root.sha256=exports.sha256,root.sha224=exports.sha224,AMD&&void 0!==(__WEBPACK_AMD_DEFINE_RESULT__=function(){return exports}.call(exports,__webpack_require__,exports,module))&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__))}()},12:function(e,t){(function(t){e.exports=t}).call(t,{})},2:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={};r.__ag__download__="shuidownloadguo",r.__ag__crypto__="shuicryptoguo",r.__ag__net__="shuinetguo",r.__ag__device__="shuideviceguo",r.__ag__store__="shuistoreguo",r.__ag__value__="shuivalueguo",r.__ag__key__="shuikeyguo",r.__ag__nav__="shuinavguo",r.__ag__airplay__="shuiairplayguo",r.__ag__imageCropPicker__="shuiicpguo",r.__ag__openInstall__="shuiopenInstallguo",t.default=r},264:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var _=a(78),o=r(_);o.default.el="#root",new Vue(o.default)},3:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var _=a(2),o=r(_),n=a(4),i=r(n),u=weex.requireModule(o.default.__ag__download__),s=weex.requireModule(o.default.__ag__crypto__),l=weex.requireModule(o.default.__ag__net__),f=weex.requireModule(o.default.__ag__store__),d=weex.requireModule(o.default.__ag__value__),c=weex.requireModule(o.default.__ag__key__),h=weex.requireModule(o.default.__ag__device__),g=weex.requireModule(o.default.__ag__nav__),p=weex.requireModule(o.default.__ag__openInstall__),v={};v.__ag__hmacSha256Sync__=function(e,t){return s?s[i.default.hmacSha256Sync](e,t):""},v.__ag__getLandscape__=function(){return!!h&&weex.supports("@module/"+o.default.__ag__device__+"."+i.default.getLandscape)},v.__ag__setLandscape__=function(e){h&&h[i.default.setLandscape](e)},v.__ag__setBadge__=function(e){h&&h[i.default.setBadge](e)},v.__ag__setStatusBarStyle__=function(e){h&&h[i.default.setStatusBarStyle](e)},v.__ag__vibrate__=function(){h&&h[i.default.vibrate]()},v.__ag__getDeviceName__=function(){if(h)return h[i.default.getDeviceName]()},v.__ag__setVolume__=function(e){if(h){weex.supports("@module/"+o.default.__ag__device__+"."+i.default.setVolume)&&h[i.default.setVolume](e)}},v.__ag__getVolume__=function(){if(h){if(weex.supports("@module/"+o.default.__ag__device__+"."+i.default.getVolume))return h[i.default.getVolume]()}return 0},v.__ag__isVolume__=function(){if(h){return!!weex.supports("@module/"+o.default.__ag__device__+"."+i.default.getVolume)}return!1},v.__ag__setAudioCategory__=function(){if(h){weex.supports("@module/"+o.default.__ag__device__+"."+i.default.setAudioCategory)&&h[i.default.setAudioCategory](m)}},v.__ag__download__=function(e,t){u&&u[i.default.download](e,function(e){v.__ag__update__(),t()})},v.__ag__update__=function(){u&&u[i.default.update]()},v.__ag__updateUrl__=function(){u&&u[i.default.updateUrl]()},v.__ag__getStore__=function(e){if(f)return f[i.default.sgetItem](e)},v.__ag__setStore__=function(e,t){f&&f[i.default.ssetItem](e,t)},v.__ag__getValue__=function(e){if(d)return d[i.default.vgetItem](e)},v.__ag__setValue__=function(e,t){d&&d[i.default.vsetItem](e,t)},v.__ag__getKey__=function(e){if(c)return c[i.default.kgetItem](e)},v.__ag__setKey__=function(e,t){c&&c[i.default.ksetItem](e,t)},v.__ag__removeItem__=function(e){c&&c[i.default.removeKeyItem](e)},v.__ag__open__=function(e){g&&g[i.default.open](e)},v.__ag__check__=function(){if(l)return l[i.default.check]()},v.__ag__oiOpenInstall_=function(){weex.supports("@module/"+o.default.__ag__openInstall__)&&p[i.default.oiopen]()},v.__ag__regist__=function(e){weex.supports("@module/"+o.default.__ag__openInstall__)&&p[i.default.regist]()},v.__ag__report__=function(e){weex.supports("@module/"+o.default.__ag__openInstall__)&&p[i.default.report]()},t.default=v},4:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r={};r.hmacSha256Sync="getWarthogCode",r.setLandscape="setLionScape",r.getLandscape="getLionScape",r.setBadge="setLionBadge",r.setStatusBarStyle="setLionStyle",r.vibrate="virateLion",r.getDeviceName="getLionName",r.setVolume="setLionVolume",r.getVolume="getLionVolume",r.getSystemVolumSlider="setLionCategory",r.setAudioCategory="setBoDragonCategory",r.download="koala",r.updateUrl="updateKoalaName",r.update="updateKoala",r.sgetItem="sgetKoalaItem",r.ssetItem="ssetKoalaItem",r.vgetItem="vgetKoalaItem",r.vsetItem="vsetKoalaItem",r.kgetItem="kgetKoalaItem",r.ksetItem="ksetKoalaItem",r.removeKeyItem="removeKoalaItem",r.check="checkKoala",r.open="open",r.oiopen="oiopen",r.regist="registKoala",r.report="reportKoala",t.default=r},78:function(e,t,a){var r,_,o=[];o.push(a(79)),r=a(80);var n=a(81);_=r=r||{},"object"!=typeof r.default&&"function"!=typeof r.default||(_=r=r.default),"function"==typeof _&&(_=_.options),_.render=n.render,_.staticRenderFns=n.staticRenderFns,_._scopeId="data-v-7c019e2b",_.style=_.style||{},o.forEach(function(e){for(var t in e)_.style[t]=e[t]}),"function"==typeof __register_static_styles__&&__register_static_styles__(_._scopeId,o),e.exports=r},79:function(e,t){e.exports={"__ag__match-screen__":{width:"750",paddingLeft:"16wx",paddingRight:"16wx",height:"40wx",backgroundColor:"#FFF4CE",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",borderTopLeftRadius:"20",borderTopRightRadius:"20"},"__ag__screen-content__":{display:"flex",flexDirection:"row"},"__ag__screen-date__":{display:"flex",flexDirection:"row"},"__ag__screen-body__":{width:"41wx",height:"25wx",borderStyle:"solid",borderWidth:"1",borderColor:"#FDC501",boxSizing:"border-box",borderRadius:"4",textAlign:"center",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",marginLeft:"5wx",marginRight:"5wx"},__ag__select__:{backgroundColor:"#FDC501"},"__ag__screen-body-text__":{fontSize:"15wx",color:"#FDC501"},"__ag__select-status__":{color:"#ffffff"},"__ag__screen-date-text__":{fontSize:"15wx",color:"#F8912C",marginRight:"8",fontWeight:"600"}}},8:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var _=a(10),o=r(_),n=a(1),i=r(n),u={};u.version=i.default.version,u.day=["周日","周一","周二","周三","周四","周五","周六"],u.tops=["60px","80px","100px","120px","140px","160px","180px"],u.TYPE_ENTER=1,u.TYPE_LEAVE=-1,u.TYPE_ENTER_GUEST=2,u.TYPE_LEAVE_GUEST=-2,u.TYPE_FOLLOW=3,u.TYPE_FOLLOW_CANCEL=-3,u.TYPE_NORMAL=4,u.TYPE_NOTICE=5,u.TYPE_SYS_NOTICE=6,u.TYPE_DANMU=7,u.TYPE_LIVE_UPDATE=8,u.TYPE_VOTE=9,u.TYPE_VOTE_RESULT=-9,u.TYPE_VOTE_USER=10,u.TYPE_REMOVE_MESSAGE=11,u.TYPE_ADD_FRIEND=12,u.TYPE_GIFT=13,u.TYPE_BANG=14,u.country=[];var s=[];for(var l in o.default){var f=o.default[l],d=f[3],c=f[1],h=JSON.stringify(f).toLowerCase();s.push({id:d,name:c,key:h})}u.country=s.sort(function(e,t){return e.name.localeCompare(t.name,"zh-CN")}),u.country1=["菲律宾","中国大陆","香港","泰国","澳门","马来西亚","新加坡","台湾省","越南"],u.country2={0:63,1:86,2:852,3:66,4:853,5:60,6:65,7:886,8:84},u.status=["未开始","已开始","已结束","已取消","待定","中断","已推迟","腰斩"],u.statusMap={};for(var g in u.status){var p=u.status[g];u.statusMap[g]=p}t.default=u},80:function(e,t,a){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var _=a(0),o=r(_);t.default={name:"ag-matchScreen",props:{screen:{type:Number,default:0},datetime:{type:String,default:""}},data:function(){return{a__ag__util__:o.default}},computed:{day:function(){try{var e=o.default.formatDate(this.datetime),t=o.default.formatDateTime(new Date);if(o.default.formatDate(t)==e)return"今天"}catch(e){}return""},date:function(){return o.default.formatDate(this.datetime,"MM月dd日")},week:function(){return o.default.formatWeeks(this.datetime)}},methods:{onscreen:function(e){this.$emit("onscreen",e)}}}},81:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:["__ag__match-screen__"]},[a("div",{staticClass:["__ag__screen-date__"]},[e.day?a("text",{staticClass:["__ag__screen-date-text__"]},[e._v(e._s(e.day))]):e._e(),a("text",{staticClass:["__ag__screen-date-text__"]},[e._v(e._s(e.date))]),a("text",{staticClass:["__ag__screen-date-text__"]},[e._v(e._s(e.week))])]),a("div",{staticClass:["__ag__screen-content__"]},[a("div",{staticClass:["__ag__screen-body__"],class:[0==e.screen?"__ag__select__":""],on:{click:function(t){e.onscreen(0)}}},[a("text",{staticClass:["__ag__screen-body-text__"],class:[0==e.screen?"__ag__select-status__":""]},[e._v("赛事")])]),a("div",{staticClass:["__ag__screen-body__"],class:[1==e.screen?"__ag__select__":""],on:{click:function(t){e.onscreen(1)}}},[a("text",{staticClass:["__ag__screen-body-text__"],class:[1==e.screen?"__ag__select-status__":""]},[e._v("赛果")])])])])},staticRenderFns:[]}}});