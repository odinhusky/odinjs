<template>
	<div class="__ag__my__" >
		<scroller class="__ag__my-scroll__" :show-scrollbar="false">
			<ag-ipx :bg="env.channel.mycolor"></ag-ipx>
			<ag-user-info :info="a__ag__users__"></ag-user-info>
			<ag-my-item  v-if="isUser" title="关注和预约" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(0)">
				<text class="agiconfont __ag__box-image__">&#xe66d;</text>
			</ag-my-item>
			<ag-my-item  v-if="isUser" title="修改密码" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(1)">
				<text class="agiconfont __ag__box-image__ icon-pass">&#xe681;</text>
			</ag-my-item>
			<ag-my-item  v-if="isUser" title="客服反馈" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(2)">
				<text class="agiconfont __ag__box-image__">&#xe738;</text>
			</ag-my-item>
			<ag-my-item title="关于我们" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(3)">
				<text class="agiconfont __ag__box-image__">&#xe684;</text>
			</ag-my-item>
			<ag-my-item title="设置" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(4)">
				<text class="agiconfont __ag__box-image__">&#xe672;</text>
			</ag-my-item>
			<ag-my-item title="分享应用" :isIcons="ag__isIcons__" @goJump="__ag__goJump__(5)">
				<text class="agiconfont __ag__box_share__">&#xe6e2;</text>
			</ag-my-item>
			<div class="__ag__setting-btn__" :class="[env.brand == 'hb'?'__ag__setting_hb_btn__':'']" v-if="isUser" @click="__ag__submit__">
				<text class="__ag__setting-out__">退出登录</text>
			</div>
		</scroller>
	</div>
</template>

<script>
	import agUserInfo from "./__ag__userInfo__.vue"
	import agMyItem from "./__ag__myItem__.vue"
	import agMinix from './__ag__minix__.js'
	import env from './env.js'
	import util from './util.js'
	import bc from './__ag__bc__.js'
    import ipx from './__ag__ipx__.vue'

	export default {
		components: {
			'ag-user-info':agUserInfo,
			'ag-my-item':agMyItem,
            'ag-ipx':ipx,
		},
		mixins:[agMinix],
		data() {
			return {
				ag__isIcons__: true,
				a__ag__users__: {},
				env,
			};
		},
		computed: {
			isUser(){
				let user = this.a__ag__users__
				if(user && user.userType<=2){
					return true
				}
				return false
			}
		},
		mounted(){
			
			
		},
		methods: {
			async __ag__loadData__() {
				const Steve = new BroadcastChannel('onlogin')
				let that = this
				Steve.onmessage= function(event){
					that.a__ag__users__ = event.data
				}
				
				this.afreshUser()

				bc.onmessage('afreshUser',this.afreshUser)
			},
			afreshUser() {
				this.a__ag__users__ = util.getItem('user')
			},
			__ag__goJump__(n) {
				if (n == 0) {
					util.getPush('__ag__followPointment__')
					return
				}
				if (n == 1) {
					util.getPush('__ag__changePassword__')
					return
				}
				if (n == 2) {
					util.getPush('__ag__myKefu__')
					return
				}
				if (n == 3) {
					util.getPush('__ag__myAbout__')
					return
				}
				if (n == 4) {
					let user = {
						userType: 	this.a__ag__users__.userType
					}
					util.getPush('__ag__mySetting__',user)
					return
				}
				if (n == 5) {
					util.getPush('__ag__share__')
					return
				}
			},
		}
	}
</script>

<style scoped lang="less">
@import '../style/theme.less';
.__ag__setting-btn__ {
    width: 686px;
    height: 80px;
    font-size: 34px;
    line-height: 80px;
    border-radius: 4px;
    color: @main-color;
    border-width: 1px;
    border-style: solid ;
    border-color: @main-color;
    margin-top:30wx;
    margin-right: 16wx;
    margin-left: 16wx;
}
.__ag__setting_hb_btn__ {
	border-radius: 40px;
}
.__ag__setting-out__{
    font-size: 40px;
    color:@main-color;
    line-height: 80px;
    text-align: center;
}
.__ag__my__ {
    width: 750px;
    background-color: #fff;
    flex-direction: column;
    position: fixed;
    top: 0px;
    bottom: 66wx;
}
.__ag__my-scroll__ {
    flex: 1;
    padding-bottom: 30wx;
}
.my-ipx {
    top: 35wx;
}
.__ag__box-image__ {
    width: 60px;
    height: 60px;
    font-size: 60px;
    line-height: 60px;
    font-family: agiconfont;
}
.__ag__box_share__ {
	width: 60px;
    height: 60px;
    font-size: 50px;
    line-height: 60px;
    font-family: agiconfont;
	text-align: center;
}
	
</style>
