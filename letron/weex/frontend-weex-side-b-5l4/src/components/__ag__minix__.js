	import __ag__sport from "./__ag__sport__.js"
	import util from "./util.js"
	import bc from "./__ag__bc__.js"
	import __ag__sportApi__ from './__ag__sport_api__.js'
	import {pinyin} from './pinyin.js'
	export default {
		name:"__ag__minix__",
		data() {
			return {
				//BBBBBB
				option: {},
				a__ag__pageRoomMsg__: {data:{}},
				a__ag__listMatchScheduleById__: {},
				a__ag__user__: {},
				__ag__listSwiperResp__: {},
				__ag__listUsersLiveResp__: {},
				//YYYYYYY
				a__ag__listSwiper__: [],
				a__ag__listUsersLive__: {
					data : [
						{
							avatar: "",
							id: -1,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						},
						{
							avatar: "",
							id: -2,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						},
						{
							avatar: "",
							id: -3,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						},
						{
							avatar: "",
							id: -4,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						},
						{
							avatar: "",
							id: -5,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						},{
							avatar: "",
							id: -6,
							joinMap: {lic: {}, lin: {},match: {nameAbbr: ""},room: {amount: 0,thumb: ''}},
							thumb: "",
							title: "",
							uid: 0,
							upName: ""
						}
					]
				},
				//JJJJJJJJ
				a__ag__pageUp__: {},
				a_ag__pageUpTime__:0,
				a__ag__pageArticle__:{
					data:{
						list:[]
					}
				},
				a__ag__pageArticleById__:{data:{}},
				//LLLLLLLL
				a__ag__listMatchScheduleClassResp__: {},
				a__ag__pageScheduleResp__: {},
				a__ag__loginByCode__:{data:{}},
				a__ag__listFollowMap__:{},
				a__ag__msgMap__: {},
				a__ag__pageRecommed__:{
					data:{
						list:[]
					}
				},
				a__ag__pageRecommedStanding__:{
					data:[]
				},
				a__ag__liveUpList__:{},
				listLive: [],
				requestLive: [],
			};
		},
		onBackPress() {
			// this.__ag__onBackPress__()
		},
		async onLoad(option){
			this.option = option
		},
		async mounted(){
			//组件拿不到option
			this.__ag__loadData__(this.option)
		},
		computed: {
			ipx(){
				let deviceModel  = weex.config.env.deviceModel

				// if(deviceModel == 'x86_64'){
				// 	return false
				// }
				if(deviceModel>='iPhone10,6'){
					if(deviceModel=='iPhone12,8'){
						return false
					}
					return true
				}
				if(deviceModel=='iPhone10,3'){
					return true
				}
				
				return false
			},
			ivx() {
				let osVersion = weex.config.env.osVersion
				if (osVersion < 16.0) {
					return false
				}
				return true
			},
			isUser(){
				
				// let user = __ag__store__.state.user
				
				let user = this.a__ag__user__
				if(user && user.userType<=2){
					return true
				}
				return false
			}
		},
		created(){
			this.a__ag__user__ = util.getItem('user')
			// uni.$on('onlogin',this.__ag__onlogin__)
		},
		destroyed() {
			// uni.$off('onlogin',this.__ag__onlogin__)
		},
		methods: {
			async __ag__listMatchLineup__(f){
				return await  __ag__sportApi__.listMatchLineup(f)
			},
			async __ag__listPlayerTechnic__(f){
				return await  __ag__sportApi__.listPlayerTechnic(f)
			},
			async __ag__editUsersPassByCode__(f){
				return await  __ag__sportApi__.editUsersPassByCode(f)

			},
			async __ag__showOtherUp__(f){
				return await  __ag__sportApi__.listUsersLive(f)
			},
			async __ag__pageUpSche__(form){
				return  await  __ag__sportApi__.pageUpSche(form)
			},
			async __ag__pageAppVer__(from){
				return await __ag__sportApi__.pageAppVer(from)
			},
			async __ag__editFriend__(f){
				return await __ag__sportApi__.editFriend(f)
			},
			async __ag__listAssistOfUp__(f){
				return await __ag__sportApi__.listAssistOfUp(f)
			},
			async __ag__editVoteUser__(f){
				return await __ag__sportApi__.editVoteUser(f)
			},
			async __ag__listVote__(f){
				return await __ag__sportApi__.pageVote(f)
			},
			async __ag__listGroup__(form){
				return await __ag__sportApi__.listGroup(form)

			},
			async __ag__pageFriend__(form){
				return await __ag__sportApi__.pageFriend(form)
			},
			async __ag__loadGroupMsg__(form){
				 let data  = await __ag__sportApi__.pageGroupMsg(form)
				 return data.data
			},
			async __ag__loadMsg__(form){
				let data  = await __ag__sportApi__.pageMsg(form)
				return  data.data
			},
			async __ag__editRoomUsers__(roomId){
				return await __ag__sportApi__.editRoomUsers({roomId})
			},
			async __ag__loadData__(option){
			},
			//BBBBBB
			async __ag__editRoomMessage__(form){
				return await __ag__sportApi__.editRoomMessage(form)
			},
			async __ag__editMsg__(form){
				return await __ag__sportApi__.editMsg(form)
			},
			async __ag__editGroupMsg__(form){
				return await __ag__sportApi__.editGroupMsg(form)
			},
			async __ag__listMatchScheduleById__(f){
				this.a__ag__listMatchScheduleById__ = await __ag__sportApi__.listMatchSchedule(f)
			},
			async __ag__pageRoomMsg__(roomId){
				let resp = await __ag__sportApi__.pageRoomMsg({roomId})
				resp.data.list = resp.data.list.reverse()
				let list = []
				for (let i in resp.data.list) {
					let r = resp.data.list[i]
					
					if(r.contentType !=3 ){
						let jsonContent = __ag__sport.jsonContent(r.content,r)
						r.jsonContent = jsonContent
					}
					list.push(r)
				}
				resp.data.list = list
				this.a__ag__pageRoomMsg__ = resp
				let ms = this.$refs.messagelist
				if (ms) {
					this.__ag__goscroll__()
				}
			},
			async __ag__pageUpById__(f){
				return await __ag__sportApi__.pageUp(f)
			},
			__ag__onBackPress__(){
				let pages = getCurrentPages();
				if(pages && pages.length>1){
					// uni.navigateBack({
					// 	delele:1
					// })
				}else {
					// uni.navigateTo({
					// 	url:'/pages/__ag__index__'
					// })
				}
			},
			async __ag__upload__(form){
				try {
					return await __ag__sportApi__.upload(form)
				} catch (error) {
					util.message(util.toString(error))
					return ;
				}
			},
			//YYYYYYY
			__ag__submit__() {
				let  guestToken = util.getItem('guestToken')
				util.setItem('token',guestToken)	
				__ag__sport.__ag__infoUser_editGuest__()
				bc.postMessage('onUnread',0)
				util.pop()
				
			},
			__ag__itemtap__(uid,isindex){
				if(!uid){
					return
				}
				let params = {
					tab: 1,
					uid: uid
				}
				// this.$router.push({ path: '/live', query: params});
				util.getPush('__ag__live__',params)
			},
			async __ag__listSwiper__(form){
				this.a__ag__listSwiper__ = await __ag__sportApi__.listSwiper()
				if(!this.a__ag__listSwiper__.data || !this.a__ag__listSwiper__.data.length){
					await this.findUserLive()
					await this.findRequestLive()
				}
			},

			// 直播中的比赛
			async findUserLive() {
				try {
					let resp = await this.__ag__showOtherUp__()
					if (resp.data && resp.data.length) {
						let l = resp.data.sort((a, b)=>{
							let amountA = a.joinMap && a.joinMap.room && a.joinMap.room.amount
							let amountB = b.joinMap && b.joinMap.room && b.joinMap.room.amount
							if (amountA && amountA) {
								return amountA > amountB ? -1 : 1
							}
							return 1
						})
						let list = []
						let map = {}
						for (let i in l) {
							let r = l[i]
							let m = map[r.scheduleId]
							if (m && m.id) {
								continue
							}
							map[r.scheduleId] = r
							r.articleId = r.uid
							r.brand = ''
							r.createTime = ''
							r.device = ''
							r.endTime = ''
							r.id = r.id
							r.matchId = r.matchId
							r.status  = 1
							if(r.joinMap && r.joinMap.room && r.joinMap.room.thumbType != 3 && r.joinMap && r.joinMap.room && r.joinMap.room.thumb) {
								r.thumb = r.joinMap && r.joinMap.room && r.joinMap.room.thumb
							} else {
								r.thumb = r.thumb
							}
							r.thumbPc = ''
							r.joinMap.cmf_match = {
								name: r.joinMap && r.joinMap.match && r.joinMap.match.name,
								nameAbbr: r.joinMap && r.joinMap.match && r.joinMap.match.nameAbbr,
							}
							r.teamFlaga = r.joinMap && r.joinMap.schedule && r.joinMap.schedule.teamFlaga || ''
							r.teamFlagb = r.joinMap && r.joinMap.schedule && r.joinMap.schedule.teamFlagb || ''
							r.teamNamea = r.joinMap && r.joinMap.schedule && r.joinMap.schedule.teamNamea
							r.teamNameb = r.joinMap && r.joinMap.schedule && r.joinMap.schedule.teamNameb
							r.title = r.title
							r.type = 3
							list.push(r)
						}
						if (list && list.length > 4) {
							this.listLive = list.slice(0,4)
						} else {
							let len = 4 - list.length
							let lq = this.requestLive.slice(0,len)
							this.listLive = list.concat(lq)
						}
					} else {
						let lq = this.requestLive
						if (lq && lq.length > 4) {
							this.listLive = lq.slice(0,4)
						} else {
							this.listLive = lq
						}
					}
				} catch (error) {
					
				}
			},
			// 已申请未开播的比赛
			async findRequestLive() {
				try {
					let resp = await this.__ag__listRequestSchedule__()
					if (resp.data && resp.data.length) {
						let l = resp.data
						for (let i in l) {
							let r = l[i]
							r.articleId = r.id
							r.brand = ''
							r.createTime = ''
							r.device = ''
							r.endTime = ''
							r.id = r.id
							r.matchId = r.matchId
							r.status  = 1
							if(r.joinMap && r.joinMap.ru && r.joinMap.ru.thumbType) {
								r.thumb = r.joinMap && r.joinMap.ru && r.joinMap.ru.thumb
							} else {
								r.thumb = ''
							}
							r.thumbPc = ''
							r.joinMap.cmf_match = {
								name: r.joinMap && r.joinMap.match && r.joinMap.match.name,
								nameAbbr: r.joinMap && r.joinMap.match && r.joinMap.match.nameAbbr,
							}
							r.teamFlaga = r.teamFlaga
							r.teamFlagb = r.teamFlagb
							r.teamNamea = r.teamNamea
							r.teamNameb = r.teamNameb
							r.title = r.teamNamea + 'vs' + r.teamNameb
							r.type = 4
						}
						let list = l.sort((a, b)=>{
							let amountA = a.amount
							let amountB = b.amount
							if (amountA && amountA) {
								return amountA > amountB ? -1 : 1
							}
							return 1
						})
						this.requestLive = list
					}
				} catch (error) {
					
				}
			},

			async __ag__listUsersLive__(form){
				let r = await __ag__sportApi__.listUsersLive(form)
				this.a__ag__listUsersLive__ = r;
				util.setItem('listUsersLive',r.data)
				return r;
			},
			async __ag__pageUp__(form){
				let r = await __ag__sportApi__.pageUp()
				this.a__ag__pageUp__ = r;
				return r;
			},
			//JJJJJJJJ
			async __ag__listGroupUser__(f){
				return await __ag__sportApi__.listGroupUser(f)
			},
			async __ag__pageSchedule__(f){
				return await __ag__sportApi__.pageSchedule(f)
			},
			async __ag__pageArticle__(form){
				this.a__ag__pageArticle__ = await __ag__sportApi__.pageArticle()
			},
			async __ag__pageArticleById__(form){
				this.a__ag__pageArticleById__ = await __ag__sportApi__.pageArticle(form)
			},
			async __ag__pageRecommed__(form) {
				this.a__ag__pageRecommed__ = await __ag__sportApi__.pageRecommend(form)
				return this.a__ag__pageRecommed__
			},
			async __ag__pageRecommedStanding__(form) {
				this.a__ag__pageRecommedStanding__ = await __ag__sportApi__.pageRecommendStanding()
			},
			//LLLLLLLL
			async __ag__listMatchScheduleClassList__(form) {
				this.a__ag__listMatchScheduleClassResp__ =  await __ag__sportApi__.listMatchScheduleClass()
			},
			async __ag__formPageSchedule__(form) {
				this.a__ag__pageScheduleResp__ =  await __ag__sportApi__.pageSchedule(form)
				if(!this.a__ag__pageScheduleResp__.data || !this.a__ag__pageScheduleResp__.data.list || !this.a__ag__pageScheduleResp__.data.list.length){
					this.a__ag__scheduleLading_ = false
					this.loadinging = false
					this.a__ag__newMap__={}
					this.a__ag__listByDate__={}
					this.a_ag__dateList__=[]
					return []
				}
				let list = this.a__ag__pageScheduleResp__
				this.__ag__getPageSchedule__(list)
			},
			__ag__getPageSchedule__(resp){
				this.a__ag__newMap__={}
				this.a__ag__listByDate__={}
				this.a_ag__dateList__=[]
				this.a__ag__scheduleItem__.code = resp.code
				this.a__ag__scheduleItem__.code = resp.code
				this.a__ag__scheduleLading_ = false
				this.loadinging = false
				if(resp.data && resp.data.list && resp.data.list.length){
					let list  = resp.data.list
					let r = list[0]
					if (this.a__ag__screen__ == 1) {
						if (list.length == 1) {
							r = list[0]
						} else {
							r = list[4]
						}
						
					}
					// this.a__ag__datetime__ = r.beginTime
					this.__ag__groupByDate__(list)

					setTimeout(()=>{
						if (this.a__ag__screen__ == 0) {
							this.__ag__goCurrentSchedule__()
						} else {
							this.__ag__goCurrentScroll__(r.id)
						}
					}, 500)
				}
			},
			async __ag__getPullingData__(form) {
				let resp =  await __ag__sportApi__.pageSchedule(form)
				if(!resp.data || !resp.data.list || !resp.data.list.length){
					setTimeout(()=>{
						this.a__ag__freshText__ = '没有更多数据'
					},1000)
					setTimeout(()=>{
						this.a__ag__refreshing__ = false
					},1500)
					return []
				}
				let l = resp.data.list
				this.a__ag__refreshing__ = false
				if(l.length){
					let date = l[l.length - 1].beginTime
					setTimeout(()=> {
						// this.a__ag__datetime__ = util.parseDate(date)
						this.a__ag__datetime__ = date
					},500)
					this.__ag__groupByDate__(l)
				}

			},
			async __ag__onloadmore__(form) {
				let resp =  await __ag__sportApi__.pageSchedule(form)
				if(!resp.data || !resp.data.list || !resp.data.list.length){
					setTimeout(()=>{
						this.a__ag__loadMoreText__ = '没有更多数据'
					},1000)
					setTimeout(()=>{
						this.a__ag__loadingMore__ = false
					},1500)
					return []
				}
				let l = resp.data.list
				this.a__ag__loadingMore__ = false
				if(l.length){
					this.__ag__groupByDate__(l)
				}
			},
			__ag__goCurrentSchedule__() {
				
				if(this.__ag__goLivingSchedule__()){
					return
				}
				
				this.__ag__goCurrentTime__()
			},
			__ag__goCurrentScroll__(id) {
				let dom = undefined
				if (!dom) {
					dom = weex.requireModule('dom');
				}
				let currentId = 'schedule-' + id
				let indicator = this.$refs[currentId][0];
				// 滚动正在直播
				if (indicator) {
					let el = indicator;
					dom.scrollToElement(el, {});
				}
			},
			__ag__goLivingSchedule__() {
				for(let j in this.a_ag__dateList__){
					let date =this.a_ag__dateList__[j]
					let list = this.a__ag__listByDate__[date]
					for(let i in list){
						let r =list[i]
						if(r.uid){
							this.__ag__goCurrentScroll__(r.id)
							return true
						}
					}
				}
				return false
			},
			__ag__goCurrentTime__() {

				let time = new Date().getTime() - 20 * 60 * 1000;
			
				for(let j in this.a_ag__dateList__){
					let date =this.a_ag__dateList__[j]
					let list = this.a__ag__listByDate__[date]
					for(let i in list){
						let r =list[i]
						let beginTime = util.parseDate(r.beginTime).getTime();
						if (beginTime >= time) {
							this.__ag__goCurrentScroll__(r.id)
							return true
						}
					}
				}
				
				return false
			},
			__ag__requestList__(livelist,requestList){
				let map = {}
				this.a__ag__liveUpList__ = {}
				for(let i in livelist){
					let r  =  livelist[i]
					let m = map[r.scheduleId]
					let joinMap = r.joinMap
					let schedule = joinMap.schedule
					schedule.userlist = []
					schedule.id = r.scheduleId
					let match = joinMap.match 
					schedule.matchName = match.nameAbbr || match.name
					schedule.matchId = r.matchId
					if(m  && m.id){
						let userlist = m.userlist
						schedule.userlist = userlist
					}
					let user = joinMap.user
					user.uid = r.uid
					user.islive = r.islive
					this.a__ag__liveUpList__[r.uid] = r
					schedule.userlist.push(user)
					schedule.islive = r.islive
					map[r.scheduleId] = schedule
				}
				for(let i in requestList ){
					let r  = requestList[i]
					let m = map[r.id]
					let joinMap = r.joinMap
					let user = joinMap.u
					user.uid = user.id
					user.islive = 0
					r.userlist = []
					if(m && m.id){
						m.userlist.push(user)
						map[r.id] = m
						continue
					}
					r.userlist.push(user)
					map[r.id] = r
				}

				return Object.values(map)
			},
			async __ag__listRequestSchedule__(form){
				return await __ag__sportApi__.listRequestSchedule(form)
			},
			__ag__groupByDate__(list){
				let dateChange = {}
				for(let i in list){
					let r = list[i]
					let date = util.dateFormat(r.beginTime,'yyyy-MM-dd')
					let d = this.a__ag__listByDate__[date]
					
					if(!d){
						d = []
						
						this.a__ag__listByDate__[date] = d
						this.a_ag__dateList__.push(date)
					}
					if(this.a__ag__newMap__[r.id]){
						continue
					}
					this.a__ag__newMap__[r.id] = r
					d.push(r)
					dateChange[date] = true
				}
				
				this.a_ag__dateList__.sort()


				
				for(let i in this.a__ag__listByDate__){
					if(!dateChange[i]){
						continue
					}
					let r = this.a__ag__listByDate__[i]
					r.sort((a,b)=>{
						if ( b.beginTime == a.beginTime) {
							return -1
						}
						return b.beginTime > a.beginTime ? -1 : 1
					})
				}
			},
			async __ag__loginByCode__(form){
				let resp = await __ag__sportApi__.regist(form)
				if(resp.success){
					util.message(resp.message)
					this.a__ag__user__ = resp.data
					__ag__sport.__ag__onlogin__(resp)
					util.pop()
				}
			},
			async __ag__loginBind__(f){
				let resp = await __ag__sportApi__.editBind(f)
				if(resp.success){
					util.message('绑定成功')
					this.a__ag__user__ = resp.data
					util.pop()
					__ag__sport.__ag__onlogin__(resp)
				}else {
					util.message(resp.message)

				}
			},
			async __ag__login__(form){
				let resp = await __ag__sportApi__.login(form)
				if(resp.success){
					util.message(resp.message)
					this.a__ag__user__ = resp.data
					util.pop()
					__ag__sport.__ag__onlogin__(resp)
				}
			},
			async __ag__editFeedback__(form){
				__ag__sportApi__.editFeedback(form)
			},
			async __ag__getMsgList__() {
				let msgMap = this.a__ag__msgMap__
				
				for(let i in msgMap) {
					delete msgMap[i]
				}
				if (!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
					return
				}
				let resp = await __ag__sportApi__.listGroup()
				if (resp.data && resp.data.length > 0) {
					resp.data.forEach(r=>{
						let key = `2-${r.uid}-${r.groupId}`
				
						r.list = []
						r.targetId = r.groupId
						r.type = 2
						r.name = r.joinMap.g.name || 'ID'+r.id
						r.amount = r.joinMap && r.joinMap.g && r.joinMap.g.amount
						r.lastTime = r.updateTime
						msgMap[key] = r
						this.$set(msgMap,key,r)
					})
					
				}
				let resp1 = await __ag__sportApi__.listFriend()
				if (resp1.data && resp1.data.length > 0) {
					resp1.data.forEach(r=>{
						let key = `3-${r.uid}-${r.friendId}`
				
						r.list = []
						r.targetId = r.friendId
						r.type = 3
						r.name = r.joinMap.u.userNicename || 'ID'+r.id
						r.avatar = r.joinMap.u.avatar 
						r.lastTime = r.updateTime
						this.$set(msgMap,key,r)
					})
				}
				this.a__ag__msgList__ = Object.values(msgMap)
				this.checkUnread()
				
			},
			async __ag__getFriendList__() {
				let resp = await __ag__sportApi__.listFriend()
				if (resp.data && resp.data.length > 0) {
					let list = resp.data
					for(let i in list){
						let r = list[i]
						r.type = 3
						r.name = r.joinMap.u.userNicename || '#'+r.id
						r.avatar = r.joinMap.u.avatar
						
						r.pinyin = pinyin(r.name)
						r.index = r.pinyin[0]
						
					}
					list = list.sort((a,b)=>{
						return a.pinyin > b.pinyin ? 1 : -1
					})
					this.a__ag__friendList__ = list
				}else {
					this.a__ag__friendList__ =[]
				}
			},
			checkUnread(){
				let unread = 0
				if (!this.a__ag__msgList__ || !this.a__ag__msgList__.length) {
					bc.postMessage('onUnread',unread)
					return
				}
				for(let i in this.a__ag__msgList__){
					let r = this.a__ag__msgList__[i]
					if(r.userHide==0 && r.unread>0){
						unread += r.unread
						continue;
					}
				}
				if(unread>0){
					unread = unread > 99 ? 99 : unread
				}
				bc.postMessage('onUnread',unread)
			},
			jumpRecommed(item) {
				if(!this.a__ag__user__ || this.a__ag__user__.userType == 3) {
					util.getPush('__ag__login__')
					return
				}
				util.getPush('__ag__recommedsDetails__',{id:item.id})
			},
			async __ag__editGood__(f) {
				return await __ag__sportApi__.editGood(f)
			},
			async __ag__editGoodCancel__(id) {
				return await __ag__sportApi__.editGoodCancel({id:id})
			},
			async __ag__getUsers__(f) {
				return await __ag__sportApi__.pageUsers(f)
			},
			async __ag__editFriend__(f) {
				return await __ag__sportApi__.editFriend(f)
			},
			async __ag__getUserMatch__(f) {
				return await __ag__sportApi__.pageUserMatch(f)
			},
			async __ag__editFollow__(f) {
				return await __ag__sportApi__.editFollow(f)
			},
			async __ag__editFollowCancel__(f) {
				return await __ag__sportApi__.editFollowCancel(f)
			},
			async __ag__removeUserMatch__(f) {
				return await __ag__sportApi__.removeUserMatch(f)
			},
			async __ag__editUserMatch__(f) {
				return await __ag__sportApi__.editUserMatch(f)
			},
			async __ag__getListUserMatch__(from) {
				return await __ag__sportApi__.listUserMatch(from)
			},
			async __ag__removeUserMatch__(f) {
				return await __ag__sportApi__.removeUserMatch(f)
			},
			async __ag__getListMatchEvent__(f) {
				return await __ag__sportApi__.listMatchEvent(f)
			},
			async __ag__getListMatchDetail__(f) {
				return await __ag__sportApi__.listMatchDetail(f)
			},
			async __ag__getListMatchScheduleById__(f){
				return await __ag__sportApi__.listMatchSchedule(f)
			},
			async __ag__listHotMatch__(){
				return await __ag__sportApi__.listHotMatch()
			},
			async __ag__getlistUsersLive__(){
				return await __ag__sportApi__.listUsersLive()
			},
		}
	}