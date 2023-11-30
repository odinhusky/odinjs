import vars from './vars.js'
import bc from './__ag__bc__.js'
import sport from './__ag__sport__.js'
import env from './env.js'
import sha256 from 'js-sha256'
import moduleAll  from './__ag__moduleAll__.js';
import moduleFun from './__ag__moduleFun__.js'
import require from './__ag__requireModule__.js'
const util = {}
const thisModule = moduleAll[env.code]

let modal = undefined
let navigator = undefined
let storage = undefined
let imgurl = undefined

let net = require.net
let agstore = require.agstore
let agvalue = require.agvalue
let agkey = require.agkey
let agdevice = require.agdevice
let ImageCropPicker = require.imageCropPicker

let clipboard = weex.requireModule('clipboard')

util.dt = 1
if(WXEnvironment.platform  == 'Web'){
	util.dt = 3
}
util.mergeJoin = function(l){
	l.forEach(r=>{
		if(r.joinMap){
			for(let i in r.joinMap){
				let v = r.joinMap[i]
				if(r[i] === undefined){
					r[i] = v
				}
			}
		}
	})
	
}
util.clearUsers = function(){
	let  guestToken = util.getItem('guestToken')
	util.setItem('token',guestToken)
	util.setItem('user','')
	sport.__ag__infoUser_editGuest__()
	let unread = 0
	bc.postMessage('onUnread',unread)
}

const key = 'uinapveppygeotoyqmtrcdhuzdfukvsx';
const signName = 'verify'
util.generateUrl =  function generateUrl(filename) {
	const isArgs = filename.includes('?') ? '&' : '?'
	const ts =  (Date.now() / 1000)^0
	// const hash = crypto.getDeerCode(filename+ts,key)
	const hash = moduleFun.__ag__hmacSha256Sync__(filename+ts,key)
	const urlencodHash = encodeURIComponent(hash)

	return filename + isArgs + signName + '=' + ts + '-' + urlencodHash
  }
const apisecret = '526dc69734aaacba8481c479f3cb2cd7'
const apiSignName = 'hash'
util.urlsecret = function(method, rand,guestToken){
	const ts = Math.floor(Date.now()/1000)
	let deviceType = util.dt
	let version = env.verIndex
	let channel = env.channel['ios'] 
	let  brand = env.brand
	let vpn = '0'
	if(net){
		vpn = moduleFun.__ag__check__() ? '1' : '0'
	}
	let agdevicename = undefined
	if(agdevice){
		// agdevicename =encodeURIComponent(agdevice.getDeviceName())
		agdevicename =encodeURIComponent(util.base64(moduleFun.__ag__getDeviceName__()))
	}
	let ecguestToken = encodeURIComponent(guestToken)
	let data = `${brand},${deviceType},${version},${channel},${ecguestToken},${ts},${vpn},${agdevicename}`
		let hash = sha256.sha256(data + apisecret)
	return data + ','+ hash
}

util.isEqualList = function(oldList,newList){
	if(!newList || !newList.length){
		return []
	}
	if(!oldList || !oldList.length){
		return newList
	}
	let listMap = {}
	for(let i in newList){
		let r = newList[i]
		listMap[r.id] = r
	}
	let list = []
	for(let i in oldList ){
		let r = oldList[i]
		let or =listMap[r.id]
		if(!or || !or.id){
			continue
		}
		if(!util.isEqual(or,r)){
			list.push(or)
			continue
		}else{
			list.push(r)
		}
	}
	let oldlistMap = {}
	for(let i in oldList){
		let r = oldList[i]
		oldlistMap[r.id] = r
	}
	for(let i in newList ){
		let r = newList[i]
		let or =oldlistMap[r.id]
		if(!or || !or.id){
			list.push(r)
			continue
		}
	}
	return list
}

