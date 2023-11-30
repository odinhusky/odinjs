<template>
	<div class="__ag__schedule-list__">
		<div class="__world_banner__" v-if="scheduleItem.name == '世界杯'" @click="__ag__goWorld__">
			<image class="__world_image__" :src="__ag__url__('static/shijiebei/sjb.png')"></image>
		</div>
		<!-- 赛事、赛果 -->
		<div class="__ag__match-screen-container__" :class="[scheduleItem.name == '世界杯' ? 'world_screen':'']">
			<ag-matchscreen @onscreen="__ag__onscreen__" :ishot="a__ag__scheduleItem__.id == 1" :screen="a__ag__screen__" :datetime="a__ag__datetime__"></ag-matchscreen>
		</div>
		<!-- :class="[a__ag__loadingMore__?'__ag__sche-body-scroll-more__':'']"  -->
		<scroller class="__ag__sche-body-scroll__" :class="[scheduleItem.name == '世界杯' ? 'world_body':'']" :show-scrollbar="false" @scroll="__ag__onscroll__" @loadmore="__ag__loadmore__">
			<refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
				<loading-indicator v-if="a__ag__freshText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
				<text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
			</refresh>
			<div v-for="(date,index) in ag__dateList__" :key="date" @appear="(e)=>{onappear(e,date)}" 
				@disappear=" (e)=>{ondisappear(e,index)}">
				<div :id="'date-'+date" class="__ag__match-date__" :class="[a__ag__scheduleItem__.id != 1 && env.brand == 'bl'?'__ag__match_date__':'',a__ag__scheduleItem__.id != 1 && env.brand == '5'?'__ag__match_date_5__':'']">
					<text class="__ag__datetext__">{{ util.formatDate(date) }}</text>
					<text class="__ag__datetext__" style="margin-left: 8px;">{{ util.formatWeeks(date) }}</text>
				</div>
				<div class="__ag__matchrequestitem__" v-if="a__ag__scheduleItem__.id == 1">
					<ag-matchrequestitem
						v-for="item in a__ag__listByDate__[date]" :key="item.id" :id="'v'+item.id"
						:dateItem="item"
						:liveUpList="a__ag__liveUpList__"
						:user="a__ag__user__"
						:userMatchMap="userMatchMap"
						:ref="'schedule-' + item.id"
					></ag-matchrequestitem>
				</div>
				<div class="__ag__matchrequestitem__" v-else>
					<ag-match-scheduleitem
					:id="'v'+item.id" v-for="item in a__ag__listByDate__[date]" :key="item.id"
					:dateItem="item"
					:date="date"
					:user="a__ag__user__"
					:userMatchMap="userMatchMap"
					:ref="'schedule-' + item.id"
				></ag-match-scheduleitem>
				</div>

			</div>
			
			<div class="loadingbox" v-if="a__ag__loadingMore__ && !platform && a__ag__scheduleItem__.id != 1">
				<loading class="loadingmore" :display="a__ag__loadingMore__ ? 'show' : 'hide'">
					<loading-indicator v-if="a__ag__loadMoreText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
					<text>{{a__ag__loadMoreText__}}</text>
				</loading>
			</div>
			<loading class="loadingmore-android" v-if="platform && a__ag__scheduleItem__.id != 1" @loading="onloading" :display="a__ag__loadingMore__ ? 'show' : 'hide'">
				<loading-indicator v-if="a__ag__loadMoreText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
				<text>{{a__ag__loadMoreText__}}</text>
			</loading>
		</scroller>
	</div>
</template>

