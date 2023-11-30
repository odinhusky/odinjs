	import __ag__sport from "./__ag__sport__.js"
	import __ag__util from "./util.js"
	import __ag__sportApi__ from './__ag__sport_api__.js'
	import module from './__ag__module__.js'
	import moduleFun from './__ag__moduleFun__.js'

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
				a__ag__listFollow__: {},
				//JJJJJJJJ
				a__ag__pageUp__: {},
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
				let user = this.a__ag__user__
				if(user && user.userType<=2){
					return true
				}
				return false
			}
		},
		created(){
			this.a__ag__user__ = __ag__util.getItem('user')
		},
		destroyed() {
			// uni.$off('onlogin',this.__ag__onlogin__)
		},
		methods: {
			async __ag__editFeedback__(f){
				return await __ag__sportApi__.editFeedback(f)
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
			async __ag__listMatchScheduleById__(uid){
				this.a__ag__listMatchScheduleById__ = await __ag__sportApi__.listMatchSchedule({uid})
			},
			async __ag__pageRoomMsg__(roomId){
				let resp = await __ag__sportApi__.pageRoomMsg({roomId})
				resp.data.list = resp.data.list.reverse()
				this.a__ag__pageRoomMsg__ = resp
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
			//YYYYYYY
			__ag__submit__() {
				let  guestToken = __ag__util.getItem('guestToken')
				__ag__util.setItem('token',guestToken)	
				__ag__sport.__ag__infoUser_editGuest__()
				__ag__util.pop()
			},
			__ag__itemtap__(uid,isindex){
				if(!uid){
					this.$emit('itemtap')
					return
				}
				let params = {
					tab: 2,
					uid: uid
				}
				if(isindex){
					__ag__util.getPush('__ag__live__',params)
					return
				}
				// this.$router.push({ path: '/live', query: params});
				__ag__util.getPush('__ag__live__',params)
			},
			async __ag__pageAppVer__(from){
				return await __ag__sportApi__.pageAppVer(from)
			},
			async __ag__listSwiper__(form){
				try {
					
					this.a__ag__listSwiper__ = await __ag__sportApi__.listSwiper()
				} catch (error) {
				}
			},
			async __ag__listFollow__(form){
				let list= await __ag__sportApi__.listFollow(form)
				return list
				// console.log("listFollow====================",JSON.stringify(list))
				// if(list && list.data && list.data.length>0){
				// 	let data = list.data
				// 	for(let i in data){
				// 		let r = data[i]
				// 		let m = this.a__ag__listFollow__[r.id]
				// 		if(m && m.id){
				// 			continue
				// 		}
				// 		this.a__ag__listFollow__[r.id] = r
				// 	}
				// }
			},
			
			async __ag__listUsersLive__(form){
				try {
					let r = await __ag__sportApi__.listUsersLive()
					console.log('rrr', r);
					this.a__ag__listUsersLive__ = r;
					return r;
				} catch (error) {
					return error
				}

			},
			async __ag__pageUp__(form){
				try {
					let r = await __ag__sportApi__.pageUp()
					// __ag__util.message('rrr', r);
					
					this.a__ag__pageUp__ = r;
					return r;
				} catch (error) {

					// return error
					return error
				}
			},
			//JJJJJJJJ
			async __ag__pageArticle__(form){
				// console.log()
				try {
					this.a__ag__pageArticle__ = await __ag__sportApi__.pageArticle()
					
				} catch (error) {
					__ag__util.message(error.message)
				}
				// __ag__util.message(this.a__ag__pageArticle__)
			},
			async __ag__pageArticleById__(form){
				try {
					this.a__ag__pageArticleById__ = await __ag__sportApi__.pageArticle(form)
				} catch (error) {
					__ag__util.message(error.message)
				}
				
			},
			//LLLLLLLL
			async __ag__listMatchScheduleClassList__(form) {
				this.a__ag__listMatchScheduleClassResp__ =  await __ag__sportApi__.listMatchScheduleClass()
			},
			async __ag__formPageSchedule__(form) {
				try {
					this.a__ag__pageScheduleResp__ =  await __ag__sportApi__.pageSchedule(form)
					if(!this.a__ag__pageScheduleResp__.data || !this.a__ag__pageScheduleResp__.data.list || !this.a__ag__pageScheduleResp__.data.list.length){
						this.a__ag__scheduleLading_ = false
						this.a__ag__newMap__={}
						this.a__ag__listByDate__={}
						this.a_ag__dateList__=[]
						return []
					}
					let list = this.a__ag__pageScheduleResp__
					this.__ag__getPageSchedule__(list)
				} catch (error) {
					__ag__util.message(error.message)
				}

			},
			__ag__getPageSchedule__(resp){
				this.a__ag__newMap__={}
				this.a__ag__listByDate__={}
				this.a_ag__dateList__=[]
				this.a__ag__scheduleItem__.code = resp.code
				this.a__ag__scheduleItem__.code = resp.code
				this.a__ag__scheduleLading_ = false
				if(resp.data && resp.data.list && resp.data.list.length){
					let list  = resp.data.list
					let r = list[0]
					if (this.a__ag__screen__ == 1) {
						// if (list.length == 1) {
						// 	r = list[0]
						// } else {
						// 	r = list[4]
						// }
						r = list[0]
						
					}
					this.a__ag__datetime__ = r.beginTime
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
				try {
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
							// this.a__ag__datetime__ = this.a__ag__util__.parseDate(date)
							this.a__ag__datetime__ = date
						},500)
						this.__ag__groupByDate__(l)
					}
				} catch (error) {
					return []
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
						let beginTime = this.a__ag__util__.parseDate(r.beginTime).getTime();
						if (beginTime >= time) {
							this.__ag__goCurrentScroll__(r.id)
							return true
						}
					}
				}
				
				return false
			},
			__ag__groupByDate__(list){
				let dateChange = {}
				for(let i in list){
					let r = list[i]
					let date = this.a__ag__util__.dateFormat(r.beginTime,'yyyy-MM-dd')
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
				try {
					let isVolume = weex.supports(`@module/${module.__ag__openInstall__}`)
					let resp = await __ag__sportApi__.regist(form)
					// __ag__util.message(resp)
					console.log('l---',__ag__util.toStirng(resp))
					if(isVolume && resp.code == 0){
						moduleFun.__ag__regist__()
					}
					if(resp.success){
						__ag__util.message(resp.message)
						this.a__ag__user__ = resp.data
						__ag__sport.__ag__onlogin__(resp)
						__ag__util.pop()
					}
				} catch (error) {
					__ag__util.message(error.message)
					
				}
			},
			async __ag__login__(form){
				try {
					let resp = await __ag__sportApi__.login(form)
					if(resp.success){
						__ag__util.message(resp.message)
						this.a__ag__user__ = resp.data
						__ag__sport.__ag__onlogin__(resp)
						__ag__util.pop()
					}
				} catch (error) {
					__ag__util.message(error.message)
				}

			},
			async __ag__editFeedback__(form){
				__ag__sportApi__.editFeedback(form)
			},
			async __ag__editFollowCancel__(form){

				return await __ag__sportApi__.editFollowCancel(form)
			},
			async __ag__editFollow__(form){

				return await __ag__sportApi__.editFollow(form)
			}
		}
	}