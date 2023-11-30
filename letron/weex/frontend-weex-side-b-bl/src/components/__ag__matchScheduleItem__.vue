<template>
	<div class="__ag__match-schedule-item__"  v-if="a__ag__dateItem__ && a__ag__dateItem__.id" @click="onMatch(a__ag__dateItem__)">
		<div v-if="!a__ag__dateItem__.lives" class="__ag__item__">
			<div class="__ag__item-lf__">
				<text class="__ag__match-begin__">{{ util.formatTime(a__ag__dateItem__.beginTime) }}</text>
				<text class="__ag__match-name-text__">{{  a__ag__dateItem__ && a__ag__dateItem__.joinMap && a__ag__dateItem__.joinMap.match &&  a__ag__dateItem__.joinMap.match.nameAbbr || a__ag__dateItem__.matchName }}</text>
			</div>
			<div class="__ag__item-center__">
				<div class="__ag__match-team-a-text__">
					<!-- <image class="__ag__match-team-a-image__" v-if="a__ag__dateItem__.teamFlaga"  mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlaga)"></image>
					<text v-else class="__ag__assembly-char__">{{ a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)}}</text> -->
					<team-logo teamType="1" :teamFlag="a__ag__dateItem__.teamFlaga" :teamName="a__ag__dateItem__.teamNamea" class="__ag__team__"></team-logo>
					<text class="__ag__match-team-teamName__">{{a__ag__dateItem__.teamNamea}}</text>
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scorea}}</text>
				</div>
				<div class="__ag__match-team-a-text__ __ag__match-team-b-text__">
					<!-- <image class="__ag__match-team-a-image__" v-if="a__ag__dateItem__.teamFlagb"   mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlagb)"></image>
					<text v-else class="__ag__assembly-char__">{{a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)}}</text> -->
					
					<team-logo teamType="2" :teamFlag="a__ag__dateItem__.teamFlagb" :teamName="a__ag__dateItem__.teamNameb" class="__ag__team__"></team-logo>
					<text class="__ag__match-team-teamName__">{{a__ag__dateItem__.teamNameb}}</text>
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scoreb}}</text>
				</div>
			</div>
			<div class="__ag__item-rg__">
				<div class="__ag__match-category-status__">
				    <div v-if="a__ag__dateItem__.lives && a__ag__dateItem__.lives.length >0 "
				        style="display: flex; align-items: center; justify-content: flex-end"
				    >
				        <div class="__ag__video-online-yuan__"></div>
				        <text style="padding-left: 7px">直播中</text>
				    </div>
				    <div v-else class="__ag__status-lived__">
				        <text class="__ag__status-text__" :class="[a__ag__dateItem__.status == 0? '__ag__status-started__':'']">{{a__ag__var__.status[a__ag__dateItem__.status]}}</text>
				    </div>
				</div>
				<text v-if="isAppoint" class="agiconfont appoint-icon" @click="onMakeAppointment">&#xe705;</text>
				<div v-if="isUserMatch" class="cancel-appointe" @click="cancelAppointment"><text class="cancel-text">取消预约</text></div>
			</div>
		</div>
		<div v-else class="__ag__item-lives__">	
			<div class="__ag__item-lives-top__">
				<div class="__ag__match-name__">
					<text class="__ag__lives-name-text__">{{ a__ag__dateItem__ && a__ag__dateItem__.joinMap && a__ag__dateItem__.joinMap.match &&  a__ag__dateItem__.joinMap.match.nameAbbr || a__ag__dateItem__.matchName }}</text>
				</div>
				<div class="__ag__match-time__">
				    <text class="__ag__lives-begin__">{{ util.formatTime(a__ag__dateItem__.beginTime) }}</text>
				</div>
				<div class="__ag__match-status__">
				    <div class="__ag__video-online-yuan__"></div>
				    <text class="__ag__lives-status-text__" style="padding-left: 7px">直播中</text>
				</div>
			</div>
			<div class="__ag__item-lives-center__">
				<div class="__ag__item-lives-info__ __ag__item-lives-info-lf__">
					<text class="__ag__lives-team-teamName__">{{a__ag__dateItem__.teamNamea}}</text>
					<team-logo teamType="1" :teamFlag="a__ag__dateItem__.teamFlaga" :teamName="a__ag__dateItem__.teamNamea" class="__ag__team_lf__"></team-logo>
					<!-- <image class="__ag__lives-team-a-image__" v-if="a__ag__dateItem__.teamFlaga"  mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlaga)"></image>
					<text v-else class="__ag__assembly-char__"  >{{ a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)}}</text> -->
				</div>
				<div class="__ag__item-lives-info-center__">
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scorea}}</text>
					<text class="__ag__scorea-line__">:</text>
					<text class="__ag__score__" :class="[a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea>a__ag__dateItem__.scoreb?'__ag__black__':( a__ag__dateItem__.status!=0 && a__ag__dateItem__.scorea<a__ag__dateItem__.scoreb?'__ag__red__':'')]">{{a__ag__dateItem__.status==0?'-':a__ag__dateItem__.scoreb}}</text>
				</div>
				<div class="__ag__item-lives-info__ __ag__item-lives-info-rg__">
					<!-- <image class="__ag__lives-team-a-image__" v-if="a__ag__dateItem__.teamFlagb"   mode="aspectFit"  :src="__ag__url__(a__ag__dateItem__.teamFlagb)"></image>
					<text v-else class="__ag__assembly-char__" >{{a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)}}</text> -->
					<team-logo teamType="2" :teamFlag="a__ag__dateItem__.teamFlagb" :teamName="a__ag__dateItem__.teamNameb" class="__ag__team_rg__"></team-logo>
					<text class="__ag__lives-team-teamName__">{{a__ag__dateItem__.teamNameb}}</text>
				</div>
			</div>
			<div class="__ag__item-lives-users__" v-if="a__ag__dateItem__ && a__ag__dateItem__.lives && a__ag__dateItem__.lives.length > 0">
				<div class="__ag__schedule-user__" v-for="(li,index) in a__ag__dateItem__.lives" :key="li.id"  @click.stop="__ag__toLisve__(li)" :class="[isMultiple(index)?'__ag__schedule-multiple__':'']">
					<div class="__ag__schedule_item__">
						<div class="__ag__matchupimgdiv__ ">
							<ag-userimg class="__ag__matchupimg__" :avatar="li.avatar" :name="li.upName" ></ag-userimg>
						</div>
						<text class="__ag__matchupimgtext__">直播中</text>
					</div>
					<text class="__ag__schedule-user-text__">{{li.upName}}</text>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import util from './util.js'
	import a__ag__var__ from './vars.js'
	import agMinix from './__ag__minix__.js'
	import agMinUrl from './__ag__minurl__.js'
	import bc from './__ag__bc__.js'
	import teamLogo from './__ag__teamLogo__.vue'
	import userimg from './__ag__userImg__.vue'
	export default {
		mixins: [agMinix,agMinUrl], // 使用mixin
		props: {
			dateItem:{
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
		},
		components: {
			'team-logo':teamLogo,
			"ag-userimg":userimg,
		},
		data() {
			return {
				util,
				a__ag__var__,
				a__ag__dateItem__: {},
				columnGap: 1,
				loading: false
			};
		},
		watch:{
			dateItem(i){
				this.a__ag__dateItem__ = i
			}
		},
		computed: {
			isAppoint(){
				
				if(this.a__ag__dateItem__ && this.a__ag__dateItem__.lives && this.a__ag__dateItem__.lives.length >0 ){
					return false
				}
				let r = this.userMatchMap[this.a__ag__dateItem__.id]
				if(this.a__ag__dateItem__.status == 0  && !r) {
					return true
				}
				return false
			},

			isUserMatch(){
				if(this.a__ag__dateItem__ && this.a__ag__dateItem__.lives && this.a__ag__dateItem__.lives.length >0 ){
					return false
				}
				if(!this.userMatchMap){
					return false
				}
				let r = this.userMatchMap[this.a__ag__dateItem__.id]
				if(r && this.a__ag__dateItem__.status == 0 ){
					return true
				}
				return false
			},
		},
		mounted() {
			this.a__ag__dateItem__ = this.dateItem
		},
		methods:{
			onMatch(item){
				if(item.lives && item.lives.length){
					// uni.navigateTo({
					//     url: "/pages/live/live?from=index&uid=" + item.lives[0].uid,
					// });
					let uid = item.lives[0].uid
					util.getPush('__ag__live__',{uid})
					return
				}
				util.getPush('__ag__datalive__',{id:item.id})
			},
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
				let id = this.a__ag__dateItem__.id
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
				
				let r = this.userMatchMap[this.a__ag__dateItem__.id]
				let id = r.id
				try {
					let resp = await this.__ag__removeUserMatch__({id:id})
					this.loading = false
					if (resp.success) {
						this.loading = false
						this.$delete(this.userMatchMap,this.a__ag__dateItem__.id)
						bc.postMessage('cancelAppoint',{scheduleId: this.a__ag__dateItem__.id})
						bc.postMessage('changeAppoint')
						let userMatchMap = util.getItem('userMatchMap')
						if (userMatchMap) {
							let match = userMatchMap[this.a__ag__dateItem__.id]
							if (match) {
								this.$delete(userMatchMap,this.a__ag__dateItem__.id)
							}
							util.setItem('userMatchMap',userMatchMap)
						} else {
							util.getStorageItem('userMatchMap').then(res=> {
								userMatchMap = res
								let match = userMatchMap[this.a__ag__dateItem__.id]
								if (match) {
									this.$delete(userMatchMap,this.a__ag__dateItem__.id)
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

<style scoped lang="less">
	@import '../style/theme.less';
	.__ag__match-schedule-item__ {
		width: 750px;
		background-color: #fff;
		padding-top: 12wx;
		padding-bottom: 12wx;
		margin-bottom: 10wx;
	}
	.__ag__item__ {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		padding-left: 16wx;
		padding-right: 16wx;
	}
	.__ag__item-lf__ {
		flex: .4;
		margin-right: 20wx;
	}
	.__ag__match-begin__ {
		height: 30wx;
		line-height: 30wx;
		font-size: 14wx;
		color: rgba(0, 0, 0, 0.5);
	}
	.__ag__match-name-text__ {
		height: 20wx;
		line-height: 20wx;
		font-size: 13wx;
		color: #000;
	}
	.__ag__item-center__ {
		flex: 1;
	}
	.__ag__match-team-a-text__ {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 10wx;
	}
	.__ag__match-team-b-text__ {
		margin-bottom: 0px;
	}
	.__ag__match-team-a-image__ {
		width: 22wx;
		height: 22wx;
		border-radius: 50%;
		margin-right: 10wx;
	}
	.__ag__team__ {
		margin-right: 10wx;
	}
	.__ag__team_lf__ {
		margin-left: 10px;
	}
	.__ag__team_rg__ {
		margin-right: 10px;
	}
	.__ag__assembly-char__ {
		width: 22wx;
		height: 22wx;
		line-height: 22wx;
		margin-right: 10wx;
		border-radius: 4wx;
		text-align: center;
		color: rgba(0, 0, 0, 0.6);
		background-color: #EFEFEF;
		font-size: 12wx;
	}
	.__ag__match-team-teamName__ {
		flex: 1;
		font-size: 14wx;
		color: #000000;
		text-overflow: ellipsis;
		lines:1;
	}
	.__ag__item-rg__ {
		flex: .4;
		margin-left: 30wx;
		display: flex;
		align-items: flex-end;
	}
	.__ag__match-category-status__ {
		height: 25wx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.__ag__status-lived__ {
		flex: 1;
	}
	.__ag__status-text__ {
		font-size: 10wx;	
		color: #2B2B2B;
		height: 25wx;
		line-height: 25wx;
	}
	.appoint-icon {
		font-size: 25wx;
		color: rgba(0, 0, 0, 0.9);
		margin-top: 3wx;
	}
	.cancel-text {
		font-size: 12wx;
		text-align: center;
		color:rgba(0,0,0,0.4);
		line-height: 25wx;
	}
	.cancel-appointe {
		width: 66wx;
		height: 25wx;
		border-width:1wx ;
		border-radius: 3wx;
		border-color: rgba(0,0,0,0.4);
		margin-top: 3wx;
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
		color: @main-color;
	}
	.__ag__item-lives__ {
		padding-left: 12wx;
		padding-right: 12wx;
	}
	.__ag__item-lives-top__ {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
	}
	.__ag__item-lives-info-rg__ {
		justify-content: flex-start;
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
		margin-left: 2wx;
		margin-right: 2wx;
	}
	.__ag__item-lives-users__ {
		display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
		margin-top: 10wx;
	}
	.__ag__schedule-user__ {
		width: 110px;
		display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
		margin-bottom: 10wx;
		margin-right: 10wx;
	}
	.__ag__schedule-multiple__ {
		margin-right: 0px;
	}
	.__ag__schedule_item__ {
		width: 110px;
		position: relative;
		justify-content: center;
        align-items: center;
		text-align: center;
	}
	.__ag__matchupimgdiv__ {
        width: 96px;
        height: 96px;
		justify-content: center;
        align-items: center;
		border-style:solid;
        border-width: 2wx;
        border-color: @main-color;
        border-radius: 50wx;
    }
	.__ag__matchupimg__ {
        width: 80px;
        height: 80px;
    }
	.__ag__matchupimgtext__ {
        position: absolute;
        bottom: -4px;
        padding: 4px;
        border-radius: 20px;
        padding-left: 8px;
        padding-right: 8px;
        font-style: normal;
        font-weight: 500;
        font-size: 6wx;
        color: #FFFFFF;
        background-color: @main-color;
    }
	.__ag__schedule-user-text__ {
		flex: 1;
		font-size: 10wx;
		font-weight: 400;
		text-align: center;
		color: #000;
		text-overflow: ellipsis;
		lines:1;
		margin-top: 10px;
	}
	
</style>
