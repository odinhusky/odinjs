<template>
	<div v-if="teamitem && teamitem.id" class="__ag__matchitem__" @click="onMatch(teamitem)">
		<div class="__ag__matchitemtitle__">
			<text class="__ag__matchitemtext__">{{teamitem.joinMap && teamitem.joinMap.match && teamitem.joinMap.match.nameAbbr || teamitem.matchName}}</text>
			
			<div class="__ag__matchitemother__">
				<image class="__ag__anchorinfo_image__" v-if="env.id == 1 && teamitem.islive" :src="__ag__url__('static/stream.gif')" mode="aspectFit"></image>
				<image class="__ag__anchorinfo_image__ __ag__other_image__" v-if="env.id != 1 && teamitem.islive" :src="__ag__url__('static/hb-stream.gif')" mode="aspectFit"></image>
				<text  v-if="teamitem.islive" class="__ag__matchitemothertext__">直播中</text>
				<text v-if="!teamitem.islive" class="__ag__matchitemtime__">{{matchDate(teamitem.beginTime)}}</text>
			</div>
		</div>
		<div class="__ag__matchteam__">
			<!-- <image v-if="teamitem.teamFlaga" class="__ag__matchteamimg__" :src="__ag__url__(teamitem.teamFlaga)"></image>
			<div v-else class="__ag__matchteamimgdiv__">
				<text class="__ag__matchteamimgdivtext__">{{charName(teamitem.teamNamea)}}</text>
			</div> -->
			<team-logo teamType="1" :teamFlag="teamitem.teamFlaga" :teamName="teamitem.teamNamea" resize="mini" class="__ag__team__"></team-logo>
			<text class="__ag__matchteamtext__">{{teamitem.teamNamea}}</text>
			<!-- <text class="__ag__matchteamfraction__ " :class="[teamitem.scoreb < teamitem.scorea ? '__ag__matchteama__':'']">{{teamitem.scorea}}</text> -->
		</div>
		<div class="__ag__matchteam__">
			<!-- <image v-if="teamitem.teamFlagb" class="__ag__matchteamimg__" :src="__ag__url__(teamitem.teamFlagb)"></image>
			<div v-else class="__ag__matchteamimgdiv__">
				<text class="__ag__matchteamimgdivtext__">{{charName(teamitem.teamNameb)}}</text>
			</div> -->
			<team-logo teamType="2" :teamFlag="teamitem.teamFlagb" :teamName="teamitem.teamNameb" resize="mini" class="__ag__team__"></team-logo>
			<text class="__ag__matchteamtext__">{{teamitem.teamNameb}}</text>
			<!-- <text class="__ag__matchteamfraction__" :class="[teamitem.scoreb > teamitem.scorea ? '__ag__matchteama__':'']">{{teamitem.scoreb}}</text> -->
		</div>
	</div>
</template>

<script> 
	import agMinUrl from './__ag__minurl__.js'
	import vars from './vars.js'
	import util from './util.js'
	import env from './env.js'
	import teamLogo from './__ag__teamLogo__.vue'
	export default {
		components: {
			'team-logo':teamLogo
		},
		mixins:[agMinUrl],
		props:{
			teamitem:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		data(){
			return {
				url:'team/400000007.png',
				vars,
				env,
				status:vars.status,
			}
		},
		watch: {
		},
		methods:{
			onMatch(item){
				if(item && item.islive){
					let uid = item.uid
					util.getPush('__ag__live__',{uid})
					return
				}
				util.getPush('__ag__datalive__',{id:item.id})
			},
			charName(name){
				if(!name){
					return ''
				}
				return name.charAt(0)
			},
			matchDate(date){
				let day =  this.formatDate(date)
				let time =  this.formatTime(date)
				return `${day} ${time}`
			},
			formatDate(date){
				let day = util.dateFormat(new Date())
				let dayTime = new Date(day).getTime()
				
				let toDate =util.dateFormat(date)
				let toDateTime =new Date(toDate).getTime()
				
				if(dayTime == toDateTime){
					return '今天'
				}
			
				if(dayTime > toDateTime){
					if(dayTime - toDateTime > 86400000){
						return util.formatDate(date)
					}
					return '昨天'
				}
				if(dayTime < toDateTime){
					if(toDateTime - dayTime > 86400000){
						return util.formatDate(date)
					}
					return '明天'
				}
				
			},
			formatTime(date){
				 return util.formatTime(date)
			},
		}
	}
</script>

<style lang="less">
     @import '../style/theme.less';
	.__ag__matchitem__ {
		width: 300px;
		height: 200px;
		background-color: #FFFFFF;
		border-radius: 8px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
		flex-direction: column;
		padding: 16px;
		padding-right: 20px;
		padding-left: 20px;
		margin-right: 32px;
	}
	.__ag__matchitemtitle__ {
		display: flex;
		flex-direction: row;
		height: 48px;
		align-items: center;
		justify-content: space-between;
	}
	.__ag__matchitemtext__ {
		flex: 1;
		font-style: normal;
		lines:1;					
		text-overflow: ellipsis;
		font-weight: normal;
		font-size: 11wx;
		color: rgba(0, 0, 0, 0.4);
	}
	.__ag__matchitemtime__ {
		/* width: 115px; */
		font-style: normal;
		font-weight: normal;
		font-size: 11wx;
		color: rgba(0, 0, 0, 0.4);
	}
	.__ag__matchitemother__ {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__matchitemothertext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 10wx;
		letter-spacing: 0.05em;
		color: rgba(0, 0, 0, 0.4);
	}
	.__ag__matchitemotherhot__ {
		color: #FF0000;
    	font-size: 13wx;
	}
	.__ag__matchteam__ {
		flex: 1;
		height: 69px;
		margin-top: 7px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.__ag__matchteamimg__ {
		width: 36px;
		height: 36px;
		margin-right: 8px;
	}
	.__ag__team__ {
		margin-right: 8px;
	}
	.__ag__matchteamimgdiv__ {
		width: 36px;
		height: 36px;
		margin-right: 8px;
		border-radius: 4px;
		background-color: #EFEFEF;
		align-items: center;
		justify-content: center;
	}
	.__ag__matchteamimgdivtext__ {
		color: rgba(0, 0, 0, 0.6);
		font-size: 14wx;
	}
	.__ag__matchteamtext__ {
		font-style: normal;
		font-weight: normal;
		font-size: 13wx;
		color: #000000;
		flex: 1;
		lines:1;
		text-overflow: ellipsis;
		margin-right: 10px;
	}
	.__ag__matchteamfraction__ {
		flex : 0 0 60px;
		height: 36px;
		lines:1;
		font-style: normal;
		font-weight: normal;
		font-size: 15wx;
		color: #000000;
	}
	.__ag__matchteama__ {
		color: @main-color;
	}
	.__ag__anchorinfo_image__ {
		width: 24px;
		height: 24px;
		border-radius: 50wx;
		margin-right: 8px;
	}
	.__ag__other_image__ {
		background-color: @main-color;
	}
</style>