util.isEqual= function(objA,objB){
    //相等
    if(objA === objB) return objA !== 0 || 1/objA === 1/objB;
    //空判断
    if(objA == null || objB == null) return objA === objB;
    //类型判断
    if(Object.prototype.toString.call(objA) !== Object.prototype.toString.call(objB)) return false;

    switch(Object.prototype.toString.call(objA)){
        case '[object RegExp]':
        case '[object String]':
            //字符串转换比较
            return '' + objA ==='' + objB;
        case '[object Number]':
            //数字转换比较,判断是否为NaN
            if(+objA !== +objA){
                return +objB !== +objB;
            }

            return +objA === 0?1/ +objA === 1/objB : +objA === +objB;
        case '[object Date]':
        case '[object Boolean]':
            return +objA === +objB;
        case '[object Array]':
            //判断数组
            for(let i = 0; i < objA.length; i++){
                if (!util.isEqual(objA[i],objB[i])) return false;
            }
            return true;
        case '[object Object]':
            //判断对象
            let keys = Object.keys(objA);
            for(let i = 0; i < keys.length; i++){
                if (!util.isEqual(objA[keys[i]],objB[keys[i]])) return false;
            }

            keys = Object.keys(objB);
            for(let i = 0; i < keys.length; i++){
                if (!util.isEqual(objA[keys[i]],objB[keys[i]])) return false;
            }

            return true;
        default :
            return false;
    }
}


util.numberReadable = (n)=>{
	
	if(!n){
		return 0
	}
	
	if(n>100000){
		return Math.floor(n/10000) + '万'
	}
	
	return n
	
}


util.copyToClipboard=(s)=>{
	
	// #ifdef APP-PLUS
	// uni.setClipboardData({
	//     data: s,
	//     success: function () {
	        
	//     }
	// })
	// #endif
	
	// #ifdef H5
	if (window.clipboardData) {
		window.clipboardData.setData('text', s);
	} else {
		(function(s) {
			document.oncopy = function(e) {
				e.clipboardData.setData('text', s);
				e.preventDefault();
				document.oncopy = null;
			}
		})(s);
		document.execCommand('Copy');
	}
	// #endif
}

util.clipboard = function(text,func) {
	clipboard.setString(text)
	func()
}


util.url = (url)=>{
	
	if(!url){
		return ''
	}
	if(url.indexOf('http')==0){
		return url
	}
	return env.download + url
}




util.setStorageSync = (key, data) => {
	// uni.setStorageSync(key, data)
}

util.getStorageSync = (key) => {
	// return uni.getStorageSync(key)
}

util.navigateTo = (url, prop, option) => {

	option = option || {}

	if (prop) {
		let f = '?'
		for (let i in prop) {
			url += f + i + '=' + prop[i]
			f = '&'
		}
	}

	option.url = url

	// uni.navigateTo(option)

}

util.arrayContains = function(array, val) {

	for (let i in array) {
		if (array[i] == val) {
			return true
		}
	}
	return false

}

util.arrayRemove = function(array, val) {
	let index = array.indexOf(val);
	if (index > -1) {
		array.splice(index, 1);
	}
}

util.message = (message, duration = 1.5) => {
	if(!message){
		return
	}
	if (!modal) {
		modal = weex.requireModule('modal')
	}
	modal.toast({
		message,
		duration
	})
}

util.error = (message,  duration = 1.5) => {
	if(!message){
		return
	}
	if (!modal) {
		modal = weex.requireModule('modal')
	}
	modal.toast({
		message,
		duration
	})
}

util.confirm = (title, success, content, cancel) => {
	// uni.showModal({
	// 	title: '',
	// 	content: title || ' ',
	// 	success: (res) => {
	// 		if (res.confirm && success) {
	// 			success();
	// 		} else if (res.cancel && cancel) {
	// 			cancel();
	// 		}
	// 	}
	// })
}

util.back = function(option) {
	
	// uni.navigateBack(option)
}

util.formatNumber = function(n) {
	return n > 9 ? n.toString() : `0${n}`
}

