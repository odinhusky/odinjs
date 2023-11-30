<template>
  <div class="__ag__record__">
    <ag-recordtitle name="数据对比"></ag-recordtitle>
    <ag-comparison
      :awin="awin"
      :bwin="bwin"
      :incomeLive="incomeLive"
      :scheduleClass="scheduleClass"
    ></ag-comparison>
    <ag-recordtitle name="交锋历史" v-if="info.status < 2"></ag-recordtitle>
    <ag-teamname
      :incomeLive="incomeLive"
      :tips="tipText"
      v-if="info.status < 2"
    ></ag-teamname>
    <ag-historyprogress :win="cwin" v-if="info.status < 2"></ag-historyprogress>
    <ag-confrontationList
      v-if="info.status < 2 && recordList1 && recordList1.length"
      :scheduleClass="scheduleClass"
      :recordList="recordList1"
      :teamName="teamNamea"
    ></ag-confrontationList>
    <ag-recordtitle v-if="info.status < 2" name="近期战绩"></ag-recordtitle>
    <ag-teamrecord
      v-if="info.status < 2"
      :isDefeat="true"
      :win="awin"
      :teamName="teamNamea"
      :isTeamName="true"
      teamType="1"
      :image="incomeLive && incomeLive.teamFlaga"
    ></ag-teamrecord>
    <ag-confrontationList
      v-if="info.status < 2"
      :recordList="recordList2"
      :scheduleClass="scheduleClass"
      :teamName="teamNamea"
    ></ag-confrontationList>
    <ag-teamrecord
      v-if="info.status < 2"
      :isDefeat="true"
      :win="bwin"
      :teamName="teamNameb"
      :isTeamName="true"
      teamType="2"
      :image="incomeLive && incomeLive.teamFlagb"
    ></ag-teamrecord>
    <ag-confrontationList
      v-if="info.status < 2"
      :recordList="recordList3"
      :scheduleClass="scheduleClass"
      :teamName="teamNameb"
    ></ag-confrontationList>
  </div>
</template>

