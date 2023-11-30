<template>
	<div class="__ag__livematch__" v-if="roomData && roomData.id">
		<div class="__ag__livematchtitle__">
			<div class="__ag__match-status__"></div>
			<div class="__ag__match-time__">
				<text class="__ag__livematchdate__">{{a__ag__util__.formatTime(roomData.beginTime)}}</text>
				<text class="__ag__livematchtext__">{{roomData.matchName}}</text>
			</div>
			<div class="__ag__match-status__">
				<div class="__ag__video-online-yuan__"></div>
				<text class="__ag__status-text__">直播中</text>
			</div>
		</div>
		<div class="__ag__livematchschedule__">
			<div class="__ag__livescheduleteam__">
				<image :src="__ag__url__(roomData.teamFlaga)" mode="aspectFill" class="__ag__livescheduleteamimg__"></image>
				<text class="__ag__livescheduleteamtext__">{{roomData.teamNamea}}</text>
			</div>
			<div class="__ag__liveschedulevs__">
				<text class="__ag__liveschedulevstexts__"> {{roomData.scorea}}</text>
				<text class="__ag__liveschedulevsline__">:</text>
				<text class="__ag__liveschedulevstext__">{{roomData.scoreb}}</text>
			</div>
			<div class="__ag__livescheduleteam__">
				<image :src="__ag__url__(roomData.teamFlagb)" mode="aspectFill" class="__ag__livescheduleteamimg__"></image>
				<text class="__ag__livescheduleteamtext__">{{roomData.teamNameb}}</text>
			</div>
		</div>
	</div>
</template>

<script>
	import agMinUrl from './__ag__minurl__.js'
	import a__ag__util__ from './util.js'
	export default {
		name:"ag-livematch",
		mixins: [agMinUrl],
		props:{
			roomData:{
				type: Object,
				default:function(){
					return {}
				}
			},

		},
		data() {
			return {
				date:new Date(),
				a__ag__util__,
			};
		},
		methods:{
		},
	}
</script>

<style lang="less">
	.__ag__livematch__ {
		padding-top: 10px;
	}
	.__ag__livematchtitle__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40px;
		padding-right: 20px;
	}
	.__ag__match-status__ {
		flex: .6;
		height: 30wx;
		line-height: 30wx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}
	.__ag__video-online-yuan__ {
		width: 10wx;
		height: 10wx;
		border-radius: 50%;
		background-color: #FD7648;
	}
	.__ag__status-text__ {
		font-size: 10wx;
		letter-spacing: 0.05em;
		color: #000000;
		margin-left: 5px;
	}
	.__ag__match-time__ {
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__livematchdate__ {
		font-size: 24px;
		letter-spacing: 2px;
		color:#474B55;
	}
	.__ag__livematchtext__ {
		font-size: 24px;
		text-align: right;
		letter-spacing: 2px;
		color: #474B55;
		margin-left: 10px;
	}
	.__ag__livematchschedule__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
	}
	.__ag__livescheduleteam__ {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__livescheduleteamimg__ {
		width: 76px;
		height: 76px;
		border-radius: 50%;
	}
	.__ag__livescheduleteamtext__ {
		margin-top: 28px;
		font-size: 26px;
		line-height: 36px;
		color: #474B55;
	}
	.__ag__liveschedulevs__ {
		width: 253.5px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.__ag__liveschedulevstext__ {
		font-weight: bold;
		font-size: 48px;
		line-height: 58px;
		color: #F5982A;
		display: flex;
	}
	.__ag__liveschedulevstexts__ {
		font-weight: bold;
		font-size: 48px;
		line-height: 58px;
		color: #F5982A;
		display: flex;
	}
	.__ag__liveschedulevsline__ {
		font-weight: bold;
		font-size: 48px;
		line-height: 58px;
		color: #F5982A;
	}
	.__ag__islive__ { 
		margin-top: 32px;
		width: 750px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__livediv__ {
		width: 364px;
		height: 68px;
		background-color: #F3E7F8;
		border-radius: 28px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.__ag__livetext__ {
		font-style: normal;
		font-weight: 500;
		font-size: 13wx;
		color: #F5982A;
	}
</style>