util.formatTime = function(date) {

	if(typeof(date) == 'string'){
		let ar = date.split(/[-:\s]+/)
		return ar[3]+':'+ar[4]
	}
	
		date = new Date(date)
	
	
	
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	const time = [hour, minute].map(util.formatNumber).join(':')

	return time
}
util.formatDateTime = function(date) {
	if(typeof(date) == 'string'){
		let ar = date.split(/[-:\s]+/)
		return ar[1]+'-'+ar[2]+' ' +ar[3]+':'+ar[4]+':'+ar[5]
	}
	
	date = new Date(date)
	
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	const d = [year, month, day].map(util.formatNumber).join('-')
	const time = [hour, minute, second].map(util.formatNumber).join(':')

	return `${d} ${time}`
}
util.formatDate = function(date) {
	
	if(typeof(date) == 'string'){
		let ar = date.split(/[-:\s]+/)
		return ar[1]+'月'+ar[2]+'日'
	}
	
	date = new Date(date)
	
	// const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	// const d = [year, month, day].map(util.formatNumber).join('-')
		return `${month}月${day}日`
}
util.forTypeDate = function(date) {
	
	if(typeof(date) == 'string'){
		let ar = date.split(/[-:\s]+/)
		return ar[1]+'/'+ar[2]
	}
	
	date = new Date(date)
	
	// const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	// const d = [year, month, day].map(util.formatNumber).join('-')

	return `${month}/${day}`
}
util.formatDay = function(date) {
	
	// if(typeof(date) == 'string'){
	// 	let ar = date.split(/[-:\s]+/)
	// 	return ar[1]+'月'+ar[2]+'日'
	// }
	
	date = new Date(date)
	const day = date.getDay()

	// const d = [year, month, day].map(util.formatNumber).join('-')

	return vars.day[day]
}
util.parseDate = (str) => {
    if(!str){
        return ''
    }
    if(typeof str == 'string'){
        str = str.replace(/-/g, '/')
    }
	let d = new Date(str)
	return d
}
const dateFormat = (date, fmt = 'yyyy-MM-dd') => {
    if(!date){
        return ''
    }
    if(typeof date == 'string'){
        date = date.replace(/-/g, '/')
    }
    date = new Date(date)
    
	let o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"H+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"S+": date.getMilliseconds()
	};

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
	}
	for (let k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)))
		}
	}
	return fmt
}

util.dateFormat2 = (date, fmt = 'yyyy-MM-dd') => {
   if (!date) {
    return "";
  }
  if (typeof date == "string") {
    date = date.replace(/-/g, "/");
  }
  date = new Date(date);

  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "S+": date.getMilliseconds(),
  };
	
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(String(o[k]).length)
      );
    }
  }

  return fmt;
}

util.simpleDateTime = (date) => {
	
	if(!date){
	    return ''
	}
	if(typeof date == 'string'){
	    date = date.replace(/-/g, '/')
	}
	date = new Date(date)
	
	let dt = date.getTime()
	let ndt = new Date().getTime()
	if(ndt - dt < 24 * 3600 * 1000){
		return dateFormat(date, 'HH:mm')
	}
	return dateFormat(date, 'yyyy-MM-dd')
	
}

util.getTimeOfMonth = (date = new Date(), t = 0) => {

	let firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - t, 0, 0, 0)
	return util.dateFormat(firstDate)

}

util.getDate = function () {
	let date = new Date()
	let offset = util.stdTimezoneOffset() * 60 * 1000
	let ts = date.getTime() + offset
	let cn = 480 * 60 * 1000
	return new Date(ts + cn)
}

