import __ag__sport_api__ from './__ag__sport_api__.js'
import util from './util.js'
import env from './env.js'

import JPush from './jpush.js'
import vars from './vars.js'
import webSocket from './webSocket.js'
import bc from './__ag__bc__.js'
import moduleFun from './__ag__moduleFun__.js'
	import dayjs from 'dayjs'
	import utc from 'dayjs/plugin/utc'
	import timezone from 'dayjs/plugin/timezone'
const sport = {}

let channel = env.channel['ios'];
sport.setBadge=(num)=>{
	// let platform = weex.config.env.platform
	// if(JPush && platform!='Web'){
	// 	JPush.setBadge(num)
	// }
	moduleFun.__ag__setBadge__(num)
	
}
sport.delMsg=function(messageList,r){
	for(let k in messageList){
		if(messageList[k].id==r.id){
			messageList.splice(k,1)
			break
		}
	}
}

sport.goPolicy = (t)=>{
	util.getPush('__ag__web__',{url: `https://${env.agreement}/privacy.html`,title:'Privacy'})
}
sport.goAgreement = (t)=>{
	util.getPush('__ag__web__',{url: `https://${env.agreement}/service.html`,title:'Service'})
}

sport.__ag__onMessage__ = (res)=>{
	const Steve = new BroadcastChannel('msg')
	Steve.postMessage(res)
};
sport.__ag__onClose__ = (res)=>{
		const Steve = new BroadcastChannel('socket')
	Steve.postMessage(false,res)
};
sport.__ag__onOpen__ = (res)=>{
	const Steve = new BroadcastChannel('socket')
		Steve.postMessage(true,res)
};
sport.__ag__onLogout__ = (res)=>{
	if(res.action == "logout"){
				// delete getApp().globalData.token;
		// delete getApp().globalData.user;
		let  guestToken = util.getItem('guestToken')
		util.setItem('token',guestToken)
		util.setItem('user','')
		util.message('该账号已从别的设备登录')
	}
	sport.__ag__infoUser_editGuest__()
};
sport.__ag__onLogint__ = (res)=>{
	
};
sport.initJPushService=()=>{
		let platform = weex.config.env.platform
		
		// let app = getApp() 
		// let jpushModule = app.jpushModule
		// let jpushModule = jpush;
		// if(!jpushModule){
			
		// 	app.jpushModule = jpushModule
		// }
		// if(!JPush){
		// 	util.message('推送无法正常运行')
		// 	return
		// }
		try {
			// 获取 RegistrationId
			// JPush.getRegistrationID(result=>{
			// 	util.message(result)
			// 	if(result.registerID){
			// 		sport.registerId =  platform.charAt(0)+'-'+ result.registerID
			// 		sport.editRegisterId()
			// 	}
			// })
			//  点击推送
			// JPush.getLaunchAppNotification(result=>{
			// 	let notificationEventType = result.notificationEventType
			// 	let messageID = result.messageID
			// 	let title = result.title
			// 	let content = result.content
			// 	let extras = result.extras
			// 	if(result.notificationEventType == 'notificationOpened' && result.extras){
			// 		sport.notificationType(result.extras)
			// 	}
			// });
			JPush.init() // 初始化 JPush 插件，如果没有调用这个方法，JS 端将不会收到相关事件。
			// JPush.setDebugMode(true) // 设置打开debug模式，Android only
			JPush.applyPushAuthority() // 申请推送权限 iOS only
					} catch (error) {
						
			// util.message("推送无法初始化")
		}
}
sport.editRegisterId = (userId)=>{
		try {
		let agvalue = moduleFun.__ag__getValue__('jtoken')
		if(userId && agvalue){
			__ag__sport_api__.editRegisterId({registerId:agvalue}).then(resp=>{
							}).catch(res=>{
				// util.message('无法绑定推送设备')
			})
		}
	} catch (error) {
		
	}

}
sport.__ag__onlogin__=(resp)=>{
	// let __ag__app__ = getApp()
	let __ag__user__ = resp.data
	sport.userId = __ag__user__.id
	if(__ag__user__ && __ag__user__.userType<3){
		sport.editRegisterId(__ag__user__.id)
	}
	let token = util.dt < 3 ? __ag__user__.tokenApp : __ag__user__.token
	util.setItem('token',token)
	util.setItem('muted','false')
	let data = resp.data
	util.setItem('user',util.toString(resp.data))
	const Steve = new BroadcastChannel('onlogin')
	Steve.postMessage(data)
}
	
