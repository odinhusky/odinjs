<template>
    <div class="__ag__race_main__">
        <ag-recordtitle name="比分详情" :isBottom="true"></ag-recordtitle>
        <ag-data-race-score-details :scheduleClass="scheduleClass" :incomeLive="incomeLive" :tab="tab" :teamaList="teamaList" :teambList="teambList" :underwayTime="underwayTime" :scoreList="scoreList"></ag-data-race-score-details>
        <ag-recordtitle name="球队统计" :isBottom="false"></ag-recordtitle>
        <ag-teamname :incomeLive="incomeLive" :tips="tipText"></ag-teamname>
        <ag-data-race-satistics :listMatchDetail="listMatchDetail"></ag-data-race-satistics>
    </div>
</template>
<script>
import agMinix from './__ag__minix__.js'
import recordtitle from './__ag__recordtitle__.vue'
import teamname from './__ag__teamName__.vue'
import dataRaceScoreDetails from './__ag__dataRaceScoreDetails__.vue'
import dataRaceSatistics from './__ag__dataRaceSatistics__.vue'
export default {
    components: {
        'ag-recordtitle':recordtitle,
        'ag-teamname':teamname,
        'ag-data-race-score-details':dataRaceScoreDetails,
        'ag-data-race-satistics':dataRaceSatistics,
    },
    mixins: [agMinix],
    props: {
        scheduleClass: {
            type: Number,
            default: undefined
        },
        matchId: {
            type: String,
            default: ''
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
    data() {
        return {
            tipText: 'VS',
            matchId1:'',
            scoreList:  [{
                teamName: '',
                img: '',
                q1:0,
                q2:0,
                q3:0,
                q4:0,
                score: '0'
            },{
                teamName: '',
                img: '',
                q1:0,
                q2:0,
                q3:0,
                q4:0,
                score: '0'
            }],
            listMatchDetail: [],
            teamaList: [],
            teambList: [],
            underwayTime: 0
        }
    },
    watch:{
        matchId(n){
            this.matchId1 = n
        },
        tab(t) {
            if (t == 1) {
                this.loadData()
            }
        }
    },
    mounted() {
        this.matchId1 =this.matchId
    },
    methods: {
        async loadData() {
            if (this.scheduleClass == 5) {
                await this.__ag__handleListMatchEvent__()
                await this.__ag__handleListMatchDetail__()
                return
            }
            if (this.scheduleClass == 4) {
                await this.__ag__handleListMatchDetail__()
                return
            }
        },
        async __ag__handleListMatchEvent__() {
            let matchId = this.matchId1
            try {
                let resp = await this.__ag__getListMatchEvent__({matchId})
                if (resp.success) {
                    if (resp.data && resp.data.length > 0) {
                        let list = resp.data
                        this.teamaList = list.filter(r => {
                            if (!r) {
                                return false
                            }
                            return r.isHome == 1
                        })
                        this.teambList = list.filter(r => {
                            if (!r) {
                                return false
                            }
                            return r.isHome == 0
                        })
                        let max = list[0].time;
                        for(var i = 1; i < list.length; i++) {
                            let cur = list[i].time;
                            cur > max ? max = cur : 0
                        }
                        this.underwayTime = max
                    }
                }
            } catch (err) {

            }
        },
        async __ag__handleListMatchDetail__() {
            let matchId = this.matchId1
            try {
                let resp = await this.__ag__getListMatchDetail__({matchId})
                if (resp.success) {
                    // if (resp.data && resp.data.length > 0) {
                        let r = resp.data && resp.data.length ? resp.data[0] : {}
                        this.scoreList = [{
                            q1:'0',
                            q2:'0',
                            q3:'0',
                            q4:'0',
                            score: r.homeScore || '0'
                        },{
                            q1:'0',
                            q2:'0',
                            q3:'0',
                            q4:'0',
                            score: r.awayScore || '0'
                        }]
                        if(this.scheduleClass == 4 ){
                            let homeFast = this.getNumber(parseInt(r.homeFast || 0),parseInt(r.awayFast || 0))
                            let awayFast = this.getNumber(parseInt(r.awayFast || 0),parseInt(r.homeFast || 0))
                            
                            let homeInside = this.getNumber(parseInt(r.homeInside || 0),parseInt(r.awayInside || 0))
                            let awayInside = this.getNumber(parseInt(r.awayInside || 0),parseInt(r.homeInside || 0))
                            
                            let homeExceed = this.getNumber(parseInt(r.homeExceed || 0),parseInt(r.awayExceed || 0))
                            let awayExceed = this.getNumber(parseInt(r.awayExceed || 0),parseInt(r.homeExceed || 0))
                            
                            let homeTotalmis = this.getNumber(parseInt(r.homeTotalmis || 0),parseInt(r.awayTotalmis || 0))
                            let awayTotalmis = this.getNumber(parseInt(r.awayTotalmis || 0),parseInt(r.homeTotalmis || 0))
                            
                            this.listMatchDetail = [{
                                a:r.homeFast,
                                b:'快攻得分',
                                c:r.awayFast,
                                pa: homeFast,
                                pc: awayFast
                            },{
                                a:r.homeInside,
                                b:'内线得分',
                                c:r.awayInside,
                                pa: homeInside,
                                pc: awayInside
                            },{
                                a:r.homeExceed,
                                b:'最多领先分数',
                                c:r.awayExceed,
                                pa: homeExceed,
                                pc: awayExceed
                            },{
                                a:r.homeTotalmis,
                                b:'总失误',
                                c:r.awayTotalmis,
                                pa: homeTotalmis,
                                pc: awayTotalmis
                            },{
                                a:0,
                                b:'三分球得分',
                                c:0
                            },{
                                a:0,
                                b:'两分球得分',
                                c:0
                            },{
                                a:0,
                                b:'罚球得分',
                                c:0
                            },{
                                a:0,
                                b:'罚球命中率',
                                c:0
                            },{
                                a:0,
                                b:'篮板',
                                c:0
                            },{
                                a:0,
                                b:'助攻',
                                c:0
                            }]
                        }else {
                            let attackNum = this.getSting(r.attackNum)
                            let goalNum = this.getSting(r.goalNum)
                            let shotsNum = this.getSting(r.shotsNum)
                            let control1 = this.getSting(r.control)
                            let control2 = this.getControl(r.control)
                            let riskAttackNum = this.getSting(r.riskAttackNum)
                            let cornerNum = this.getSting(r.cornerNum)
                            if(r.cornerNum2){
                                let cornerNum2 = this.getSting(r.cornerNum2)
                                cornerNum.a += cornerNum2.a
                                cornerNum.c += cornerNum2.c
                                cornerNum.z += cornerNum2.z
                            }
                            let yellowNum = this.getSting(r.yellowNum)
                            if(r.yellowNum2){
                                let yellowNum2 = this.getSting(r.yellowNum2)
                                yellowNum.a += yellowNum2.a
                                yellowNum.c += yellowNum2.c
                                yellowNum.z += yellowNum2.z
                            }
                            let redNum = this.getSting(r.redNum)
                            let freeNum = this.getSting(r.freeNum)
                            let offsideNum = this.getSting(r.offsideNum)
                            if(r.offsideNum2){
                                let offsideNum2 = this.getSting(r.offsideNum2)
                                offsideNum.a += offsideNum2.a
                                offsideNum.c += offsideNum2.c
                                offsideNum.z += offsideNum2.z
                            }
                            let foulNum = this.getSting(r.foulNum)
                            let passNum = this.getSting(r.passNum)
                            let slideTackle = this.getSting(r.slideTackle)
                            let dribblingNum = this.getSting(r.dribblingNum)
                            let halfCorner = this.getSting(r.halfCorner)
                            let halfball = this.getSting(r.halfball)
                            let headBallNum = this.getSting(r.headBallNum)
                            let retrieve = this.getSting(r.retrieve)
                            let tackle = this.getSting(r.tackle)
                            this.listMatchDetail = [{
                                a:attackNum.a,
                                b:'进攻',
                                c:attackNum.c,
                                pa: attackNum.pa,
                                pc: attackNum.pc
                            },{
                                a:goalNum.a,
                                b:'射门',
                                c:goalNum.c,
                                pa: goalNum.pa,
                                pc: goalNum.pc
                            },{
                                a:shotsNum.a,
                                b:'射正',
                                c:shotsNum.c,
                                pa: shotsNum.pa,
                                pc: shotsNum.pc
                            },{
                                a:control2.ca + '%',
                                b:'控球率',
                                c:control2.cc + '%',
                                pa:control1.pa,
                                pc:control1.pc
                            },{
                                a:riskAttackNum.a,
                                b:'危险进攻',
                                c:riskAttackNum.c,
                                pa: riskAttackNum.pa,
                                pc: riskAttackNum.pc
                            },{
                                a:cornerNum.a,
                                b:'角球',
                                c:cornerNum.c,
                                pa: cornerNum.pa,
                                pc: cornerNum.pc
                            },{
                                a:yellowNum.a,
                                b:'黄牌',
                                c:yellowNum.c,
                                pa: yellowNum.pa,
                                pc: yellowNum.pc
                            },{
                                a:redNum.a,
                                b:'红牌',
                                c:redNum.c,
                                pa: redNum.pa,
                                pc: redNum.pc
                            },{
                                a:freeNum.a,
                                b:'自由球',
                                c:freeNum.c,
                                pa: freeNum.pa,
                                pc: freeNum.pc
                            },{
                                a:offsideNum.a,
                                b:'越位',
                                c:offsideNum.c,
                                pa: offsideNum.pa,
                                pc: offsideNum.pc
                            },{
                                a:foulNum.a,
                                b:'犯规',
                                c:foulNum.c,
                                pa: foulNum.pa,
                                pc: foulNum.pc
                            },{
                                a:passNum.a,
                                b:'传球',
                                c:passNum.c,
                                pa: passNum.pa,
                                pc: passNum.pc
                            },{
                                a:slideTackle.a,
                                b:'铲球',
                                c:slideTackle.c,
                                pa: slideTackle.pa,
                                pc: slideTackle.pc
                            },{
                                a:dribblingNum.a,
                                b:'过人次数',
                                c:dribblingNum.c,
                                pa: dribblingNum.pa,
                                pc: dribblingNum.pc
                            },{
                                a:halfCorner.a,
                                b:'半场角球',
                                c:halfCorner.c,
                                pa: halfCorner.pa,
                                pc: halfCorner.pc
                            },{
                                a:halfball.a,
                                b:'半场控球',
                                c:halfball.c,
                                pa: halfball.a ,
                                pc: halfball.c
                            },{
                                a:headBallNum.a,
                                b:'头球成功次数',
                                c:headBallNum.c,
                                pa: headBallNum.pa,
                                pc: headBallNum.pc
                            },{
                                a:retrieve.a,
                                b:'救球',
                                c:retrieve.c,
                                pa: retrieve.pa,
                                pc: retrieve.pc
                            },{
                                a:tackle.a,
                                b:'阻截',
                                c:tackle.c,
                                pa: tackle.pa,
                                pc: tackle.pc
                            }]
                            
                        }
                    // }
                }
            } catch (err) {
                
            }
        },
        getSting(r){
            let f={a:0,c:0,z:1,pa:0,pc:0}
            if (!r) return f
            let list = r.split(',')
            if(list && list.length && list.length ==2){
                f.a = parseInt(list[0])
                f.c = parseInt(list[1])
                f.z = f.a + f.c
                if (f.z > 0) {
                    f.pa = (f.a / f.z * 10).toFixed(0)
                    f.pc = (f.c / f.z * 10).toFixed(0)
                }
            }
            return f
        },
        getControl(r) {
            let f={ca:0,cc:0,z:1,pa:0,pc:0}
            if (!r) return f
            let list = r.split(',')
            if(list && list.length && list.length ==2){
                f.ca = parseInt(list[0])
                f.cc = parseInt(list[1])
                f.z = f.ca + f.cc
                if (f.z > 0) {
                    f.ca = (f.ca / f.z * 100).toFixed(0)
                    f.cc = (f.cc / f.z * 100).toFixed(0)
                }
            }
            return f
        },
        getNumber(h,a){
            let n = h + a
            let s = 0
            if (n > 0) {
                s = h / n *  10
            }
            return s.toFixed(0)
        },
    }
}
</script>
<style scoped>
    .__ag__race_main__ {
        width: 750px;
        background-color: #fff;
    }
</style>