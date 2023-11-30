<template>
	<div v-if="teamitem && teamitem.id" class="__ag__matchitem__" @click="onMatch(teamitem)" :class="[!teamitem.islive?'__ag__matchitem_notlive__':'']">
		<div class="__ag__matchitemtitle__" :class="[!teamitem.islive?'__ag__matchitemtitle_notlive__':'']">
			<text class="__ag__matchitemtext__">{{teamitem.joinMap && teamitem.joinMap.match && teamitem.joinMap.match.nameAbbr || teamitem.matchName}}</text>
			<div class="__ag__matchitemother__">
				<image class="__ag__anchorinfo_image__" v-if="teamitem.islive" :src="__ag__url__(`static/${env.brand}-stream.gif`)"></image>
				<text  v-if="teamitem.islive" class="__ag__matchitemothertext__">直播中</text>
				<text v-if="!teamitem.islive" class="__ag__matchitemtime__">{{matchDate(teamitem.beginTime)}}</text>
			</div>
		</div>
		<div class="__ag__match_content__">
			<image class="__ag__matchitemtitle_bg__" v-if="teamitem.islive && switchWorldcup" :src="__ag__url__('static/shijiebei/bs-liveb.png')"></image>
			<image class="__ag__matchitemtitle_bg__" v-if="!teamitem.islive && switchWorldcup" :src="__ag__url__('static/shijiebei/bs-notb.png')"></image>
			<div class="__ag__match_lf__">
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
			<div class="__ag__match_rg__" v-if="!teamitem.islive">
				<image class="__ag__appoint_image__" v-if="isAppoint" :src="__ag__url__('static/yy2.png')" @click.stop="onMakeAppointment"></image>
				<image class="__ag__appoint_image__" v-if="isUserMatch" :src="__ag__url__(`static/${env.brand}-yy1.png`)" @click.stop="cancelAppointment"></image>
			</div>
			<div class="__ag__match_rg__" v-if="teamitem.islive && isUserMatch">
				<image class="__ag__appoint_image__" :src="__ag__url__(`static/${env.brand}-yy1.png`)" @click.stop="cancelAppointment"></image>
			</div>
		</div>
	</div>
</template>

