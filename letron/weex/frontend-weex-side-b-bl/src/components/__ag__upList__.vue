<template>
	<div class="__ag__uplist__" v-if="sortedStreamerList && sortedStreamerList.length>0">
		<scroller  scroll-direction="horizontal" :show-scrollbar="false" class="__ag__uplistscroll__" >
			<div class="__ag__uplistscroll__" >
				<div v-for="(item) in sortedStreamerList" :key="'p'+item.id" class="__ag__uplistitem__" @click="__ag__clickTap__(item)">
					<ag-anchor-item :listFollowMap="a__ag__listFollowMap__" :item="item" @cancelFollow="__ag__cancelFollow__" @followTap="__ag__followTap__" :isindex="true" :showAction="false" @onClick="__ag__clickTap__(item)"></ag-anchor-item>
				</div>
			</div>
		</scroller >
	</div>
</template>

<script>
	import agAnchorItem from "./__ag__anchorItem__.vue"
	import agMinix from './__ag__minix__.js'
	import util from './util.js'
	import bc from './__ag__bc__.js'
    import __ag__sportApi__ from './__ag__sport_api__.js'
	export default {
		components:{
			'ag-anchor-item':agAnchorItem,
		},
		mixins:[agMinix],
		props: {
			isRefresh: {
				type: Boolean,
				default: false
			},
			liveList: {
				type: Array,
				default: function() {
					return []
				}
			},
			requestList: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				a__ag__listFollowMap__:{},
				a__ag__user__: {}
			}
		},
		watch: {
			isRefresh(n) {
				if (n) {
					this.__ag__loadData__()
				}
			}
		},
		computed:{
			list2(){
				
				if(!this.a__ag__pageUp__ || !this.a__ag__pageUp__.data || !this.a__ag__pageUp__.data.list){
					return []
				}
				let data = this.a__ag__pageUp__.data
				let l = data.list
				l.sort((a,b)=>{ 
					let scorea = this.score(a)
					let scoreb = this.score(b)
					return scoreb - scorea
				})
				if(l && l.length>18){
					return l.slice(0,18)
				}
				return l
			},
			list() {
				if(!this.a__ag__pageUp__ || !this.a__ag__pageUp__.data || !this.a__ag__pageUp__.data.list){
					return []
				}
				let data = this.a__ag__pageUp__.data
				let l = data.list
				return l
			},
			sortedStreamerList() {
				// 获取所有主播
				let allStreamerList = [...this.list] || [];
				// 存放所有正在直播的主播
				const allLiveStreamerList = [];
				// 存放所有预约未上播的主播
				const allRequeseStreamerList = [];
				// 存放剩下的主播
				const defaultL = [];
				// 从所有主播中筛选符合条件的主播
				allStreamerList.forEach(item => {
					let allLive = this.userLiveListMap[item.id]
					let allRequese = this.userRequestListMap[item.id]
					if (allLive) {
						allLiveStreamerList.push(item)
					} else if (allRequese) {
						allRequeseStreamerList.push(item)
					}else {
						defaultL.push(item)
					}
				});
				
				// 已订阅的主播列表
				const userSubscribedStreamerIdList = Object.keys(this.a__ag__listFollowMap__);
				// 存放已订阅的主播
				let userSubscribedStreamerList = [];
				// 从所有主播列表筛选已订阅的主播
				allStreamerList.map((ele) => {
					userSubscribedStreamerIdList.map((mm) => {
					if (ele.id.toString() === mm) {
						userSubscribedStreamerList.push(ele);
					}
					});
				});
				// 从所有主播列表筛选已推荐的主播
				const backendRecommendedStreamerList = allStreamerList.filter((ss) => ss.joinMap && ss.joinMap.hot_up && ss.joinMap.hot_up.status === 1);
				// 从所有正在直播的主播筛选已订阅的主播
				const liveSubscribedStreamerList = allLiveStreamerList.filter((m1) =>userSubscribedStreamerList.some((m2) => m1.id === m2.id));
				// 从所有正在直播的主播筛选已推荐的主播
				const liveBackendRecommendedStreamerList = allLiveStreamerList.filter((m1) =>backendRecommendedStreamerList.some((m2) => m1.id === m2.id)).filter((m3) => !liveSubscribedStreamerList.some((m4) => m3.id === m4.id));
				// 未推荐、未订阅的主播
				const otherLiveStreamerList = allLiveStreamerList.filter((m1) =>![...liveSubscribedStreamerList,...liveBackendRecommendedStreamerList,].some((m2) => m1.id === m2.id));
				// 从预约未上播的主播筛选已订阅的主播
				const notLiveSubscribedStreamerList = [ ...allRequeseStreamerList,...defaultL,].filter((m1) =>userSubscribedStreamerList.some((m2) => m1.id === m2.id));
				// 从预约未上播的主播筛选已推荐的主播
				const notLiveBackendRecommendedStreamerList = [...allRequeseStreamerList,...defaultL,].filter((m1) =>backendRecommendedStreamerList.some((m2) => m1.id === m2.id));
				// 从预约未上播的主播筛选未推荐、未订阅的主播
				const notSubAndRecommendedScheduleStreamerList = allRequeseStreamerList.filter((m1) =>![...notLiveSubscribedStreamerList,...notLiveBackendRecommendedStreamerList,].some((m2) => m1.id === m2.id));
				// 从预约未上播、未推荐、未订阅的主播筛选相同的主播
				const otherNotLiveStreamerLlist = defaultL.filter((m1) =>![...notLiveSubscribedStreamerList,...notLiveBackendRecommendedStreamerList,].some((m2) => m1.id === m2.id));

				[
					liveSubscribedStreamerList,
					liveBackendRecommendedStreamerList,
					otherLiveStreamerList,
					notLiveSubscribedStreamerList,
					notLiveBackendRecommendedStreamerList,
					notSubAndRecommendedScheduleStreamerList,
					otherNotLiveStreamerLlist,

				].forEach((list) =>
					list.sort((a, b) => {
						if ((a.follow && b.follow) || (!a.follow && !b.follow)) {
							const streamerA = this.userLiveListMap[a.id];
							const streamerB = this.userLiveListMap[b.id];
							if (streamerA && streamerB) {
								const streamerAViewer = streamerA.joinMap.room.ipAmount;
								const streamerBViewer = streamerB.joinMap.room.ipAmount;
								// if same actual viewer count then sort by the fake user followers count
								if (streamerAViewer === streamerBViewer) {
									// if both having same followers then sort by matchId
									if (a.score === b.score) {
										return a.matchId - b.matchId;
									}
									return b.score - a.score;
								}
								return streamerBViewer - streamerAViewer;
							} else {
								if (a.score === b.score) {
									return a.matchId - b.matchId;
								}
								return b.score - a.score;
							}
						}
						return a.follow ? -1 : 1;
					})
				);
				let mergedList = [
					...liveSubscribedStreamerList,
					...liveBackendRecommendedStreamerList,
					...otherLiveStreamerList,
					...notLiveSubscribedStreamerList,
					...notLiveBackendRecommendedStreamerList,
					...notSubAndRecommendedScheduleStreamerList,
					...otherNotLiveStreamerLlist,
				];

				if (mergedList && mergedList.length > 18) {
					mergedList = mergedList.slice(0, 18);
				}
				return mergedList;

			},
			userLiveListMap() {
				let liveLists = this.liveList ? this.liveList : []
				return liveLists.reduce((obj, user) => {
					obj[user.uid] = user;
					return obj;
				}, {});
			},
			userRequestListMap() {
				let requestLists = this.requestList ? this.requestList : []
				return requestLists.reduce((obj, user) => {
					obj[user.joinMap.u.id] = user;
					return obj;
				}, {});
			}
		},
		methods:{
			score(a){
				let s = 0
				//在线主播
				if(a.joinMap && a.joinMap.live && a.joinMap.live.scheduleId){
					s += 1000000000
				}
				//已订阅主播
				if(a.follow){
					s += 100000000
				}
				//订阅人数
				s+= a.score
				return s
				
			},
			async __ag__listFollow__(from){
				if(this.a__ag__user__ && this.a__ag__user__.userType<3){
					let resp = await __ag__sportApi__.listFollow(from)
					let list = resp.data
					if(list && list.length>0){
						for(let i in list){
							let r = list[i]
                            this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
						}
					}
				}else {
					this.a__ag__listFollowMap__= {}
				}
			},
			async __ag__loadData__(){
				let that = this
				that.a__ag__user__ = util.getItem('user')
				const login = new BroadcastChannel('onlogin')
				login.onmessage= async function(event){
					if(event.data){
						that.a__ag__user__ = event.data
					}
					if (event.data && event.data.userType < 3) {
						await that.__ag__pageUp__()
					}
					await that.__ag__listFollow__({status:1})
				}
				bc.onmessage('cancelFollow',this.changeCancelFollow)
				bc.onmessage('followTap',this.changeFollowTap)
				
				await this.__ag__pageUp__()
                await this.__ag__listFollow__({status:1})
			},
			changeCancelFollow(item) {
				let r = this.a__ag__listFollowMap__[item.data.streamerId]
				if (r) {
					this.$delete(this.a__ag__listFollowMap__,item.data.streamerId)
				}
			},
			changeFollowTap(item) {
				this.$set(this.a__ag__listFollowMap__,item.data.streamerId,item.data)
			},
			async __ag__cancelFollow__(item) {
                try{
                    let up = this.a__ag__listFollowMap__[item.id]
                    let id  = up.id
                    let resp = await __ag__sportApi__.editFollowCancel({id})
                    util.message(resp.message)
                    if(resp.success){
                        this.$delete(this.a__ag__listFollowMap__,item.id)
                    }
                }catch(e){
                    util.message(e.message || '无法订阅')
                }
            },
           async __ag__followTap__(item) {
			   	if (!this.a__ag__user__ || !this.a__ag__user__.userType || this.a__ag__user__.userType == 3) {
					util.getPush('__ag__login__')
					return
				}
                try{
                    let resp = await __ag__sportApi__.editFollow({streamerId: item.id})
                    if(resp.success){
						util.message(resp.message)
                        let r = resp.data
                        // this.a__ag__listFollowMap__[r.streamerId] = r
                        this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
                    }
                    // this.__ag__loadData__()
                }catch(e){
                    util.message(e.message || '无法订阅')
                }
            },
			__ag__onlive__(){
				__ag__util__.getPush('__ag__live__')
			},
			__ag__clickTap__(item) {
                let uid = item.id
                if(!uid){
					return
				}

				let islive = this.userLiveListMap[item.id]
				if (!islive) {
					let scheduleUsers = this.requestList.find((user) => user.joinMap.u.id === item.id );
					if (!!scheduleUsers) {
						let id = scheduleUsers.id
						util.getPush('__ag__datalive__',{id})
						return
					}
					util.getPush('__ag__anchorDetails__',{uid: item.id})
					return
				}
				
				let params = {
					tab: 1,
					uid: uid
				}
				util.getPush('__ag__live__',params)
            },
		}
	}
</script>

<style>
	.__ag__uplist__ {
		width: 750px;
		background-color: #F2F3F4;
	}
	.__ag__uplistscroll__ {
		display: flex;
		flex-direction: row;
	}
	.__ag__uplistitem__ {
		width: 165px;
	}
</style>
