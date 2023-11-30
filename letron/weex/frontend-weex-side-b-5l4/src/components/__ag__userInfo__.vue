<template>
	<div class="__ag__userInfo-main__">
		<div class="__ag__userInfo-item__" >
			<div class="__ag__userInfo-item-image__">
				<image v-if="info && info.userType<3" class="__ag__avatar__" mode="aspectFill" :src="__ag__url__(info.avatar)"></image>
				<image v-else class="__ag__avatar-user__" mode="aspectFill" :src="__ag__url__('static/__ag__notuser__.png')"></image>
			</div>

			<div class="__ag__userInfo-item-name__" v-if="info && info.userType<3" @click="__ag__modifyUserInfo__">
				<text class="__ag__userInfo-item-user-ame__" :class="[env.brand == 'hb'?'__ag__userInfo_hb_text__':'__ag__userInfo_orther_text__']">{{info && info.userNicename}}</text>
				<text class="__ag__userInfo-item-account__">MOB: {{info && info.userLogin}}</text>
			</div>
			<div v-else class="__ag__userInfo-item-name__" @click="__ag__goLogin__">
				<text class="__ag__userInfo-item-user-ame__" :class="[env.brand == 'hb'?'__ag__userInfo_hb_text__':'__ag__userInfo_orther_text__']">点击登录</text>
				<text class="__ag__userInfo-item-account__">登录可享更多服务</text>
			</div>
		</div>
		<div class="__ag__userInfo-btn__" v-if="info && info.userType<3">
			<div class="__ag__userInfo-btntext__" :class="[env.brand == 'hb'?'__ag__modify_hb_btn__':'__ag__modify_orther_btn__']" @click="__ag__modifyUserInfo__" >
				<text class="__ag__modify__text__" :class="[env.brand == 'hb'?'__ag__modify_hb_text__':'__ag__modify_orther_text__']"> 编辑个人档案</text>
			</div>
		</div>
		<div class="__ag__userInfo-btn__" v-else>
			<div class="__ag__userInfo-btntext__" :class="[env.brand == 'hb'?'__ag__modify_hb_btn__':'__ag__modify_orther_btn__']" @click="__ag__goLogin__" >
				<text class="__ag__modify__text__" :class="[env.brand == 'hb'?'__ag__modify_hb_text__':'__ag__modify_orther_text__']"> 点击登录</text>
			</div>
		</div>
	</div>
</template>

<script>
	import userImg from './__ag__userImg__.vue'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	import util from './util.js'
	import env from './env.js'
	export default {
		name:"ag-userInfo",
		mixins: [agMinix,agMinUrl],
		components: {
			'user-img':userImg
		},
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				util,
				env
			};
		},
		methods: {
			// 跳转登录页面
			__ag__goLogin__() {
				util.getPush('__ag__login__')
			},
			// 跳转个人信息
			__ag__modifyUserInfo__() {
				util.getPush('./__ag__modifyUser__')
			},
		}
	}
</script>

<style lang="less">
    @import "../style/theme.less";
	.__ag__modify__text__{
		font-size: 30px;
	}
	.__ag__userInfo-main__ {
		max-height: 360px;
		background-color: @my-by-color;
	}
	.__ag__userInfo-item__ {
		height: 200px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__userInfo-item-image__ {
		margin-left: 20px;
		margin-right: 35px;
		width: 160px;
		height: 160px;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		overflow: hidden;
		background-color: rgba(206, 206, 206,0.5);
	}
	.__ag__avatar__ {
		width: 160px;
		height: 160px;
	}
	.__ag__avatar-user__ {
		width: 80px;
		height: 80px;
	}
	.__ag__userInfo-item-name__ {
		flex-direction: column;
	}
	.__ag__userInfo-item-user-ame__ {
		font-style: normal;
		font-weight: 500;
		font-size: 40px;
		white-space:unset;
	}
	.__ag__userInfo_hb_text__ {
		color: #fff;
	}
	.__ag__userInfo_orther_text__ {
		color: #FFFFFF;
	}
	.__ag__userInfo-item-account__ {
		font-style: normal;
		font-weight: 300px;
		font-size: 13wx;
		color: #fff;
		white-space:unset;
		margin-top: 3wx;
	}
	.__ag__userInfo-btn__ {
		width: 750px;
		height: 120px;
		padding: 20px;
		padding-top: 10px;
	}
	.__ag__userInfo-btntext__ {
		width: 710px;
		height: 70px;
		align-items: center;
		justify-content: center;
		font-style: normal;
		font-weight: 500;
		font-size: 45px;
		letter-spacing: 0.05em;
		border-style: solid;
		border-width: 1px;
		color: #FFFFFF;
	}
	.__ag__modify_hb_btn__ {
		border-color: #F2F3F4;
		background-color: #F2F3F4;
		border-radius: 40px;
	}
	.__ag__modify_orther_btn__ {
		border-color: #FFFFFF;
		border-radius: 4px;
	}
	.__ag__modify_hb_text__ {
		color: #252932;
	}
	.__ag__modify_orther_text__ {
		color: #FFFFFF;
	}
</style>
