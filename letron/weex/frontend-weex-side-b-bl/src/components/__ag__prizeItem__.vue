<template>
	<div class="__ag__task-item-container__" >
		<div class="__ag__icon-content__" :class="[done==2?'__ag__donebox__':'']">
			<div class="__ag__task-icon__" :class="[done==2?'prize-done':'']">
				<image :src="__ag__url__(icons)" class="__ag__prizeicom__" :class="[done==2?'__ag__imgdone__':'']" />
			</div>
		</div>
		<div class="__ag__task-content-box__">
			<div class="__ag__task-text-wc__">
				<text class="__ag__task-title-wc__" :class="[done==2?'gray':'']">{{title}}</text>
				<text class="__ag__task-description-wc__ padding-space">{{des}}</text>
				<text class="__ag__task-description-wc__">{{time}}</text>
			</div>
			<div class="__ag__task-button__" :class="[done==2?'done':'']">
				<text v-if="done===1" @click="getPrize" class="__ag__noget__" >未领取</text>
				<text v-if="done===2" class="__ag__got__">已发放</text>
				
			</div>
		</div>

	</div>
</template>

<script>
	import minurl from './__ag__minurl__.js'

	export default {
		mixins:[minurl],
		props:{
			icons:{
				type:String,
				defalut:'30min'
			},
			title:{
				type:String,
				default:'标题'
			},
			des:{
				type:String,
				default:'说明文字'
			},
			done:{
				type:Number,
				default:0
			},

			time:{

			}
		},
		computed:{

		},
		data() {
			return {
				
			}
		},
		methods: {
			getPrize(){
				this.$emit('getPrize')
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../style/theme.less';
.__ag__task-item-container__{
	width:686px;
	border-radius: 5wx;
	background-color: #fff;
	// min-height: 80wx;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-left:7wx;
	padding-right:14wx;
	margin-top:20px;
}
.__ag__icon-content__{
	width:66wx;
	height: 66wx;
	border-radius: 5wx;
	background-color: rgba(236,27,80,0.2);
	justify-content: center;
	align-items: center;

}
.__ag__donebox__{
	background-color: #f2f2f2;

}
.__ag__prizeicom__{
	width:52wx;
	height: 52wx;
}
.__ag__imgdone__{
	opacity: 0.5;

}
.__ag__task-button__{
	flex:1;
	width:64wx;
	height: 23wx;
	border-radius: 23wx;
	border-color: @main-color;
	border-style: solid;
	border-width: 1px;
	align-items: center;
	justify-content: center;

}
.done{
	border-color: #f2f2f2;
	border-style: unset;
	border-width: 0px;
	align-items: center;
	background-color: #f2f2f2;
}
.__ag__noget__{
	color:@main-color;
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 14wx;
	line-height: 20wx;
}
.__ag__task-content-box__{
	flex-direction: row;
	position: relative;
	justify-content: space-between;
	flex:1;
	padding-left:8wx;
	align-items: center;
	padding-top:8wx;
	padding-bottom:8wx;
}
.__ag__task-title-wc__{
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18wx;
	line-height: 20wx;
	color: #EC1B50;
}
.gray{
	color:#808080;
}
.__ag__task-description-wc__{
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 12wx;
	line-height: 17wx;
	color: #808080;
}
.padding-space{
	padding-top:20px;
}
.__ag__got__{
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 400;
	font-size: 14wx;
	line-height: 20wx;
	color:#808080;
}
.__ag__task-text-wc__{
	flex:3;
}
</style>
