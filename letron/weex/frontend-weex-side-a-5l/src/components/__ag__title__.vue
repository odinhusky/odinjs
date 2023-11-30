<template>
	<div class="__ag__title__">
		<div class="__ag__titleleft__">
			<text class="__ag__titlelefttext__">{{name}}</text>
		</div>
		<div v-if="isgd" class="__ag__titleright__" @click.stop="onclick">
			<text class="__ag__titlerighttext__">更多</text>
			<text class="iconfont __back_icon__">&#xec5a;</text>
		</div>
	</div>
</template>

<script>
	import agMinUrl from './__ag__minurl__.js'
	import env from './env.js'
	export default {
		
		mixins:[agMinUrl],
		props:{
			id:{
				type:String,
				default:'0',
			},
			name:{
				type:String,
				default:''
			},
			isgd: {
				type:Boolean,
				default:false,
			}
		},
		data() {
			return {
				env,
			};
		},
		methods:{
			onclick(){
				this.$emit('onclick')
			},
		},
	}
</script>

<style lang="less" scoped>
@import '../style/default.less';
	.iconfont {
		font-family: iconfont;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.__ag__title__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 28wx;
	}
	.__ag__fire__ {
		color: #FFA001;
		font-size: 30wx;
	}
	.__ag__titlelefttext__ {
		height: 28wx;
		font-style: normal;
		font-weight: 700;
		font-size: 20wx;
		color: #000000;
		overflow: unset;
	}
	.__ag__titleright__ {
		width: 53wx;
		height: 24wx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: rgba(253, 197, 1, 0.3);
		border-radius: 24px;
		padding-left: 5px;
	}
	.__ag__titlerighttext__ {
		height: 24wx;
		line-height: 24wx;
		font-style: normal;
		font-weight: 400;
		font-size: 12wx;
		color: #F8912C;
	}
	.__ag__titleleft__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 24wx;
		margin-right: 15px;
	}
	.__back_icon__ {
		font-size: 14wx;
		color: #F8912C;
	}
</style>
