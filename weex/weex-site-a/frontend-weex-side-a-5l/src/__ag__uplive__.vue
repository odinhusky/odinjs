<template>
    <div class="__ag__uplive__">
		<div class="__ag__uplive_title__" :class="[ipx?'title-ipx':'']">
			<div class="__ag__back__" @click="__ag__onBackPress__">
				<image :src="__ag__url__('static/bl/back.png')" class="__ag__back_image__"></image>
			</div>
			<div class="__ag__text__">
				<text class="__ag__titile_text__">热门直播</text>
			</div>
			<image class="__ag__uplive_image__" :src="__ag__url__('static/bl/zb.png')"/>
		</div>
        <scroller class="__ag__uplivecontent__" :class="[ipx?'ipx':'']" :show-scrollbar="false">
            <refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
                <loading-indicator  class="__ag__loading__"></loading-indicator>
                <text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
            </refresh>
            <ag-liveuplist class="__ag__liveuplist__" :list="list" :isindex="true"></ag-liveuplist>
        </scroller>
    </div>
</template>

<script>
    import agMinix from './components/__ag__minix__.js'
	import liveUpList from './components/__ag__liveUpList__.vue'
	import __ag__util from "./components/util.js"
	import env from "./components/env.js"
	import agMinUrl from './components/__ag__minurl__.js'
	export default {
		mixins:[agMinix,agMinUrl],
		components:{
			'ag-liveuplist':liveUpList,
		},
		data() {
            return {
                a__ag__isFreshing__: false,
				a__ag__freshing__: false,
				a__ag__triggered__: false,
				a__ag__freshText__: '释放更新',
				a__ag__refreshing__:false,
				env,
            }
		},
		computed:{
            list(){
				if(!this.a__ag__listUsersLive__ || !this.a__ag__listUsersLive__.data){
					return []
				}
				let l  = this.a__ag__listUsersLive__.data
				return l
			},
        },
		methods:{
			__ag__onBackPress__(){
				__ag__util.pop()
			},
            async __ag__loadData__(){
				try {
					await this.__ag__listUsersLive__()
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
            async refresh(){
				return  await this.__ag__listUsersLive__()
			},
			onpullingdown(){
				this.a__ag__freshText__ = '释放更新'
			},
		}
	}
</script>

<style>
    .__ag__uplive__ {
		background-color: #ffffff;
		width: 750px;
		flex-direction: column;
		align-items: center;
	}
	.__ag__uplive_title__ {
		width: 750px;
		height: 334px;
		padding-left: 16px;
		padding-right: 16px;
		background-image: linear-gradient(to bottom, #FDC501, #fd9b3a);
		position: relative;
		padding-top: 44px;
		overflow: hidden;
	}
	.title-ipx {
		padding-top: 78px;
	}
	.__ag__back__ {
		width: 60px;
		height: 60px;
		margin-top: 20px;
	}
	.__ag__back_image__ {
		width: 60px;
		height: 60px;
	}
	.__ag__text__ {
		flex: 1;
		justify-content: center;
		padding-bottom: 20px;
	}
	.__ag__titile_text__ {
		font-style: normal;
		font-weight: 500;
		font-size: 24wx;
		color: #FFFFFF;
		padding-left: 16px;
	}
	.__ag__uplive_image__ {
		width: 364px;
		height: 284px;
		position: absolute;
		right: 0;
		bottom: -30px;
	}
    .__ag__uplivecontent__ {
        width: 750px;
        padding: 32px;
		padding-bottom: 0;
        position: fixed;
		top: 320px;
		bottom: 0px;
        flex-direction: column;
		align-items: center;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background-color: #fff;
    }
	.ipx {
		padding-bottom: 34px;
	}
	.__ag__refresh__ {
		padding: 40px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__loading__ {
		color: #000000;
		margin-right: 20wx;
	}
	.__ag__liveuplist__ {
		width: 696px;
	}
	.__ag__hbliveuplist__ {
		width: 696px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
</style>
