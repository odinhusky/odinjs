<template>
	<div class="__ag__matchmain__" :class="[ipx?'match-ipx':'']">
		<div class="__ag__matchClassification__">
			<ag-match-classification :list="a__ag__newslist__" :scheduleClassId="a__ag__scheduleClass__" @changeClass="__ag__changeClass__"></ag-match-classification>
		</div>
		<div class="__ag__sche-body__">
			<slider class="__ag__slider__" interval="10" auto-play="false" infinite="false" @change="changeHandler" :index="sliderIndex">
				<ag-schedule-list v-for="item in a__ag__newslist__" :key="item.id" :scheduleItem="item" :ref="'sch'+(item.id+1)"></ag-schedule-list>
			</slider>
		</div>
	</div>
</template>

<script>
	import agMatchClassification from './__ag__matchClassification__.vue'
	import agScheduleList from './__ag__matchScheduleList__.vue'
	import agMinix from './__ag__minix__.js'
	import agUtil from "./util.js";
	export default {
		mixins: [agMinix], // 使用mixin
		props: {
			tab: {
                type: Number,
                default: 1
            }
		},
		components: {
			agMatchClassification,
			agScheduleList,
		},
		data() {
			return {
				a__ag__scheduleClass__: 1,
				a__ag__screen__: 0,
				sliderIndex: 0,
				classList: [],
				sliderMap: {},
				tabtime: 0
			};
		},
		watch: {
			tab(n) {
				if (n == 2) {
					let time =  new Date().getTime()
					if(this.tabtime + 30000 < time){
						this.tabtime = time
						this.__ag__goCurrent__()
					}
				}
			}
		},
		computed: {
			a__ag__newslist__() {
				if(!this.a__ag__listMatchScheduleClassResp__ || !this.a__ag__listMatchScheduleClassResp__.data){
					return []
				}
				let l  = this.a__ag__listMatchScheduleClassResp__.data
				return this.__ag__onNewslist__(l)
			},
		},
		methods: {
			__ag__changeClass__(item) {
				this.a__ag__scheduleClass__ = item.id
				this.sliderIndex = this.sliderMap[item.id]
			},
			async __ag__loadData__(){
				try {
					await this.__ag__listMatchScheduleClassList__()
				} catch (error) {
					agUtil.message(error.message)
				}
			},
			__ag__onNewslist__(list) {
			    let l = [];
				let time = agUtil.formatDateTime(new Date()) 
				let size = 40
				let page = 2
			    l.push({ id: 1, name: "热门",prevList:[],list:[],prevForm:{done:'0',page,size,hot:1,time},nextForm:{done:'0',page,size,hot:1,time},form:{done:'0',time,hot:1,page:1,size}});
			    // l.push({ id: 0, name: "全部",prevList:[],list:[],prevForm:{done:'0',page,size,time},nextForm:{done:'0',page,size,time},form:{done:'0',time,page:1,size}});
				this.classList.push(1)
				// this.classList.push(0)
				this.sliderMap[1] = 0
				// this.sliderMap[0] = 1
				let index = 1
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
			},
			__ag__goCurrent__() {
				let id = this.a__ag__scheduleClass__ + 1
				let currentId = 'sch' + id
				let indicator = this.$refs[currentId][0];
				if(indicator){
					indicator.__ag__getPageCurrent__()
				}
				
			},
		}
	}
</script>

<style lang="less" scoped>
@import '../style/default.less';
.__ag__matchmain__ {
	 width: 750px;
	background-color: #F2F3F4;
	position: fixed;
	top: 56px;
	bottom: 0px;
	padding-bottom: 134px;
}
.match-ipx {
	top: 110px;
	padding-bottom: 168px;
}
.__ag__matchClassification__ {
	width: 750px;
	height: 50wx;
}
.__ag__sche-body__ {
	width: 750px;
	position: absolute;
	top: 60px;
	bottom: 134px;
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
	background-color: @zhuse;
	border-radius: 20wx;
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

</style>