sport.indexopenws = (user,token)=>{
	webSocket.openws(sport.__ag__onMessage__,sport.__ag__onClose__,sport.__ag__onOpen__,sport.__ag__onLogout__,sport.__ag__onLogint__,user,token)
}
sport.__ag__infoUser_editGuest__=()=>{
	let info ={}
	info.deviceType = 2

	let token =  util.getItem('token')
	let  guestToken = util.getItem('guestToken')
	if(!token){
		token = guestToken
		util.setItem('token',token)
	}
	if(token){
		__ag__sport_api__.infoUser(info).then(sport.__ag__onlogin__).catch(res=>{
						if(res.code == '400' || res.code == '404'){
				if(token != guestToken){
					util.setItem('token',guestToken)
				}else {
					util.setItem('token','')
					util.setItem('guestToken','')
				}
				sport.__ag__infoUser_editGuest__()
			}
		})
	}else {
		__ag__sport_api__.editGuest(info).then(resp=>{
			if(resp.data && resp.data.userType == 3){
				let tokenApp = util.dt < 3 ? resp.data.tokenApp : resp.data.token
				util.setItem('guestToken', tokenApp)
			}
			sport.__ag__onlogin__(resp)
		}).catch(res=>{
			util.message(res.message)
		})
	}
}

sport.emotionlist2 = vars.emoji
sport.jsonContent =(content,n)=>{
	let msg = []
	if(/^\[.+\]$/.test(content)){
				let emo = content.substr(1, content.length-2)
				let hi = sport.emotionlist2.indexOf(emo)
				if(hi >= 0){
			if(n){
				n.hi = true
			}
			let imageUrl = `emoji/${hi+1}.jpg`
						msg.push({content: imageUrl,contents: '', type: 'image'})
		}
		return msg
	}
	
	let reg = /(http)s?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/igm;
	let start = 0;
	let end = content.length
	for(;;){
		let s = reg.exec(content);
		end = s && s.length ? s.index : content.length
	
		let t = content.substring(start, end)
		if(t){
			msg.push({content: t,contents: '', type: 'text'})
		}
		start = s && s.length ? end + s[0].length : content.length
		
		if(s && s.length){
			msg.push({content: s[0],contents: '', type:'http'})
		}else{
			return msg
		}
		
		
	}
}


sport.subFriendUnread=function(list,friendId){
	let key = `3-${this.a__ag__user__.id}-${friendId}`
	let unread = 0
	let id = []
	list.forEach(r=>{
		if(r.status==0){
			id.push(r.id)
		}
	})
	if(id.length>0){
		unread = id.length
		let f = {
			key: key,
			unread:unread
		}
		bc.postMessage('msgUnread',f)
		__ag__sport_api__.editMsgRead({id, friendId}).then(resp=>{
		}).catch(res=>{
			util.message(res.message)
		})
	}
}

sport.subGroupUnread=function(list,groupId){
	if(!this.a__ag__user__ || !this.a__ag__user__.id){
		return
	}
	
	let key = `2-${this.a__ag__user__.id}-${groupId}`
	let id = []
	let unread = 0
	list.forEach(r=>{
		if(r.status==0){
			id.push(r.id)
		}
	})
	
	if(id.length>0){
		unread = id.length
		let f = {
			key: key,
			unread:unread
		}
		bc.postMessage('msgUnread',f)
		__ag__sport_api__.editGroupMsgRead({id, groupId}).then(resp=>{
		}).catch(res=>{
			util.message(res.message)
		})
	}
}
sport.click = (toUrl) => {
	let user = util.getItem('user');
	let uid = user && user.id || 0
	let ct = user && user.createTime ? util.parseDate(user.createTime) : new Date()
	let f = {
		ci: channel,
		uid: uid,
		dt: 1,
		ct: ct.getTime(),
		toUrl
	}
	__ag__sport_api__.click(f)
};
sport.getRef = () => {
	let user = util.getItem('user');
	let dt = '1'
	let uid = user && user.id
	if (!user || !user.id) {
	  uid = 0
	}
	let ct = (util.parseDate(user.createTime) || new Date()).getTime();
	
	return `${uid}_${dt}_${ct}_${channel}`;
  };
