<template>
	<div class="__ag__newsitem__" @click="__ag__onnewsDetail__(isindex)" :class="[index == length - 1 ? 'last-news-item': '',!isindex?'__ag__newsitem-index__':'']">
		<div class="__ag__newsitem-lf__">
			<div class="__ag__newsitemtitle__">
				<text class="__ag__newsitemtitletext__">{{item.title}}</text>
			</div>
			<div class="__ag__newsitemdate__">
				<text class="__ag__newsitemtext__" v-if="item.addTime">{{__ag__formatToDate__(item.addTime)}}</text>
			</div>
		</div>
		<div class="__ag__newsitem-rg__">
			<image class="new-poster-img" resize="contain" mode="aspectFill" v-if="item.thumb" :src="__ag__url__(item.thumb)"/>
		</div>
		
	</div>
</template>

<script>
	import util from './util.js'
	import agMinUrl from '@/components/__ag__minurl__.js'
	export default {
		name:"ag-newsitem",
		mixins:[agMinUrl],
		data() {
			return {
				date:new Date(),
			};
		},
		props:{
			item:{
				type:Object,
				default:{}
			},
			isindex:{
				type:Boolean,
				default:false
			},
			index: {
				type:Number,
				default: 0
			},
			length: {
				type:Number,
				default: 0
			}
		},
		
		methods:{
			__ag__formatToDate__(date){
				return util.formatToDate(date)
			},
			__ag__onnewsDetail__(isindex){
				if(this.item.id<=0){
					return
				}
				let data = {
					id:this.item.id
				}
				if(isindex){
					util.getPush('__ag__newdetails__',data)
					return 
				}
				util.getPush('__ag__newdetails__',data)
				// uni.navigateTo({
				// 	url:'/pages/__ag__newsDetail__?id='+this.item.id
				// })
			},
		},
	}
</script>

<style lang="less">
	.__ag__text__ {
		overflow: hidden;
		text-overflow: hidden;
	}
	.__ag__nowrap__ {
		overflow: hidden;
		text-overflow: hidden;
		white-space:nowrap;
		word-break:break-all; 
		text-overflow: ellipsis;
	}
	.__ag__newsitem__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		padding-bottom: 16wx;
        padding-top: 16wx;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #E2E5EA;
	}
	.__ag__newsitem-index__ {
		padding-left: 16wx;
		padding-right: 16wx;
	}
	.last-news-item {
		border-bottom-width:0px;
	}
	.__ag__newsitem-lf__ {
		flex: 1;
		margin-right: 12wx;
	}
	.__ag__newsitemtitle__ {
		flex: 1;
		height: 50wx;
	}
	.__ag__newsitemtitletext__ {
		font-style: normal;
		font-weight: 500;
		font-size: 15wx;
		line-height: 25wx;
		color: #000000;
		lines:2;
		text-overflow: ellipsis;
	}
	.__ag__newsitemdate__ {
		height: 30wx;
		display: flex;
		flex-direction: row;
	}
	.__ag__newsitemtext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 13wx;
		height: 30wx;
		line-height: 30wx;
		color: rgba(0, 0, 0, 0.5);
		overflow: unset;
		
	}
	.__ag__newsitem-rg__ {
		width: 130wx;
		border-radius: 4wx;
		overflow: hidden;
	}
	.new-poster-img {
		width: 130wx;
		height: 80wx;
		border-radius: 4wx;
	}
</style>
