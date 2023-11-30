<template>
	<div class="__ag__match-schedule-item__"  v-if="a__ag__dateItem__ && a__ag__dateItem__.id">
		<div v-if="!a__ag__dateItem__.lives" class="__ag__item__">
			<div class="__ag__item-top__">
				<text class="__ag__match-name-text__">{{  a__ag__dateItem__ && a__ag__dateItem__.joinMap && a__ag__dateItem__.joinMap.match &&  a__ag__dateItem__.joinMap.match.nameAbbr || a__ag__dateItem__.matchName }}</text>
				<text class="__ag__match-begin__">{{ a__ag__util__.formatTime(a__ag__dateItem__.beginTime) }}</text>
				<text class="__ag__status-text__" :class="[a__ag__dateItem__.status == 0? '__ag__status-started__':'']">{{a__ag__var__.status[a__ag__dateItem__.status]}}</text>
			</div>
			<div class="__ag__item-center__">
				<div class="__ag__match-team-a-text__ __ag__match-team-lf__">
					<text class="__ag__match-team-teamName__">{{a__ag__dateItem__.teamNamea}}</text>
					<image class="__ag__match-team-a-image__" v-if="a__ag__dateItem__.teamFlaga"  mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlaga)"></image>
					<text v-else class="__ag__assembly-char__">{{ a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)}}</text>
				</div>
				<div class="__ag__item_score__">
					<div class="__score_box__" v-if="a__ag__dateItem__.status != 0">
						<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scorea}}</text>
						<text class="__ag__scorea-line__">:</text>
						<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scoreb}}</text>
					</div>
					<text class="__score_tips__" v-else>VS</text>
				</div>
				<div class="__ag__match-team-a-text__ __ag__match-team-rg__">
					<image class="__ag__match-team-a-image__" v-if="a__ag__dateItem__.teamFlagb"   mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlagb)"></image>
					<text v-else class="__ag__assembly-char__">{{a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)}}</text>
					<text class="__ag__match-team-teamName__">{{a__ag__dateItem__.teamNameb}}</text>
				</div>
			</div>
		</div>
		<div v-else class="__ag__item-lives__">	
			<div class="__ag__item-lives-top__">
				<div class="__ag__match-name__">
					<text class="__ag__lives-name-text__">{{ a__ag__dateItem__ && a__ag__dateItem__.joinMap && a__ag__dateItem__.joinMap.match &&  a__ag__dateItem__.joinMap.match.nameAbbr || a__ag__dateItem__.matchName }}</text>
				</div>
				<div class="__ag__match-time__">
				    <text class="__ag__lives-begin__">{{ a__ag__util__.formatTime(a__ag__dateItem__.beginTime) }}</text>
				</div>
				<div class="__ag__match-status__">
				    <div class="__ag__video-online-yuan__"></div>
				    <text class="__ag__lives-status-text__" style="padding-left: 7px">直播中</text>
				</div>
			</div>
			<div class="__ag__item-lives-center__">
				<div class="__ag__item-lives-info__ __ag__item-lives-info-lf__">
					<text class="__ag__lives-team-teamName__" style="margin-right:5wx">{{a__ag__dateItem__.teamNamea}}</text>
					<image class="__ag__lives-team-a-image__" v-if="a__ag__dateItem__.teamFlaga"  mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlaga)"></image>
					<text v-else class="__ag__assembly-char__"  >{{ a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)}}</text>
				</div>
				<div class="__ag__item-lives-info-center__">
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scorea}}</text>
					<text class="__ag__scorea-line__">:</text>
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scoreb}}</text>
				</div>
				<div class="__ag__item-lives-info__ __ag__item-lives-info-rg__">
					<image class="__ag__lives-team-a-image__" v-if="a__ag__dateItem__.teamFlagb"   mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlagb)"></image>
					<text v-else class="__ag__assembly-char__" >{{a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)}}</text>
					<text class="__ag__lives-team-teamName__" style="margin-left:5wx">{{a__ag__dateItem__.teamNameb}}</text>
				</div>
			</div>
			<div class="__ag__item-lives-users__">
				<div class="__ag__schedule-user__" v-for="(li,index) in a__ag__dateItem__.lives" :key="li.id"  @click.stop="__ag__toLisve__(li)" :class="[isMultiple(index)?'__ag__schedule-multiple__':'']">
					<image  mode="aspectFill" v-if="li.avatar" class="__ag__avatar__" :src="__ag__url__(li.avatar)"></image>
					<div v-else class="__ag__avatar__">
						<text class="__ag__friend-ava__">{{li && li.joinMap && li.joinMap.user && li.joinMap.user.userNicename && li.joinMap.user.userNicename && li.joinMap.user.userNicename.charAt(0)}}</text>
					</div>
					<text class="__ag__schedule-user-text__">{{li.upName}}</text>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import a__ag__util__ from './util.js'
	import a__ag__var__ from './vars.js'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	export default {
		mixins: [agMinix,agMinUrl], // 使用mixin
		props: {
			dateItem:{
				type:Object,
				default:function(){
					return {}
				}
			}
		},
		data() {
			return {
				a__ag__util__,
				a__ag__var__,
				a__ag__dateItem__: {},
				columnGap: 1,
			};
		},
		watch:{
			dateItem(i){
				this.a__ag__dateItem__ = i
			}
		},
		mounted() {
			this.a__ag__dateItem__ = this.dateItem
		},
		methods:{
			isMultiple(i) {
				let index = i + 1
				if(index%3 === 0){
					return true
				} else {
					return false
				}
			},
			__ag__toLisve__(li) {
				if(!li.uid){
					return
				}
				if(typeof li.uid == 'string'){
					li.uid = li.uid.split(',')[0]
				}
				this.__ag__itemtap__(li.uid,false)
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../style/default.less';
	.__ag__match-schedule-item__ {
		width: 750px;
		background-color: #fff;
		padding-top: 12wx;
		padding-bottom: 12wx;
		margin-bottom: 10wx;
	}
	.__ag__item__ {
		flex: 1;
		padding-left: 12wx;
		padding-right: 12wx;
	}
	.__ag__item-top__ {
		height: 30wx;
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10wx;
	}
	.__ag__match-begin__ {
		font-size: 14wx;
		color: #000;
	}
	.__ag__match-name-text__ {
		font-size: 13wx;
		letter-spacing: 0.05em;
		color: rgba(0, 0, 0, 0.5);
	}
	.__ag__item-center__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5wx;
	}
	.__ag__match-team-a-text__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__match-team-lf__ {
		justify-content: flex-end;
	}
	.__ag__match-team-rg__ {
		justify-content: flex-start;
	}
	.__ag__match-team-a-image__ {
		width: 30wx;
		height: 30wx;
		border-radius: 50%;
		margin-right: 5wx;
		margin-left: 5wx;
	}
	.__ag__assembly-char__ {
		width: 30wx;
		height: 30wx;
		line-height: 30wx;
		margin-right: 10wx;
		margin-left: 5wx;
		border-radius: 4wx;
		text-align: center;
		color: rgba(0, 0, 0, 0.6);
		background-color: #EFEFEF;
		font-size: 12wx;
	}
	.__ag__match-team-teamName__ {
		max-width: 100wx;
		font-size: 14wx;
		letter-spacing: 0.05em;
		color: #000000;
		text-overflow: ellipsis;
		lines:1;
	}
	.__ag__item_score__ {
		min-width: 75wx;
		display: flex;
		flex-direction: row;
		margin-left: 10wx;
		margin-right: 10wx;
		align-items: center;
		justify-content: center;
	}
	.__score_box__ {
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}
	.__score_tips__ {
		flex: 1;
		text-align: center;
		font-size: 28px;
		font-style: normal;
		font-weight: 400;
	}
	.__ag__status-text__ {
		font-size: 10wx;	
		color: #2B2B2B;
	}
	.__ag__status-started__ {
		color: rgba(0, 0, 0, 0.4);
	}
	.__ag__score__ {
		color: rgba(0, 0, 0, 0.4);
		font-weight: 500;
		font-size: 18wx;
	}
	.__ag__black__ {
		color: #000000;
	}
	.__ag__red__ {
		color: @scoreColor;
	}
	.__ag__item-lives__ {
		padding-left: 12wx;
		padding-right: 12wx;
	}
	.__ag__item-lives-top__ {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 10wx;
	}
	.__ag__match-name__,.__ag__match-time__ {
		flex: 1;
		height: 30wx;
		line-height: 30wx;
	}
	.__ag__match-status__ {
		flex: 1;
		height: 30wx;
		line-height: 30wx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}
	.__ag__lives-name-text__ {
		font-size: 13wx;
		letter-spacing: 0.05em;
		color: rgba(0, 0, 0, 0.5);
		height: 30wx;
		line-height: 30wx;
	}
	.__ag__lives-begin__ {
		text-align: center;
		font-size: 14wx;
		letter-spacing: 0.05em;
		color: #000000;
		height: 30wx;
		line-height: 30wx;
	}
	.__ag__video-online-yuan__ {
		width: 10wx;
		height: 10wx;
		border-radius: 50%;
		background-color: #FF4F3D;
	}
	.__ag__lives-status-text__ {
		font-size: 10wx;
		letter-spacing: 0.05em;
		color: #000000;
	}
	.__ag__item-lives-center__ {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.__ag__item-lives-info__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__item-lives-info-lf__ {
		justify-content: flex-end;
		padding-right: 15wx;
	}
	.__ag__item-lives-info-rg__ {
		justify-content: flex-start;
		padding-left: 15wx;
	}
	.__ag__item-lives-info-center__ {
		min-width: 73wx;
		display: flex;
		flex-direction: row;
		margin-left: 10wx;
		margin-right: 10wx;
		align-items: center;
		justify-content: center;
	}
	.__ag__lives-team-teamName__ {
		max-width: 100wx;
		font-size: 14wx;
		letter-spacing: 0.05em;
		color: #000000;
		text-overflow: ellipsis;
		lines:1;
	}
	.__ag__lives-team-a-image__ {
		width: 30wx;
		height: 30wx;
		border-radius: 50%;
	}
	.__ag__scorea-line__ {
		width: 10wx;
		margin-left: 2wx;
		margin-right: 2wx;
		text-align: center;
	}
	.__ag__item-lives-users__ {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 25wx;
		justify-content: center;
	}
	.__ag__schedule-user__ {
		width: 60wx;
		margin-bottom: 10wx;
		text-align: center;
		align-items: center;
	}
	.__ag__schedule-multiple__ {
		margin-right: 0px;
	}
	.__ag__avatar__ {
		width: 45wx;
		height: 45wx;
		border-radius: 50%;
		background-color: #F2F3F4;
	}
	.__ag__friend-ava__ {
		line-height: 45wx;
		text-align: center;
		color: rgba(0, 0, 0, 0.3);
		font-size: 13wx;
	}
	.__ag__schedule-user-text__ {
		flex: 1;
		line-height: 20wx;
		max-width: 75wx;
		text-align: center;
		text-overflow: ellipsis;
		lines:1;
		font-style: normal;
		font-weight: 400;
		font-size: 20px;
		color: #000000;
	}
	
</style>
