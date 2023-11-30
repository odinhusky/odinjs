<template>
	<div class="__ag__schedule-list__">
		<!-- 赛事、赛果 -->
		<div class="__ag__match-screen-container__">
			<ag-matchScreen @onscreen="__ag__onscreen__" :screen="a__ag__screen__" :datetime="a__ag__datetime__"></ag-matchScreen>
		</div>
		<scroller class="__ag__sche-body-scroll__" :show-scrollbar="false" @loadmore="__ag__loadmore__">
			<refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
				<loading-indicator v-if="a__ag__freshText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
				<text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
			</refresh>
			<div v-for="(date,index) in ag__dateList__" :key="date" @appear="(e)=>{onappear(e,date)}" 
				@disappear=" (e)=>{ondisappear(e,index)}">
				<div :id="'date-'+date" class="__ag__match-date__">
					<text class="__ag__datetext__">{{ a__ag__util__.formatDate(date) }}</text>
					<text class="__ag__datetext__" style="margin-left: 8px;">{{ a__ag__util__.formatWeeks(date) }}</text>
				</div>
				<div class="__ag__matchrequestitem__">
					<ag-match-scheduleItem
						:id="'v'+item.id" v-for="item in a__ag__listByDate__[date]" :key="item.id"
						:dateItem="item"
						:date="date"
						:ref="'schedule-' + item.id"
					></ag-match-scheduleItem>
				</div>
				<!-- <div class="__ag__matchrequestitem__">
					<ag-match-scheduleItem-bh
						:id="'v'+item.id" v-for="item in a__ag__listByDate__[date]" :key="item.id"
						:dateItem="item"
						:date="date"
						:ref="'schedule-' + item.id"
					></ag-match-scheduleItem-bh>
				</div> -->
			</div>
			
			<div class="loadingbox" v-if="a__ag__loadingMore__ && !platform">
				<loading class="loadingmore" :display="a__ag__loadingMore__ ? 'show' : 'hide'">
					<loading-indicator v-if="a__ag__loadMoreText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
					<text>{{a__ag__loadMoreText__}}</text>
				</loading>
			</div>
			<loading class="loadingmore-android" v-if="platform" @loading="onloading" :display="a__ag__loadingMore__ ? 'show' : 'hide'">
				<loading-indicator v-if="a__ag__loadMoreText__!= '没有更多数据'" class="__ag__loading__"></loading-indicator>
				<text>{{a__ag__loadMoreText__}}</text>
			</loading>
		</scroller>
	</div>
</template>

<script>
	import agMatchScreen from './__ag__matchScreen__.vue'
	import agMatchScheduleItem from './__ag__matchScheduleItem__.vue'
	import agMatchScheduleItemBh from './__ag__matchScheduleItembh__.vue'
	import a__ag__util__ from './util.js'
	import env from './env.js'
	import agMinix from './__ag__minix__.js'
	export default {
		components: {
			'ag-matchScreen':agMatchScreen,
			'ag-match-scheduleItem':agMatchScheduleItem,
			'ag-match-scheduleItem-bh':agMatchScheduleItemBh,
		},
		mixins: [agMinix], // 使用mixin
		props: {
			scheduleItem:{
				type:Object,
				default:function(){
					return {}
				}
			},
			
		},
		data() {
			return {
				env,
				a__ag__util__,
				a_ag__dateList__:[],
				a__ag__listByDate__: {},
				a__ag__screen__:0,
				a__ag__datetime__: a__ag__util__.formatDateTime(new Date()) ,
				a__ag__scheduleItem__: {},
				a__ag__scheduleLading_: false,
				a__ag__refreshing__: false,
				a__ag__freshText__: '下拉刷新',
				a__ag__loadingMore__: false,
				a__ag__loadMoreText__: '加载中...'
			};
		},
		watch: {
		    scheduleItem(l) {
				this.a__ag__scheduleItem__ = l
				this.a__ag__screen__ = 0
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
				if(!this.scheduleItem || !this.scheduleItem.prevList){
					return []
				}
				// this.a__ag__datetime__ = a__ag__util__.formatDateTime(new Date())
				this.a__ag__scheduleItem__ = this.scheduleItem
				this.a__ag__scheduleItem__.nextForm.page = 1
				this.a__ag__scheduleItem__.prevForm.page = 1
				delete this.a__ag__scheduleItem__.nextForm.code
				delete this.a__ag__scheduleItem__.prevForm.code
				await this.__ag__formPageSchedule__(this.a__ag__scheduleItem__.nextForm)
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
				this.a__ag__loadMoreText__ = '加载中...'
				if (this.a__ag__screen__ == 0) {
					if (this.a__ag__loadingMore__) {
						return
					}
					this.a__ag__scheduleItem__.prevForm.page++
					let prevForm = this.a__ag__scheduleItem__.prevForm
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
			}
		}
	}
</script>

<style scoped>
	.__ag__schedule-list__ {
		width: 750px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.__ag__sche-body-scroll__ {
		width: 750px;
		position: absolute;
		top: 40wx;
		bottom: 0;
	}
	.__ag__sche-body-scroll-more__ {
		bottom: 60px;
	}
	.__ag__match-screen-container__ {
		width: 750px;
		height: 40wx;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}
	.__ag__match-date__ {
		width: 750px;
		height: 40wx;
		background-color: #FFF4CE;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		display: flex;
		align-items: center;
		flex-direction: row;
		padding-left: 14wx;
	}
	.__ag__datetext__ {
		font-size: 13wx;
		font-weight: 600;
		color: #F8912C;
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