<script>
import teamname from "./__ag__teamName__.vue"
import comparison from "./__ag__comparison__.vue"
import historyProgress from "./__ag__historyProgress__.vue"
import confrontationList from "./__ag__confrontationList__.vue"
import recordtitle from "./__ag__recordtitle__.vue"
import teamrecord from "./__ag__teamrecord__.vue"
import __ag__sportApi__ from "./__ag__sport_api__.js"
export default {
  props: {
    scheduleClass: {
      type: Number,
      default: undefined,
    },
    status: {
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
    tab: {
      type: Number,
      default: 0,
    },
  },
  components: {
    "ag-teamname": teamname,
    "ag-comparison": comparison,
    "ag-historyprogress": historyProgress,
    "ag-confrontationList": confrontationList,
    "ag-recordtitle": recordtitle,
    "ag-teamrecord": teamrecord,
  },
  data() {
    return {
      listLastMatching: false,
      info1: {},
      teamIda: "",
      teamIdb: "",
      awin: {
        win: 0,
        ping: 0,
        fu: 0,
        awin: 0,
        bwin: 0,
        afu: 0,
        bfu: 0,
        sl: 0,
        ping6: 0,
        win6: 0,
        fu6: 0,
        jq: 0,
        sq: 0,
      },
      bwin: {
        win: 0,
        ping: 0,
        fu: 0,
        awin: 0,
        bwin: 0,
        afu: 0,
        bfu: 0,
        sl: 0,
        ping6: 0,
        win6: 0,
        fu6: 0,
        jq: 0,
        sq: 0,
      },
      cwin: {
        win: 0,
        ping: 0,
        fu: 0,
        awin: 0,
        bwin: 0,
        afu: 0,
        bfu: 0,
        sl: 0,
        ping6: 0,
        win6: 0,
        fu6: 0,
        jq: 0,
        sq: 0,
      },
      LastMatchList: [],
      teamNamea: "",
      teamNameb: "",
      recordList1: [],
      recordList2: [],
      recordList3: [],
    }
  },
  watch: {
    info(n) {
      this.info1 = n
      this.getInfo()
    },
    tab(t) {
      if (t == 6) {
        this.getInfo()
      }
    },
  },
  mounted() {
    this.info1 = this.info
    this.getInfo()
  },
  computed: {
    tipText() {
      let tips = "最近" + this.recordList1.length + "场交锋"
      return tips
    },
  },
  methods: {
    getInfo() {
      if (!this.info1 || !this.info1.id) {
        return
      }
      this.teamIdb = this.info1.teamIdb
      this.listLastMatch(this.teamIdb)
      this.teamIda = this.info1.teamIda
      this.listLastMatch(this.teamIda)
      this.teamNamea = this.info1.teamNamea
      this.teamNameb = this.info1.teamNameb
      this.listLastMatch(this.teamIda, this.teamIdb)
    },
    listLastMatch(teamId, teamIdb) {
      __ag__sportApi__
        .listLastMatch({ teamId, teamIdb })
        .then((resp) => {
          if (teamIdb) {
            this.recordList1 = resp.data
            this.winning(resp.data, "", this.cwin)
            return
          } else {
            if (teamId == this.teamIda) {
              this.recordList2 = resp.data

              this.winning(resp.data, teamId, this.awin)

              return
            }
            if (teamId == this.teamIdb) {
              this.recordList3 = resp.data
              this.winning(resp.data, teamId, this.bwin)
              return
            }
          }
        })
        .catch((res) => {})
    },
    winning(list, id, ywin) {
      let win = 0
      let ping = 0
      let fu = 0
      let awin = 0
      let afu = 0
      let bwin = 0
      let bfu = 0
      let scorea = 0
      let scoreb = 0
      let win6 = 0
      let ping6 = 0
      let fu6 = 0
      for (let i in list) {
        let r = list[i]
        if (id) {
          scorea += r.scorea
          scoreb += r.scoreb
          if (i <= 5) {
            win6 += r.teamIda == id && r.scorea > r.scoreb ? 1 : 0
            win6 += r.teamIdb == id && r.scorea < r.scoreb ? 1 : 0
            ping6 += r.scorea == r.scoreb ? 1 : 0
            fu6 += r.teamIda == id && r.scorea < r.scoreb ? 1 : 0
            fu6 += r.teamIdb == id && r.scorea > r.scoreb ? 1 : 0
          }
          win += r.teamIda == id && r.scorea > r.scoreb ? 1 : 0
          win += r.teamIdb == id && r.scorea < r.scoreb ? 1 : 0
          ping += r.scorea == r.scoreb ? 1 : 0
          fu += r.teamIda == id && r.scorea < r.scoreb ? 1 : 0
          fu += r.teamIdb == id && r.scorea > r.scoreb ? 1 : 0
          awin += r.teamIda == id && r.scorea > r.scoreb ? 1 : 0
          bwin += r.teamIdb == id && r.scorea > r.scoreb ? 1 : 0
          afu += r.teamIda == id && r.scorea < r.scoreb ? 1 : 0
          bfu += r.teamIdb == id && r.scorea < r.scoreb ? 1 : 0
        } else {
          // 交锋
          win += r.scorea > r.scoreb ? 1 : 0
          ping += r.scorea == r.scoreb ? 1 : 0
          fu += r.scorea < r.scoreb ? 1 : 0
        }
      }
      ywin.win = win
      ywin.ping = ping
      ywin.fu = fu
      ywin.awin = awin
      ywin.bwin = bwin
      ywin.afu = afu
      ywin.bfu = bfu
      ywin.jq = (scorea / 10).toFixed(1)
      ywin.sq = (scoreb / 10).toFixed(1)
      ywin.win6 = win6
      ywin.ping6 = ping6
      ywin.fu6 = fu6
      let total = win + ping + fu
      if (total) {
        ywin.sl = ((win * 100) / total).toFixed(1) + "%"
      }
    },
  },
}
</script>

<style>
.__ag__record__ {
  /* flex: 1; */
  display: flex;
  flex-direction: column;
}
</style>
