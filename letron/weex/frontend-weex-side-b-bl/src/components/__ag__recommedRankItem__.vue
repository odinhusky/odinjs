<template>
    <div class="__ag__recomd-rank-main__" v-if="item">
        <text class="rank-one rank-text">{{index+1}}</text>
        <div class="rank-two rank-text">
            <user-img class="__ag__recom-img__" :avatar="item.avatar" :fontSize="true" :name="item.userNicename"></user-img>
            <text class="__ag__user-name__">{{item.userNicename}}</text>
        </div>
        <text class="rank-there rank-text">{{ Math.floor(item.redCount * 100 / (item.blackCount + item.redCount))}}%</text>
        <text class="rank-four rank-text">{{item.blackCount + item.redCount}}</text>
    </div>
</template>
<script>
import userImg from './__ag__userImg__.vue'
export default {
    components: {
        "user-img":userImg
    },
    props: {
        item: {
            type:Object,
            default: function() {
                return {}
            }
        },
        index: {
            type:Number,
            default: 0
        }
    }
}
</script>
<style scoped>
    .__ag__recomd-rank-main__ {
        height: 40wx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .rank-one {
        width: 50wx;
    }
    .rank-two {
        flex: 1;
    }
    .rank-there {
        width: 60wx;
    }
    .rank-four {
        width: 70wx;
        text-align: center;
    }
    .rank-text {
        display: flex;
        flex-direction: row;
        font-style: normal;
        font-weight: normal;
        font-size: 14wx;
        color: rgba(0, 0, 0, 0.5);
    }
    .__ag__recom-img__ {
        width: 24wx;
        height: 24wx;
        margin-right: 8wx;
    }
    .__ag__user-name__ {
        font-style: normal;
        font-weight: normal;
        font-size: 14wx;
        color: rgba(0, 0, 0, 0.5);
    }
</style>