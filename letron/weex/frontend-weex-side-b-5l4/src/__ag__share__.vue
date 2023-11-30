<template>
	<div class="__ag__share__" :class="[ipx?'share-ipx':'']">
		<div class="__ag__shareb__">
			<image class="__ag__shareimgb__" resize="cover" :src="__ag__url__(`static/${env.code}-share-b.png`)"></image>
			<div class="__ag__sharecontent__">
				<image class="__ag__shareimg__" resize="contain" :src="__ag__url__(`static/${env.code}-share.png`)"></image>
				<div class="__ag__shareqr_item__">
					<image class="__ag__shareqr__" resize="contain" :src="__ag__url__(srcqr)"></image>
					<text class="__ag__shareqr_text__">截图分享给好友</text>
				</div>
			</div>
		</div>
		<div class="__ag__back__" @click="onclose">
			<text class="agiconfont __ag__back_text__">&#xe61d;</text>
		</div>
	</div>
</template>

<script>
	import util from './components/util.js'
	import env from './components/env.js'
	import api from './components/__ag__sport_api__.js'
	import agMinUrl from './components/__ag__minurl__.js'
	export default {
		mixins: [agMinUrl],
		components: {
		},
		data() {
			return {
				env,
				srcqr: ''
			};
		},
		computed: {
			
		},
		created(){

		},
		mounted() {
			this.__ag__editQR__()
		},
		methods: {
			onclose() {
				util.pop()
			},
			__ag__editQR__() {
				api.listMetaData({label:"qrUrl"}).then(resp => {
					if (resp.data && resp.data.length) {
						this.srcqr = resp.data[0].value
					}
				}).catch(err => {

				})
			}
		}
	}
</script>

<style lang="less">
	@import './style/theme.less';
	.__ag__share__ {
		width: 750px;
		position: fixed;
		top: 0;
		bottom: 0;
		background-color: #fff;
	}
	.__ag__shareb__ {
		flex: 1;
		position: relative;
	}
	.__ag__back__ {
		width: 80px;
		height: 80px;
		line-height: 80px;
		margin-right: 15px;
		position: fixed;
		top: 100px;
		left: 20px;
		text-align: center;
	}
	.__ag__back_text__ {
		color: #000;
		font-size: 25wx;
		text-align: center;
		line-height: 80px;
	}
	.__ag__shareimgb__ {
		flex: 1;
	}
	.__ag__sharecontent__ {
		position: fixed;
		width: 750px;
		top: 130px;
		bottom: 0;
	}
	.__ag__shareimg__ {
		flex: 1;
	}
	.__ag__shareqr_item__ {
		width: 750px;
		position: absolute;
		bottom: 120wx;
		left: 0;
		right: 0;
		justify-content: center;
		align-items: center;
	}
	.__ag__shareqr__ {
		width: 190wx;
		height: 190wx;
		border-radius: 10px;
	}
	.__ag__shareqr_text__ {
		color: #fff;
		font-size: 14wx;
		margin-top: 40px;
	}
</style>
