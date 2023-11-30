<template>
    <div class="__ag__recommed-item-main__" :class="[index == length > 0 ? length - 1 : length ? 'last-recom-item': '']" @click="$emit('jumpRecommed',item)">
        <div class="__ag__recommed-item-top__">
            <div class="__ag__recom-lf__">
                <user-img class="__ag__recom-img__" :avatar="item && item.joinMap && item.joinMap.u && item.joinMap.u.avatar" :fontSize="true" :uid="item.uid" :name="item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename"></user-img>
                <text class="__ag__user-name__">{{item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename}}</text>
            </div>
            <div class="__ag__recom-rg__">
                <text v-if="goodLevel == 1">😊</text>
                <text v-if="goodLevel == 2">😐</text>
                <text v-if="goodLevel == 3">😭</text>
                <text class="__recom-text__">推荐准确率 {{rate}}%</text>
            </div>
        </div>
        <div class="__ag__recommed-item-content">
            <text class="item-cont-text">{{ item &&item.title}}</text>
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
<style scoped>
    .__ag__recommed-item-main__ {
        padding-bottom: 16wx;
        padding-top: 16wx;
        border-bottom-style: solid;
        border-bottom-width:1px ;
        border-bottom-color:#E2E5EA ;
    }
    .last-recom-item {
        border-bottom-width:0px ;
    }
    .__ag__recommed-item-top__ {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .__ag__recom-lf__ {
        flex: 1;
        flex-direction: row;
        align-items: center;
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
        flex: 1;
        flex-direction: row;
        align-items: center;
        height: 30wx;
        justify-content: flex-end;
    }
    .__recom-text__ {
        font-style: normal;
        font-weight: normal;
        font-size: 13wx;
        color: rgba(0, 0, 0, 0.5);
        margin-left: 5wx;
    }
    .__ag__recommed-item-content {
        margin-top: 8wx;
    }
    .item-cont-text {
        flex: 1;
        font-style: normal;
        font-weight: normal;
        font-size: 15wx;
        height: 20wx;
        color: #000000;
        line-height: 20wx;
        lines:1;
        text-overflow: ellipsis;
    }
</style>