util.stdTimezoneOffset = function () {
	var jan = new Date(2022, 0, 1);
	var jul = new Date(2022, 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

util.dateFormat = dateFormat

util.api = (func, form) => {
	return new Promise((resolve, reject) => {
			func(form).then(resp=>{
				util.message(resp.message)
				resolve(resp)
			}).catch(res=>{
				util.error(res.message)
			})
		}
	)
}

util.json=(str)=>{
	
	if(str && typeof(str)=='string' && str.charAt(0)=='{' && str.charAt(str.length-1)=='}'){
		try{
						return JSON.parse(str)
		}catch(e){
					}
	}else{
			}
	return str
	
}
util.toString=(str)=>{
	
	try{
				return JSON.stringify(str)
	}catch(e){
			}
	return str
	
}
  
util.debounce = (fn, time=200)=>{

  if (fn.debounce) {
	clearTimeout(fn.debounce)
  }
  
  fn.debounce = setTimeout(() => {
	fn.debounce = undefined  
	fn()
	
  }, time)
  
}

util.throttle = (fn, time=200)=> {
		
	if (fn.throttle) {
		return
	}
	fn.throttle = true
	setTimeout(() => {
		fn.throttle = undefined
		fn()
	}, time)
	
}

util.pushAll = function(l,data,isVars,follow){
	if(isVars){
		data.forEach(t=>{
			vars.listUserTask.forEach(u=>{
				if(u.id == t.id){
					t.img=u.img
					t.completeImg=u.completeImg
					if(t.id == 1){
						t.status=1
						t.img=u.completeImg
					}else{
				
						if(follow && follow.id && t.id == 10001){
							t.status=1
							t.img=u.completeImg
				
						}else{
							t.status=u.status
						}
					}
					l.push(t)
					return
				}
			})
		})
	}else{
		data.forEach(r=>{
			l.push(r)
		})
	}

}

util.formatWeek =function(date){
	let myDate = util.parseDate(date)
	let mm = myDate.getDay() 
	let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	let week = weeks[mm]  
	return week
}

util.formatWeeks =function(date){
	let myDate = util.parseDate(date)
	let mm = myDate.getDay() 
	let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	let week = weeks[mm]  
	return week
}

util.formatToDate = function(newDate){
	if(!newDate){
		return ''
	}
	
	if(typeof newDate == 'string'){
	    newDate = newDate.replace(/-/g, '/')
	}
	
		//一小时
		let minute= 3600000
		//一天
		let days= 86400000
		
		let sdays=259200000
		let oleDate =new Date()
		newDate=new Date(newDate)
		let time = oleDate - newDate
		let date = ''
		if(time < minute){
			//一小时内的
			date= Math.floor(time / 1000 / 60 ) + '分钟前'
		}else if(time < days){
			date= Math.floor(time / minute ) + '小时前'
		}else {
			if(time < sdays){
				return this.formatDate(newDate)
			}else{
				date= Math.floor(time / days ) + '天前'
			}
		
		}
		return date
}

util.statusbar = function(b){
	moduleFun.__ag__setStatusBarStyle__(b)
}
util.keyboardHeight = function(event){
	if(!event){
		return 0
	}
	if(event.keyboardSize && event.keyboardSize.height){
		return  event.keyboardSize.height + 14
	}
	if(event.keyboardSize){
		return  event.keyboardSize + 14
	}
	return 0
}

util.keyboardHeights = function(event){
	if(!event){
		return 0
	}
	if(event.keyboardSize && event.keyboardSize.height){
		return  event.keyboardSize.height + 5
	}
	if(event.keyboardSize){
		return  event.keyboardSize + 5
	}
	return 0
}

util.getJumpBaseUrl =function(toUrl,data={}) {  
	var bundleUrl = weex.config.bundleUrl;  
	bundleUrl = new String(bundleUrl);  
	var nativeBase;  
	var native;  
	if (WXEnvironment.platform == 'android') {  
		nativeBase =  bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);  
		native = nativeBase + toUrl + ".js";  
	} else if (WXEnvironment.platform == 'iOS') {  
		nativeBase = bundleUrl.substring(0, bundleUrl.lastIndexOf('/') + 1);  
		native = nativeBase + toUrl + ".js";  
	} else {
		var host = 'localhost:8081';  
		var matches = /\/\/([^\/]+?)\//.exec(bundleUrl);  
		if (matches && matches.length >= 2) {  
			host = matches[1];  
		}
		if (typeof window === 'object') {  
			nativeBase = 'http://' + host + '/';  
		} else {  
			nativeBase = 'http://' + host + '/';  
		}  
		native = nativeBase + toUrl + ".html";  
	}
	if(Object.values(data).length>0){
		native += util.parseData(data)
	}
	return native;  
}
util.parseData = function(data){
	if(Object.values(data).length<=0){
		return
	}
	let s=""
	for(let i in data){
		let r = data[i]
		if(s.length>0){
			s+='&'+ i +'='+r
		}else {
			s='?'+ i +'='+r
		}
	}
	return s
}
util.getPush =function(url,data={}){
	if(!navigator){
		navigator = weex.requireModule('navigator')
	}
	navigator.push({
	  url: util.getJumpBaseUrl(url,data),
	  animated: "true"
	}, event => {
		bc.postMessage('onPause')
			})
}
util.pop =function(page){
	if(!navigator){
		navigator = weex.requireModule('navigator')
	}
	navigator.pop({
	  animated: "true"
	}, event => {
				bc.postMessage('onPause')
	})
		if (page) {
		bc.postMessage('pop-'+page)
	}
}

util.getUrlJson = function(url) {
	let str = url; //取得整个地址栏
	let num = str.indexOf("#");
	if (num == -1) {
		return {}
	}
	str = str.substr(num + 1); //取得所有参数
	let arr = decodeURIComponent(str)
	return util.json(arr)
	
}

util.mergeJoin = function(l){
	l.forEach(r=>{
		if(r.joinMap){
			for(let i in r.joinMap){
				let v = r.joinMap[i]
				if(r[i] === undefined){
					r[i] = v
				}
			}
		}
	})
	
}
let base62 ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
util.base62 = function(i){
	if(!i){
		return ''
	}
	if(isNaN(i)){
		return ''
	}
		let s = ''
	for(;;){
		let n = base62.charAt(i % 62)
		s = n + s
		i = Math.floor(i / 62)
				if(!i){
			break;
		}
	}
	
	return s;
}
let  base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
util.base64 = function (input) {
	let output = "";
	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	let i = 0;
	input = util._utf8_encode(input);
	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output +
		base64.charAt(enc1) + base64.charAt(enc2) +
		base64.charAt(enc3) + base64.charAt(enc4);
	}
	return output;
}
util._utf8_encode = function (string) {
	string = string.replace(/\r\n/g, "\n");
	let utftext = "";
	for (let n = 0; n < string.length; n++) {
		let c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}

	}
	return utftext;
}


