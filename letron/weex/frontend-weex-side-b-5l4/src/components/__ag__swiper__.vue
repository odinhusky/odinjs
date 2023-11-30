<template>
	<div class="swiper" v-if="swipersFinal && swipersFinal.length">
		<slider class="swiper" show-indicators="true" interval="5000" auto-play="true">
			<div class="swiper" v-for="(item,index) in swipersFinal" :key="index" @click="onurl(item)">
				<image class="swiper" v-if="item.thumb"  @load="imgError($event,item)" :src=" __ag__url__(item.thumb)" mode="aspectFill"></image>
				<image v-else  class="swiper" :src="__ag__url__('static/def-jt.png')"></image>
				<div class="swiper-item" v-if="!item.thumb">
					<div class="__ag__match_lf__">
						<image v-if="item.teamFlaga" :src="__ag__url__(item.teamFlaga)"  class="__ag__match_image__"></image>
						<div class="__ag__match_item__" v-else>
							<text class="__ag__match_text__">{{item.teamNamea && item.teamNamea.charAt(0)}}</text>
						</div>
					</div>
					<div class="__ag__match_rg__">
						<image v-if="item.teamFlagb" :src="__ag__url__(item.teamFlagb)"  class="__ag__match_image__"></image>
						<div class="__ag__match_item__" v-else>
							<text class="__ag__match_text__">{{item.teamNameb && item.teamNameb.charAt(0)}}</text>
						</div>
					</div>
				</div>
			</div>
			<indicator v-if="swipersFinal && swipersFinal.length>0" class="indicator"></indicator>
    	</slider>
	</div>
</template>

<script>
	import agMinUrl from '@/components/__ag__minurl__.js'
	import agMinix from '@/components/__ag__minix__.js'
	import sport from '@/components/__ag__sport__.js'
	import util from '@/components/util.js'

	export default {
		name:"ag-swiper",
		mixins:[agMinix,agMinUrl],
		props:{
			swipers:{
				type:Array,
				default:function(){
					return []
				}
			},
			listLive: {
				type:Array,
				default:function(){
					return []
				}
			}
		},
		data() {
			return {
				swipers0: [],
			};
		},
		watch: {
			swipers(n) {
				this.swipers0 = n
			}
		},
		computed: {
			swipersFinal() {
				if (!this.swipers0 || !this.swipers0.length) {
					let l = this.listLive
					return l
				}
				return this.swipers0
			},
		},
		mounted() {
			this.swipers0 = this.swipers
		},
		methods:{
			imgError(event,item) {
				if(!event.success){
					item.thumb = ''
				}
			},
			onurl(item){
				
				if(item.type == 1){
					sport.urlTo(item,true)
					return
				}
				if(item.type == 2){
					let data = {
						id :item.articleId
					}
					util.getPush('__ag__newdetails__',data)
					return
				}
				if(item.type == 3){
					let data = {
						uid :item.articleId
					}
					util.getPush('__ag__live__',data)
					return
				}
				if(item.type == 4){
					let data = {
						id :item.articleId
					}
					util.getPush('__ag__datalive__',data)
					return
				}
				if(item.type == 6){
					sport.urlTo(item,true)
					return
				}
			},
		}
	}
</script>

<style >
	.swiper {
		height: 175wx;
		width: 750px;
		position: relative;
	}
	.swiper-item {
		height: 175wx;
		width: 750px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	.__ag__match_lf__ {
		width: 200px;
		height: 175wx;
		flex-direction: row;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 40px;
	}
	.__ag__match_rg__ {
		width: 200px;
		height: 175wx;
		flex-direction: row;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 40px;
	}
	.__ag__match_image__ {
		width: 175px;
		height: 175px;
		border-radius: 50wx;
	}
	.__ag__match_item__ {
		width: 175px;
		height: 175px;
		border-radius: 50wx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #E2E5EA;
	}
	.__ag__match_text__ {
		width: 80px;
		height: 80px;
		border-radius: 50wx;
		color: #000000;
		font-size: 16wx;
		text-align: center;
		line-height: 80px;
	}
	.indicator {
		width: 750px;
		height: 60px;
		position: absolute;
		bottom: 1px;
		item-color:rgba(255,255,255,0.5); 
		item-selected-color:#07C160; 
		item-size:16px;
	}
</style>
