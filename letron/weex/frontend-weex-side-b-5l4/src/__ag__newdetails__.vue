<template>
    <div class="__ag__newdetails__" :class="[ipx?'ipx':'']">
        <ag-hbtitle :isback="true"></ag-hbtitle>
        <div class="__ag__newdetails__content__">
            <scroller class="scroller" :show-scrollbar="false">
                <div class="__ag__newdetails__top__">
                    <image v-if="newDetails.thumb" resize="contain" class="newdetails-image" :src="__ag__url__(newDetails.thumb)"></image>
                </div>
                <div class="__ag__newdetails__box__">
                    <div class="newdetails-title-box">
                        <text class="newdetails-title">{{newDetails.title}}</text>
                    </div>
                    <div class="__ag__box__top__">
                        <text class="__ag__box__title__" v-if="newDetails.joinMap && newDetails.joinMap.match && newDetails.joinMap.match.nameAbbr">{{newDetails.joinMap.match.nameAbbr}}</text>
                        <text class="__ag__box__title__" v-if="newDetails.addTime">{{formatToDate(newDetails.addTime)}}</text>
                    </div>
                    <div class="__ag__box__content__">
                        <ag-richText  :inner="newDetails.content"></ag-richText>
                    </div>
                </div>
            </scroller>
        </div>
    </div>
</template>

<script>
import agMinix from './components/__ag__minix__.js'
import agMinUrl from './components/__ag__minurl__.js'
import util from './components/util.js'
import agRichText from './components/__ag__richText__.vue'
import hbtitle from './components/__ag__headTop__.vue'
export default {
    mixins:[agMinix,agMinUrl],
    components: {
        agRichText,
        'ag-hbtitle' : hbtitle,
    },
    data() {
        return {
            newDetails: {},
        }
    },
    methods: {
        formatToDate(newDate){
            return util.formatToDate(newDate)
        },
        async __ag__loadData__(){
            try {
                let data = util.getUrlParam(weex.config.bundleUrl)
                await this.__ag__pageArticleById__(data)
                this.newDetails = this.a__ag__pageArticleById__.data.list[0]
            } catch (err) {
                util.message(err.message)
            }
            
		}
    }
}
</script>

<style scoped>
.__ag__newdetails__ {
    width: 750px;
    position: fixed;
    top: 128px;
	bottom: 0px;
    background-color: #fff;
}
.ipx {
   top: 166px; 
}
.__ag__newdetails__content__ {
   flex: 1;
   padding-top: 20px;
   padding-bottom: 170px;
}
.__ag__newdetails__top__ {
    width: 750px;
    height: 400px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
}
.newdetails-image {
    width: 750px;
    height: 400px;
}
.newdetails-title-box {
    flex: 1;
    margin-bottom: 16wx;
}
.newdetails-title {
    flex: 1;
    font-weight: 600;
    font-size: 40px;
    line-height: 60px;
    color: #000000;
}
.__ag__box__top__ {
    display: flex;
    flex-direction: row;
    margin-bottom: 20wx;
}
.__ag__newdetails__box__ {
    padding: 16wx;
}
.__ag__box__title__ {
    font-size: 26px;
    color: rgba(0, 0, 0, 0.5);
}
.__ag__box__text__ {
    line-height: 40px;
}


</style>
