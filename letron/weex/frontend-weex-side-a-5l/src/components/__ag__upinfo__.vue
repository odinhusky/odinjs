<template>
	<div class="__ag__upinfo__" v-if="item && item.id">
		<div class="__ag__upinfotitle__">
			<div class="__ag__upinfoleft__">
				<ag-userimg class="__ag__upinfotitleimg__" :fontSize="true" :name="item.userNicename" :avatar="item.avatar"></ag-userimg>
				<div class="__ag__upinfoname__">
					<text class="__ag__upinfonametext__">{{item.userNicename}}{{id}}</text>
					<div class="__ag__upinfofollow__">
						<image :src="__ag__url__('static/bl/hot.png')"   class="__ag__fire__"></image>
						<text class="__ag__upinfofollowtext__">{{a__ag__util__.numberReadable(amount)}}</text>
						<text class="iconfont __ag__like__">&#xe700;</text>
						<text class="__ag__upinfofollowtext__" v-if="item.score">{{a__ag__util__.numberReadable(item.score)}}</text>
					</div>
				</div>
			</div>
			<div class="__ag__upinforight__">
				<text class="iconfont __ag__follow__" v-if="!id"  @click="__ag_editFollow__">&#xe66d;</text>
				<text class="iconfont __ag__follow__ isfollow-select_text" v-else  @click="__ag_editFollow__">&#xe700;</text>
			</div>
		</div>
		<div class="__ag__upinfobottom__" v-if="tab == 2">
			<div class="__ag__upinfobody__" v-if="item.bio">
				<text class="__ag__upinfotext__">{{item.bio}}</text>
			</div>
			<div class="__ag__upinfo_operation__">
				<div class="__ag__upinfobottomlh__ __ag__upinfobottoma__" @click="__ag_black__">
					<text class="iconfont __ag__iconlh__">&#xe640;</text>
					<text class="__ag__upinfobottomtext__" >拉黑</text>
				</div>
				<div class="__ag__upinfobottomlh__ __ag__upinfobottomb__" @click="__ag_report__">
					<text class="iconfont __ag__iconlh__">&#xe6a0;</text>
					<text class="__ag__upinfobottomtext__" >举报</text>
				</div>
			</div>
		</div>
		
		<div class="__ag__upinforeport__" v-if="isreport">
			<ag-report :isreport="isreport" @onclose="onclose" :roomId="roomId"></ag-report>
		</div>
	</div>
</template>

