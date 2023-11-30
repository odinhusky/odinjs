<template>
	<div class="__ag__title__">
		<div class="__ag__titleleft__">
			<image :src="__ag__url__('static/rmbs.png')" mode="aspectFit" v-if="id ==1" :class="['__ag__newsimg_'+id+'__']"></image>
			<image :src="__ag__url__('static/rmzb.png')" mode="aspectFit" v-if="id ==2" :class="['__ag__newsimg_'+id+'__']"></image>
			<image :src="__ag__url__('static/rmzbo.png')" mode="aspectFit" v-if="id ==3" :class="['__ag__newsimg_'+id+'__']"></image>
			<text class="__ag__titlelefttext__">{{name}}</text>
		</div>
		<div v-if="isgd" class="__ag__titleright__" @click.stop="onclick">
			<text class="__ag__titlerighttext__">更多</text>
			<text class="agiconfont back1-right">&#xec6b;</text>
		</div>
	</div>
</template>

<script>
	import agMinUrl from './__ag__minurl__.js'
	export default {
		name:"ag-title",
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
				
			};
		},
		methods:{
			onclick(){
				this.$emit('onclick')
			},
		},
	}
</script>

<style lang="less">
	@import "../style/theme.less";
	.__ag__title__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.__ag__titlelefttext__ {
		font-style: normal;
		font-weight: 600;
		font-size: 20wx;
		color: #000000;
		overflow: unset;
	}
	.__ag__titleright__ {
		height: 25wx;
		box-sizing: border-box;
		border-radius: 28px;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-style: solid;
		border-width: 1px;
		padding-left: 15px;
		padding-right: 2px;
		border-color: @main-color;
	}
	.__ag__titlerighttext__ {
		height: 30wx;
		font-style: normal;
		font-weight: 500;
		font-size: 14wx;
		line-height: 30wx;
		letter-spacing: 0.05em;
		color: @main-color;
		overflow: unset;
	}
	.back1-right {
		font-size: 18wx;
		color: @main-color;
	}
	.__ag__titleleft__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 30wx;
	}
	.__ag__newsimg_1__ {
		width: 34px;
		height: 42px;
		margin-right: 4wx;
		margin-top: 5px;
	}
	.__ag__newsimg_2__ {
		width: 50px;
		height: 50px;
		margin-right: 4wx;
	}
	.__ag__newsimg_3__ {
		width: 50px;
		height: 50px;
		margin-right: 4wx;
		margin-top: 5px;
	}
</style>
