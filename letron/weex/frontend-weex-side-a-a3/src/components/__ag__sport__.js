import __ag__sport_api__ from './__ag__sport_api__.js'
import ws from './uniws.js'
import a__ag__util__ from './util.js'
import env from './env.js'
import JPush from './jpush.js'
import module from './__ag__module__.js'
import moduleFun from './__ag__moduleFun__.js'
const sport = {}
let webSocket = undefined
let navigator  = undefined
let agdevice = undefined
sport.delMsg=function(messageList,r){
	for(let k in messageList){
		if(messageList[k].id==r.id){
			messageList.splice(k,1)
			break
		}
	}
}

sport.goPolicy = (t)=>{
	a__ag__util__.getPush("__ag__web__", {
    url: `https://file.${env.agreement}/file/assets/static/privacy.html`,
    title: "Privacy",
  })
}
sport.goAgreement = (t)=>{
	a__ag__util__.getPush("__ag__web__", {
    url: `https://file.${env.agreement}/file/assets/static/eula.html`,
    title: "Service",
  })
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
		console.log("logout",res)
		// delete getApp().globalData.token;
		// delete getApp().globalData.user;
		let  guestToken = a__ag__util__.getItem('guestToken')
		a__ag__util__.setItem('token',guestToken)
		a__ag__util__.setItem('user','')
		a__ag__util__.message('账号已退出')
		// sport.__ag__infoUser_editGuest__()
	}
};
sport.__ag__onLogint__ = (res)=>{
	
};
sport.setBadge=(num)=>{
	let platform = weex.config.env.platform
	if(JPush && platform!='Web'){
		JPush.setBadge(num)
	}
	
	moduleFun.__ag__setBadge__(num)
}
sport.initJPushService=()=>{
		// let platform = weex.config.env.platform
		
		// // let app = getApp() 
		// // let jpushModule = app.jpushModule
		// let jpushModule = jpush;
		// // if(!jpushModule){
			
		// // 	app.jpushModule = jpushModule
		// // }
		// if(!jpushModule){
		// 	a__ag__util__.message('推送无法正常运行')
		// 	return
		// }
		// // 初始化
		// jpushModule.init();
		// a__ag__util__.message("极光")
	
		
		// 获取 RegistrationId
		// JPush.getRegistrationID(result=>{
		// 	a__ag__util__.message(a__ag__util__.toStirng(result))
		// 	if(result.registerID){
		// 		sport.registerId =  platform.charAt(0)+'-'+ result.registerID
		// 		sport.editRegisterId()
		// 	}
		// })
		//  点击推送
		// JPush.getLaunchAppNotification(result=>{
		// 	// let notificationEventType = result.notificationEventType
		// 	// let messageID = result.messageID
		// 	// let title = result.title
		// 	// let content = result.content
		// 	// let extras = result.extras
		// 	a__ag__util__.message(a__ag__util__.toStirng(result))
		// 	if(result.notificationEventType == 'notificationOpened' && result.extras){
		// 		sport.notificationType(result.extras)
		// 	}
		// });
		try {
			JPush.init() // 初始化 JPush 插件，如果没有调用这个方法，JS 端将不会收到相关事件。
			// JPush.setDebugMode(true) // 设置打开debug模式，Android only
			JPush.applyPushAuthority() // 申请推送权限 iOS only
			console.log("推送初始化完成")
			// let agvalue = weex.requireModule(module.__ag__value__).value('jtoken')
			let agvalue = moduleFun.__ag__getValue__('jtoken')
			// a__ag__util__.message("agvalue"+agvalue)
		} catch (error) {
			// a__ag__util__.message("推送无法初始化")
			console.log("JPush=======",error)
		}
}
sport.editRegisterId = (userId)=>{
	// console.log("sport.registerId",sport.registerId,sport.userId)
	try {
		// let agvalue = weex.requireModule(module.__ag__value__).value('jtoken')
		let agvalue = moduleFun.__ag__getValue__('jtoken')
		if(userId && agvalue){
			__ag__sport_api__.editRegisterId({registerId:agvalue}).then(resp=>{
				console.log("绑定推送成功")
			}).catch(res=>{
				// a__ag__util__.message('无法绑定推送设备')
			})
		}
	} catch (error) {
		
	}

}
sport.urlTo = (item)=>{
	if(item.url){

		if(WXEnvironment.platform  == 'Web'){
			if(!window.open(item.url)){
				location.href = item.url
			}
			return 
		}
		moduleFun.__ag__open__(item.url)
	}
}
sport.__ag__onlogin__=(resp)=>{
	let __ag__user__ = resp.data
	sport.userId = __ag__user__.id
	if(__ag__user__ && __ag__user__.userType<3){
		sport.editRegisterId(__ag__user__.id)
	}
	let  token = a__ag__util__.dt < 3 ? resp.data.tokenApp : resp.data.token
	a__ag__util__.setItem('token',token)
	a__ag__util__.setItem('muted','false')
	a__ag__util__.toStirng(resp.data) 
	let data = resp.data
	a__ag__util__.setItem('user',a__ag__util__.toStirng(__ag__user__))
	if(!webSocket){
		webSocket = new ws(
			sport.__ag__onMessage__,
			sport.__ag__onClose__,
			sport.__ag__onOpen__,
			sport.__ag__onLogout__,
			sport.__ag__onLogint__
		);
	}
	const Steve = new BroadcastChannel('onlogin')
	Steve.postMessage(data)
	webSocket.open(__ag__user__.socketUrl, __ag__user__.socketIndex, __ag__user__.id,token)
}

sport.__ag__infoUser_editGuest__=(t)=>{
	let info ={}
	info.deviceType = 2
	let token =  a__ag__util__.getItem('token')
	let  guestToken = a__ag__util__.getItem('guestToken')
	console.log('guest==',guestToken,token)
	if(!token){
		token = guestToken
		a__ag__util__.setItem('token',token)
	}
	if(token){
		__ag__sport_api__.infoUser(info).then(sport.__ag__onlogin__).catch(res=>{
			console.log('guest==1',a__ag__util__.toStirng(res))
			if(res.code == '400' || res.code == '404'){
				let  guestToken = a__ag__util__.getItem('guestToken')
				if(token != guestToken){
					a__ag__util__.setItem('token',guestToken)
				}else {
					a__ag__util__.setItem('token','')
					a__ag__util__.setItem('guestToken','')
				}
				sport.__ag__infoUser_editGuest__()
			}
		})
	}else {
		__ag__sport_api__.editGuest(info).then(resp=>{
			console.log('guest==2',a__ag__util__.toStirng(resp))
			if(resp.data && resp.data.userType == 3){
				let tokenApp = a__ag__util__.dt < 3 ? resp.data.tokenApp : resp.data.token
				a__ag__util__.setItem('guestToken', tokenApp)
			}
			sport.__ag__onlogin__(resp)
		}).catch(res=>{
			a__ag__util__.message(res.message)
		})
	}
}

export default sport

