<template>
    <div class="__ag__score__main__">
        <!-- 足球比分详情 -->
        <div class="__ag__score__football__" v-if="scheduleClass == 5">
            <ag-football-score :incomeLive="incomeLive" :underwayTime="underwayTime" :teamaList="teamaList" :teambList="teambList" :tab="tab"></ag-football-score>
        </div>

        <!-- 篮球比分详情 -->
        <div class="__ag__score__basketball__" v-if="scheduleClass == 4">
            <ag-basketball-score :scoreList="scoreList" :incomeLive="incomeLive"></ag-basketball-score>
        </div>
    </div>
</template>
<script>

import footballScore from './__ag__dataRaceFootballScore__.vue'
import basketballScore from './__ag__dataRaceBasketballScore__.vue'
export default {
    props: {
        scheduleClass: {
            type: Number,
            default: undefined
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
        scoreList: {
            type: Array,
            default: function() {
                return []
            }
        },
        underwayTime: {
            type:Number,
            default:0
        },
        incomeLive: {
            type: Object,
            default: function(){
                return {}
            }
        },
        tab: {
            type: Number,
            default: 1
        }
    },
    components: {
        'ag-football-score':footballScore,
        'ag-basketball-score' :basketballScore,
    },
    data() {
        return {
            
        }
    },
}
</script>
<style scoped>
    .__ag__score__main__ {
        width: 750px;
    }
</style>