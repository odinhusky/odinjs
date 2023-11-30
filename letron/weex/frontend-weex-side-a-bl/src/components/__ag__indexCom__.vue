<template>
	<scroller class="__ag__indexcom__" :class="[ipx?'ipx':'']" :show-scrollbar="false">
		<refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
			<loading-indicator  class="__ag__loading__"></loading-indicator>
			<text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
		</refresh>
		<div class="__ag__indexup__">
			<div class="__ag__indexhbtitle__">
				<ag-title class="__ag__indexagtitle__" name="特别推荐" id="3" :isgd="false"></ag-title>
			</div>
			<div class="__ag__indexagup__">
				<ag-uplist></ag-uplist>
			</div>
		</div>
		<div class="__ag__livelive__">
			<ag-title class="__ag__indexnewtitle__" @onclick="__ag__onUpLive__" name="热门直播" id="1" :isgd="true"></ag-title>
			<ag-liveuplist class="__ag__liveuplist__" :list="list"></ag-liveuplist>
		</div>
		<div class="__ag__indexhbcontent__">
			<div class="__ag__liventitlediv__">
				<ag-title class="__ag__indexnewtitle__" @onclick="__ag__news__" name="每日新闻" id="2" :isgd="true"></ag-title>
			</div>
			<div class="__ag__livenew__">
				<ag-newslist :isindex="true"></ag-newslist>
			</div>
		</div>
	</scroller>
</template>

<script>
	import agMinix from './__ag__minix__.js'
	import agMatchuplist from './__ag__matchUpList__.vue'
	import aguplist from './__ag__upList__.vue'
	import title from './__ag__title__.vue'
	import newsList from './__ag__newsList__.vue'
	import liveUpList from './__ag__liveUpList__.vue'
	import __ag__util from "./util.js"
	import env from "./env.js"
	import swiper from './__ag__swiper__.vue'
	let a = undefined;
	let _resolve = undefined, _reject= undefined;
	
	export default {
		mixins:[agMinix],
		components:{
			'ag-matchuplist':agMatchuplist,
			'ag-uplist':aguplist,
			'ag-title':title,
			'ag-newslist':newsList,
			'ag-liveuplist':liveUpList,
			'ag-swiper':swiper,
		},
		data() {
			return {
				a__ag__isFreshing__: false,
				a__ag__freshing__: false,
				a__ag__triggered__: false,
				a__ag__freshText__: '释放更新',
				a__ag__refreshing__:false,
				env,
			};
		},
		computed: {
			swiperlist(){
				if(!this.a__ag__listSwiper__.data || !this.a__ag__listSwiper__.data.length){
					return []
				}
				let l = this.a__ag__listSwiper__.data
				console.log('aaa==',l.length)
				return l
			},
			list(){
				if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
					return []
				}
				let l  = this.a__ag__listUsersLive__.data
				if(l && l.length>6){
					return l.slice(0,6)
				}
				return l
			},
			item(){
				if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
					return {}
				}
				let l  = this.a__ag__listUsersLive__.data[0]
				return l
			},
		},
		methods:{
			__ag__news__(){
				__ag__util.getPush('__ag__news__')
			},
			__ag__onUpLive__(){
				__ag__util.getPush('__ag__uplive__')
			},
			async __ag__loadData__(){
				try {
					await this.__ag__onBackPress__()
				} catch (error) {
					__ag__util.message(error.message)
					
				}
			},
			async onrefresh(){
				this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
				await this.refresh()
				// setTimeout(()=>{
					this.a__ag__refreshing__ = false
				// },2000)
			},
			onpullingdown(){
				this.a__ag__freshText__ = '释放更新'
			},
			__ag__onPulling__() {
				this.a__ag__onPulling__()
			},
			async refresh(){
				// return  await this.__ag__listUsersLive__()
				await this.__ag__onRefresh__()
			},
			async __ag__onRefresh__() {
				if (this.a__ag__freshing__) return;
				this.a__ag__freshing__ = true
				this.a__ag__isFreshing__ = true
				if (!this.a__ag__triggered__) {
					this.a__ag__triggered__ = true
				}
				await this.__ag__onBackPress__()
			},
			__ag__onRestore__() {
				this.a__ag__onRestore__()
			},
			__ag__onAbort__() {
				this.a__ag__onAbort__()
			},
			async __ag__onBackPress__(){
				try {
					await this.__ag__listSwiper__()
					await this.__ag__pageUp__()
					await this.__ag__listUsersLive__()
					await this.__ag__pageArticle__()
				} catch (error) {
					__ag__util.message(error.message)
				}

				setTimeout(() =>{
					this.a__ag__freshing__ = false
					this.a__ag__triggered__ = false
					this.a__ag__isFreshing__ = false
				},700)
			},

			__ag__testAsync__(){
				
				a = new Promise((resolve, reject)=>{
					_resolve = resolve;
					_reject = reject;
					setTimeout(()=>{
						console.log('a 10', a);
						// resolve(10)
						reject(10)
						console.log('a 10.1', a);
					},10000);
				});
				
				a.then(sec=>{
					console.log('then', sec);
				}).catch(err=>{
					console.error('rej', err)
				})
				
				setTimeout(()=>{
					_reject('4')
				}, 4000)
				
				
				setTimeout(()=>{
					_resolve('5')
				}, 5000)
				
				console.log('a', a);
				
				setTimeout(()=>{
					console.log('a 11', a);
				}, 11000)	
			},
		}
	}
</script>

<style>
	 .__ag__indexcom__ {
		background-color: #fff;
		width: 750px;
		flex-direction: column;
		align-items: center;
		position: fixed;
		top: 142px;
		bottom: 0px;
		padding-bottom: 134px;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
	}
	.ipx {
		top: 196px;
		padding-bottom: 168px;
	}
	.__ag__indexhbcontent__ {
		width: 750px;
		flex-direction: column;
		align-items: center;
		margin-top: 50px;
	}
	.__ag__swiper__ {
		width: 100vw;
		height:46.67vw;
	}
	.__ag__indexhblive__ {
		padding: 32px;
		padding-top: 12px;
		padding-bottom: 48px;
	}
	.__ag__indexup__ {
		padding: 32px;
		padding-top: 50px;
		padding-bottom: 48px;
	}
	.__ag__indexagup__ {
		width: 750px;
		padding-top: 16px;
	}
	.__ag__refresh__ {
		padding: 60px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__loading__ {
		color: #000000;
		margin-right: 20wx;
	}
	.__ag__indexhbtitle__ {
		height: 40wx;
		padding-right: 32px;
		padding-left: 32px;
	}
	.__ag__livelive__ {
		margin-top: 10px;
		width: 750px;
		padding: 32px;
		padding-top: 16px;
		padding-bottom: 0px;
	}
	.__ag__liveuplist__{
		width: 686px;
		padding-top: 16px;
	}
	.__ag__livenew__ {
		width: 750px;
		padding-top: 16px;
	}
	.__ag__indexnewtitle__ {
		margin-bottom: 16px;
	}
	.__ag__indexaguptitle__ {
		padding-left: 16px;
		padding-right: 32px;
		/* padding-top: 0px;
		padding-bottom: 0px; */
	}
	.__ag__liventitlediv__ {
		width: 750px;
		padding-left: 38px;
		padding-right: 28px;
	}
</style>
