<template>
    <waterfall class="__ag__anchorlist-main__" :show-scrollbar="false" column-count="2" column-width="auto" column-gap="20">
        <refresh class="__ag__refresh__"  @refresh="onrefresh" @pullingdown="onpullingdown" :display="a__ag__refreshing__ ? 'show' : 'hide'">
            <text  class="__ag__refreshtext__" >{{a__ag__freshText__}}</text>
            <loading-indicator  class="__ag__loading__"></loading-indicator>
        </refresh>
        <cell v-for="(item) in p__ag__anchorList" :key="item.id" >
            <anchor-item class="__ag__anchor__" :listFollowMap="a__ag__listFollowMap__" :item="item" @cancelFollow="__ag__cancelFollow__" @followTap="__ag__followTap__"></anchor-item>
        </cell>
    </waterfall >
</template>
<script>
    import anchorItem from './__ag__anchorItem__.vue'
    import agMinix from './__ag__minix__.js'
    import a__ag__util__ from './util.js'
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
                a__ag__listFollowMap__:{}
            }
        },
        computed: {
            p__ag__anchorList() {
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
                console.log(l)
				return l
            }
        },
        methods: {
            score(a){
				let s = 0
				//已订阅主播
				if(a.follow){
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
                this.a__ag__refreshing__ = true
				this.a__ag__freshText__ = '加载中...'
				await this.__ag__loadData__()
				this.a__ag__refreshing__ = false
			},
            async __ag__listFollow__(from){
				// if(this.a__ag__user__ && this.a__ag__user__.userType<3){
					let resp = await __ag__sportApi__.listFollow(from)
					let list = resp.data
					if(list && list.length>0){
						for(let i in list){
							let r = list[i]
							// this.a__ag__listFollowMap__[r.streamerId] = r
                            this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
						}
					}
				// }
			},
			onpullingdown(){
				this.a__ag__freshText__ = '释放更新'
			},
            async __ag__loadData__(){
                let that = this
				that.a__ag__user__ = a__ag__util__.getItem('user')
                try {
                    await this.__ag__pageUp__()
                    await that.__ag__listFollow__({status:1})
                } catch (error) {
                    a__ag__util__.message(error.message)
                }

			},
            async __ag__cancelFollow__(item) {
                try{
                    let up = this.a__ag__listFollowMap__[item.id]
                    let id  = up.id
                    let resp = await __ag__sportApi__.editFollowCancel({id})
                    a__ag__util__.message(resp.message)
                    if(resp.success){
                        this.$delete(this.a__ag__listFollowMap__,item.id)
                        // console.log(this.a__ag__listFollowMap__)
                    }
                    // this.__ag__loadData__()
                }catch(e){
                   
                    a__ag__util__.message(e.message || '无法订阅')
                }
            },
           async __ag__followTap__(item) {
                try{
                    let resp = await __ag__sportApi__.editFollow({streamerId: item.id})
                    a__ag__util__.message(resp.message)
                    if(resp.success){
                        let r = resp.data
                        // this.a__ag__listFollowMap__[r.streamerId] = r
                        this.$set(this.a__ag__listFollowMap__,r.streamerId,r)
                    }
                    // this.__ag__loadData__()
                }catch(e){
                    a__ag__util__.message(e.message || '无法订阅')
                }
            }
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
		align-items: center;
		justify-content: center;
	}
    .__ag__refreshtext__ {
		padding-bottom: 40px;
	}
	.__ag__loading__ {
		color: #000000;
	}
    .__ag__anchor__ {
        height: 330px;
    }
</style>