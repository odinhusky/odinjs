<template>
	<div class="__ag__nvideo-main__" @click="__ag__click__">
		<div class="__ag__video-box__" ref="__ag__nvideo__" @click="__ag__click__">
			<video class="__ag__video__" :style="videoStyle" :src="sourceUrl" auto-play="true" :controls="controls" :play-status="state" @start="onstart" @fail="playFail"  @click="__ag__click__" ></video>
		</div>

		<!-- 自定义控件 -->
		<ag-video-control v-if="src" :isFull="isFull" :fullDevice="fullDevice" :info="upinfo" @full="onFull" ref="__ag__control__"></ag-video-control>

		<!-- 顶部控件 -->
		<div class="__ag__control_top__" :class="[isFull && ivx && ipx ?'__ag__control_full__':'',ivx && isFull && !ipx? '__ag__control_full_ivx__':'' ]" ref="__ag__close__" :style="controlStyle" @click.stop="">
			<div class="__ag__livetitle__" :style="controlStyle">
				<ag-uptitle :isfollow="false" :isclose="true" :iswhite="true" :isVideo="true"
				:item="upinfo" :amount="upinfo.joinMap && upinfo.joinMap.room  && upinfo.joinMap.room.amount"
				:score="upinfo.joinMap && upinfo.joinMap.streamer  && upinfo.joinMap.streamer.score" :user="a__ag__user__" @close="onclose"></ag-uptitle>
			</div>
		</div>

		<ag-modal :modalText="modalText" :isModal="isModal" @close="isModal = false" :isFull="isFull" :fullDevice="fullDevice"></ag-modal>
		 
	</div>
</template>

<script>
	import agVideoControl from './__ag__videoControls__.vue'
	import agModal from './__ag__modal__.vue'
	import util from './util.js'
	import minurl from './__ag__minurl__.js'
	import agMinix from './__ag__minix__.js'
	import module from './__ag__module__.js'
	import moduleFun from './__ag__moduleFun__.js'
	import uptitle from './__ag__uptitle__.vue'

	const animation = weex.requireModule('animation')
	export default {
		components: {
			'ag-video-control':agVideoControl,
			'ag-modal': agModal,
			'ag-uptitle':uptitle,

		},
		mixins:[minurl,agMinix],
		props:{
			src:{
				type:String,
				default:'',
			},
			fullDevice: {
				type: Object,
				default: function() {
					return {width:0,height:0,}
				}
			},
			upinfo: {
				type: Object,
				default: function() {
					return {}
				}
			},
			full: {
				type:Boolean,
				default: false
			},
		},
		data() {
			return {
				sourceUrl: this.src,
				state: 'pause',
				controls: 'nocontrols',
				isFull: false,
				isHideBar: false,
				controlerShowTimer:'',
				keyboardSize: '0px',
				isModal: false,
				modalText: ''
			};
		},
		watch: {
			src(n) {
				this.sourceUrl = n
			},
			full(n) {
				this.isFull = n
			},
		},
		computed: {
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
			controlStyle() {
				let style ={}
				if(this.isFull){
					style.height = "40wx"
					style.width = this.fullDevice.height.toFixed(2) + "px"
				} else {
					style.height = "40wx"
					style.width = "750px"
				}
				
				return style
			},
		},
		destroyed(){
			this.state = 'pause'
			this.clearTimeout()
		},
		mounted() {
			this.changeBar()
		},
		created() {
			let that = this
			let globalEvent = weex.requireModule('globalEvent');
			globalEvent.addEventListener('WXApplicationWillResignActiveEvent', function(e) {
				that.onPause()
			});
			globalEvent.addEventListener('WXApplicationDidBecomeActiveEvent', function(e) {
				that.onPlay()
			});
		},
		methods:{
			onstart (event) {
				this.state = 'start'
			},
			playFail() {
				this.clearTimeout()
				this.changeBar()
			},
			onFull(f) {
				this.isFull = f == 1 ? true : false
				this.isHideBar = false
				this.clearTimeout()
				this.changeBar()
				const changeFull = new BroadcastChannel('changeFull')
				changeFull.postMessage({f})
			},
			onclose(){
				util.setLandscape(0)
				if (this.isFull) {
					this.onFull(0)
				} else {
					util.pop()
				}
				
			},
			__ag__click__() {
				this.isHideBar = !this.isHideBar

				if (this.keyboardSize == '0px') {
					this.changeHideBar()
				}
				
				if (!this.isHideBar) {
					this.changeBar()
				}
			},
			changeBar() {
				if (this.controlerShowTimer) {
					clearTimeout(this.controlerShowTimer)
				}
				this.controlerShowTimer = setTimeout(()=> {
					this.isHideBar = true
					this.changeHideBar()
				},5000)
			},
			clearTimeout() {
				if (this.controlerShowTimer) {
					clearTimeout(this.controlerShowTimer)
				}
			},
			changeHideBar() {
				let landscape = false
				let el = this.$refs.__ag__control__
				let y = this.isHideBar ? 100 : 0
				let cl = this.$refs.__ag__close__
				let cy = this.isHideBar ? -180 : 0

				let agdevice = weex.requireModule(module.__ag__device__)
				if (agdevice) {
					landscape = moduleFun.__ag__getLandscape__()
				}
				console.log('l---',landscape)
				if (landscape) {
					cy = this.isHideBar ? -180 : 0
				}

				if (landscape && this.isFull) {
					cy = this.isHideBar ? -180 : 10
				}

				if (this.isFull && !landscape) {
					cy = this.isHideBar ? -180 : 44
				}

				if (el){
					animation.transition(el, {
						styles: {
							transform: `translateY(${y}px)`,
							transformOrigin: 'center center'
						},
						duration: 500, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					})
				}
				
				if (cl) {
					animation.transition(cl, {
						styles: {
							transform: `translateY(${cy}px)`,
							transformOrigin: 'center center'
						},
						duration: 500, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					})
				}
				this.clearTimeout()
			},
		},

	}
</script>

<style lang="less" scoped>
	.iconfont {
        font-family:iconfont;
		 font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
    }
	.__ag__nvideo-main__ {
		flex: 1;
		position: relative;
		background-color: #000;
	}
	.__ag__video-box__ {
		flex: 1;
	}
	.__ag__video__ {
		width: 750px;
		height: 421.875px;
	}
	.__ag__control_top__ {
		width: 750px;
		height: 80px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.__ag__control_full__ {
		padding-left: 100px;
	}
	.__ag__control_full_ivx__ {
		padding-left: 40px;
	}
	.__control_top_lf__ {
		flex: 1;
		flex-direction: row;
		align-items: center;
	}
	.__video_close__ {
		font-size: 55px;
		width: 80px;
		height: 80px;
		font-weight: bold;
		color: #fff;
		text-align: center;
		line-height: 80px;
	}
	.__ag__match_item__ {
		font-style: normal;
		font-weight: 500;
		font-size: 24px;
		color: #FFFFFF;
		margin-left: 5wx;

	}
	.__control_top_rg__ {
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		padding-right: 15wx;
	}
	.airplay {
		width: 80px;
		height: 80px;
		text-align: center;
		line-height: 32px;
		align-items: center;
		justify-content: center;
	}
	.__rg__tv_images__ {
		width: 40px;
		height: 40px;
	}
	.__rg__share_item__ {
		width: 80px;
		height: 80px;
		text-align: center;
		line-height: 32px;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
	}
	.__rg__share_images__ {
		width: 40px;
		height: 40px;
	}
	.__ag__livetitle__ {
		padding-left: 10px;
		padding-right: 20px;
		height: 80px;
		width: 750px;
	}
</style>
