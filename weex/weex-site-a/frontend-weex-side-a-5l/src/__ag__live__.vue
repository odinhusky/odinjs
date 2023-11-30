<template>
	<div class="__ag__live__" :class="[ipx?'live-ipx':'']" :style="mainStyle" ref="video_full">

		<ag-keyboardsize ref="keyboardsize"></ag-keyboardsize>

		<div class="__ag__livetitlep__" :style="{'top':keyboardSize}" :class="[ipx?'title-ipx':'',isFull?'__ag__livetitlep_full__':'']" ></div>

		<div class="__ag__livenvideo__" :style="videoStyle" :class="[isFull && !ivx?'video_full':'',ivx && isFull?'video_full_ivx':'']">
			<ag-nvideo v-if="src" :src="src" :full="isFull" :fullDevice="fullDevice" :upinfo="upinfo"></ag-nvideo>
		</div>

		<div class="__ag__livechathead__" v-if="!isFull">
			<div class="__ag__livechattab__" @click="ontab(1)">
				<text class="__ag__livechattabtext__" :class="[tab==1?'selected':'']">广场</text>
			</div>
			<div class="__ag__livechattab__" @click="ontab(2)">
				<text :class="[tab==2?'selected':'']" class="__ag__livechattabtext__">主播助理</text>
			</div>
			<div class="__ag__livechattab__" @click="ontab(3)">
				<text :class="[tab==3?'selected':'']" class="__ag__livechattabtext__">赛况</text>
			</div>
		</div>

		<div class="__ag__livechatcontent__" @click="__ag__clickLive__" v-if="!isFull">
			<ag-upinfo v-if="tab != 2" :user="a__ag__user__" :tab="tab" :roomId="roomId" :item="item.joinMap && item.joinMap.streamer" :amount="item.joinMap && item.joinMap.room && item.joinMap.room.amount" :followId="followId" @editFollow="editFollow"></ag-upinfo>
			<div class="__ag__livegz__" :class="[tab==1?'show':'hide']">
				<div v-if="!islive" class="__ag__notlive__" >
					<text class="__ag__notlivetext__">主播不在家</text>
				</div>
				
				<ag-messagelist ref="messagelist" :sysnotices="sysNotice" :uid="uid" @onClick="__ag__clickLive__" :resp="a__ag__pageRoomMsg__"></ag-messagelist>
				
				<div class="__ag__livesend__" :class="[ipx?'__ag__send-ipx__':'']" v-if="islive">
					<div class="__ag__livesendinput__">
						<input :placeholder="isUser ?'大家都在聊...' : '立即登录开启热聊'" class="__ag__livesendbodyinput__"
						ref="inputref" v-model="form.content"
						:hideDoneButton="true"
						@return="__ag__keyboard__"
						@confirm="__ag__send__"
						@keyboard="keyboard"
						@blur="blurkeyboard"
						/>
					</div>
					<div class="__ag__livefs__" @click="__ag__send__">
						<image :src="__ag__url__('static/bl/send.png')"   class="__ag__send__"></image>
					</div>
				</div>
			</div>
			<div class="__ag__livezb__" :class="[tab==2?'show':'hide']">
				<ag-upinfo :user="a__ag__user__" :tab="tab" :roomId="roomId" :item="item.joinMap && item.joinMap.streamer" :amount="item.joinMap && item.joinMap.room && item.joinMap.room.amount" :followId="followId" @editFollow="editFollow"></ag-upinfo>
			</div>
			<div class="__ag__livemh__" :class="[tab==3?'show':'hide']">
				<ag-livematch  :roomData="roomdata"></ag-livematch>
			</div>
		</div>	
	</div>
</template>

