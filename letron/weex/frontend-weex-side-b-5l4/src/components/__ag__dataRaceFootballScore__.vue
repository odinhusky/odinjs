<template>
    <div class="__ag__football__main__">
        <div class="__football_lf__">
            <div class="__lf_item__">
                <!-- <image class="__lf_image__" v-if="incomeLive && incomeLive.teamFlaga" :src="__ag__url__(incomeLive.teamFlaga)" resize="contain"></image>
                <text v-else class="__lf_name_text">{{ incomeLive && incomeLive.teamNamea && incomeLive.teamNamea.charAt(0)}}</text> -->
                <team-logo teamType="1" :teamFlag="incomeLive.teamFlaga" :teamName="incomeLive.teamNamea"></team-logo>
            </div>
            <div class="__lf_item__ __lf_item_tow__">
                <!-- <image class="__lf_image__" v-if="incomeLive && incomeLive.teamFlagb" :src="__ag__url__(incomeLive.teamFlagb)" resize="contain"></image>
                <text v-else class="__lf_name_text">{{ incomeLive && incomeLive.teamNameb && incomeLive.teamNameb.charAt(0)}}</text> -->
                <team-logo teamType="2" :teamFlag="incomeLive.teamFlagb" :teamName="incomeLive.teamNameb"></team-logo>
            </div>
        </div>
        <div class="__football_rg__" ref="football">
            <div class="__rg_top__">
                <text v-for="(item,index) in timeline" :key="'t'+ index" class="__rg_time__" :class="[index == 0?'__relative_left_':'', index == 2?'__relative_center_':'', index == 3?'__aling_center_':'',index > 3?'__aling_right_':'',index == 6?'__relative_right_':'']">{{item}}’</text>
            </div>
            <div class="__team_content__">
                <div class="__team_box__">
                    <div class="__team_item__" v-for="(item,index) in teamLista" :key="'a'+ index" :class="[index == 0?'__border_lf__':'',index >= 4?'__padding_right__':'']">
                        <div class="__team_event__" v-for="(t,k) in item.list" :key="'td'+ k" :style="{'left': t.p + 'px'}">
                            <text v-if="t.k == 1 && t.name" class="agiconfont __event_zuqiu__">&#xea78;</text>
                            <text v-if='t.name && (t.k == 2 || t.k == 9 || t.k == 3)' class="__event_brand__" :class="[t.k == 2 || t.k == 9?'__event_brand_red__':'__event_brand_yellow__']"></text>
                            <image v-if="t.k == 7 && t.name" style="width:18wx;height: 18wx;" :src="__ag__url__('static/strokes.png')" resize="contain"></image>
                        </div>
                    </div>
                </div>
                <div class="__progress_box__">
                    <div class="__progress_item__" :style="{'width': percent + 'px'}"></div>
                </div>
                <div class="__team_box__">
                    <div class="__team_item__" v-for="(item,index) in teamListb" :key="'b'+ index" :class="[index == 0?'__border_lf__':'',index >= 4?'__padding_right__':'']">
                         <div class="__team_event__" v-for="(t,k) in item.list" :key="'td'+ k" :style="{'left': t.p + 'px'}">
                            <text v-if="t.k == 1 && t.name" class="agiconfont __event_zuqiu__">&#xea78;</text>
                            <text v-if='t.name && (t.k == 2 || t.k == 9 || t.k == 3)' class="__event_brand__" :class="[t.k == 2 || t.k == 9?'__event_brand_red__':'__event_brand_yellow__']"></text>
                            <image v-if="t.k == 7 && t.name" style="width:18wx;height: 18wx;" :src="__ag__url__('static/strokes.png')" resize="contain"></image>
                        </div>
                    </div>
                </div>
                <div class="__midfield_box__" v-if="incomeLive && incomeLive.status == 2 || incomeLive.status == 1 && percent > 0" :style="{'left': wleft + 'px', 'right': wleft + 'px'}" ><text class="__midfield_text__"></text></div>
            </div>
        </div>
    </div>
