<template>
    <div class="__ag__recommeds-item-main__" v-if="item" @click="$emit('jumpRecommed',item)">
        <div class="recommeds-item-userInfo">
            <div class="__ag__recom-lf__">
                <user-img class="__ag__recom-img__" :avatar="item && item.joinMap && item.joinMap.u && item.joinMap.u.avatar" :fontSize="true" :uid="item.uid" :name="item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename"></user-img>
                <text class="__ag__user-name__">{{item && item.joinMap && item.joinMap.u && item.joinMap.u.userNicename}}</text>
            </div>
            <div class="__ag__recom-rg__" v-if="item.joinMap && item.joinMap.sche && item.joinMap.sche.islive">
                <div class="__ag__recom_live">
                    <text class="live_line"></text>
                    <text class="live_static">比赛进行中</text>
                </div>
            </div>
            <div class="__ag__recom-rg__" v-else>
                <text class="anchor-static" v-if="item.result==1">红单</text>
				<text class="anchor-static black" v-else-if="item.result==2">黑单</text>
				<text class="anchor-static gray" v-else-if="item.result==3">走水</text>
				<text class="anchor-static wu" v-else-if="item.result==0">{{status[item.joinMap && item.joinMap.sche && item.joinMap.sche.status]}}</text>
            </div>
        </div>
        <div class="recommeds-item-content">
            <text class="item-cont-text">{{ item &&item.title}}</text>
        </div>
        <div class="recommeds-item-box">
            <div class="__item_i__">
                <text class="__item_t__">时间：</text>
                <text class="__item-time__ __item-text">{{forTypeDate(item.createTime)}} {{formatTime(item.createTime)}}</text>
            </div>
            <div class="__item_i__ item-status">
                <text class="__item_t__">状态：</text>
                <text class="__item-text">{{status[item.joinMap.sche.status]}}</text>
            </div>
        </div>
        <div class="recommeds-item-box">
            <div class="__item_i__">
                <text class="__item_t__">推荐比赛：</text>
                <text class="__item-text">{{item.joinMap.sche.teamNamea}} vs {{item.joinMap.sche.teamNameb}}</text>
            </div>
        </div>
        <div class="recommeds-item-box">
            <div class="__item_i__">
                <text class="__item_t__">推荐标的：</text>
                <text class="__item-text">{{item.target}}</text> 
            </div>
        </div>
        <!-- <div class="recommeds-item-complat">
            <text v-if="!isGood" class="agiconfont thumbs thumbs-icon" @click="editGood(1)">&#xe694;</text>
            <text v-else class="agiconfont goodcolor thumbs-icon"  @click="editGoodCancel">&#xec63;</text>
            <text class="thumbs-text thumbs-one" :class="[isGood?'goodcolor':'']">{{item.goods}}</text>
            <text v-if="!isBad" class="agiconfont thumbs-copy thumbs-icon"  @click="editGood(-1)">&#xec60;</text>
            <text v-else class="agiconfont goodcolor thumbs-icon"  @click="editGoodCancel">&#xe69d;</text>
            <text class="thumbs-text" :class="[isBad?'goodcolor':'']">{{item.bads}}</text>
        </div> -->
    </div>
