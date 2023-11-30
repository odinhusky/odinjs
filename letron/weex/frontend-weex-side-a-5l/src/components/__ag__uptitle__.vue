<template>
	<div class="__ag__uptitle__" >
		<div class="__ag__uptitle-left__">
			<text class="iconfont __ag__back__" :class="[iswhite ? 'white' : 'black']" v-if="isclose" @click.stop="onclose">&#xe61d;</text>
			<!-- <ag-userimg v-if="item && item.id" class="__ag__upimg__" :name="item.upName" :uid="item.id" :avatar="item.avatar"></ag-userimg> -->
			<text v-if="item && item.joinMap && item.joinMap.match" class="__ag__upname__" :class="[iswhite ? 'white' : 'black']">{{item.joinMap.match.name}}: </text>
			<text v-if="item && item.teamNamea && item.teamNameb" class="__ag__upname__" :class="[iswhite ? 'white' : 'black']">{{item.teamNamea}} VS {{item.teamNameb}}</text>
		</div>
		<!-- <div class="__ag__uptitle-right__" v-if="item && item.id"> -->
			<!-- <agairplay class="airplay" v-if="!isfollow">
				<text class="iconfont airplay-text">&#xe62c;</text>
			</agairplay> -->
			<!-- <div class="__ag__uphot__" v-if="amount1 !=0"> -->
				<!-- <text class="iconfont __ag__fire__">&#xe6a5;</text> -->
				<!-- <image resize="contain" :src="__ag__url__('/static/5l4-huo.png')" class="__ag__fire__"></image>
				<text class="__ag__uptext__" :class="[iswhite ? 'white' : 'black']" >{{amount1}}</text>
			</div>
			<div class="__ag__upfollow__" :class="[isfollow?isfollow:'']" v-if="score1 !=0">
				<text class="iconfont  __ag__heart3__">&#xe700;</text>
				<text class="__ag__uptext__" :class="[iswhite ? 'white' : 'black']" >{{score1}}</text>
			</div> -->
			<!-- <div v-if="isfollow" @click.stop="__ag_editFollow__" class="__ag_isfollow__" >
				<text class="iconfont  __ag__outlined_heart__" v-if="!id" :class="[isfollow?isfollow:'']" >&#xe66d;</text>
				<text class="iconfont  __ag__vector__" v-else :class="[isfollow?isfollow:'']">&#xe700;</text>
			</div> -->
		<!-- </div> -->
	</div>
</template>

<script>
	import a__ag__util__ from './util.js'
	import agMinix from './__ag__minix__.js'
	import userImg from './__ag__userImg__.vue'
	import agMinUrl from './__ag__minurl__.js'

	export default {
		name:"ag-uptitle",
		mixins:[agMinix,agMinUrl],
		components:{
			'ag-userimg': userImg,
		},
		props:{
			iswhite:{
				type:Boolean,
				default:false,
			},
			isfollow:{
				type:Boolean,
				default:false,
			},
			isclose:{
				type:Boolean,
				default:false,
			},
			amount:{
				type:Number,
				default:0,
			},
			score:{
				type:Number,
				default:0,
			},
			item:{
				type:Object,
				default:function(){
					return {}
				},
			},
			user:{
				type:Object,
				default:function(){
					return {}
				},
			},
			isVideo:{
				type:Boolean,
				default:false,
			},
		},
		mounted(){

		},
		data() {
			return {
				id:0,
			};
		},
		computed:{
			
			amount1(){
				return a__ag__util__.numberReadable(this.amount)
			},
			score1(){
				return a__ag__util__.numberReadable(this.score)
			},
			iosUserId() {
				if (WXEnvironment.platform == 'iOS') {
					let i = this.user && this.user.id
					return a__ag__util__.base62(i)
				}
			},
		},
		methods:{

			async __ag_editFollow__(){
				
				try{
					if(this.id){
						let resp = await this.__ag__sport_api__.editFollowCancel({id: this.id})
						a__ag__util__.message(resp.message)
						this.id = 0
					}else{
						let resp = await this.__ag__sport_api__.editFollow({streamerId: this.item.id})
						a__ag__util__.message(resp.message)
						if(resp.message== "已订阅"){
							this.id = 1
							return 
						}
						this.id = resp.data.id
					}
					
				}catch(e){
					a__ag__util__.error(e.message || '无法订阅')
				}
			},
			onclose(){
				if (this.isVideo) {
					this.$emit('close')
					return
				}
				a__ag__util__.pop()
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
	.__ag__uptitle__ {
		flex: 1;
		height: 80px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-radius: 4px;
		padding: 20px;
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.__ag__uptitle-right__,
	.__ag__uptitle-left__ {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__upimg__ {
		width: 60px;
		height: 60px;
		margin-right: 6px;
	}
	.__ag__upname__ {
		font-size: 14wx;
		/* line-height: 18px; */
	}
	.white {
		color: #FFFFFF;
	}
	.black {
		color: #000000 !important;
	}
	.__ag__back__ {
		width: 80px;
		height: 80px;
		line-height: 80px;
		font-size: 50px ;
		margin-right: 15px;
		color: #fff;
		margin-left: -15px;
		text-align: center;
	}
	.__ag__heart3__ {
		font-size: 12wx;
		color: #F9595F;
		margin-right: 5px;
	}
	.__ag__fire__ {
		width: 20px;
		height: 20px;
		font-size: 14wx;
		color: #FFA001;
		margin-right: 5px;
	}
	.__ag__uptext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 12wx;
	}
	.__ag__uphot__ {
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}
	.__ag__upfollow__ {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag_isfollow__ {
		margin-left: 10px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.isfollow {
		margin-right: 10px;
	}
	.__ag__vector__ {
		font-size: 24px;
	}
	.__ag__outlined_heart__ {
		font-size: 30px;
	}
	.follow {
		color: #F9595F;
	}
	.airplay {
		width: 45wx;
		height: 30wx;
	}
	.airplay-text {
		color: #fff;
		text-align: center;
		line-height: 30wx;
		font-size:30px;
	}
</style>