util.getItem = function(key){
	
	let item = ''
	if(agkey && key == 'guestToken'){
		item = util.json(moduleFun.__ag__getKey__(key))
		if(item){
			util.setItem(key,item)
			return item
		}
	}
	if(agstore){
		item = util.json(moduleFun.__ag__getStore__(key))
		if(item){
			return item
		}
	}
	if(agvalue){
		item = util.json(moduleFun.__ag__getValue__(key))
		if(item){
			return item
		}
	}
	if(WXEnvironment.platform  == 'Web' && localStorage ){
		item = util.json(localStorage.getItem(key))
		if(item){
			return item
		}
	}
	return item
}

util.setItem = function(key,value){
	// let v = util.toString(value)
	if(agstore){
		moduleFun.__ag__setStore__(key,value)
	}
	if(agvalue){
		moduleFun.__ag__setValue__(key,value)
	}
	if(agkey && key == 'guestToken'){
		moduleFun.__ag__setKey__(key,value)
	}
	if(WXEnvironment.platform  == 'Web' && localStorage ){
		localStorage.setItem(key,value)
	}
}

util.removeItem = function(key){
	if(agkey){
		moduleFun.__ag__removeItem__(key)
	}
}

util.getStorageItem = function(key) {
	let item = ''
	if (!storage) {
		storage = weex.requireModule('storage');
	}
	return new Promise((resolve, reject) => {
		storage.getItem(key, (e)=>{
			if (e.result == "success") {
				item = util.json(e.data)
				resolve(item)
			}
			reject(item)
		})
	})
}