<script>
	import a__ag__util__ from './util.js'
	import userImg from './__ag__userImg__.vue'
	import report from './__ag__report__.vue'
	import __ag__sportApi__ from './__ag__sport_api__.js'
	import agMinUrl from './__ag__minurl__.js'
	export default {
		name:"ag-upinfo",
		mixins:[agMinUrl],
		components:{
			'ag-userimg':userImg,
			'ag-report':report,
		},
		data() {
			return {
				a__ag__util__,
				id: 0,
				isreport:false,
			};
		},
		props:{
			item:{
				type: Object,
				default(){
					return {}
				}
			},
			followId: {
				type:Number,
				default:0
			},
			roomId:{
                type:Number,
                default:0,
            },
			user:{
				type: Object,
				default(){
					return {}
				}
			},
			amount: {
				type:Number,
				default:0
			},
			tab: {
				type:Number,
				default:1
			},
		},
		watch:{
			followId(n){
				
				this.id = n
			}
		},
		mounted() {
			this.id = this.followId
		},
		methods:{
			onclose(){
				this.isreport = false
			},
			__ag_report__(){
				if(!this.user || this.user.useType == 3){
					a__ag__util__.message('请登录账号再举报')
					return 
				}
				this.isreport = true
				// a__ag__util__.message(this.isreport)
			},
			__ag_black__(){
				a__ag__util__.message('已拉黑，主播将不能对您私信')
			},
			async __ag_editFollow__(){
				if(this.id){
					try{
						let resp = await __ag__sportApi__.editFollowCancel({id: this.id})
						a__ag__util__.message(resp.message)
						this.id = 0
						this.$emit('editFollow',this.id)
					}catch(e){
						a__ag__util__.message(e.message || '无法订阅')
					}
				}else{
					try{
						let resp = await __ag__sportApi__.editFollow({streamerId: this.item.id})
						a__ag__util__.message(resp.message)
						this.id = resp.data.id
						this.$emit('editFollow',this.id)
					}catch(e){
						a__ag__util__.message(e.message || '无法订阅')
					}
				}
			}
			
		}
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
	.__ag__upinfo__ {
		width: 750px;
	}
	.__ag__upinfotitle__ {
		display: flex;
		flex-direction: row;
		padding-top: 20px;
		padding-bottom: 20px;
		background-color: #fff;
		padding-left: 32px;
		padding-right: 16px;
	}
	.__ag__upinfoleft__ {
		flex: 1;
		flex-direction: row;
		align-items: center;
	}
	.__ag__upinforight__ {
		width: 100px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__follow__ {
		font-size: 30wx;
	}
	.isfollow-select_text {
		color: #F60909;
		font-size: 24wx;
	}
	.__ag__upinfotitleimg__ {
		width: 116px;
		height: 116px;
		font-size: 50px;
		margin-right: 22px;
		border-radius: 50wx;
	}
	.__ag__upinfoname__ {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.__ag__upinfonametext__ {
		font-weight: 600;
		font-size: 30px;
		line-height: 42px;
		color: #000;
	}
	.__ag__upinfofollow__ {
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__like__ {
		width: 35px;
		color: #F02727;
		font-size: 30px;
		margin-right: 5px;
		margin-left: 30px;
	}
	.__ag__fire__ {
		width: 44px;
		height: 44px;
		margin-top: -10px;
	}
	.__ag__upinfofollowtext__ {
		font-size: 26px;
		color: #000;
	}
	.__ag__upinfobody__ {
		background-color: rgba(253, 197, 1, 0.3);
		margin-top: 25wx;
		padding: 32px;
		border-radius: 20px;
	}
	.__ag__upinfotext__ {
		color: #000;
		font-size: 13wx;
		line-height: 40px;
		font-weight: 400;
	}
	.__ag__upinfobottom__ {
		background-color: #fff;
		margin-top: 10px;
		padding-left: 32px;
		padding-right: 32px;
	}
	.__ag__upinfo_operation__ {
		flex-direction: row;
		align-items: center;
		margin-top: 52px;
		padding-bottom: 50px;
		padding-left: 50px;
		padding-right: 50px;
	}
	.__ag__upinfobottomlh__ {
		flex: 1;
		border-style:solid ;
		border-width: 1px;
		border-color: #F5982A;
		box-sizing: border-box;
		border-radius: 30px;
		height: 68px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.isfollow-select {
		background-color: #F3E7F8;
		border-style:solid ;
		border-width: 0px;
		border-color: #F3E7F8;
	}
	.__ag__upinfobottomfo__ {
		// margin-right: 10px;
	}
	.__ag__upinfobottomba__ {
		margin-left: 20px;
	}
	.__ag__upinfobottomtext__ {
		font-weight: 500;
		font-size: 26px;
		line-height: 36px;
		color: #F5982A;
	}
	.__ag__iconlh__ {
		font-size: 30x;
		color: #F5982A;
		margin-right: 8px;
	}
	.__ag__upinfobottoma__ {
		background-color: rgba(253, 197, 1, 0.3);
		border-width: 0px;
		margin-right: 32px;
	}
	.__ag__vector_isfollow__ { 
		color: #FF332A;
		font-size: 30px;
	}
	.__ag__upinforeport__ {
		position: fixed;
		width: 750px;
		top: 501.875px;
		bottom: 0px;
	}
</style>