<script>
	import agMatchScreen from './__ag__matchScreen__.vue'
	import agMatchScheduleItem from './__ag__matchScheduleItem__.vue'
	import matchRequestItem from './__ag__matchRequestItem__.vue'
	import util from './util.js'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	const dom = weex.requireModule('dom');
	export default {
		components: {
			'ag-matchscreen':agMatchScreen,
			'ag-match-scheduleitem':agMatchScheduleItem,
			'ag-matchrequestitem':matchRequestItem,
		},
		mixins: [agMinix,agMinUrl], // 使用mixin
		props: {
			scheduleItem:{
				type:Object,
				default:function(){
					return {}
				}
			},
			userMatchMap:{
				type:Object,
				default:function(){
					return {}
				}
			},
			
		},
		data() {
			return {
				util,
				a_ag__dateList__:[],
				a__ag__listByDate__: {},
				a__ag__screen__:0,
				a__ag__user__: {},
				a__ag__datetime__: util.formatDateTime(new Date()) ,
				a__ag__scheduleItem__: {},
				a__ag__scheduleLading_: false,
				a__ag__refreshing__: false,
				a__ag__freshText__: '下拉刷新',
				a__ag__loadingMore__: false,
				a__ag__loadMoreText__: '加载中...',
				a__ag__liveUpList__:{},
				zbtime:0,
			};
		},
		watch: {
		    scheduleItem(l) {
				this.a__ag__screen__ = 0
				let tiem = new Date().getTime()
				if(this.a__ag__scheduleItem__.id == l.id && l.id==1){
					if(this.zbtime + 30000 > tiem ){
						this.a__ag__scheduleItem__ = l
						return 
					}
				}
				this.a__ag__scheduleItem__ = l
				this.__ag__loadData__()
		    },
		},
		computed: {
			ag__dateList__() {
				return this.a_ag__dateList__
			},
			platform() {
				if (WXEnvironment.platform == 'android') {
					return true
				}
				return false
			}
		},
		mounted() {
			this.a__ag__scheduleItem__ = this.scheduleItem
		},
		methods: {
			async onrefresh(){
				if (this.a__ag__refreshing__) {
					return
				}
                this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
				if (this.a__ag__screen__ == 0) {
					await this.__ag__loadData__()
					this.a__ag__refreshing__ = false
					return
				}
				if (this.a__ag__screen__ == 1) {
					await this.__ag__endPullingDown__()
					return
				}
				
			},
			onpullingdown(){
				// this.a__ag__freshText__ = '释放更新'
			},
			async __ag__loadData__(){
				let that = this
				const Steve = new BroadcastChannel('onlogin')
				Steve.onmessage= async function(event){
					that.a__ag__user__ = event.data
				}
				if(!this.scheduleItem || !this.scheduleItem.prevList){
					return []
				}
				if(this.a__ag__scheduleItem__ && this.a__ag__scheduleItem__.id == 1 && this.scheduleItem && this.scheduleItem.id == 1){
					
					try {
						let liveResp = await this.__ag__listUsersLive__()
						let requestResp = await this.__ag__listRequestSchedule__()
						this.a__ag__newMap__={}
						this.a__ag__listByDate__={}
						this.a_ag__dateList__= []
						let livelist = []
						let requestList = []
						this.a__ag__scheduleLading_ = false
						if(liveResp && liveResp.data && liveResp.data.length>0){
							livelist = liveResp.data
						}
						if(requestResp && requestResp.data && requestResp.data.length>0){
							requestList = requestResp.data
						}
						let list = this.__ag__requestList__(livelist,requestList)
						this.__ag__groupByDate__(list)
						this.a__ag__datetime__ = this.ag__dateList__[0]
						
					} catch (error) {
						this.a__ag__scheduleLading_ = false
					}
					return 
				}
				if(this.a__ag__scheduleItem__ && this.a__ag__scheduleItem__.id != 1 && this.scheduleItem && this.scheduleItem.id != 1){
					// this.a__ag__datetime__ = util.formatDateTime(new Date())
					this.a__ag__scheduleItem__ = this.scheduleItem
					this.a__ag__scheduleItem__.nextForm.page = 1
					this.a__ag__scheduleItem__.prevForm.page = 1
					delete this.a__ag__scheduleItem__.nextForm.code
					delete this.a__ag__scheduleItem__.prevForm.code
					
					if (this.a__ag__scheduleItem__.name == '世界杯') {
						this.a__ag__scheduleItem__.nextForm.matchId = '600000075'
						delete this.a__ag__scheduleItem__.nextForm.scheduleClass
						delete this.a__ag__scheduleItem__.nextForm.time
					} else {
						delete this.a__ag__scheduleItem__.nextForm.matchId
					}
					
					try {
						await this.__ag__formPageSchedule__(this.a__ag__scheduleItem__.nextForm)
					} catch (err) {
						this.a__ag__refreshing__ = false
						this.a__ag__loadingMore__ = false
					}
				}
			},
			
			
			async __ag__onscreen__(index) {
				this.a__ag__screen__ = index;
				this.a__ag__refreshing__ = false
				this.a__ag__loadingMore__ = false
				this.a__ag__scheduleItem__.form.done = index == 0 ? '0' : 1
				this.a__ag__scheduleItem__.prevForm.done = index == 0 ? '0' : 1
				this.a__ag__scheduleItem__.nextForm.done = index == 0 ? '0' : 1
				this.a__ag__scheduleItem__.prevForm.page = 1
				await this.__ag__loadData__()
			},
			async __ag__endPullingDown__() {
				this.a__ag__scheduleItem__.nextForm.page++
				let nextForm = this.a__ag__scheduleItem__.nextForm
				await this.__ag__getPullingData__(nextForm)
			},
			async __ag__loadmore__() {
				if(this.a__ag__scheduleItem__ && this.a__ag__scheduleItem__.id == 1 && this.scheduleItem && this.scheduleItem.id == 1){
					return 
				}
				this.a__ag__loadMoreText__ = '加载中...'
				if (this.a__ag__screen__ == 0) {
					if (this.a__ag__loadingMore__) {
						return
					}
					this.a__ag__scheduleItem__.prevForm.page++
					let prevForm = this.a__ag__scheduleItem__.prevForm
					if (this.a__ag__scheduleItem__.name == '世界杯') {
						prevForm.matchId = '600000075'
						delete prevForm.scheduleClass
						delete prevForm.time
					} else {
						delete prevForm.matchId
					}
					this.a__ag__loadingMore__ = true
					await this.__ag__onloadmore__(prevForm)
					return
				}
				this.a__ag__loadMoreText__ = '没有更多数据'
				this.a__ag__loadingMore__ = true
				setTimeout(()=>{
					this.a__ag__loadingMore__ = false
				}, 1500)
			},
			async onloading () {
				if (WXEnvironment.platform == 'android') {
					await this.__ag__loadmore__()
				}
				
			},
			__ag__onscroll__(e) {
				if(this.a__ag__scheduleItem__.id != 1){
					// let __ag__scrollTop__ = Math.abs(e.contentOffset.y)
					// let i = Math.floor((__ag__scrollTop__ ) / 190)
					// if(i < 0){
					// 	i = 0
					// } 
					// let r = {}
					// let target = 0
					// for(let j in this.a_ag__dateList__){
					// 	let date = this.a_ag__dateList__[j]
					// 	let list = this.a__ag__listByDate__[date]
					// 	target += list.length
					// 	if(target > i){
					// 		r = list[0]
					// 		break;
					// 	}
					// }
					
					// if(r && r.beginTime){
					// 	let date = r.beginTime
					// 	setTimeout(()=> {
					// 		this.a__ag__datetime__ = date
					// 	},200)
					// }
				}else {
					// let __ag__scrollTop__ = Math.abs(e.contentOffset.y)
					// let i = Math.floor((__ag__scrollTop__ ) / 280)
					// if(i < 0){
					// 	i = 0
					// } 
					// let r = {}
					// let target = 0
					// for(let j in this.a_ag__dateList__){
					// 	let date = this.a_ag__dateList__[j]
					// 	let list = this.a__ag__listByDate__[date]
					// 	target += list.length
					// 	if(target > i){
					// 		r = list[0]
					// 		break;
					// 	}
					// }
					// if(r && r.beginTime){
					// 	let date = r.beginTime
					// 	setTimeout(()=> {
					// 		this.a__ag__datetime__ = date
					// 	},200)
					// }
				}

			},
			onappear(e,data){
				if(e.direction == 'down'){
					this.a__ag__datetime__ = data
				}
			},
			ondisappear(e,index){
				if(e.direction == 'up'){
					this.a__ag__datetime__ = this.ag__dateList__[index +1]
				}
			},
			async __ag__getPageCurrent__() {
				if (this.a__ag__scheduleLading_) {
					return
				}
				this.a__ag__scheduleLading_ = true
				await this.__ag__loadData__()
			},
			__ag__goWorld__() {
				util.getPush('__ag__worldSpecial__')
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../style/theme.less";
	.__ag__schedule-list__ {
		width: 750px;
		position: absolute;
		top: 0;
		bottom: 0;
	}
	.__world_banner__ {
		width: 750px;
		height: 112px;
	}
	.__world_image__ {
		width: 750px;
		height: 112px;
	}
	.__ag__sche-body-scroll__ {
		width: 750px;
		position: absolute;
		top: 40wx;
		bottom: 0;
	}
	.world_body {
		top:192px
	}
	.__ag__sche-body-scroll-more__ {
		bottom: 60px;
	}
	.__ag__match-screen-container__ {
		width: 750px;
		height: 40wx;
		position: absolute;
		top: 0;
	}
	.world_screen {
		top: 112px;
	}
	.__ag__match-date__ {
		width: 750px;
		height: 30wx;
		background-color: #F2F3F4;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding-left: 14wx;
	}
	.__ag__match_date__ {
		background-color: #FFF9E3;
	}
	.__ag__match_date_5__ {
		background-color: #E6F9F0;
	}
	.__ag__datetext__ {
		font-size: 13wx;
		font-weight: 600;
	}
	.__ag__refresh__ {
        width: 750px;
		padding: 10wx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__loading__ {
		color: #000000;
		margin-right: 15wx;
	}
	.loadingbox {
		width: 750px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20wx;
		padding-bottom: 30wx;
		height: 20wx;
	}
	.loadingmore {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.loadingmore-android {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 20wx;
		height: 20wx;
		padding-bottom: 30wx;
	}
	.__ag__matchrequestitem__ {
		flex: 1;
	}
</style>