util.setStorageItem = function(key,value) {
	if (!storage) {
		storage = weex.requireModule('storage');
	}
	let v = util.toString(value)
	storage.setItem(key,v)
	
}

util.removeStorageItem = function(key) {
	if (!storage) {
		storage = weex.requireModule('storage');
	}
	storage.removeItem(key)
}

util.setLandscape = function (v) {
	moduleFun.__ag__setLandscape__(v)
}

util.setAudioCategory = function (m) {
	moduleFun.__ag__setAudioCategory__(m)
}

util.isLandscape = function(){
	if (agdevice) {
		let isLandscape = weex.supports(`@module/${thisModule.__ag__device__}.${thisModule.getLandscape}`)
		if (isLandscape) {
			return true
		}
		return false
	}
	return false
}

util.isnet = function(){
	if (net) {
		let isLandscape = weex.supports(`@module/${thisModule.__ag__net__}.${thisModule.check}`)
		if (isLandscape) {
			return true
		}
		return false
	}
	return false
}

util.setVibrate = function (v) {
	moduleFun.__ag__vibrate__(v)
}


util.isVolume = function(){
	return moduleFun.__ag__isVolume__()
}

util.setVolume = function(m){
	moduleFun.__ag__setVolume__(m)
}

util.imageCropPicker = function() {
	if (!ImageCropPicker) {
		ImageCropPicker = weex.requireModule(thisModule.__ag__imageCropPicker__)
	}
	ImageCropPicker.openPicker(options, (response) => {
		if(response && response.code == 'E_SUCCESS'){
			let data = response.data.data
			if (!imgurl) {
				imgurl = new BroadcastChannel('imgurl')
			}
			imgurl.postMessage('data:image/png;base64,' + data)
			let f = {
				file:response.data.data,
				filename:'image.png'
			}
			bc.postMessage('uploadBase64',f)
		}
	})
}

util.reszeImage = function (w = 100,h = 100) {
	let r = h / w
	let s = {}
	if (r > 2) {
		s.h = 600
		s.w = 600 * w / h
	} else {
		s.w = 300
		s.h = 300 * h / w	
	}
	return s
}

util.reszeliveImage = function (w = 100,h = 100) {
	let r = h / w
	let s = {}
	if (r > 2) {
		s.h = 264
		s.w = 264 * w / h
	} else {
		s.w = 132
		s.h = 132 * h / w	
	}
	return s
}

util.calculationText = function(size = 26,text) {
	let w = 0 
	for(let i in text) {
		let r = text[i]
		let c = r.charCodeAt();
		if (c < 128) {
			w += 16 * size / size
		} else {
			w += 29 * size / size
		}
	}
	return w
}

util.cutTextByWidth = function(text, w, size = 26) {
	
	for(let i in text) {
		let r = text[i]
		if(r == '\r' || r == '\n'){
			return i
		}
		let c = r.charCodeAt();
		
		if (c < 128) {
			w -= 13 * size / size
		} else {
			w -= 26 * size / size
		}
		if(w<=0){
			return i
		}
	}

	return text.length
}

util.getLink = function (content) {
	let reg = /(http)s?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/igm;
	let end = content.length
	for(;;){
		let s = reg.exec(content);
		end = s && s.length ? s.index : content.length
		
		if(s && s.length){
			return s[0]
		}
		return ''
	}
}

util.iconfontUtils  = function(){
	let dom = weex.requireModule('dom');
	let platform = WXEnvironment.platform;
	let url;
	if ( "android" == platform || "iOS" == platform) {
		url = `url('local:///${env.iconfont || 'iconfont'}.ttf')`;	
	}
	dom.addRule('fontFace', {
		'fontFamily': "iconfont",
		'src': url
	});
}

