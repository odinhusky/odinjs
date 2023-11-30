<template>
	<div class="__ag__hbtitle__" :class="[ipx?'title-ipx':'',!ipx && tab == 2?'title-match':'',ipx && tab == 2?'title-match-ipx':'',isBl?'title-logo':'']">
		<div class="__ag__hbtitlediv__" :class="[isback?'__ag__hbtitlediv_back__':'']">
			<div class="__ag__hbtitletop__" v-if="isback">
				<image :src="__ag__url__('static/bl/back.png')" class="__ag__back__" @click.stop="__ag__onBackPress__"></image>
				<text class="__ag__hbtitletoptext__"  v-if="title">{{title}}</text>
				<text class="__ag__back__"></text>
			</div>
			<div class="__ag__hbtitleright__"  v-if="!isback && tab != 2" >
				<image class="__ag__hbtitleimg__" :src="__ag__url__('static/bl/logo-t.png')"/>
			</div>
		</div>
		
	</div>
</template>

<script>
	import a__ag__util__ from './util.js'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	import env from './env.js'
	export default {
		mixins:[agMinix,agMinUrl],
		name:"ag-hbtitle",
		props:{
			isback:{
				type: Boolean,
				default: false,
				
			},
			isBl:{
				type:Boolean,
				default:false
			},
			title:{
				type: String,
				default: '',
			},
			tab: {
                type: Number,
                default: 1
            }
		},
		watch:{
			
		},
		mounted() {
			
		},
		data() {
			return {
				tab: 1,
				env,
			};
		},
		methods:{
			__ag__onBackPress__(){
				a__ag__util__.pop()
			},
		},
	}
</script>

<style lang="less" scoped>
	@import '../style/default.less';
	.iconfont {
        font-family:iconfont;
		 font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
    }
	.__ag__hbtitle__{
		position: fixed;
		top:0px;
		width:750px;
		height: 152px;
		background-image: linear-gradient(to bottom, #FDC501, #fd9b3a);
		z-index: 99999;
		left: 0;
    	right: 0;
		padding-top: 44px;
	}
	.title-ipx {
		height: 206px;
		top: 0px;
		padding-top: 78px;
	}
	.title-match {
		height: 56px;
		background-image: linear-gradient(to bottom, #FDC501, #FDC501);
	}
	.title-match-ipx {
		height: 110px;
	}
	.title-logo {
		background-image:linear-gradient(to bottom, #FDC501, #FDC501);
	}
	.__ag__hbtitlediv__ {
		width:750px;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: relative;
	}
	.__ag__hbtitlediv_back__ {
		align-items: flex-end;
	}
	.__ag__hbtitletop__ {
		width:750px;
		height: 80px;
		padding-left: 32px;
		padding-right: 32px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 20px;
	}
	.__ag__hbtitletoptext__{
		color: #fff;
		font-size: 18wx;
		font-weight: 500;
	}
	
	.__ag__hbtitleright__ {
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-bottom: 15px;
	}
	.__ag__hbtitleimg__ {
		width:300px;
		height: 96px;
	}
	.__ag__backdiv__ {
		width: 60px;
		height: 60px;
		align-items: center;
		justify-content: center;
	}
	.__ag__back__ {
		width: 60px;
		height: 60px;
	}
	.__ag__hbmy__ {
		font-size: 68px;
		color: #fff;
	}
	.__ag__myimg__ {
		width: 66px;
		height: 66px;
	}
	.__ag__book__ {
		width: 65px;
		height: 65px;
	}
</style>