<script>
	import nvideo from './components/__ag__nvideo__.vue'
	import agmessagelist from './components/__ag__messageList__.vue'
	import agupinfo from './components/__ag__upinfo__.vue'
	import aglivematch from './components/__ag__livematch__.vue'
	import vars from './components/vars.js'
	import agMinUrl from './components/__ag__minurl__.js'
	import util from './components/util.js'
	import env from './components/env.js'
	import module from './components/__ag__module__.js'
	import agMinix from './components/__ag__minix__.js'
	import __ag__sport from "./components/__ag__sport__.js"
	import uptitle from './components/__ag__uptitle__.vue'
	import keyboardsize from './components/__ag__keyboardSize__.vue'

	const dom = weex.requireModule('dom')
	export default {
		components:{
			'ag-nvideo':nvideo,
			'ag-messagelist':agmessagelist,
			'ag-upinfo':agupinfo,
			'ag-livematch':aglivematch,
			'ag-uptitle':uptitle,
			'ag-keyboardsize':keyboardsize,
		},
		mixins:[agMinix,agMinUrl],
		data() {
			return {
				src:'',
				tab:1,
				uid: undefined,
				roomId: undefined,
				form:{
					contentType: 1,
					content: '',
					title: '',
					thumb: '',
					url: '',
					messageType: 1,
					type: 4
				},
				item: {joinMap: {}},
				upinfo:{},
				islive:true,
				vars,
				a__ag__user__: {},
				keyboardSize:'0px',
				sysNotice:'',
				isFull: false,
				fullDevice: {
					width:0,
					height:0,
				},
				followId: 0
			};
		},
		computed:{
			roomdata(){
				if(this.a__ag__listMatchScheduleById__ && this.a__ag__listMatchScheduleById__.data && this.a__ag__listMatchScheduleById__.data.length){
					return this.a__ag__listMatchScheduleById__.data[0]
				}
				return {}
			},
			videoStyle() {
				let style ={}
                if(this.isFull){
                    style.height = "750px"
                    style.width = this.fullDevice.height.toFixed(2) + "px"
                } else {
					style.height = "421.875px"
                    style.width = "750px"
				}
				return style
			},
			mainStyle() {
				let style ={}
                if(this.isFull){
                    style.width = this.fullDevice.height.toFixed(2) + "px"
					if (this.ivx) {
						style.transform = "rotate(90deg)"
					}
					
                } else {
                    style.width = "750px"
					if (this.ivx) {
						style.transform = "rotate(0deg)"
					}
				}
                
				return style
			},
		},
		created() {
			let that = this
			util.setAudioCategory(1)
			var globalEvent = weex.requireModule('globalEvent');
			globalEvent.addEventListener('WXApplicationDidBecomeActiveEvent', function(e) {
				that.isFull = false
				util.setLandscape(0)
			});
		},
		destroyed() {
			util.setLandscape(0)
		},
		methods:{
			blurkeyboard(){
				this.keyboardSize = '0px'
				this.$refs.keyboardsize.keyboardSize(this.keyboardSize)
			},
			keyboard(event){
				let e = util.keyboardHeight(event)
				if(!this.ipx){
					e += 24
				}
				this.keyboardSize = e + 'px'
				// let s =util.toStirng(event.keyboardSize)
				// util.message(this.keyboardSize)
				this.__ag__goscroll__()
				this.$refs.keyboardsize.keyboardSize(this.keyboardSize)
				// const keyboardSize = new BroadcastChannel('keyboardSize')
				// keyboardSize.postMessage(this.keyboardSize)
				// Vue.$emit("keyboardSize",this.keyboardSize)
				
			},
			ontab(tab){
				this.tab= tab
				// if (tab == 1) {
					this.__ag__goscroll__()
				// }
				this.__ag__clickLive__()
			},
			editFollow(id) {
				this.followId = id
			},
			__ag__clickLive__() {
				let ipt = this.$refs.inputref
				if (ipt) {
					ipt.blur()
				}
			},
			__ag__onmsg__(msg) {
				// console.log('-----msg',msg)

				if (!msg) {
					return
				}
				for(let i in msg){
					let item = msg[i]
					let list = this.a__ag__pageRoomMsg__.data && this.a__ag__pageRoomMsg__.data.list
					if(list.length>0){
						let msgLen = list.length - 1
						if (item.type != vars.TYPE_LIVE_UPDATE && msgLen >= 0) {
							let lastMsg = list[msgLen]
							if (lastMsg.id == item.id && item.type != vars.TYPE_REMOVE_MESSAGE) {
								continue
							}
						}
						if (item.type == vars.TYPE_REMOVE_MESSAGE) {
							if (this.tab == 1 && item.messageType == 1) {
								__ag__sport.delMsg(this.a__ag__pageRoomMsg__.data.list, item)
								continue
							}
						}
					}

					this.__ag__addMessage__(item)
				}
			},
			__ag__addMessage__(item){
				if (item.type == vars.TYPE_LEAVE) {
					return
				}
				if (item.messageType == 1 && item.roomId != this.roomId) {
					return
				}
				item.guest = item.senderName && item.senderName.indexOf('游客') == 0
				if (item.type == vars.TYPE_ENTER) {
					this.upinfo.joinMap.room.amount++
					return
				}
				if (item.senderId == this.a__ag__user__.id) {
					return
				}
				if(item.messageType == 1){
					item.joinMap={
						u:{
							userNicename:item.senderName
						}
					}
					this.a__ag__pageRoomMsg__.data.list.push(item)
					this.__ag__goscroll__()
				}
			},
			__ag__keyboard__() {
				this.__ag__send__()
				this.__ag__clickLive__()
			},
			async __ag__send__(){
				if (!this.a__ag__user__ || ! this.a__ag__user__.userType == 3) {
					util.message('登录账号发消息')
					return
				}
				if (!this.roomId) {
					util.message('主播不在家')
					return
				}
				if (!this.form.content) {
					util.message('消息不能为空')
					return
				}
				try{
					let f = Object.assign({}, this.form)
					f.senderName = this.a__ag__user__.userNicename
					f.messageType = 1
					f.senderId = this.a__ag__user__.id
					let resp = await this.__ag__editRoomMessage__(f)
					this.form.content = ''
					this.a__ag__pageRoomMsg__.data.list.push(resp.data)
					this.__ag__goscroll__()
				}catch(err){
					util.message(err.message)
				}
			},
			async __ag__loadData__(){
				let that = this
				that.a__ag__user__ = util.getItem('user')
				const Steve = new BroadcastChannel('onlogin')
				Steve.onmessage= function(event){
					that.a__ag__user__ = event.data
				}
				const msg = new BroadcastChannel('msg')
				msg.onmessage= function(event){
					that.__ag__onmsg__(event.data)
				}

				const full = new BroadcastChannel('changeFull')
				full.onmessage= function(event){
					that.changeFull(event.data)
				}

				// this.uid = this.$route.query.uid
				let data = util.getUrlParam(weex.config.bundleUrl)
				this.uid = data.uid
				try {
					await this.__ag__listMatchScheduleById__(this.uid)
				} catch (err) {
					console.log("aaaa===2",util.message(err))
					util.message(err.message)
				}
				if(!this.a__ag__listMatchScheduleById__.data || !this.a__ag__listMatchScheduleById__.data.length){
					this.islive = false
					return
				}

				this.islive = true
				let item = this.a__ag__listMatchScheduleById__.data[0]

				
				this.item = item
				item.joinMap.streamer.id = this.uid
				
				this.upinfo = item
				let joinMap = item.joinMap
				this.upinfo.upName  = joinMap.streamer.userNicename
				this.upinfo.avatar  = joinMap.streamer.avatar
				this.roomId = joinMap.room.id
				let live =joinMap.live
				this.src = item.joinMap.live.pull
				this.sysNotice = live.sysNotice
				this.form.roomId = this.roomId
				this.followId = item.joinMap && item.joinMap.follow&&item.joinMap.follow.id

				if (env.dev) {
					// this.src = 'https://5lpullali.dasll.com/live/ff9192bbb89b432290fd49beb5f26468.m3u8?auth_key=1648353192-ce6f6fd15ec44608b669c22939e2f15c-0-97155a9221ca85450a4a0eb6b062e483'
				}
				try {
					await this.__ag__editRoomUsers__(this.roomId)
				} catch(err) {
					console.log("aaaa===",util.toStirng(err))
					util.message(err.message)
				}
				try {
					await this.__ag__pageRoomMsg__(this.roomId)
					let ms = this.$refs.messagelist
					if (ms) {
						console.log("ms",ms)
						this.__ag__goscroll__()
					}
				} catch(err) {
					console.log("aaaa===1",util.message(err))
					util.message(err.message)
				}
			},
			changeFull(data) {
				this.isFull = data.f == 1 ? true : false
				
				let v = this.$refs['video_full']
				let that = this
				if (v) {
					dom.getComponentRect(v, function(ret) {
						that.fullDevice = ret.size
					});
				}
				if (!this.isFull) {
					let ms = this.$refs.messagelist
					if (ms) {
						this.__ag__goscroll__()
					}
				}
				
			},
			__ag__goscroll__() {
				if (this.a__ag__pageRoomMsg__.data && this.a__ag__pageRoomMsg__.data.list && this.a__ag__pageRoomMsg__.data.list.length > 0) {
					let length = this.a__ag__pageRoomMsg__.data.list.length
					setTimeout(()=> {
						this.$refs.messagelist.__ag__goscroll__(length)
					},200)
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	@import "./style/default.less";
	.__ag__live__ {
		padding-top: 44px;
		background-color: #fff;
	}
	.__ag__livetitlep__ {
		position: fixed;
		height: 44px;
		top: 0px;
		width: 750px;
		background-image: linear-gradient(to bottom, #FDC401, #F99926);
		// background-color: #4D139A;
	}
	.__ag__livetitlep_full__ {
		height: 0px;
	}
	.title-ipx {
		height: 78px;
	}
	.live-ipx {
		padding-top: 78px;
		padding-bottom: 34px;
	}
	.__ag__livenvideo__ {
		width: 750px;
		height: 421.875px;
		background-color: #000;
		position: relative;
	}
	.video_full {
		height: 700px;
		position: fixed;
		top: 0;
		bottom: 0px;
		left: 0;
		right: 0;
	}
	.video_full_ivx {
		height: 700px;
		position: fixed;
		bottom: 0px;
		left: 0;
		right: 0;
	}
	.__ag__livechatcontent__ {
		padding-top: 10px;
		bottom: 0px;
		flex: 1;
		background-color: #F7F7F7;
	}
	.__ag__livechathead__ {
		width: 750px;
		height: 80px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		background-color: #FFFFFF;
	}
	.__ag__livechattab__ {
		width: 75px;
		height: 80px;
		justify-content: center;
		flex-direction: row;
		align-items: center;
	}
	.__ag__livechattabtext__ {
		height: 80px;
		line-height: 80px;
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 600;
		font-size: 15wx;
		letter-spacing: 0.05em;
		transition: color .5s;
		transition: border-bottom-color .5s;
		display: flex;
		align-items: center;
		color: #000;
		border-bottom-style: solid ;
		border-bottom-color: #fff;
		border-bottom-width: 8px;
	}
	.selected {
		color: #F5982A;
		border-bottom-color: #F5982A;
	}
	.__ag__livezb__,
	.__ag__livegz__ {
		position: absolute;
		width: 750px;
		top: 10px;
		bottom: 0px;
		background-color: #f7f7f7;
	}
	.__ag__livezb__ {
		background-color: #f7f7f7;
	}
	.__ag__livegz__ {
		position: absolute;
		top: 178px;
		bottom: 0px;
	}
	.__ag__livemh__{
		position: absolute;
		top: 178px;
		bottom: 0px;
		width: 750px;
		padding: 10px;
		padding-right: 20px;
		padding-left: 20px;
		background-color: #fff;
	}
	.__ag__livemessage__ {
		width: 750px;
		padding: 12px;
		padding-bottom: 0px;
	}
	.__ag__send-ipx__ {
		margin-top: 0px;
	}
	.__ag__livesend__ {
		position: absolute;
		bottom: 0px;
		width: 750px;
		height: 90px;
		background-color: #FFFFFF;
		padding: 16px;
		padding-right: 16wx;
		padding-left: 16wx;
		display: flex;
		flex-direction: row;
		align-items: center;
		box-shadow: -2px -2px 4px rgba(214, 214, 214, 0.3);
	}	
	.__ag__livesendinput__ {
		flex: 1;
		height: 60px;
		padding-left: 16wx;
		padding-right: 16wx;
		background-color: rgba(253, 197, 1, 0.3);
		border-radius: 34px;
		margin-right: 16wx;
	}
	.__ag__livesendbodyinput__ {
		font-size: 25px;
		height: 60px;
		line-height: 60px;
		border-width: 0px;
		border-style: solid;
		placeholder-color: #F5982A;
		border-radius: 34px;
	}
	.__ag__livefs__ {
		width: 60px;
		height: 60px;
		padding: 6px;
		padding-left: 12px;
		padding-right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.__ag__send__ {
		width: 60px;
		height: 60px;
	}
	.__ag__notlive__ {
		padding-top: 50px;
		align-items: center;
		justify-content: center;
		
	}
	.__ag__notlivetext__ {
		color: #777777;
		font-size: 30px;
	}
	.show {
		left: 0;
	}
	.hide {
		left: 750px;
	}
	.ipx {
		bottom: 34wx;
	}
	.__ag__livefsimg__ {
		width: 40px;
		height: 40px;
	}
	.__ag__upinfo-box__{
		width: 750px;
		height: 150px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__upavatar__{
		
		height: 92px;
		width: 92px;
		border-radius: 50%;
	}
	.__ag__littleicon__{
		width: 30px;
		height: 30px;
	}
	.__ag__bigicon__{
		width: 50px;
		height: 50px;
		margin-right:50px;
	}
	.__ag__fireandheart__{
		flex-direction: row;
		align-items: center;
		margin-top:10px;
	}
	.__ag__upavatar-box__{
		margin-left:50px;
		flex:1;
	}
	.__ag__heart-box__{
		flex:1;
	}
	.__ag__info-box__{
		flex:4;
	}
	.__ag__grayspace__{
		width: 750px;
		height: 10px;
		background-color: #E0E0E0;
	}
	.__ag__info-name__{
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 20wx;
		line-height: 20wx;
		color:#000;
	}
	.__ag__firenum__{
		font-family: 'PingFang SC';
		font-style: normal;
		font-weight: 400;
		font-size: 14wx;
		line-height: 20wx;
		color:#000;
		margin-left:17px;
	}
	.hearticon2{
		margin-left:34px;
	}
</style>