util.fontUtils = function () {
	let dom = weex.requireModule('dom');
	let platform = WXEnvironment.platform;
	let url;
	if ("android" == platform || "iOS" == platform) {
		url = `url('${env.download}static/shijiebei/wcnum.ttf')`;
	}
	dom.addRule('fontFace', {
		'fontFamily': "wcnum",
		'src': url
	});
}


util.getUrlParam = function(url) {
	let name, value;
	let data={}
	let str = url; //取得整个地址栏
	let num = str.indexOf("?");
	str = str.substr(num + 1); //取得所有参数   

	let arr = str.split("&"); //各个参数放到数组里
	for (let i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			data[name] = value;
		}
	}
	// util.message(data)
	return data
	
}

util.__ag__checkModule__ = function() {
	let moduleList = [
		`@module/${thisModule.__ag__device__}`
		,`@module/${thisModule.__ag__net__}`
		,`@module/${thisModule.__ag__download__}`
		,`@module/${thisModule.__ag__value__}`
		,`@module/${thisModule.__ag__store__}`
		,`@module/${thisModule.__ag__key__}`
		,`@module/${thisModule.__ag__crypto__}`
		,`@module/${thisModule.__ag__nav__}`
		,`@module/${thisModule.__ag__openInstall__}`
		,`@module/${thisModule.__ag__imageCropPicker__}`
		,`@module/${thisModule.__ag__crypto__}.${thisModule.hmacSha256Sync}`
		,`@module/${thisModule.__ag__device__}.${thisModule.getLandscape}`
		,`@module/${thisModule.__ag__device__}.${thisModule.setLandscape}`
		,`@module/${thisModule.__ag__device__}.${thisModule.setBadge}`
		,`@module/${thisModule.__ag__device__}.${thisModule.setStatusBarStyle}`
		,`@module/${thisModule.__ag__device__}.${thisModule.vibrate}`
		,`@module/${thisModule.__ag__device__}.${thisModule.getDeviceName}`
		,`@module/${thisModule.__ag__device__}.${thisModule.setVolume}`
		,`@module/${thisModule.__ag__device__}.${thisModule.getVolume}`
		,`@module/${thisModule.__ag__device__}.${thisModule.setAudioCategory}`
		,`@module/${thisModule.__ag__download__}.${thisModule.download}`
		,`@module/${thisModule.__ag__download__}.${thisModule.update}`
		,`@module/${thisModule.__ag__download__}.${thisModule.updateUrl}`
		,`@module/${thisModule.__ag__store__}.${thisModule.sgetItem}`
		,`@module/${thisModule.__ag__store__}.${thisModule.ssetItem}`
		,`@module/${thisModule.__ag__value__}.${thisModule.vgetItem}`
		,`@module/${thisModule.__ag__value__}.${thisModule.vsetItem}`
		,`@module/${thisModule.__ag__key__}.${thisModule.kgetItem}`
		,`@module/${thisModule.__ag__key__}.${thisModule.ksetItem}`
		,`@module/${thisModule.__ag__key__}.${thisModule.removeKeyItem}`
		,`@module/${thisModule.__ag__nav__}.${thisModule.open}`
		,`@module/${thisModule.__ag__net__}.${thisModule.check}`
		,`@module/${thisModule.__ag__openInstall__}.${thisModule.oiopen}`
		,`@module/${thisModule.__ag__openInstall__}.${thisModule.regist}`
		,`@module/${thisModule.__ag__openInstall__}.${thisModule.report}`
	]
	let check = weex.requireModule(thisModule.__ag__net__)[thisModule.check]
	let vpn = check()
	let arr1 = []
	let arr2 = []
	for (let i in moduleList) {
		let r = moduleList[i]
		if (weex.supports(r)) {
			arr1.push(r)
		} else {
			arr2.push(r)
		}
	}
	let modules =`check:${check}  vpn:${vpn}\n` + 'false：' + arr2.join('\n') + '\n--------------------------------\n' + 'true：' + arr1.join('\n')

	return modules
}
export default util
