<template>
	<div class="__ag__match_lives_main__" @click.stop="">
		<div class="__lives_author__">
			<ag-user-img class="__author_img__" :avatar="upitem.avatar" :name="upitem.userNicename"></ag-user-img>
		</div>
		<text class="__lives_name__">{{upitem.userNicename}}</text>
		<text class="__lives_tips__" v-if="upitem.islive==1">该主播正在直播其他比赛， 是否去看看？</text>
		<text class="__lives_tips__" v-else>该主播不在家，是否去看看其他主播？</text>

		<!-- 直播其他的比赛 -->
		<div class="__lives_content__" v-if="lives">
			<div class="__broadcast_item__">
				<ag-user-img class="__broadcast_img__" :avatar="liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamFlaga" :name="liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNamea"></ag-user-img>
				<text class="__broadcast_name__">{{liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNamea}}</text>
			</div>
			<text class="__broadcast_text__">直播中</text>
			<div class="__broadcast_item__">
				<ag-user-img class="__broadcast_img__" :avatar="liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamFlagb" :name="liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNameb"></ag-user-img>
				<text class="__broadcast_name__">{{liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNameb}}</text>
			</div>
		</div>

		<!-- 主播不在家 -->
		<div class="__lives_content__" v-else>
			<div class="__broadcast_lf__">
				<ag-user-img class="__author_img__ __author_lives_img__ " :avatar="liveitem.avatar" :name="liveitem.upName"></ag-user-img>
				<image class="__zbz_img__" :src="__ag__url__('static/zbz.gif')"></image>
			</div>
			<div class="__broadcast_rg__">
				<text class="__tema_name__">{{liveitem.upName}}</text>
				<text class="__broadcast_tema__">{{liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNamea}} VS {{liveitem.joinMap && liveitem.joinMap.schedule && liveitem.joinMap.schedule.teamNameb}}</text>
			</div>
		</div>
		<div class="__lives_btn__">
			<text class="__btn_lf__" @click="$emit('closePopup')">取消</text>
			<text class="__btn_rg__" @click="__go_lives__">去看看</text>
		</div>
	</div>
</template>

<script>
	import util from './util.js'
	import agUserImg from './__ag__userImg__.vue'
	import agMinUrl from './__ag__minurl__.js'
	export default {
		components: {
			agUserImg
		},
		mixins:[agMinUrl],
		props: {
			liveitem: {
				type: Object,
				default: function() {
					return {}
				}
			},
			upitem: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				util,
				lives: false
			};
		},
		computed: {
			
		},
		methods: {
			__go_lives__() {
				let params = {
					uid:this.liveitem.uid
				}
				util.getPush('__ag__live__',params)
				this.$emit('closePopup')
			}
		}
	}
</script>

<style scoped lang="less">
	@import '../style/theme.less';
	.__ag__match_lives_main__ {
		width: 590px;
		height: 220wx;
		background-color: #fff;
		border-radius: 4wx;
		position: relative;
		padding-top: 22wx;
	}
	.__lives_author__ {
		width: 52wx;
		height: 52wx;
		border-radius: 50wx;
		background-color: #fff;
		position: absolute;
		left: 245px;
		right: 245px;
		top: -30wx;
		align-items: center;
		justify-content: center;
	}
	.__author_img__ {
		width: 45wx;
		height: 45wx;
		border-radius: 50wx;
	}
	.__author_lives_img__ {
		border-style: solid;
		border-width: 2wx;
		border-color: @main-color;
	}
	.__lives_name__ {
		height: 20wx;
		line-height: 20wx;
		text-align: center;
		font-style: normal;
		font-weight: 300;
		font-size: 14wx;
		color: #000000;
	}
	.__lives_tips__ {
		font-weight: 400;
		font-size: 15wx;
		line-height: 22wx;
		text-align: center;
		color: #000000;
		margin-top: 13wx;
		padding-right: 52wx;
		padding-left: 52wx;
	}
	.__lives_content__ {
		height: 50wx;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 8wx;
		padding-left: 40wx;
		padding-right: 40wx;
	}
	.__broadcast_item__ {
		flex: 1;
		justify-content: center;
		align-items: center;
	}
	.__broadcast_img__ {
		width: 25wx;
		height: 25wx;
	}
	.__broadcast_name__ {
		font-style: normal;
		font-weight: 400;
		font-size: 13wx;
		line-height: 20wx;
		letter-spacing: 0.05em;
		color: #000000;
		text-align: center;
		lines:1;
		text-overflow: ellipsis;
	}
	.__broadcast_text__ {
		width: 50wx;
		font-style: normal;
		font-weight: 500;
		font-size: 14wx;
		line-height: 50wx;
		letter-spacing: 0.05em;
		color: #FF3551;
		text-align: center;
	}
	.__broadcast_lf__ {
		width: 47wx;
		height: 47wx;
		border-radius: 50wx;
		margin-right: 8wx;
		position: relative;
	}
	.__zbz_img__ {
		width: 26wx;
		height: 12wx;
		position: absolute;
		bottom: -2wx;
		left: 10wx;
	}
	.__broadcast_rg__ {
		flex: 1;
		padding-top: 7wx;
	}
	.__tema_name__ {
		font-style: normal;
		font-weight: 500;
		font-size: 13wx;
		line-height: 18wx;
		color: #000000;
	}
	.__broadcast_tema__ {
		font-style: normal;
		font-weight: 400;
		font-size: 10wx;
		line-height: 14wx;
		color: #000000;
		text-align: left;
	}
	.__lives_btn__ {
		height: 34wx;
		margin-top: 15wx;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 20wx;
		padding-right: 20wx;
	}
	.__btn_lf__ {
		width: 120wx;
		height: 34wx;
		background-color: #fff;
		border-radius: 34wx;
		font-style: normal;
		font-weight: 500;
		font-size: 13wx;
		line-height: 34wx;
		letter-spacing: 0.05em;
		color: @main-color;
		text-align: center;
		border-style: solid;
		border-width: 2wx;
		border-color: @main-color;
	}
	.__btn_rg__ {
		width: 120wx;
		height: 34wx;
		background-color: @main-color;
		border-radius: 34wx;
		font-style: normal;
		font-weight: 500;
		font-size: 13wx;
		line-height: 34wx;
		letter-spacing: 0.05em;
		color: #FFFFFF;
		text-align: center;
	}
	
</style>