</template>
<script>
import agMinUrl from './__ag__minurl__.js'
import teamLogo from './__ag__teamLogo__.vue'
const dom = weex.requireModule('dom')
export default {
    components:{
        'team-logo':teamLogo
    },
    mixins: [agMinUrl],
    props: {
		incomeLive: {
            type:Object,
            default: function() {
                return {}
            }
        },
        teamaList: {
            type: Array,
            default: function() {
                return []
            }
        },
        teambList: {
            type: Array,
            default: function() {
                return []
            }
        },
        underwayTime: {
            type:Number,
            default:0
        },
        tab: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            timeline: ['0','15','30','HT','60','75','90'],
            teamLista: [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}],
            teamListb: [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}],
            teamaList1: [],
            teambList1: [],
            wleft: 0,
            width: 0,
        };
    },
    computed: {
        percent() {
            let p
            if (!this.incomeLive && this.incomeLive.status) {
                p = 0
                return p
            }
            if (this.incomeLive.status == 0) {
                p = 0
            }
            if (this.incomeLive.status == 1) {
                p = this.underwayTime
            } 
            if (this.incomeLive.status == 2) {
                p = 90
            }
            if (this.incomeLive.status == 3 || this.incomeLive.status == 4 || this.incomeLive.status == 5 || this.incomeLive.status == 6) {
                p = 0
            }
            return p / 90 * this.width
        },
    },
    
    watch: {
        teamaList(a) {
            this.teamaList1 = a
            this.teamLista = [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}]
            this.getTeama(a,this.teamLista)
        },
        teambList(b) {
            this.teambList1 = b
            this.teamListb = [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}]
            this.getTeama(b,this.teamListb)
        },
        tab(t) {
            if (t == 1) {
                let sf = this.$refs.football
                if (sf) {
                    dom.getComponentRect(sf, option => {
                        let w = (option.size.width -  40) / 2
                        this.wleft = w.toFixed(2)
                        this.width = option.size.width - 18
                        this.getTeama(this.teamaList,this.teamLista)
                        this.getTeama(this.teambList,this.teamListb)
                    })
                }
                
            }
        }
    },
    mounted() {
        this.teamaList1 = this.teamaList
        this.teambList1 = this.teambList
        this.teamLista = [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}]
        this.teamListb = [{list: []},{list: []},{list: []},{list: []},{list: []},{list: []}]
        // this.getTeama(this.teamaList,this.teamLista)
        // this.getTeama(this.teambList,this.teamListb)
    },
    methods: {
        getTeama(list,l) {
            if (!list || !list.length) {
                return
            }
            let obj
            let f = this.width / 6 - 11
            for (let i in list) {
                let t = list[i]
                if (t.time <= 15) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: t.time / 15 * f
                    }
                    l[0].list.push(obj)
                    continue
                }
                if (t.time > 15 && t.time<= 30) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: (t.time - 15) / 15 * f
                    }
                    l[1].list.push(obj)
                    continue
                }
                if (t.time > 30 && t.time<= 45) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: (t.time - 30) / 15 * f
                    }
                    l[2].list.push(obj)
                    continue
                }
                if (t.time > 45 && t.time<= 60) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: (t.time - 45) / 15 * f
                    }
                    l[3].list.push(obj)
                    continue
                }
                if (t.time > 60 && t.time<= 75) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: (t.time - 60) / 15 * f
                    }
                    l[4].list.push(obj)
                    continue
                }
                if (t.time > 75 && t.time<= 90) {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: (t.time - 75) / 15 * f
                    }
                    l[5].list.push(obj)
                    continue
                }
                if (t.overTime && t.overTime != '') {
                    obj = {
                        k: t.kind,
                        name: t.name,
                        p: 90
                    }
                    l[5].list.push(obj)
                    continue
                }
            }
        }
    }
}
</script>
<style scoped lang="less">
    @import "../style/theme.less";
    .__ag__football__main__ {
        width: 750px;
        padding: 16wx;
        flex-direction: row;
    }
    .__football_lf__ {
        width: 35wx;
        padding-top: 20wx;
    }
    .__lf_item__{
        height: 33wx;
        display: flex;
		align-items: center;
		justify-content: center;
        padding-right: 12wx;
        padding-left: 12wx;
    }
    .__lf_item_tow__ {
        margin-top: 3wx;
    }
    .__lf_image__ {
        width: 21wx;
		height: 21wx;
		border-radius: 50wx;
    }
    .__lf_name_text {
        width: 21wx;
		height: 21wx;
		border-radius: 50wx;
		background-color: #F2F3F4;
		display: flex;
        font-size: 12wx;
	    text-align: center;
        line-height: 21wx;
    }
    .__football_rg__ {
        flex: 1;
        padding-left: 10wx;
    }
    .__rg_top__ {
        height: 20wx;
        display: flex;
        flex-direction: row;
		justify-content: space-between;
        align-items: center;
    }
    .__rg_time__ {
        flex: 1;
		font-style: normal;
		font-weight: bold;
		font-size: 14wx;
		color: #000000;
        text-align: left;
    }
    .__aling_center_ {
        text-align: center;
    }
    .__aling_right_ {
        text-align: right;
    }
    .__relative_right_ {
        position: relative;
        right: -15wx;
    }
    .__relative_left_ {
        position: relative;
        left: -5wx;
    }
    .__relative_center_ {
        left: 5wx;
    }
    .__team_content__ {
        flex: 1;
        position: relative;
        /* background-color: aqua; */
    }
    .__team_box__ {
        height: 33wx;
		display: flex;
        flex-direction: row;
        justify-content: space-around;
        /* padding-right: 10wx;
        padding-left: 5wx; */
    }
    .__padding_right__ {
        /* flex: .9; */
    }
    .__team_item__ {
        flex: 1;
		height: 33wx;
		border-right-style: solid;
		border-right-width: 1wx;
		border-right-color:#F2F3F4;
        flex-direction: row;
		align-items: center;
    }
    .__team_event__ {
		position: absolute;
		top: 10wx;
		bottom: 10wx;
    }
    .__event_zuqiu__{
        font-size: 12wx;
    }
    .__event_brand__{
        width: 8wx;
		height: 10wx;
		border-radius: 2px;
    }
    .__event_brand_red__ {
        background-color: #FF5E5E;
    }
    .__event_brand_yellow__ {
        background-color: #FFA601;
    }

    .__border_lf__ {
		border-left-style: solid;
		border-left-width: 1wx;
        border-left-color:#F2F3F4;
        /* flex: .9; */
    }
    .__midfield_box__ {
        width: 12wx;
		height: 12wx;
		border-radius: 50wx;
        position: absolute;
		background-color: #000000;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        top: 28wx;
        bottom: 28wx;
    }
    .__midfield_text__ {
        width: 9wx;
		height: 9wx;
		background-color: #C4C4C4;
		border-radius: 50wx;
    }
    .__progress_box__ {
        flex: 1;
        height: 2wx;
        border-bottom-style: solid;
        border-bottom-width: 2wx;
        border-bottom-color: rgba(0, 0, 0, 0.05);
    }
    .__progress_item__ {
        width: 0px;
        height: 2wx;
        border-bottom-style: solid;
        border-bottom-width: 2wx;
        border-bottom-color: rgba(0, 0, 0,1);
    }
</style>