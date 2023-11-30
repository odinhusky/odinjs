<template>
	<div v-if="item1 && item1.id" class="__ag__liveupitem__">
		<div class="__ag__liveupitemimgview__">
			<image  v-if="item1 && item1.joinMap && item1.joinMap.room && item1.joinMap.room.thumb"  :src="__ag__url__(item1.joinMap.room.thumb)" mode="aspectFill" class="__ag__liveupitemimg__"></image>
			<image  v-else-if="item1.thumb" @load="imgError"  :src="__ag__url__(item1.thumb)"  mode="aspectFill" class="__ag__liveupitemimg__"></image>
			<image  v-else  mode="aspectFill" class="__ag__liveupitemimg__"></image>
			<div class="__ag__liveupitemmatch__" v-if="item1.joinMap && item1.joinMap.match  && item1.joinMap.match.nameAbbr">
				<image  :src="__ag__url__('static/5l5-r.png')"  class="__ag__liveupimg__"></image>
				<div class="__ag__liveupimg__">
					<text class="__ag__liveupitemtext__">{{item1.joinMap && item1.joinMap.match  && item1.joinMap.match.nameAbbr}}</text>

				</div>
			</div>
		</div>
		<div class="__ag__liveupitemcontent__">
			<div class="__ag__liveupitemtitle__">
				<text class="__ag__liveupitemtitletext__">{{item1.title}}</text>
			</div>
			<div class="__ag__liveupitembottom__">
				<div class="__ag__liveupitemup__">
					<ag-userimg class="__ag__liveupitemupimg__" :avatar="item1.avatar" :uid="item1.id" :name="item1.upName"></ag-userimg>
					<div class="__ag__liveupitemupview__">
						<text class="__ag__liveupitemuptext__">{{item1.upName}}</text>
					</div>
				</div>
				<!-- <text class="iconfont __ag__fire__">&#xe6a5;</text> -->
				<div class="__ag__hotdiv__">
					<image resize="contain" :src="__ag__url__('/static/5l5-hot3.png')" class="__ag__fire__"></image>
					<text class="__ag__liveupitembottomtext__" >{{item1.joinMap && item1.joinMap.room && item1.joinMap.room.amount}}</text>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import agMinix from './__ag__minix__.js'
	import __ag__env from "./env.js"
	import userImg from './__ag__userImg__.vue'
	import agMinUrl from './__ag__minurl__.js'
	export default {
		name:"ag-liveUpitem",
		components:{
			'ag-userimg': userImg,
		},
		props:{
			item:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		mixins:[agMinix,agMinUrl],
		data() {
			return {
				item1:{},
				__ag__env,
				download:__ag__env.download,
			};
		},
		watch:{
			item(n){
				this.item1 = n
			}
		},
		mounted(){
			this.item1 = this.item
		},
		methods:{
			imgError(event){
				console.log("event",event)
				if(!event.success){
					this.item1.thumb=null
				}
			}
		}
	}
</script>

<style >
	.iconfont {
		font-family: iconfont;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.__ag__liveupitem__ {
		flex-direction: row;
		height: 202px;
		margin-bottom: 30px;
		box-shadow: 8px 6px 2px rgba(0, 0, 0, 0.25);
	}
	.__ag__liveupitem__:last-child{
		margin-bottom: 0px;
	}
	.__ag__liveupitemimgview__ {
		width: 328px;
		height: 200px;
		/* border-radius: 16px; */
		position: relative;
	}
	.__ag__liveupitemimg__ {
		height: 198px;
		border-style: solid;
		border-width: 1px;
		border-color: #E2E5EA;
		background-color:#fff;
	}
	.__ag__liveupitemmatch__ {
		position: absolute;
		top: 0px;
		right: 0px;
	}
	.__ag__liveupitemtext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 20px;
		color: #FFFFFF;
		overflow: auto;
	}
	.__ag__liveupitemcontent__ {
		flex-direction: column;
		width: 360px;
		height: 200px;
		padding-top: 16px;
		padding-right: 34px;
		padding-left: 24px;
		padding-bottom: 18px;
		background-color: #6E0FAB;
	}
	.__ag__liveupitemup__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 16px;
	}
	.__ag__liveupitemupimg__ {
		width: 28px;
		height: 28px;
		margin-right: 8px;
	}
	.__ag__liveupitemupview__ {
		width: calc(100% - 8px - 24px);
		overflow: hidden;
		text-overflow: hidden;
		white-space:nowrap;
		word-break:break-all; 
		text-overflow: ellipsis;
	}
	.__ag__liveupitemuptext__ {
		font-style: normal;
		font-weight: 400;
		font-size: 10wx;
		color: #F2F3F4;
	}
	.__ag__liveupitemtitle__ {
		flex: 1;
		margin-bottom: 14px;
	}
	.__ag__liveupitemtitletext__ {
		font-style: normal;
		font-weight: 500;
		font-size: 14wx;
		color: #FFFFFF;
		lines:2;
	}
	.__ag__hotdiv__ {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__liveupitembottom__ {
		height: 28px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.__ag__fire__ {
		color: #FFA001;
		width: 20px;
		height: 20px;
		font-size: 25px;
		margin-right: 5px;
	}
	.__ag__liveupitembottomtext__ {
		font-style: normal;
		font-weight: 400;
		font-size: 10wx;
		color: #F2F3F4;
	}
	.__ag__liveupimg__ {
		width: 100px;
		height: 38px;
		position: absolute;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
