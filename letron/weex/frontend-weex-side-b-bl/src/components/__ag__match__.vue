<template>
	<div class="__ag__matchmain__" >
		<ag-ipx :bg="bg" :image="image"></ag-ipx>
		<div class="__ag__matchClassification__" >
			<ag-match-classification :list="a__ag__newslist__" :scheduleClassId="a__ag__scheduleClass__" @changeClass="__ag__changeClass__"></ag-match-classification>
		</div>
		
		<loading class="__loading_main__" :class="[ipx?'loading-ipx':'',loadinging?'show':'hide']">
			<loading-indicator class="loading_text" ref="loading"></loading-indicator>
		</loading>
		<div class="__ag__sche-body__" :class="[ipx?'matchbody-ipx':'',ipx && loadinging?'matchbody-load-ipx':'',!ipx && loadinging?'matchbody-unload-ipx':'']">
			<slider class="__ag__slider__" interval="10" auto-play="false" infinite="false" @change="changeHandler" :index="sliderIndex">
				<ag-schedule-list v-for="item in a__ag__newslist__" :key="item.id" :scheduleItem="item" :ref="'sch'+(item.id+1)" :userMatchMap="userMatchMap"></ag-schedule-list>
			</slider>
			<div class="__ag__schedule-bottom__" v-if="sliderIndex" :class="[ipx?'schedule-bottom-ipx':'']" @click="__ag__onsliderIndex__"><text class="__ag__schedule-bottom-text__">回到当前賽程</text></div>
		</div>
	</div>
</template>

<script>
	import agMatchClassification from './__ag__matchClassification__.vue'
	import agScheduleList from './__ag__matchScheduleList__.vue'
	import agMinix from './__ag__minix__.js'
	import util from "./util.js";
	import ipx from './__ag__ipx__.vue'
	import bc from './__ag__bc__.js'
	const animation = weex.requireModule('animation')
	export default {
		mixins: [agMinix], // 使用mixin
		components: {
			agMatchClassification,
			agScheduleList,
			'ag-ipx':ipx,
		},
		props: {
			topTab: {
				type:String,
				default: '2'
			},
			currentIndex: {
				type:Number,
				default: 0
			}
		},
		data() {
			return {
				a__ag__scheduleClass__: 1,
				a__ag__screen__: 0,
				sliderIndex: 0,
				classList: [],
				sliderMap: {},
				a__ag__user__: {},
				userMatchMap: {},
				tabtime: 0,
				loadinging: false,
				rotateX: 0,
				loadtime: 0,
			};
		},
		computed: {
			a__ag__newslist__() {
				if(!this.a__ag__listMatchScheduleClassResp__ || !this.a__ag__listMatchScheduleClassResp__.data){
					return []
				}
				let l  = this.a__ag__listMatchScheduleClassResp__.data.sort((a, b) => {
					if (a.name == '世界杯' || b.name == '世界杯') {
						return -1;
					}
					return 1;
				});
				return this.__ag__onNewslist__(l)
			},
		},
		watch: {
			topTab(n) {
				if (n == 2) {
					this.__ag__goCurrent__()
				}
			},
			loadinging(n) {
				if (!n) {
					let rotate = this.$refs.loading;
					animation.transition(rotate, {
						styles: {
							transform: 'rotate(0deg)',
						},
						duration: 100, //ms
						timingFunction: 'linear',
					})
				}
			},
			currentIndex(n) {
				this.sliderIndex = n
			}
		},
		methods: {
			__ag__changeClass__(item) {
				this.a__ag__scheduleClass__ = item.id
				this.sliderIndex = this.sliderMap[item.id]
			},
			async __ag__loadData__(){
				let that = this
				const Steve = new BroadcastChannel('onlogin')
				Steve.onmessage= async function(event){
					that.userMatchMap = {}
					that.a__ag__user__ = event.data
					if(that.a__ag__user__ && that.a__ag__user__.userType<3){
						await that.getListUserMatch()
					}
				}
				bc.onmessage('cancelAppoint',this.cancelAppointTap)
				bc.onmessage('makeAppoint',this.makeAppointTap)
				
				await this.__ag__listMatchScheduleClassList__()

			},
			async getListUserMatch() {
				try {
					let resp = await this.__ag__getListUserMatch__()
					if (resp.success) {
						let list = resp.data
						let map = {}
						for(let i in list){
							let r = list[i]
							this.$set(this.userMatchMap,r.scheduleId,{scheduleId:r.scheduleId,id:r.id})
							map[r.scheduleId] = {scheduleId: r.scheduleId,id:r.id}
						}
						util.setItem('userMatchMap',map)
						util.setStorageItem('userMatchMap',map)
					}
				} catch (err) {
					util.message(err.message)
				}
				
			},
			cancelAppointTap(item) {
				let r = this.userMatchMap[item.data.scheduleId]
				if (r) {
					this.$delete(this.userMatchMap,item.data.scheduleId)
				}

				let userMatchMap = util.getItem('userMatchMap')
				if (userMatchMap) {
					let ur = userMatchMap[item.data.scheduleId]
					if (ur) {
						this.$delete(userMatchMap,item.data.scheduleId)
					}
					util.setItem('userMatchMap',userMatchMap)
				} else {
					util.getStorageItem('userMatchMap').then(res => {
						userMatchMap = res
						if (userMatchMap) {
							let ur = userMatchMap[item.data.scheduleId]
							if (ur) {
								this.$delete(userMatchMap,item.data.scheduleId)
							}
							util.setStorageItem('userMatchMap',userMatchMap)
						}
					})
					
				}
			},
			makeAppointTap(item) {
				this.$set(this.userMatchMap,item.data.scheduleId,{scheduleId:item.data.scheduleId,id:item.data.id})
				let userMatchMap = util.getItem('userMatchMap')
				if (userMatchMap) {
					userMatchMap[item.data.scheduleId] = {scheduleId:item.data.scheduleId,id: item.data.id}
					util.setItem('userMatchMap',userMatchMap)
				} else {
					util.getStorageItem('userMatchMap').then(res => {
						userMatchMap = res
						if (userMatchMap) {
							userMatchMap[item.data.scheduleId] = {scheduleId:item.data.scheduleId,id: item.data.id}
							util.setStorageItem('userMatchMap',userMatchMap)
						}
					})
					
				}
			},
			__ag__onNewslist__(list) {
			    let l = [];
				let time = util.formatDateTime(new Date()) 
				let size = 40
				let page = 2
			    l.push({ id: 1, name: "直播",prevList:[],list:[],prevForm:{done:'0',page,size,hot:1,time},nextForm:{done:'0',page,size,hot:1,time},form:{done:'0',time,hot:1,page:1,size}});
			    l.push({ id: 0, name: "全部",prevList:[],list:[],prevForm:{done:'0',page,size,time},nextForm:{done:'0',page,size,time},form:{done:'0',time,page:1,size}});
				this.classList.push(1)
				this.classList.push(0)
				this.sliderMap[1] = 0
				this.sliderMap[0] = 1
				let index = 2
			    for (let i in list) {
			        let r = list[i];
					this.classList.push(r.id)
					this.sliderMap[r.id] = index
			        l.push({ id: r.id, name: r.name,prevList:[],list:[],prevForm:{done:'0',time,page,size,scheduleClass:r.id},nextForm:{done:'0',time,page,size,scheduleClass:r.id},form:{done:'0',page:1,size,time,scheduleClass:r.id}});
					index++
			    }
			    return l;
			},
			changeHandler(e) {
				this.a__ag__scheduleClass__ = this.classList[e.index];
				this.sliderIndex = e.index;
			},
			__ag__onsliderIndex__(){
				this.loadtime = 0
				this.__ag__goCurrent__()
			},
			__ag__goCurrent__() {
				this.loadinging = false
				let id = this.a__ag__scheduleClass__ + 1
				let currentId = 'sch' + id
				let indicator = this.$refs[currentId][0];
				if(indicator){
					let time =  new Date().getTime()
					if(this.loadtime + 30000 < time){
						this.loadtime = time
						this.loadinging = true
						this.rotate(720)
						indicator.__ag__getPageCurrent__()
						setTimeout(() => {
							this.loadinging = false
						}, 800);
					}
				}
				
			},
			rotate(rota) {
				let rotate = this.$refs.loading;
				animation.transition(rotate, {
					styles: {
						transform: `rotate(${rota}deg)`,
					},
					duration: 1000, //ms
					timingFunction: 'linear',
				})
			}
		}
	}
