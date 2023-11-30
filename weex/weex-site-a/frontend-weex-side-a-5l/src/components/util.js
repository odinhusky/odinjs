import vars from './vars.js'
import env from './env.js'
import sha256 from 'js-sha256'
import module from './__ag__module__.js'
import moduleFun from './__ag__moduleFun__.js'
import moduleReg from './__ag__moduleReg__.js'

const util = {}

let modal = undefined
let net = weex.requireModule(module.__ag__net__)
let agstore = weex.requireModule(module.__ag__store__);
let agvalue = weex.requireModule(module.__ag__value__);
let agkey = weex.requireModule(module.__ag__key__);
let agdevice = weex.requireModule(module.__ag__device__);
util.brand = env.brand
util.dt = 1
if(WXEnvironment.platform  == 'Web'){
	util.dt = 3
}
let navigator = undefined
util.platform = 'ios'
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
	let channel = env.channel[util.platform]
	let  brand = env.brand
	let vpn = '0'
	if(net){
		vpn = moduleFun.__ag__check__() ? '1' : '0'
	}
	let agdevicename = undefined
	if(agdevice){
		agdevicename = encodeURIComponent(util.base64(moduleFun.__ag__getDeviceName__()))
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
		return ''
	}
	
	if(n>=10000){
		return Math.floor(n/10000).toFixed(1) + '万'
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


util.url = (url)=>{
	
	if(!url){
		return ''
	}
	if(url.indexOf('http')==0){
		return url
	}
	return env.download + url
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
	console.log('-------',message)
	if (!modal) {
		modal = weex.requireModule('modal')
	}
	modal.toast({
		message,
		duration
	})
}

util.error = (title, icon = 'none', duration = 2000) => {
	if(!title){
		return
	}
	// uni.showToast({
	// 	title,
	// 	icon,
	// 	duration
	// })
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
	console.log(month,day)
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
			// console.log('is json string', str)
			return JSON.parse(str)
		}catch(e){
			console.log('util.json', e)
		}
	}else{
		// console.log('not jsonstring', str)
	}
	return str
	
}
util.toStirng=(str)=>{
	
	try{
		// console.log('is json string', str)
		return JSON.stringify(str)
	}catch(e){
		console.log('util.stringify', e)
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

util.keyboardHeight = function(event){
	if(!event){
		return 0
	}
	if(event.keyboardSize && event.keyboardSize.height){
		return  event.keyboardSize.height 
	}
	if(event.keyboardSize){
		return  event.keyboardSize
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
		console.log('callback: ', event )
	})
}
util.pop =function(){
	if(!navigator){
		navigator = weex.requireModule('navigator')
	}
	navigator.pop({
	  animated: "true"
	}, event => {
		console.log('callback: ', event) 
	})
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

let base62 ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
util.base62 = function(i){
	if(!i){
		return ''
	}
	if(isNaN(i)){
		return ''
	}
	console.log('i',i)
	let s = ''
	for(;;){
		let n = base62.charAt(i % 62)
		s = n + s
		i = Math.floor(i / 62)
		console.log('i',i)
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

util.iconfontUtils  = function(){
	let dom = weex.requireModule('dom');
	let platform = WXEnvironment.platform;
	let url;
	if ( "android" == platform || "iOS" == platform) {
		url = "url('local:///bl.ttf')";	
	} else {
		url = "url('https://at.alicdn.com/t/c/font_3744412_si354vz0kn.woff2?t=1667358828928')"
	}
	dom.addRule('fontFace', {
		'fontFamily': "iconfont",
		'src': url
	});
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
	if(WXEnvironment.platform == 'Web'){
		if(localStorage){
			item = util.json(localStorage.getItem(key))
			if(item){
				return item
			}
		}
	}
	return item
}

util.setItem = function(key,value){
	// let v = util.toStirng(value)
	if(agstore){
		moduleFun.__ag__setStore__(key,value)
	}
	if(agvalue){
		moduleFun.__ag__setValue__(key,value)
	}
	if(agkey && key == 'guestToken'){
		moduleFun.__ag__setKey__(key,value)
	}
	if(WXEnvironment.platform  == 'Web' && localStorage){
		localStorage.setItem(key,value)
	}
}

util.isVolume = function(){
	return moduleFun.__ag__isVolume__()
}

util.getVolume = function(){
	return moduleFun.__ag__getVolume__()
	
}

util.setVolume = function(m){
	moduleFun.__ag__setVolume__(m)
}

util.setLandscape = function(m){
	moduleFun.__ag__setLandscape__(m)
}

util.setAudioCategory = function(m){
	moduleFun.__ag__setAudioCategory__(m)
}

util.setStatusBarStyle = function(m){
	moduleFun.__ag__setStatusBarStyle__(m)
}

util.__ag__checkModule__ = function() {
	let moduleList = [
		`@module/${module.__ag__device__}`
		,`@module/${module.__ag__net__}`
		,`@module/${module.__ag__download__}`
		,`@module/${module.__ag__value__}`
		,`@module/${module.__ag__store__}`
		,`@module/${module.__ag__key__}`
		,`@module/${module.__ag__crypto__}`
		,`@module/${module.__ag__nav__}`
		,`@module/${module.__ag__openInstall__}`
		,`@module/${module.__ag__imageCropPicker__}`
		,`@module/${module.__ag__crypto__}.${moduleReg.hmacSha256Sync}`
		,`@module/${module.__ag__device__}.${moduleReg.getLandscape}`
		,`@module/${module.__ag__device__}.${moduleReg.setLandscape}`
		,`@module/${module.__ag__device__}.${moduleReg.setBadge}`
		,`@module/${module.__ag__device__}.${moduleReg.setStatusBarStyle}`
		,`@module/${module.__ag__device__}.${moduleReg.vibrate}`
		,`@module/${module.__ag__device__}.${moduleReg.getDeviceName}`
		,`@module/${module.__ag__device__}.${moduleReg.setVolume}`
		,`@module/${module.__ag__device__}.${moduleReg.getVolume}`
		,`@module/${module.__ag__device__}.${moduleReg.setAudioCategory}`
		,`@module/${module.__ag__download__}.${moduleReg.download}`
		,`@module/${module.__ag__download__}.${moduleReg.update}`
		,`@module/${module.__ag__download__}.${moduleReg.updateUrl}`
		,`@module/${module.__ag__store__}.${moduleReg.sgetItem}`
		,`@module/${module.__ag__store__}.${moduleReg.ssetItem}`
		,`@module/${module.__ag__value__}.${moduleReg.vgetItem}`
		,`@module/${module.__ag__value__}.${moduleReg.vsetItem}`
		,`@module/${module.__ag__key__}.${moduleReg.kgetItem}`
		,`@module/${module.__ag__key__}.${moduleReg.ksetItem}`
		,`@module/${module.__ag__key__}.${moduleReg.removeKeyItem}`
		,`@module/${module.__ag__nav__}.${moduleReg.open}`
		,`@module/${module.__ag__net__}.${moduleReg.check}`
		,`@module/${module.__ag__openInstall__}.${moduleReg.oiopen}`
		,`@module/${module.__ag__openInstall__}.${moduleReg.regist}`
		,`@module/${module.__ag__openInstall__}.${moduleReg.report}`
	]
	let check = weex.requireModule(module.__ag__net__)[moduleReg.check]
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
	let modules = `check:${check}\n` + `vpn:${vpn}\n` +  'false：' + arr2.join('\n') + '\n--------------------------------\n' + 'true：' + arr1.join('\n')

	return modules
}

export default util
