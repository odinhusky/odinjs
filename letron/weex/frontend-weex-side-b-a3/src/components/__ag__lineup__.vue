<template>
  <div class="__ag__lineup__">
    <ag-recordtitle
      v-if="status == 2 && scheduleClass == 4"
      name="本场最佳"
    ></ag-recordtitle>
    <div
      class="__ag__bczj__"
      v-if="status == 2 && scheduleClass == 4 && bestList && bestList.length"
    >
      <ag-lineupbestgame
        v-for="(item, index) in bestList"
        :item="item"
        :key="'b' + index"
      ></ag-lineupbestgame>
    </div>
    <div
      v-if="
        status == 2 && scheduleClass == 4 && (!bestList || !bestList.length)
      "
      class="__ag__not__"
    >
      <text class="__ag__nottext__">暂无信息</text>
    </div>
    <ag-teamlineupList
      :scheduleClass="scheduleClass"
      :item="incomeLive"
      :lineupList="lineupList"
    ></ag-teamlineupList>
    <div
      class="__ag__lineupcontent__"
      v-if="
        (status == 0 && scheduleClass == 4) ||
        (status == 2 && scheduleClass == 5) ||
        (status == 0 && scheduleClass == 5)
      "
    >
      <ag-recordtitle name="首发阵容"></ag-recordtitle>
      <ag-teamname :incomeLive="incomeLive" :tips="tipText"></ag-teamname>
      <ag-linupplayerlist
        :incomeLive="incomeLive"
        :list="startingList"
        :scheduleClass="scheduleClass"
        :isStarting="true"
      ></ag-linupplayerlist>
      <ag-recordtitle name="替补阵容"></ag-recordtitle>
      <ag-teamname :incomeLive="incomeLive" :tips="tipText"></ag-teamname>
      <ag-linupplayerlist
        :incomeLive="incomeLive"
        :list="substituteList"
        :scheduleClass="scheduleClass"
        :isStarting="true"
      ></ag-linupplayerlist>
    </div>
    <div class="__ag__lineupcontent__" v-if="status == 2 && scheduleClass == 4">
      <ag-teamrecord
        :isDefeat="false"
        :teamName="incomeLive.teamNamea"
        :image="incomeLive.teamFlaga"
        :isTeamName="true"
      ></ag-teamrecord>
      <ag-teamtitle></ag-teamtitle>
      <div
        class="__ag__teamitem__"
        v-if="homePlayerList && homePlayerList.length"
      >
        <ag-teamscoreitem
          v-for="(item, index) in homePlayerList"
          :item="item"
          :key="'l' + index"
        ></ag-teamscoreitem>
      </div>
      <div v-else class="__ag__not__">
        <text class="__ag__nottext__">暂无信息</text>
      </div>
      <ag-teamrecord
        :isDefeat="false"
        :teamName="incomeLive.teamNameb"
        :image="incomeLive.teamNameb"
        :isTeamName="true"
      ></ag-teamrecord>
      <ag-teamtitle></ag-teamtitle>
      <div
        class="__ag__teamitem__"
        v-if="awayPlayerList && awayPlayerList.length"
      >
        <ag-teamscoreitem
          v-for="(item, index) in awayPlayerList"
          :item="item"
          :key="'l' + index"
        ></ag-teamscoreitem>
      </div>
      <div v-else class="__ag__not__">
        <text class="__ag__nottext__">暂无信息</text>
      </div>
    </div>
    <ag-recordtitle name="伤停信息"></ag-recordtitle>
    <ag-teamname :incomeLive="incomeLive" :tips="tipText"></ag-teamname>
    <ag-linupplayerlist
      :incomeLive="incomeLive"
      v-if="list2 && list2.length"
      :list="list2"
      :scheduleClass="scheduleClass"
      :isStarting="true"
    ></ag-linupplayerlist>
    <div v-else class="__ag__not__">
      <text class="__ag__nottext__">暂无信息</text>
    </div>
  </div>
</template>