</script>

<style scoped lang="less">
 @import '../style/theme.less';
.__ag__matchmain__ {
	width: 750px;
	background-color: #F2F3F4;
	position: fixed;
	top: 0px;
	bottom: 66wx;
	/* padding-top: 20wx; */
}
.match-ipx {
	padding-top: 35wx;
	/* bottom: 100wx; */
	/* padding-bottom: 30px; */
}
.ag-ipx {
	background-image: linear-gradient(to top, #d6d6d6, #c0c0c0);
}
.__ag__matchClassification__ {
	width: 750px;
	height: 45wx;
}
.__ag__sche-body__ {
	width: 750px;
	position: absolute;
	top: 70wx;
	bottom: 0;
}
.matchbody-ipx {
	top: 170px;
	/* bottom: 100wx; */
	/* padding-bottom: 30px; */
}
.matchbody-unload-ipx {
	top: 100wx;
}
.matchbody-load-ipx {
	top: 170px;
}
.__ag__slider__ {
	flex-direction: row;
	width: 750px;
	position: absolute;
	top: 0;
	bottom: 0;
}
.__ag__schedule-bottom__ {
	width: 208px;
	height: 28wx;
	background-color: @main-color;
	border-radius: 8px;
	position: absolute;
	bottom: 50wx;
	left: 271px;
}
.schedule-bottom-ipx {
	bottom: 60wx;
}
.__ag__schedule-bottom-text__ {
	font-weight: 500;
	font-size: 14wx;
	letter-spacing: 0.05em;
	color: #FFFFFF;
	line-height: 28wx;
	text-align: center;
}

.__loading_main__ {
	width: 750px;
	height: 35wx;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 70wx;
}
.loading-ipx {
	top: 178px;
}
.loading_text {
	color: #000;
	transform:rotate(0deg);
}
.show {
	left: 0;
}
.hide {
	left: 750px;
}
</style>
