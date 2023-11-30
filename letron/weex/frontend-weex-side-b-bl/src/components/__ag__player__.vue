<template>
    <div class="__ag__palyer__" v-if="item && item.name">
        <div class="__ag__palyerimgdiv__">
            <text class="agiconfont __ag__football__" v-if="scheduleClass == 5 && item.score > 0">&#xea78;</text>
            <text class="agiconfont __ag__football__" v-if="scheduleClass == 4 && item.score > 0">&#xe6d6;</text>
            <ag-userimg class="__ag__palyerimg__" :avatar="item.avatar" :name="item.name" :islive="true"></ag-userimg>
            <div class="__ag__playeritemp__ __ag__huan__" v-if="scheduleClass == 5 && item.player && item.player.yellow > 0 "></div>
        </div>
        <text class="__ag__palyertext__">{{item.username}}</text>
    </div>
</template>
<script>
    import userimg from './__ag__userImg__.vue'
    export default {
        components:{
            'ag-userimg':userimg
        },
        props:{
            scheduleClass: {
				type: Number,
				default: undefined
			},
            item:{
                type: Object,
				default: function(){
                    return {}
                }
            },
        },
        data() {
            return {

            }
        },
    }
</script>
<style scoped lang="less">
    @import "../style/theme.less";
    .__ag__palyer__ {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100px;
        margin-right: 16px;
    }
    .__ag__palyerimgdiv__ {
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        // background-color: red;
    }
    .__ag__palyerimg__ {
        width: 48px;
        height: 48px;
    }
    .__ag__palyertext__ {
        flex: 1;
        lines:1;
        text-overflow: ellipsis;
        font-style: normal;
        font-weight: 900;
        font-size: 10wx;
        text-align: center;
        color: #FFFFFF;
    }
    .__ag__football__ {
        width: 20px;
        height: 20px;
        margin-top: 10px;
        margin-right: 5px;
		text-align: center;
		color:#535668;
        background-color: #FFFFFF;
        font-size: 12wx;
		border-radius: 10px;
    }
     .__ag__playeritemp__ {
        position: absolute;
        top: -10px;
        right: 3px;
        width: 16px;
        height: 20px;
        border-radius: 4px;
    }
    .__ag__huan__ {
        background-color: #FFA601;
    }
    .__ag__hong__ {
        background-color: #FF5E5E;
    }
</style>