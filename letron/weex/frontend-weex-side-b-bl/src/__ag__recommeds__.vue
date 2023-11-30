<template>
    <div class="__ag__recommeds-main__" :class="[ipx?'recom-ipx':'']" @swipe="handleSwipe">
        <ag-hbtitle :isback="true" title="推荐"></ag-hbtitle>
        <div class="__ag__recommeds-tabs__">
            <div class="__ag__recom-tabs-item__" :class="[tab == item.id?'tab-select':'','tab-item-'+ item.id]" v-for="item in tabList" :key="item.id" @click="change(item)">
                <text class="__ag__tabs-text" :class="[tab == item.id?'tab-select-text':'']">{{item.name}}</text>
            </div>
        </div>
        <div class="__ag__recommeds-content__">
            <slider class="__ag__slider__" interval="10" offset-x-accuracy="200" auto-play="false" infinite="false" @change="changeHandler" :index="sliderIndex">
                <div class="__ag__recommeds-item__" :class="[sliderIndex==0?'show':'hide']">
                    <scroller class="__ag__recommeds-list" show-scrollbar="false" v-if="recommedNewList && recommedNewList.length > 0"> 
                        <ag-recommed-new-item v-for="item in recommedNewList" :item="item" :key="item.id" @jumpRecommed="jumpRecommed" :user="a__ag__user__"></ag-recommed-new-item>
                    </scroller>
                    <text v-if="!recommedNewList || !recommedNewList.length" class="no-data-text">暂无数据</text>
                </div>
                <div class="__ag__recommeds-item__" :class="[sliderIndex==1?'show':'hide']">
                    <scroller class="__ag__recommeds-list" show-scrollbar="false" v-if="recommedNewList && recommedNewList.length > 0"> 
                        <ag-recommed-new-item v-for="item in recommedNewList" :item="item" :key="item.id" @jumpRecommed="jumpRecommed" :user="a__ag__user__"></ag-recommed-new-item>
                    </scroller>
                    <text v-else class="no-data-text">暂无数据</text>
                </div>
                <div class="__ag__recommeds-item__" :class="[sliderIndex==2?'show':'hide']">
                    <div class="__ag__recommeds-rank-title__">
                        <text class="rank-one rank-text">排名</text>
                        <text class="rank-two rank-text">主播</text>
                        <text class="rank-there rank-text">准确率</text>
                        <text class="rank-four rank-text">推荐次数</text>
                    </div>
                    <scroller class="__ag__recommeds-list" show-scrollbar="false" v-if="recommedRankList && recommedRankList.length > 0"> 
                        <ag-recommed-rank-item v-for="(item,index) in recommedRankList" :index="index" :item="item" :key="item.id"></ag-recommed-rank-item>
                    </scroller>
                    <text v-else class="no-data-text">暂无数据</text>
                </div>
			</slider>
        </div>
    </div>
</template>
<script>
import agMinix from './components/__ag__minix__.js'
import hbtitle from './components/__ag__headTop__.vue'
import agRecommedNewItem from './components/__ag__recommedNewItem__.vue'
import agRecommedRanktem from './components/__ag__recommedRankItem__.vue'
import util  from './components/util.js'
export default {
    mixins:[agMinix],
    components: {
        'ag-hbtitle': hbtitle,
        'ag-recommed-new-item': agRecommedNewItem,
        'ag-recommed-rank-item': agRecommedRanktem,
    },
    data() {
        return {
            tabList: [{id:0,name:'最新推荐'},{id:1,name:'历史推荐'},{id:2,name:'推荐榜'}],
            sliderIndex: 0,
            tab:0,
            a__ag__user__: {},
        }
    },
    computed: {
        recommedNewList() {
            let resp = this.a__ag__pageRecommed__
            if(!resp || !resp.data || !resp.data.list){
                return []
            }
            let list = resp.data.list
            return list
        },
        recommedRankList() {
            let resp = this.a__ag__pageRecommedStanding__
            if(!resp || !resp.data){
                return []
            }
            let list = resp.data
            return list
        }
    },
    methods : {
        async __ag__loadData__(){
            let that = this
             that.a__ag__user__ = util.getItem('user')
            const Steve = new BroadcastChannel('onlogin')
            Steve.onmessage= async function(event){
                that.a__ag__user__ = event.data
                await that.__ag__pageRecommed__({page:1,size:50})
            }
            await this.__ag__pageRecommed__({page:1,size:50})
        },
        changeHandler(e) {
            this.tab = this.tabList[e.index].id;
			this.sliderIndex = this.tabList[e.index].id;
            this.getData(this.tab)
        },
        change(item) {
            this.tab = item.id
            this.sliderIndex = item.id
            this.getData(item.id)
        },
        async getData(id) {
            if (id == 0) {
                await this.__ag__loadData__()
                return
            }
            if (id == 1) {
                let f = {
                    history: 1,
                    page:1,
                    size:50
                }
                await this.__ag__pageRecommed__(f)
                return
            }
            if (id == 2) {
                await this.__ag__pageRecommedStanding__()
                return
            }
        },
        handleSwipe(e) {
            if (e.direction == 'right') {
                if (this.tab == 0) {
                    util.pop()
                }
            }
		}	
    }
}
</script>
<style scoped lang="less">
	@import './style/theme.less';
    .__ag__recommeds-main__ {
        width: 750px;
		padding-bottom: 32px;
        position: fixed;
        bottom: 0px;
        top: 128px;
        background-color: #F2F2F2;
    }
    .recom-ipx {
        top: 176px;
    }
    .__ag__recommeds-tabs__ {
        width: 750px;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #FFFFFF;
        flex-direction: row;
        justify-content: center;
        align-items: center;
		padding: 32px;
    }
    .__ag__recom-tabs-item__ {
        height: 34wx;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 40px;
		border-style: solid;
		border-width: 2px;
		border-color: @main-color;
    }
    .tab-select {
        background-color: @main-color;
    }
    .__ag__tabs-text {
        font-style: normal;
        font-weight: normal;
        font-size: 13wx;
        color: @main-color;
    }
    .tab-select-text {
        color: #fff;
    }
	.tab-item-1 {
		margin-left: 20px;
		margin-right: 20px;
	}
    .__ag__recommeds-item__ {
        position: relative;
    }
    .__ag__recommeds-content__ {
        width: 750px;
        flex: 1;
        padding-top: 12wx;
        padding-bottom: 150px;
		padding-left: 32px;
		padding-right: 32px;
    }
    .__ag__slider__ {
        flex: 1;
    }
    .__ag__recommeds-list {
        flex: 1;
    }
    .show {
		left: 0;
	}
	.hide {
		left: 750px;
	}
    .__ag__recommeds-rank-title__ {
        width: 686px;
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
        text-align: right;
    }
    .rank-text {
        font-style: normal;
        font-weight: normal;
        font-size: 14wx;
        color: rgba(0, 0, 0, 0.5);
    }
    .no-data-text {
        width: 750px;
        text-align: center;
        padding-top: 30wx;
        padding-bottom: 30wx;
        font-size: 15wx;
        color: rgba(0, 0, 0, 0.3);
    }

</style>