<script> 
	import agMinUrl from './__ag__minurl__.js'
	import agMinix from './__ag__minix__.js'
	import vars from './vars.js'
	import util from './util.js'
	import env from './env.js'
	import teamLogo from './__ag__teamLogo__.vue'
	import bc from './__ag__bc__.js'
	export default {
		components: {
			'team-logo':teamLogo
		},
		mixins:[agMinUrl,agMinix],
		props:{
			teamitem:{
				type:Object,
				default:function(){
					return {}
				}
			},
			userMatchMap:{
				type:Object,
				default:function(){
					return {}
				}
			},
			user:{
				type:Object,
				default:function(){
					return {}
				}
			},
			switchWorldcup: {
				type:Boolean,
				default:false,
			}
		},
		data(){
			return {
				url:'team/400000007.png',
				vars,
				env,
				status:vars.status,
				loading: false
			}
		},
		watch: {

		},
		computed: {
			isAppoint(){
				let r = this.userMatchMap[this.teamitem.scheduleId]
				if(this.teamitem.status == 0  && !r) {
					return true
				}
				return false
			},

			isUserMatch(){
				if(!this.userMatchMap){
					return false
				}
				let r = this.userMatchMap[this.teamitem.scheduleId]
				if(r && this.teamitem.status == 0 ){
					return true
				}
				return false
			},
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
			async onMakeAppointment(){
				if (!this.user || !this.user.userType || this.user.userType == 3) {
					util.getPush('__ag__login__')
					return
				}
				if (this.loading ) {
					return
				}
				this.loading = true
				let id = this.teamitem.scheduleId
				try {
					let resp = await this.__ag__editUserMatch__({scheId:id})
					this.loading = false
					if (resp.success) {
						this.loading = false
						this.$set(this.userMatchMap,resp.data.scheduleId,{scheduleId:resp.data.scheduleId,id:resp.data.id})
						bc.postMessage('makeAppoint',resp.data)
						let userMatchMap = util.getItem('userMatchMap')
						if (userMatchMap) {
							userMatchMap[resp.data.scheduleId] = {scheduleId:resp.data.scheduleId,id: resp.data.id}
							util.setItem('userMatchMap',userMatchMap)
						} else {
							util.getStorageItem('userMatchMap').then(res => {
								userMatchMap = res
								if (userMatchMap) {
									userMatchMap[resp.data.scheduleId] = {scheduleId:resp.data.scheduleId,id: resp.data.id}
									util.setStorageItem('userMatchMap',userMatchMap)
								}
							})
						}
						
						util.message("预约成功")
						
					}
				} catch (err) {
					this.loading = false
					util.message(err.message)
				}
			
			},
			async cancelAppointment() {
				if(this.loading){
					return
				}
				this.loading=true
				
				let r = this.userMatchMap[this.teamitem.scheduleId]
				let id = r.id
				try {
					let resp = await this.__ag__removeUserMatch__({id:id})
					this.loading = false
					if (resp.success) {
						this.loading = false
						this.$delete(this.userMatchMap,this.teamitem.scheduleId)
						bc.postMessage('cancelAppoint',{scheduleId: this.teamitem.scheduleId})
						let userMatchMap = util.getItem('userMatchMap')
						if (userMatchMap) {
							let match = userMatchMap[this.teamitem.scheduleId]
							if (match) {
								this.$delete(userMatchMap,this.teamitem.scheduleId)
							}
							util.setItem('userMatchMap',userMatchMap)
						} else {
							util.getStorageItem('userMatchMap').then(res=> {
								userMatchMap = res
								let match = userMatchMap[this.teamitem.scheduleId]
								if (match) {
									this.$delete(userMatchMap,this.teamitem.scheduleId)
								}
								util.setStorageItem('userMatchMap',userMatchMap)
							})
						}
						util.message("已取消预约")
					}
				} catch (err) {
					this.loading = false
					util.message(err.message)
				}
			}
		}
	}
</script>

<style lang="less">
     @import '../style/theme.less';
	.__ag__matchitem__ {
		width: 310px;
		height: 200px;
		background-color: #FFFFFF;
		border-radius: 8px;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
		flex-direction: column;
		// padding: 16px;
		// padding-right: 20px;
		// padding-left: 20px;
		margin-right: 20px;
		border-style: solid;
		border-width: 2px;
		border-color: @main-color;
		position: relative;
		overflow: hidden;
	}
	.__ag__matchitem_notlive__ {
		border-color: #c5c5c5;
	}
	.__ag__matchitemtitle_bg__ {
		width: 310px;
		height: 150px;
		position: absolute;
		top: 10px;
		left: 0;
		right: 0;
	}
	.__ag__matchitemtitle__ {
		display: flex;
		flex-direction: row;
		height: 48px;
		align-items: center;
		justify-content: space-between;
		background-color: @main-color;
		padding-left: 12px;
		padding-right: 12px;
	}
	.__ag__matchitemtitle_notlive__ {
		background-color: #c5c5c5;
	}
	.__ag__matchitemtext__ {
		flex: 1;
		font-style: normal;
		lines:1;					
		text-overflow: ellipsis;
		font-weight: normal;
		font-size: 11wx;
		color: #fff;
	}
	.__ag__matchitemtime__ {
		/* width: 115px; */
		font-style: normal;
		font-weight: normal;
		font-size: 11wx;
		color: #fff;
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
		color: #fff;
	}
	.__ag__matchitemotherhot__ {
		color: #FF0000;
    	font-size: 13wx;
	}
	.__ag__match_content__ {
		flex: 1;
		flex-direction: row;
	}
	.__ag__match_lf__ {
		flex: 1;
	}
	.__ag__matchteam__ {
		flex: 1;
		height: 69px;
		margin-top: 7px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-left: 12px;
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
		background-color: @main-color;
	}
	.__ag__other_image__ {
		background-color: @main-color;
	}
	.__ag__match_rg__ {
		width: 70px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.__ag__appoint_image__ {
		width: 26px;
		height: 30px;
		margin-top: 3wx;
	}
</style>