</template>
<script>
import userImg from './__ag__userImg__.vue'
import agMinix from './__ag__minix__.js'
import util from "./util.js"
export default {
    mixins:[agMinix],
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
        user: {
            type:Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            status:['比赛未开始','比赛进行中','比赛已结束','已取消','待定','中断','已推迟','腰斩'],
            loading: false
        }
    },
    computed: {
        isGood(){
            if(!this.item){
                return false
            }
            return this.item.good || (this.item.joinMap && this.item.joinMap.good && this.item.joinMap.good.good==1)
        },
        isBad(){
            if(!this.item){
                return false
            }
            return this.item.bad || (this.item.joinMap && this.item.joinMap.good && this.item.joinMap.good.good==-1)
        },
    },
    methods: {
        formatTime(date){
            return util.formatTime(date)
        },
        forTypeDate(date){
            let dateDay= util.forTypeDate(date)
            if(dateDay.split(0,1) == 0 ){
                return dateDay.substr(1,dateDay.length-1)
            }
            return dateDay
        },
        async editGood(good) {
            if (!this.user || this.user.userType == 3) {
                util.getPush('__ag__login__')
                return
            }
            if(this.loading){
                return
            }
            this.loading=true
            let item = this.item
            let f = {type:2,refId:item.id,good}
            try {
                let resp =  await this.__ag__editGood__(f)
                if (resp && resp.success) {
                    this.loading=false
                    util.message(resp.message)
                    this.item.joinMap.good=resp.data
                    if(good==1){
                        this.$set(item, 'good', true)
                        this.$set(item, 'bad', false)
                        item.goods++
                    }else{
                        this.$set(item, 'good', false)
                        this.$set(item, 'bad', true)
                        item.bads++
                    }
                }
            } catch(err) {
                this.loading=false
                util.message(err.message)
            }
        },
        async editGoodCancel(){
            if (!this.user || this.user.userType == 3) {
                util.getPush('__ag__login__')
                return
            }
            if(this.loading){
                return
            }
            let item = this.item
			let id = this.item.joinMap.good.id
            try {
                let resp = await this.__ag__editGoodCancel__(id)
                if (resp && resp.success) {
                    this.loading=false
                    util.message(resp.message)
                    if(this.isGood){
                        this.$set(item, 'good', false)
                        this.item.goods -= 1
                    }
                    if(this.isBad){
                        this.$set(item, 'bad', false)
                        this.item.bads -=1
                    }
                    this.item.joinMap.good=[]
                }
            } catch(err) {
                this.loading=false
            }
        }
    }
}
</script>
<style scoped lang="less">
    @import "../style/theme.less";
    .__ag__recommeds-item-main__ {
        width: 686px;
        background-color: #fff;
        padding: 12wx;
        border-radius: 4wx;
        overflow: hidden;
        margin-top: 8wx;
    }
    .recommeds-item-userInfo {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-bottom-color: #E6F9EF;
        padding-bottom: 15px;
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
        position: relative;
    }
    .recommeds-item-content {
        flex: 1;
        height: 21wx;
        margin-top: 10wx;
    }
    .item-cont-text {
        font-style: normal;
        font-weight: 500;
        font-size: 18wx;
        color: #000000;
        height: 20wx;
        line-height: 20wx;
        lines:1;
        text-overflow: ellipsis;
    }
    .recommeds-item-box {
        flex: 1;
        display: flex;
        flex-direction: row;
        line-height: 18wx;
        margin-top: 8wx;
        
    }
    .__item-text {
        flex: 1;
        lines:2;
        line-height: 25wx;
        font-style: normal;
        font-weight: normal;
        font-size: 14wx;
        color: rgba(0, 0, 0, 0.5);
    }
    .item-status {
        margin-left: 25wx;
    }
    .recommeds-item-complat {
        margin-top: 8wx;
        height: 25wx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .anchor-static {
        padding-left: 32px;
        padding-right: 32px;
		height: 25wx;
        background-color: #E62222;
        color: #FFFFFF;
        text-align: center;
        line-height: 25wx;
        border-radius: 40px;
        font-size: 12wx;
    }
    .black {
        background-color: #000;
    }
    .gray {
        background-color: #808080;
    }
    .wu {
        font-weight: normal;
        letter-spacing: 0.05em;
        background-color:  rgba(96, 96, 96, 0.1);
        color: #606060;
    }
    .thumbs-text {
        font-style: normal;
        font-weight: normal;
        font-size: 12wx;
        color: rgba(0, 0, 0, 0.4);
    }
    .thumbs-text {
        margin-left: 3wx;
    }
    .thumbs-one {
        margin-right: 20wx;
    }
    .goodcolor {
        color: #FF8934;
    }
    .__ag__recom_live {
        height: 25wx;
        padding-left: 32px;
        padding-right: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        background-color: rgba(230, 34, 34, 0.1);
    }
    .live_line {
        width: 10px;
        height: 10px;
        border-radius: 50wx;
        background-color: #E62222;
        margin-right: 5px;
    }
    .live_static {
        font-style: normal;
        font-weight: 500;
        font-size: 12wx;
        color: #E62222;
    }
    .__item_i__ {
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .__item_t__ {
        font-style: normal;
        font-weight: 600;
        font-size: 14wx;
        color: @main-color;
    }
</style>