sport.urlTo = (item)=>{
	bc.postMessage('onPause')
	if(item.url){
		if(WXEnvironment.platform  == 'Web'){
			if(!window.open(item.url)){
				location.href = item.url
			}
			return 
		}
		let url = item.url
		
		if (url) {
			let q = url.indexOf("?") == -1 ? "?" : "&";
			let ref = sport.getRef();
			url = url + q + "From=" + ref;
			sport.click(url)
		}
		moduleFun.__ag__open__(url)
	}
}
sport.showAppDownDate = (t)=>{
	// let las = undefined
	// if (!storage) {
	// 	storage = weex.requireModule('storage');
	// }
	// storage.getItem('lastdate',(e)=>{
	// 	let date = util.dateFormat(new Date())
	// 	if(e.result == "success"){
	// 		let lastdate = e.data
	// 		if(!lastdate || lastdate != date){
	// 			storage.setItem("lastdate",date)
	// 			las = true 
	// 		}
	// 		las = false
	// 	} else {
	// 		storage.setItem("lastdate",date)
	// 		las = true 
	// 	}
	// 	return las
	// })
	let date = util.dateFormat(new Date())
	let lastdate = util.getItem('lastdate')
	if(!lastdate || lastdate != date){
		util.setItem("lastdate",date)
		return true 
	}
	return false
}
//主播不在家的数据
//如果有预约即将开始（1个小时），则倒计时
//如果没有，则推荐其他正在直播的主播, 按热度排名
sport.onUpAbsent = (t, uid)=>{
	__ag__sport_api__.pageUpSche({uid}).then(resp=>{
		// t.$set(getApp().globalData, 'pageUpSche', resp.data)
				let incomeLive = sport.hasIncomeLive(resp.data.list)
		// t.$set(getApp().globalData, 'incomeLive', incomeLive)
		t.incomeLive = incomeLive
				if(!incomeLive || !incomeLive.id){
						sport.showOtherUp(t)
		}else{
			// t.startCountTime()
			t.isincomeLive = true
		}
	}).catch(res=>{
		util.message(res.message)
	})
}
sport.hasIncomeLive = (l,islive)=>{
	let date = new Date()
	let now = date.getTime()
	l.reverse()
	for(let i in l){
		let r = l[i]
		let beginTime = util.parseDate(r.beginTime)
		if(!beginTime || !beginTime.getTime()){
			return {}
		}
		let t = beginTime.getTime() - now
		// r.t =false
		if(t>0 && t<86400000){
			// r.t = true\

			return r;
		}
		if(islive){
			return r;
		}

	}
	return {}
}
// 热门主播
sport.showOtherUp = (t)=>{
		// t.$store.dispatch('listUsersLives')
	__ag__sport_api__.listUsersLive().then(resp=>{
		if( resp.data && resp.data.length>0){
			let otherUp = resp.data[0]
			t.$set(t,'otherUp', otherUp)
		}
	}).catch(res=>{
		util.message(res.message)
	})
}

sport.getSevenDays = (ob,haveSigned,serial,code) =>{
	let now = new Date(code)

	let today = dayjs(now).tz("Asia/Shanghai").format('YYYY-MM-DD')
	let today2 = dayjs(now).tz("Asia/Shanghai").format('DD/MM')
	let yesterday = dayjs(new Date(code-24*60*60*1000)).tz("Asia/Shanghai").format('YYYY-MM-DD')

	let stat = ob && ob.joinMap && ob.joinMap.stat || {}
	
	// stat.amount = 1
	// stat.date = '2022-10-22'

	let signTimes = 0
	let amount = 0
	if(stat.date == today){
		if(stat.amount > 0 && stat.amount % 7 == 0){
			signTimes = 6
			amount = 7
		}else{
			signTimes = (stat.amount - 1) % 7
			amount = signTimes + 1
		}
	}else if(stat.date == yesterday){
		signTimes = stat.amount % 7
		amount = signTimes
	}
	
	let ts = code - signTimes* 24 * 60* 60 * 1000
	let daySignList = []
	for(let i=0;i<7;i++){
		
		let obj = {}
		obj.id = i
		obj.award= ( i==2 || i==6) ? 3  : 1
		obj.complete = i < amount ? 1 : 0
		obj.day = dayjs(new Date(ts + i * 24 * 60* 60 * 1000 )).tz("Asia/Shanghai").format('DD/MM')
		obj.today = obj.day == today2 ? 1 : 0
		obj.logo = ob.logo
		daySignList.push(obj)
	}
	
	return daySignList
}


sport.getListMetaData = async function() {
	let resp = await __ag__sport_api__.listMetaData()
	let map = {}
	if (resp.data && resp.data.length) {
		for (let i in resp.data) {
		  let r = resp.data[i];
		  let m = map[r.label];
		  if (m && m.id) {
			continue;
		  }
		  map[r.label] = r.value;
		}
		util.setItem('metaDataMap',map)
		bc.postMessage('afreshMetaData')
	}
}

export default sport

