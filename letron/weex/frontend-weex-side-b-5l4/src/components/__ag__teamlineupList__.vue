<template>
    <div class="__ag__teamlineuplist__" >
        <image class="__ag__footballimg__" :src="__ag__url__(url)"></image>
        <div class="__ag__footballlineup__" v-if="scheduleClass == 5">
            <div class="__ag__lineuptitle__ __ag__toptitleteam__">
                <div class="__ag__titleteam__">
                    <div class="__ag__titleteamname__">
                        <text class="__ag__titleteamnametext__">{{item.teamNamea}}</text>
                    </div>
                    <text class="__ag__footballtitlename__">{{lineupa}}</text>
                </div>
                <ag-player :item="goalkeepera"></ag-player>
            </div>
            <ag-teamlineupitem :scheduleClass="scheduleClass" :lineupList="lineupList"></ag-teamlineupitem>
            <ag-teamlineupitem :scheduleClass="scheduleClass" :lineupList="lineupList" :isbottom="true"></ag-teamlineupitem>
             <div class="__ag__lineuptitle__ __bottomlineup__">
                <div class="__ag__titleteam__ __bottomteamname__">
                    <text class="__ag__footballtitlename__ __bottomlineupname__">{{lineupb}}</text>
                    <div class="__ag__titleteamname__">
                        <text class="__ag__titleteamnametext__">{{item.teamNameb}}</text>
                    </div>
                </div>
                <ag-player  :item="goalkeeperb"></ag-player>
            </div>
        </div>
        <div class="__ag__footballlineup__" v-if="scheduleClass == 4">
            <div class="__ag__lineuptitle__ __ag__toptitleteam__">
                <div class="__ag__titleteam__">
                    <div class="__ag__titleteamname__ __ag__titleteamnamebasket__">
                        <text class="__ag__titleteamnametext__">{{item.teamNamea}}</text>
                    </div>
                </div>
            </div>
            <ag-teamlineupitem :scheduleClass="scheduleClass" :lineupList="lineupList"></ag-teamlineupitem>
            <ag-teamlineupitem :scheduleClass="scheduleClass" :lineupList="lineupList" :isbottom="true"></ag-teamlineupitem>
             <div class="__ag__lineuptitle__ __bottomlineup__">
                <div class="__ag__titleteam__ __bottomteamname__">
                    <div class="__ag__titleteamname__ __ag__titleteamnamebasket__">
                        <text class="__ag__titleteamnametext__">{{item.teamNameb}}</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import agMinUrl from './__ag__minurl__.js'
    import player from './__ag__player__.vue'
    import teamLineupitem from './__ag__teamLineupitem__.vue'
    export default {
        mixins:[agMinUrl],
        components:{
            'ag-player':player,
            'ag-teamlineupitem':teamLineupitem,
        },
        props:{
			scheduleClass: {
				type: Number,
				default: undefined
			},
			lineupList: {
				type:Array,
				default:function() {
					return []
				}
			},
			item: {
				type:Object,
				default:function() {
					return {}
				}
			}
		},
        computed:{
            url(){
                if(this.scheduleClass == 5){
                    return 'static/football.png'
                }
                if(this.scheduleClass == 4){
                    return 'static/rectangle.png'
                }
            },
			goalkeepera() {
				for (let i in this.lineupList) {
					let r = this.lineupList[i]
					if (r.lineupType == 0 && r.positionId == 0) {
						return r
					}
				}
				return {}
			},
			goalkeeperb() {
				for (let i in this.lineupList) {
					let r = this.lineupList[i]
					if (r.lineupType == 1 && r.positionId == 0) {
						return r
					}
				}
				return {}
			},
			lineupa() {
				if (!this.lineupList || !this.lineupList.length) {
					return ''
				}
				return this.lineupList[0].homeArray.split('').join('-')
			},
			lineupb() {
				if (!this.lineupList || !this.lineupList.length) {
					return ''
				}
				return this.lineupList[0].awayArray.split('').join('-')
			},
		},
        data() {
            return {
                avatar:'2022/0316/17d16af0891b41fea50c91cec95313fc.png',
            }
        },
    }
</script>
<style lang="less" scoped>
    .__ag__teamlineuplist__ {
        width: 690px;
        margin-left: 30px;
        margin-right: 30px;
        height: 1090px;
        position: relative;
    }
    .__ag__footballimg__ {
        width: 690px;
        height: 1090px;
        border-radius: 24px;
    }
    .__ag__footballlineup__ {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 690px;
        display: flex;
        flex-direction: column;
    }
    .__ag__lineuptitle__ {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 90px;
        position: relative;
        padding-top: 24px;
    }
    .__ag__titleteam__ {
        position: absolute;
		left: 42px;
		text-align: center;
        align-items: center;
        justify-content: center;
    }
    .__ag__toptitleteam__ {
        top: 24px;
    }
    .__bottomteamname__ {
        bottom: 24px;
    }
    .__ag__titleteamname__ {
        padding:16px;
        padding-top: 8px;
        padding-bottom: 8px;
		height: 44px;
		background-color: rgba(7, 150, 72, 0.4);
		border-radius: 12px;
		text-align: center;
        align-items: center;
        justify-content: center;
    }
    .__ag__titleteamnamebasket__ {
        background-color: rgba(0, 74, 141, 0.5);
    }
    .__ag__titleteamnametext__ {
        font-style: normal;
		font-weight: normal;
		font-size: 12wx;
		color: #FFFFFF;
    }
    .__ag__footballtitlename__ {
        margin-top: 5px;
        font-style: normal;
		font-weight: normal;
		font-size: 12wx;
		color: #FFFFFF;
    }
    .__bottomlineupname__ {
        margin-top: 0px;
        margin-bottom: 5px;
    }
    .__bottomlineup__ {
        position: absolute;
		bottom: 24px;
		right: 0;
		left: 0;
    }
</style>