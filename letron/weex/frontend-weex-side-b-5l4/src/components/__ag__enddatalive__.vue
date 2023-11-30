<template>
	<div class="__ag__enddatalive__">
		<image class="__ag__endbackimg__" :src="__ag__url__(url)" ></image>
		<div class="__ag__uptime_content__">
			<div class="__ag__endcontent__" v-if="info && info.id"  @swipe="handleSwipe">
				<div class="__ag__endsaishi__">
					<div class="__ag__endteam__">
						<!-- <image resize="contain" class="__ag__endteamimg__" v-if="info && info.teamFlaga" :src="__ag__url__(info.teamFlaga)" ></image>
						<text class="__ag__endteamimg__ __ag__uptimenoteamimg__" v-else>{{info && info.teamNamea && info.teamNamea.charAt(0)}}</text> -->
						<team-logo teamType="1" :teamFlag="info.teamFlaga" :teamName="info.teamNamea" resize="medium"></team-logo>
						<text class="__ag__endteamtext__">{{info.teamNamea}}</text>
					</div>
					<div class="__ag__endscore__">
						<div class="__ag__enddate__">
							<text class="__ag__enddatename__">{{info.matchName}}</text>
							<text class="__ag__enddatetext__">{{formatDateTime(info.beginTime)}}</text>
						</div>
						<div class="__ag__endteamscore__">
							<text class="__ag__endteamscoretext__">{{info.scorea}}</text>
							<text class="__ag__endteamscoretext__">:</text>
							<text class="__ag__endteamscoretext__">{{info.scoreb}}</text>
						</div>
					</div>
					<div class="__ag__endteam__">
						<!-- <image resize="contain" class="__ag__endteamimg__" v-if="info && info.teamFlagb" :src="__ag__url__(info.teamFlagb)" ></image>
						<text class="__ag__endteamimg__ __ag__uptimenoteamimg__" v-else>{{info && info.teamNameb && info.teamNameb.charAt(0)}}</text> -->
						<team-logo teamType="2" :teamFlag="info.teamFlagb" :teamName="info.teamNameb" resize="medium"></team-logo>
						<text class="__ag__endteamtext__">{{info.teamNameb}}</text>
					</div>
				</div>
				<div class="__ag__endteamstatus__">
					<text class="__ag__endteamstatustext__">{{a__ag__var__.status[info.status]}}</text>
				</div>
			</div>
			<div class="__ag__incomelive_content__" v-if="list && list.length">
				<text class="__ag__incomelive_text__">更多精彩直播推荐</text>
				<scroller scroll-direction="horizontal" :show-scrollbar="false" class="__ag__matchscroll__">
					<ag-income-live-item v-for="(item) in list" :key="item.id" :item="item"></ag-income-live-item>
				</scroller>
			</div>
		</div>
	</div>
</template>

<script>
	import agMinUrl from './__ag__minurl__.js'
	import util from './util.js'
	import a__ag__var__ from './vars.js'
	import incomeLiveItem from './__ag__incomeLiveItem__.vue'
	import teamLogo from './__ag__teamLogo__.vue'
	export default {
		components: {
			'ag-income-live-item':incomeLiveItem,
			'team-logo':teamLogo
		},
		mixins:[agMinUrl],
		props:{
			info:{
				type:Object,
                default:function(){
					return {}
				},
			},
			list: {
				type:Array,
				default:function(){
					return []
				}
			}
		},
		data(){
			return {
				url:"static/endstreaming.png",
				a__ag__var__,
			}
		},
		methods:{
			handleSwipe(e) {
				if (e.direction == 'right') {
					util.pop()
				}
			},
			formatDateTime(date){
				let time = util.formatTime(date)
				let matDate = util.formatDate(date)

				return `${matDate} ${time}`
			},
		}
	}
</script>

<style scoped lang="less">
	@import "../style/theme.less";
	.__ag__enddatalive__ {
		width: 750px;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.__ag__endbackimg__ {
		width: 750px;
		position: absolute;
		top: 0px;
		bottom: 0px;
	}
	.__ag__uptime_content__ {
		width: 750px;
		/* position: absolute;
		top: 0px;
		bottom: 0px; */
		padding-top: 50px;
		padding-bottom: 20px;
	}
	.__ag__endcontent__ {
		width: 750px;
		/* position: absolute;
		top: 0px;
		bottom: 0px; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__endsaishi__ {
		width: 750px;
		height: 140px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__endteamstatus__ {
		height: 36px;
		width: 554px;
		margin-left: 49px;
		margin-right: 49px;
		margin-top: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__endteam__ {
		flex: 1;
		height: 140px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__endteamimg__ {
		width: 68px;
		height: 68px;
		line-height: 68px;
		border-radius: 50wx;
		text-align: center;
		color: rgba(0, 0, 0, 0.6);
		font-size: 14wx;
	}
	.__ag__uptimenoteamimg__ {
		background-color: #EFEFEF;
	}
	.__ag__uptimeteamtext__ {
		margin-top: 12px;
		height: 28px;
		flex: 1;
		lines:1;
		text-overflow: ellipsis;
		font-style: normal;
		font-weight: normal;
		font-size: 12wx;
		color: #FFFFFF;
	}
	.__ag__endscore__ {
		width: 250px;
		height: 140px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__enddate__ {
		flex: 1;
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.__ag__enddatename__ { 
		font-style: normal;
		font-weight: normal;
		font-size: 14wx;
		color: #FFFFFF;
		margin-right: 5px;
	}
	.__ag__endteamtext__ {
		margin-top: 12px;
		height: 28px;
		width: 140px;
		lines:1;
		text-overflow: ellipsis;
		font-style: normal;
		font-weight: normal;
		font-size: 12wx;
		color: #FFFFFF;
		text-align: center;
	}
	.__ag__enddatetext__ {
		/* width: 184px; */
		font-style: normal;
		font-weight: bold;
		font-size: 14wx;
		color: #FFFFFF;
	}
	.__ag__endteamscore__ {
		margin-top: 16px;
		flex: 1;
		height: 120px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.__ag__endteamscoretext__ {
		font-style: normal;
		font-weight: 700;
		font-size: 24wx;
		color: #FFFFFF;
	}
	.__ag__endteamstatustext__ {
		font-style: normal;
		font-weight: 400;
		font-size: 14wx;
		letter-spacing: 0.05em;
		color: #8C97A5;
	}
	.__ag__incomelive_content__ {
		width: 750px;
		padding-bottom: 20px;
		padding-top: 15px;
	}
	.__ag__incomelive_text__ {
		line-height: 35px;
		font-size: 12wx;
		color: #fff;
		padding-left: 32px;
		margin-bottom: 15px;
	}
	.__ag__matchscroll__ {
		display: flex;
		flex-direction: row;
		padding-left: 32px;
		padding-right: 32px;
	}
</style>