<script>
import teamlineupList from "./__ag__teamlineupList__.vue"
import recordtitle from "./__ag__recordtitle__.vue"
import teamname from "./__ag__teamName__.vue"
import linupPlayerList from "./__ag__linupPlayerList__.vue"
import lineupbestgame from "./__ag__lineupbestgame__.vue"
import minix from "./__ag__minix__.js"
import teamrecord from "./__ag__teamrecord__.vue"
import teamTitle from "./__ag__teamScoreTitle__.vue"
import teamScoreItem from "./__ag__teamScoreItem__.vue"
export default {
  mixins: [minix],
  components: {
    "ag-teamlineupList": teamlineupList,
    "ag-recordtitle": recordtitle,
    "ag-teamname": teamname,
    "ag-linupplayerlist": linupPlayerList,
    "ag-lineupbestgame": lineupbestgame,
    "ag-teamrecord": teamrecord,
    "ag-teamtitle": teamTitle,
    "ag-teamscoreitem": teamScoreItem,
  },
  props: {
    scheduleClass: {
      type: Number,
      default: undefined,
    },
    status: {
      type: Number,
      default: undefined,
    },
    tab: {
      type: Number,
      default: undefined,
    },
    matchId: {
      type: String,
      default: "",
    },
    info: {
      type: Object,
      default: function () {
        return {}
      },
    },
    incomeLive: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      tipText: "VS",
      startingList: [{ list: [] }, { list: [] }],
      substituteList: [{ list: [] }, { list: [] }],
      bestList: [],
      homePlayerList: [],
      awayPlayerList: [],
      list2: [],
      playerMap: {},
      lineupMap: {},
      lineupList: [],
    }
  },
  watch: {
    tab(t) {
      if (t == 7) {
        this.getListMatchLineup()
      }
    },
  },
  mounted() {
    this.getListMatchLineup()
  },
  methods: {
    async getListMatchLineup() {
      try {
        let resp = await this.__ag__listMatchLineup__({ matchId: this.matchId })

        let l = resp.data
        await this.getListPlayerTechnic()
        if (!l && !l.length) {
          return
        }
        l.forEach((r) => {
          this.lineupMap[r.playerId] = r
          if (r.positionId) {
            r.position =
              r.positionId >= 0 && r.positionId <= 5
                ? ["守门员", "后卫", "后腰", "中场", "前腰", "前锋"][
                    r.positionId
                  ]
                : "-"
          }

          let p = this.playerMap[r.playerId] || {}

          if (p.goals) {
            r.score = p.goals
          }

          r.player = p
        })
        let h = l.filter((r) => {
          if (!r) {
            return false
          }
          return (
            r.lineupType == 0 ||
            r.lineupType == 1 ||
            r.lineupType == "home" ||
            r.lineupType == "away"
          )
        })
        this.lineupList = h

        let a = l.filter((r) => {
          if (!r) {
            return false
          }
          return (
            r.lineupType == 2 ||
            r.lineupType == 3 ||
            r.lineupType == "homeBackup" ||
            r.lineupType == "awayBackup"
          )
        })
        let hsl = []
        let hst = []
        let asl = []
        let ast = []
        for (let i in h) {
          let t = h[i]
          if (t.lineupType == "0") {
            hsl.push(h[i])
            continue
          }
          if (t.lineupType == "1") {
            hst.push(h[i])
            continue
          }
        }

        for (let i in a) {
          let t = a[i]
          if (t.lineupType == "2") {
            asl.push(a[i])
            continue
          }
          if (t.lineupType == "3") {
            ast.push(a[i])
            continue
          }
        }
        this.startingList[0].list = hsl
        this.startingList[1].list = hst
        this.substituteList[0].list = asl
        this.substituteList[1].list = ast
      } catch (error) {}
    },
    async getListPlayerTechnic() {
      try {
        let resp = await this.__ag__listPlayerTechnic__({
          matchId: this.matchId,
        })
        let l = resp.data
        if (!l && !l.length) {
          return
        }
        l.forEach((r) => {
          this.playerMap[r.playerId] = r
          let p = this.lineupMap[r.playerId]
          r.name = p ? p.name : "#" + r.playerId
          r.rebound =
            parseInt(r.offensiveRebound) + parseInt(r.defensiveRebound)
        })
        let hp = l.filter((r) => {
          if (!r) {
            return false
          }
          return r.type == 0
        })
        let aw = l.filter((r) => {
          if (!r) {
            return false
          }
          return r.type == 1
        })

        let homeList = hp.sort(this.sortBest("playtime"))
        let awayList = aw.sort(this.sortBest("playtime"))

        if (!homeList || !homeList.length) {
          homeList = []
        }

        if (!awayList || !awayList.length) {
          awayList = []
        }

        this.homePlayerList = this.playerListReduce(homeList)
        this.awayPlayerList = this.playerListReduce(awayList)
        let bl = []

        for (let i in this.homePlayerList) {
          if (i == 0) {
            let homeBestScore = this.homePlayerList.sort(this.sortBest("score"))
            let r = homeBestScore[0]
            bl.push({
              namea: r.name,
              scroea: r.score,
              textType: "得分",
              nameb: "",
              scroeb: 0,
            })
          }
          if (i == 1) {
            let homeBestAssist = this.homePlayerList.sort(
              this.sortBest("assist")
            )
            let r = homeBestAssist[0]
            bl.push({
              namea: r.name,
              scroea: r.assist,
              textType: "助攻",
              nameb: "",
              scroeb: 0,
            })
          }
          if (i == 2) {
            let homeBestRebound = this.homePlayerList.sort(
              this.sortBest("rebound")
            )
            let r = homeBestRebound[0]
            bl.push({
              namea: r.name,
              scroea: r.rebound,
              textType: "篮板",
              nameb: "",
              scroeb: 0,
            })
          }
        }
        for (let i in this.awayPlayerList) {
          if (i == 0) {
            let awayBestScore = this.awayPlayerList.sort(this.sortBest("score"))
            let r = awayBestScore[0]
            let br = bl[i]
            if (br) {
              br.nameb = r.name
              br.textType = "得分"
              br.scroeb = r.score
            } else {
              bl.push({
                namea: "",
                scroea: 0,
                textType: "得分",
                nameb: r.name,
                scroeb: r.score,
              })
            }
          }
          if (i == 1) {
            let awayBestAssist = this.awayPlayerList.sort(
              this.sortBest("assist")
            )
            let r = awayBestAssist[0]
            let br = bl[i]
            if (br) {
              br.nameb = r.name
              br.textType = "助攻"
              br.scroeb = r.assist
            } else {
              bl.push({
                namea: "",
                scroea: 0,
                textType: "助攻",
                nameb: r.name,
                scroeb: r.assist,
              })
            }
          }
          if (i == 2) {
            let awayBestRebound = this.awayPlayerList.sort(
              this.sortBest("rebound")
            )
            let r = awayBestRebound[0]
            let br = bl[i]
            if (br) {
              br.nameb = r.name
              br.textType = "篮板"
              br.scroeb = r.rebound
            } else {
              bl.push({
                namea: "",
                scroea: 0,
                textType: "篮板",
                nameb: r.name,
                scroeb: r.rebound,
              })
            }
          }
        }
        this.bestList = bl
      } catch (error) {}
    },
    playerListReduce(arr) {
      let obj = {}

      let arrs = arr.reduce(function (item, next) {
        obj[next.playerId] ? "" : (obj[next.playerId] = true && item.push(next))
        return item
      }, [])
      return arrs
    },
    sortBest(property) {
      return function (a, b) {
        let s1 = a[property]
        let s2 = b[property]
        return parseInt(s2) - parseInt(s1)
      }
    },
    sortList(type) {
      return function (obj1, obj2) {
        var val1 = obj1[type]
        var val2 = obj2[type]
        return val1 - val2
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/theme.less";
.__ag__lineup__ {
  padding-top: 20px;
  width: 750px;
  background-color: @white;
}
.__ag__lineupcontent__ {
  flex: 1;
}
.__ag__not__ {
  flex: 1;
  height: 100px;
  align-items: center;
  justify-content: center;
}
.__ag__nottext__ {
  font-size: 15wx;
  color: @black;
}
.__ag__bczj__ {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
}
.__ag__teamitem__ {
  flex: 1;
  flex-direction: column;
}
</style>
