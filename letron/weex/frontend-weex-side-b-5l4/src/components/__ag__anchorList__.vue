<template>
    <waterfall class="__ag__anchorlist-main__" :show-scrollbar="false" column-count="2" column-width="auto" column-gap="32">
        <refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
            <loading-indicator  class="__ag__loading__"></loading-indicator>
            <text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
        </refresh>
        <cell v-for="(item) in sortedStreamerList" :key="item.id" @click="__ag__clickTap__(item)">
            <anchor-item class="__ag__anchor__" :listFollowMap="a__ag__listFollowMap__" :item="item" @cancelFollow="__ag__cancelFollow__" @followTap="__ag__followTap__" @onClick="__ag__clickTap__(item)"></anchor-item>
        </cell>
		
    </waterfall >
</template>
<script>
    import anchorItem from './__ag__anchorItem__.vue'
    import agMinix from './__ag__minix__.js'
    import util from './util.js'
    import bc from './__ag__bc__.js'
    import __ag__sportApi__ from './__ag__sport_api__.js'
    export default {
        mixins:[agMinix],
        components: {
            'anchor-item':anchorItem,
        },
         props: {
            isindex: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                a__ag__freshText__: '释放更新',
				a__ag__refreshing__:false,
                a__ag__user__:{},
                a__ag__listFollowMap__:{},
                pageUplist:[],
                listUsersLive: [],
                userRequestList: [],
            }
        },
        computed: {
            p__ag__anchorList() {
                if(!this.pageUplist || !this.pageUplist.length){
					return []
				}
				let l = this.pageUplist
                l.sort((a,b)=>{ 
					let scorea = this.score(a)
					let scoreb = this.score(b)
					return scoreb - scorea
				})
				return l
            },
            list() {
				if(!this.pageUplist || !this.pageUplist.length){
					return []
				}
				let l = this.pageUplist
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
				return mergedList;

			},
			userLiveListMap() {
				let liveLists = this.listUsersLive ? this.listUsersLive : []
				return liveLists.reduce((obj, user) => {
					obj[user.uid] = user;
					return obj;
				}, {});
			},
			userRequestListMap() {
				let requestLists = this.userRequestList ? this.userRequestList : []
				return requestLists.reduce((obj, user) => {
					obj[user.joinMap.u.id] = user;
					return obj;
				}, {});
			}
        },
        methods: {
            score(a){
				let s = 0
				//已订阅主播
                let f = this.a__ag__listFollowMap__[a.id]
				if(f){
					s += 1000000000
				}
				//在线主播
				if(a.joinMap && a.joinMap.live && a.joinMap.live.scheduleId){
					s += 100000000
				}
				//订阅人数
				s+= a.score
				return s
				
			},
            async onrefresh(){
                util.setItem('listUsersLive',[])
                util.setItem('listUsersRequest',[])
                this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
				await this.__ag__loadData__()
				this.a__ag__refreshing__ = false
			},
            async __ag__listFollow__(from){
				if(this.a__ag__user__ && this.a__ag__user__.userType<3){
                    try {
                        let resp = await __ag__sportApi__.listFollow(from)
                        let list = resp.data
                        if(list && list.length>0){
                            for(let i in list){
                                let r = list[i]
                                // this.a__ag__listFollowMap__[r.streamerId] = r
                                this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
                            }
                        }
                    } catch (err) {
                        util.message(err.message)
                    }
				}
			},
			onpullingdown(){
				this.a__ag__freshText__ = '释放更新'
			},
            async __ag__loadData__(){
                let that = this
				that.a__ag__user__ = util.getItem('user')
                bc.onmessage('cancelFollow',this.changeCancelFollow)
				bc.onmessage('followTap',this.changeFollowTap)
                await this.__ag__getHotMatchList__()
                try {
                    let resp = await this.__ag__pageUp__()
                    if(resp.data && resp.data.list && resp.data.list.length>0){
						this.pageUplist = resp.data.list
						this.$emit('refresh')
                    }
                } catch (err) {
                    util.message(err.message)
                }
                try {
                    await that.__ag__listFollow__({status:1})
                } catch (err) {
                    util.message(err.message)
                }
               
			},
            async __ag__getHotMatchList__() {
                let listUsersLive = util.getItem('listUsersLive')
                let listUsersRequest = util.getItem('listUsersRequest')
                if (listUsersLive && listUsersLive.length) {
                    this.listUsersLive = listUsersLive
                } else {
                    try {
                        let liveResp = await this.__ag__listUsersLive__()
                        if(liveResp && liveResp.data && liveResp.data.length>0){
                            this.listUsersLive = liveResp.data
                        }
                    } catch (error) {
                        
                    }
                }
                if (listUsersRequest && listUsersRequest.length) {
                    this.userRequestList = listUsersRequest
                } else {
                    try {
                        let requestResp = await this.__ag__listRequestSchedule__()
                        if(requestResp && requestResp.data && requestResp.data.length>0){
                            this.userRequestList = requestResp.data
                            util.setItem('listUsersRequest',this.userRequestList)
					    }
                    } catch (error) {
                        
                    }
                }
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
                        let f = {
                            streamerId: item.id
                        }
                        bc.postMessage('cancelFollow',f)
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
                    util.message(resp.message)
                    if(resp.success){
                        let r = resp.data
                        bc.postMessage('followTap',r)
                        this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
                    }
                }catch(e){
                    util.message(e.message || '无法订阅')
                }
            },
            __ag__clickTap__(item) {
                let uid = item.id
                if(!uid){
					return
				}

				let islive = this.userLiveListMap[item.id]
				if (!islive) {
					let scheduleUsers = this.userRequestList.find((user) => user.joinMap.u.id === item.id );
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
<style scoped>
    .__ag__anchorlist-main__ {
        width: 750px;
        background-color: #F2F3F4;
        padding: 20px;
        /* padding-top: 100px; */
        /* position: fixed;
		top: 100px;
		bottom: 0px;
		z-index: 9;
        padding-bottom: 30px; */
    }
	
    .__ag__refresh__ {
        width: 750px;
		padding: 60px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
    .__ag__refreshtext__ {
		/* padding-bottom: 40px; */
	}
	.__ag__loading__ {
		color: #000000;
		margin-right: 25px;
	}
    .__ag__anchor__ {
        height: 330px;
    }
</style>