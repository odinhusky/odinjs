<template>
    <div class="__ag__anchorlist-item__" v-if="item && item.id" @click="__ag__itemlive__(item,isindex)">
        <div class="__ag__anchorlist-img__" >
            <ag-userimg class="__ag__anchorlist-image__" :fontSize="true" @click="__ag__itemlive__(item,isindex)" :avatar="item.avatar" :name="item.userNicename"></ag-userimg>
		</div>
		<text class="__ag__anchorlist-text__">{{item && item.userNicename}}</text>
		<div class="__ag__anchorlist-status__" v-if=" item && item.joinMap && item.joinMap.live && item.joinMap.live.scheduleId">
			<div class="__ag__anchorlist-yuan__"></div>
			<text class="__ag__anchorlist-zb__">直播中</text>
		</div>
		<div class="__ag__anchorlist-status__" v-else>
			<text class="__ag__anchorlist-home__">不在家</text>
		</div>
        <!-- <div class="__ag__anchorlist-gz__ cancelfollow" @click.stop="__ag__cancelFollow__(item)" v-if="isFollow" >
			<text class="iconfont icon-heart3 __ag__anchorlist-icon__ heart3">&#xe679;</text>
            <text class="__ag__anchorlist-dy__ heart3">已订阅</text> 
		</div>
		<div v-else class="__ag__anchorlist-gz__" @click.stop="__ag__followTap__(item)">
			<text class="iconfont icon-outlined_heart __ag__anchorlist-icon__">&#xe66d;</text>
			<text class="__ag__anchorlist-dy__">订阅</text>
		</div>
		<div class="__ag__anchorlist-score__">
			<text class="__ag__anchorlist-num__">订阅人数:</text>
			<text class="__ag__anchorlist-num__">{{item &&  item.score}}</text>
		</div> -->
    </div>
</template>
<script>
    import agMinix from './__ag__minix__.js'
    import util from './util.js'

    import userImg from './__ag__userImg__.vue'
    export default {
        mixins:[agMinix],
        components:{
            'ag-userimg': userImg,
        },
        props: {
            item: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            isindex: {
                type: Boolean,
                default: false
            },
            listFollowMap:{
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        data() {
            return {
                f__ag_id__: 0
            }
        },
        computed:{
            isFollow(){
                if( !this.listFollowMap){
                    return false
                }
                let r = this.listFollowMap[this.item.id]
                console.log(this.listFollowMap,this.item.id,r)
               
                return r
            },
        },
        methods: {
            __ag__itemlive__(item,isindex){
                util.message(item.id)
				if(!item.id ){
					return
				}
                if(!(item && item.joinMap && item.joinMap.live && item.joinMap.live.scheduleId)){
                    util.message("主播不在家")
                    return
                }
                let uid = item.id
				let params = {
					tab: 2,
					uid: uid
				}
				if(isindex){
					util.getPush('__ag__live__',params)
					return
				}
				// this.$router.push({ path: '/live', query: params});
				util.getPush('__ag__live__',params)
			},
            __ag__cancelFollow__(item) {
               this.$emit('cancelFollow',item)
            },
            __ag__followTap__(item) {
                this.$emit('followTap',item)
            } 
        }
    }
</script>
<style lang="less" scoped>
    @import '../style/default.less';
    .iconfont {
        font-family: iconfont ;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }
    .__ag__anchorlist-item__ {
        background-color: #fff;
        margin-bottom: 16px;
        /* box-shadow: 0px 1px 3px rgb(0 0 0 / 10%); */
        border-radius: 8px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .__ag__anchorlist-img__ {
        width: 120px;
        height: 120px;
        border-radius: 60px ;
        background-color: #EFEFEF;
        color: rgba(0, 0, 0, 0.3);
        text-align: center;
        line-height: 60px;
        font-size: 27px;
        margin-top: 14px;
    }
    .__ag__anchorlist-image__ {
        width: 120px;
        height: 120px;
        background-color: #EFEFEF;
        border-radius:60px;
        color: rgba(0, 0, 0, 0.3);
        text-align: center;
        display: flex;
        /* align-items: center; */
        justify-content: center;
        font-size: 40px;
    }

    .__ag__anchorlist-text__ {
        font-style: normal;
        font-weight: 500;
        font-size: 28px;
        color: #000000;
        margin-top: 7px;
        margin-left: 16px;
        margin-right: 16px;
        width: calc(100% - 16px - 16px);
        text-align: center;
        overflow: hidden;
        text-overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
    }
    .__ag__anchorlist-status__ {
        margin-top: 6px;
        height: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .__ag__anchorlist-yuan__ {
        background-color: #FF0000;
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
    .__ag__anchorlist-zb__ {
        margin-left: 4px;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        text-align: right;
        letter-spacing: 0.05em;
        color: #000000;
    }
    .__ag__anchorlist-home__ {
        font-style: normal;
        font-weight: normal;
        font-size: 11wx;
        letter-spacing: 2wx;
        color: rgba(0, 0, 0, 0.3);
    }
    .__ag__anchorlist-gz__ {
        margin-top: 7px;
        background-color: @zhuse;
        border-radius: 15wx;
        width: 80wx;
        height: 30wx;
        font-size: 13wx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        flex-direction: row;
    }
    .cancelfollow {
        background-color: rgba(7, 193, 96, 0.15);
         color: @zhuse;
    }
    .heart3 {
         color: @zhuse;
    }
    .__ag__anchorlist-dy__ {
        font-size: 13wx;
        color: #FFFFFF;
    }
    .__ag__anchorlist-icon__ {
        font-size: 16wx;
        color: #FFFFFF;
        margin-right: 3px;
    }

    .__ag__anchorlist-score__ {
        flex-direction: row;
        margin-top: 10px;
        margin-bottom: 10px;
        align-items: center;
    }
    .__ag__anchorlist-num__ {
        font-style: normal;
        font-weight: normal;
        font-size: 11wx;
        color: @zhuse;
    }

</style>