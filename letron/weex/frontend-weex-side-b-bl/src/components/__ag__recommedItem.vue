<template>
    <div class="__ag__recommed-item-main__" :class="[index == length > 0 ? length - 1 : length ? 'last-recom-item': '']" @click="$emit('jumpRecommed',item)">
        <div class="__ag__recom-rg__">
            <!-- <text v-if="goodLevel == 1">😊</text>
            <text v-if="goodLevel == 2">😐</text>
            <text v-if="goodLevel == 3">😭</text> -->
            <text class="rate_text">{{rate}}%</text>
            <text class="__recom-text__">推荐准确率</text>
        </div>
        <div class="__ag__recom-lf__">
            <div class="__ag__recommed-item-content">
                <text class="item-cont-text">{{ item &&item.title}}</text>
            </div>
            <div class="__ag__recommed-item-top__">
                <user-img class="__ag__recom-img__" :avatar="item && item.joinMap && item.joinMap.u && item.joinMap.u.avatar" :fontSize="true" :uid="item.uid" :name="item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename"></user-img>
                <text class="__ag__user-name__">{{item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename}}</text>
            </div>
            
        </div>
    </div>
</template>
<script>
import userImg from './__ag__userImg__.vue'
export default {
    components: {
        "user-img":userImg
    },
    props:{
        item:{
            type:Object,
            default:function() {
                return {}
            }
        },
        index: {
            type:Number,
            default: 0
        },
        length: {
            type:Number,
            default: 0
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        goodLevel(){
            if(!this.item){
                return ''
            }
            let rate = this.rate
            if(!rate){
                return ''
            }
            if(rate>=70){
                return 1
            }
            if(rate>=40){
                return 2
            }
            if(rate>0){
                return 3	
            }
            return ''
            
        },
        total(){
            if(!this.item){
                return ''
            }
            let r = this.item.joinMap.u.redCount || 0
            let b = this.item.joinMap.u.blackCount || 0
            let total = r + b
            if(!total){
                return ''
            }
            return total
        },
        rate(){
            if(!this.total){
                return 0
            }
            let rate = this.item.joinMap.u.redCount * 100 / this.total
            rate  = Math.floor(rate)
            return rate
        }
    }
}
</script>
<style scoped lang="less">
    @import "../style/theme.less";
    .__ag__recommed-item-main__ {
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 16px;
        padding-top: 16px;
        background-color: #fff;
        margin-bottom: 20px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0,.3);
        border-radius: 8px;
        flex-direction: row;
    }
    .last-recom-item {
        border-bottom-width:0px ;
    }
    .__ag__recommed-item-top__ {
        display: flex;
        height:60px;
        flex-direction: row;
        align-items: center;
    }
    .__ag__recom-lf__ {
        flex: 1;
        padding-left: 40px;
    }
    .__ag__recom-img__ {
        width: 24wx;
        height: 24wx;
        margin-right: 8wx;
    }
    .__ag__user-name__ {
        font-style: normal;
        font-weight: 600;
        font-size: 15wx;
        color: #000000;

    }
    .__ag__recom-rg__ {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-left: 20px;
        padding-right: 30px;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #cdf6e0;
    }
    .__recom-text__ {
        font-style: normal;
        font-weight: normal;
        font-size: 13wx;
        color: rgba(0, 0, 0, 0.5);
        margin-left: 5wx;
    }
    .__ag__recommed-item-content {
        flex: 1;
    }
    .item-cont-text {
        flex: 1;
        font-style: normal;
        font-weight: normal;
        font-weight: 500;
        font-size: 15wx;
        height:60px;
        color: #000000;
        line-height: 60px;
        lines:1;
        text-overflow: ellipsis;
        margin-bottom: 5px;
    }
    .rate_text {
        font-style: normal;
        font-weight: 600;
        font-size: 22wx;
        letter-spacing: 0.01em;
        color: @main-color;
        margin-bottom: 10px;
    }
</style>