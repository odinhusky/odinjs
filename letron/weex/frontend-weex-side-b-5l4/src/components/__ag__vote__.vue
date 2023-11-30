<template>
  <div
    class="__ag__vote__"
    :style="voteStyle"
    v-if="isVotes && tab == 0 && keyboardSize == '0px'"
  >
    <text class="agiconfont __ag__voteclose__" @click="onclose">&#xe615;</text>
    <div class="__ag__votecontent__">
      <div class="__ag__votetitle__">
        <text class="__ag__votetitletext__">{{ vote.title }}</text>
      </div>
      <div class="__ag__votebottomcontent__">
        <text class="agiconfont __ag__votecount__">&#xe605;</text>
        <text class="__ag__voteprogresstext__">{{ vote.countAB }}</text>
        <text class="__ag__voteprogresstext__">已参与</text>
      </div>
      <div class="__ag__votebody__">
        <div class="__ag__voteprogress__">
          <div class="__ag__voteprogress_item__" :style="{ flex: vote.classA }">
            <div
              class="__ag__voteprogressleft__"
              :class="[
                this.vote.classA == '.3' ? '__ag__voteprogressleft_3__' : '',
              ]"
            >
              <text class="__ag__voteprogress_text__"
                >{{ vote.progressA }}%</text
              >
            </div>
            <div
              class="__ag__vote_lf_line__"
              :class="[this.vote.classA == '.3' ? '__ag__vote_linea_3__' : '']"
            ></div>
          </div>
          <div class="__ag__voteprogress_item__" :style="{ flex: vote.classB }">
            <div
              class="__ag__voteprogressright__"
              :class="[
                this.vote.classB == '.3' ? '__ag__voteprogressright_3__' : '',
              ]"
            >
              <text class="__ag__voteprogress_text__"
                >{{ vote.progressB }}%</text
              >
            </div>
            <div
              class="__ag__vote_rg_line__"
              :class="[this.vote.classB == '.3' ? '__ag__vote_lineb_3__' : '']"
            ></div>
          </div>
        </div>
        <div class="__ag__voteoption__">
          <text class="__ag__voteoptionleft__">{{ vote.optionA }}</text>
          <text class="__ag__voteoptionright__">{{ vote.optionB }}</text>
        </div>
      </div>
      <div class="__ag__votebottom__">
        <div class="__ag__bottomleft__">
          <text
            class="__ag__votebottom_lf_text__"
            v-if="vote.isCountA"
            :class="[!vote.isCountB ? 'pointer' : '']"
            @click="onCount(1)"
            >{{ voteName }}</text
          >
        </div>

        <div class="__ag__bottom_center__">
          <text class="__ag__votetitletime__" v-if="vote.timeout > 0"
            >{{ vote.timeout }}s</text
          >
          <text class="__ag__votetitleend__" v-if="vote.timeout < 0">{{
            timeout
          }}</text>
        </div>

        <div class="__ag__bottomright__">
          <text
            class="__ag__votebottom_rg_text__"
            v-if="vote.isCountB"
            :class="[!vote.isCountA ? 'pointer' : '']"
            @click="onCount(2)"
            >{{ voteName }}</text
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import agMinix from "./__ag__minix__.js"

import vars from "./vars.js"
import util from "./util.js"

export default {
  mixins: [agMinix],
  props: {
    roomId: {
      type: Number,
      default: 0,
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
    tab: {
      type: Number,
      default: 0,
    },
    keyboardSize: {
      type: String,
      default: "",
    },
    voteItem: {
      type: Object,
      default: function () {
        return {}
      },
    },
    fullDevice: {
      type: Object,
      default: function () {
        return { width: 0, height: 0 }
      },
    },
    showVote: {
      type: Boolean,
      default: false,
    },
    isVote: {
      type: Boolean,
      default: false,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vote: {},
      timeout: "已结束",
      timer: 0,
      vars,
      answer: 0,
      isCountB: true,
      isCountA: true,
      countAB: 0,
      voteing: false,
      voteName: "投票",
      timeTimer: false,
    }
  },
  watch: {
    voteItem(n) {
      this.vote = n
      this.__ag__pagesVote__()
    },
    isVote(n) {
      if (n) {
        this.__ag__setTimeout__()
      }
    },
  },
  computed: {
    isVotes() {
      return this.isVote
    },
    voteStyle() {
      let style = {}
      let lf = this.fullDevice.height.toFixed(2) - 660
      if (this.isFull) {
        style.left = lf / 2 + "px"
        style.top = "120px"
      } else {
        style.left = "0px"
        style.top = "108px"
      }

      return style
    },
  },
  async mounted() {
    this.vote = this.voteItem
  },
  destroyed() {
    // this.__ag__resultVote__()
  },
  methods: {
    __ag__loadData__() {
      let that = this
      const msg = new BroadcastChannel("msg")
      msg.onmessage = function (event) {
        that.__ag__onmsg__(event.data)
      }
    },
    __ag__onAnswer__() {
      this.voteName = "已投票"
      if (this.answer == 1) {
        this.isCountB = false
        this.vote.isCountB = false
      } else {
        this.isCountA = false
        this.vote.isCountA = false
      }
    },
    __ag__onmsg__(resp) {
      if (!resp) {
        return
      }
      for (let i in resp) {
        let item = resp[i]
        if (item.index == 1) {
          return
        }
        //投票消息
        if (item.type == vars.TYPE_VOTE) {
          // this.vote=item
          this.__ag__voteUser__(item)
          return
        }

        //用户投票消息
        if (item.type == vars.TYPE_VOTE_USER) {
          // this.vote=item
          this.__ag__voteUser__(item)
          return
        } //投票结束消息
        if (item.type == vars.TYPE_VOTE_RESULT) {
          // this.vote=item

          this.isCountA = true
          this.isCountB = true
          this.vote.isCountA = true
          this.vote.isCountB = true
          this.voteName = "投票"
          // if (item.timeout == 0) {
          this.__ag__addMessageVote__()
          // }
          this.__ag__resultVote__()
          return
        }
      }
    },
    __ag__resultVote__() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = 0
      }
      if (this.timeTimer) {
        clearTimeout(this.timeTimer)
        this.timeTimer = false
      }
      this.$emit("resultVote")
    },
    __ag__voteUser__(item) {
      this.vote.id = item.id
      if (item.type == vars.TYPE_VOTE) {
        this.vote.title = item.title
        this.vote.optionA = item.optionA
        this.vote.optionB = item.optionB
        this.vote.countA = 0
        this.vote.countB = 0
        this.vote.timeout = item.timeout
        this.vote.createTime = item.createTime
        this.__ag__getCode__()
      } else {
        this.vote.countA = item.optionA
        this.vote.countB = item.optionB
      }
      this.vote.createTime = item.createTime
      this.__ag__count__()
    },
    async __ag__pagesVote__() {
      this.__ag__getVote__()
      this.__ag__count__()
    },
    async onCount(answer) {
      if (!this.user || this.user.userType == 3) {
        this.$emit("full", 0)
        if (!this.ivx) {
          util.setLandscape(0)
        }
        util.getPush("__ag__login__")
        return
      }
      if (this.vote.timeout <= 0) {
        util.message("时间已过不能再投票")
        return
      }
      if (answer == 1 && !this.isCountB) {
        return
      }
      if (answer == 2 && !this.isCountA) {
        return
      }
      if (this.voteing) {
        return
      }
      this.voteing = true
      if (answer == 1) {
        this.vote.countA++
      } else {
        this.vote.countB++
      }
      this.__ag__count__()
      let f = {
        voteId: this.vote.id,
        answer: answer,
      }
      try {
        let resp = await this.__ag__editVoteUser__(f)

        if (resp.success) {
          util.message("投票成功")
          this.answer = answer
          this.__ag__onAnswer__()
        }
        this.voteing = false
      } catch (err) {
        this.voteing = false
        // util.message("asdada")
      }
    },
    __ag__count__() {
      if (!this.vote) {
        return
      }
      this.countAB = this.vote.countA * 1 + this.vote.countB * 1
      this.vote.countAB = this.vote.countA * 1 + this.vote.countB * 1
      if (this.countAB != 0) {
        let classA = ((this.vote.countA / this.countAB) * 10).toFixed(0)
        let classB = ((this.vote.countB / this.countAB) * 10).toFixed(0)
        this.vote.progressA = ((this.vote.countA / this.countAB) * 100).toFixed(
          0
        )
        this.vote.progressB = ((this.vote.countB / this.countAB) * 100).toFixed(
          0
        )
        if (classA == 0 || classB == 0) {
          if (classA == 0) {
            this.vote.classB = "1"
            this.vote.classA = ".3"
          } else if (classB == 0) {
            this.vote.classB = ".3"
            this.vote.classA = "1"
          }
        } else {
          if (classA < 3) {
            this.vote.classA = ".3"
          } else if (classA > 7) {
            this.vote.classA = ".7"
          } else {
            this.vote.classA = "." + classA
          }

          if (classB < 3) {
            this.vote.classB = ".3"
          } else if (classB > 7) {
            this.vote.classB = ".7"
          } else {
            this.vote.classB = "." + classB
          }
        }
        // this.vote.classA = this.__ag__iscount__(classA)
        // this.vote.classB =this.__ag__iscount__(classB)
      } else {
        this.vote.classA = ".5"
        this.vote.classB = ".5"
      }
    },
    __ag__getVote__() {
      if (this.vote && this.vote.status == 1) {
        if (this.vote.joinMap.u.answer) {
          this.answer = this.vote.joinMap.u.answer
          this.__ag__onAnswer__()
        }
        if (this.vote.timeout > 0) {
          this.__ag__getCode__()
        }
        if (this.vote.timeout < 0) {
          this.__ag__endVote__()
          this.__ag__count__()
          this.__ag__endMessageVote__()
          return
        }
      }
      this.__ag__count__()
    },
    __ag__getLocalTime__() {
      let timezone = 8
      let offset_GMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
      let nowDate = new Date().getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
      let targetDate = new Date(
        nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
      )
      return targetDate
    },
    __ag__getCode__() {
      // this.answer = this.vote.joinMap.u.answer
      // util.message(util.toString(this.vote))
      if (!this.vote.timeout) return
      let createTime = util.parseDate(this.vote.createTime)
      let nDate = this.__ag__getLocalTime__()
      let timeout =
        createTime.getTime() / 1000 + this.vote.timeout - nDate.getTime() / 1000
      // this.vote.timeout = Math.floor(timeout)
      this.vote.timeout = timeout ^ 0
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = 0
      }
      this.timer = setInterval(() => {
        this.vote.timeout--
        if (this.vote.timeout == 0) {
          this.vote.timeout = -1
          if (this.timer) {
            clearInterval(this.timer)
            this.timer = 0
          }
          this.__ag__addMessageVote__()
          this.__ag__endVote__()
        }
      }, 1000)
    },
    __ag__endMessageVote__() {
      let item = {}
      item.messageType = 1
      item.type = vars.TYPE_VOTE_RESULT
      item.title = this.vote.title
      item.countAB = this.countAB
      item.countA = this.vote.countA
      item.countB = this.vote.countB
      item.classA = this.vote.classA
      item.classB = this.vote.classB
      item.optionA = this.vote.optionA
      item.optionB = this.vote.optionB
      item.progressA = this.vote.progressA
      item.progressB = this.vote.progressB
      this.$emit("endMessageVote", item)
    },
    __ag__endVote__() {
      if (this.answer == 0) {
        this.isCountB = false
        this.isCountA = false
        this.vote.isCountA = false
        this.vote.isCountB = false
      }
      this.timeout = "已结束"
    },
    __ag__addMessageVote__() {
      let item = {}
      item.messageType = 1
      item.type = vars.TYPE_VOTE_RESULT
      item.title = this.vote.title
      item.countAB = this.countAB
      item.countA = this.vote.countA
      item.countB = this.vote.countB
      item.classA = this.vote.classA
      item.classB = this.vote.classB
      item.optionA = this.vote.optionA
      item.optionB = this.vote.optionB
      item.progressA = this.vote.progressA
      item.progressB = this.vote.progressB
      item.id = new Date().getTime()
      this.$emit("addMessageVote", item)
    },
    onclose() {
      if (this.timeTimer) {
        clearTimeout(this.timeTimer)
        this.timeTimer = false
      }
      this.$emit("voteClose")
    },
    __ag__setTimeout__() {
      if (this.timeTimer) {
        clearTimeout(this.timeTimer)
        this.timeTimer = false
      }
      this.timeTimer = setTimeout(() => {
        this.$emit("voteClose")
      }, 10000)
    },
  },
}
</script>

<style scoped lang="less">
@import "../style/theme.less";
.__ag__vote__ {
  position: absolute;
  width: 750px;
  top: 108px;
  left: 0px;
}
.__ag__voteclose__ {
  position: absolute;
  top: -50px;
  right: 45px;
  font-size: 20wx;
  color: #fff;
  background-color: rgba(119, 55, 199, 1);
  border-radius: 50wx;
  padding: 3px;
}
.__ag__votecontent__ {
  margin-left: 45px;
  margin-right: 45px;
  width: 660px;
  border-radius: 40px;
  background-image: linear-gradient(to right, #341b77, #7f3ad1);
  box-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
  padding-bottom: 40px;
}
.__ag__votetitle__ {
  width: 660px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.__ag__votetitletext__ {
  line-height: 35px;
  text-align: center;
  flex: 1;
  font-size: 13wx;
  font-weight: 600;
  color: #fff;
  lines: 2;
  text-overflow: ellipsis;
}
.__ag__votetitletime__ {
  color: #ffd600;
  font-size: 15wx;
  text-align: center;
}
.__ag__votetitleend__ {
  color: #dd524d;
  font-size: 15wx;
  text-align: center;
}
.__ag__votebody__ {
  display: flex;
  flex-direction: column;
  width: 660px;
  padding-top: 20px;
}
.__ag__voteoption__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 35px;
}
.__ag__voteoptionleft__ {
  flex: 1;
  color: #ff5930;
  text-align: center;
  lines: 2;
  line-height: 35px;
  padding-left: 30px;
  padding-right: 10px;
  text-overflow: ellipsis;
  font-size: 13wx;
  font-weight: 600;
  text-align: left;
}
.__ag__voteoptionright__ {
  flex: 1;
  color: #0ac63f;
  lines: 2;
  line-height: 35px;
  padding-left: 10px;
  padding-right: 30px;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 13wx;
  font-weight: 600;
  text-align: right;
}
.__ag__voteprogress__ {
  height: 30wx;
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 20px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 10wx;
  justify-content: space-between;
}
.__ag__voteprogress_item__ {
  flex: 0.5;
  height: 45wx;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.__ag__voteprogressleft__ {
  flex: 1;
  height: 45wx;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  background-image: linear-gradient(to right, #ff164a, #fda440);
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 25px;
  padding-right: 30px;
}
.__ag__voteprogressleft_3__ {
  background-image: linear-gradient(to right, #ff164a, #ff164a);
}
.__ag__vote_lf_line__ {
  width: 30px;
  height: 55wx;
  background-color: #f99665;
  transform: rotate(16deg);
  position: absolute;
  right: 13px;
}
.__ag__vote_linea_3__ {
  background-color: #ff164a;
}
.__ag__votecount__ {
  color: #fff;
  font-size: 16wx;
}
.__ag__voteprogresstext__ {
  margin-right: 5wx;
  margin-left: 5wx;
  color: #fff;
  font-size: 13wx;
}
.__ag__voteprogress_text__ {
  font-size: 14wx;
  font-weight: 600;
  color: #fff;
}
.__ag__voteprogressright__ {
  flex: 1;
  height: 45wx;
  background-image: linear-gradient(to right, #00d867, #18ab00);
  display: flex;
  flex-direction: row;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  justify-content: flex-start;
  align-items: center;
  margin-left: 25px;
  padding-left: 30px;
}
.__ag__voteprogressright_3__ {
  background-image: linear-gradient(to right, #00d867, #00d867);
}
.__ag__vote_rg_line__ {
  width: 30px;
  height: 55wx;
  background-color: #00d867;
  transform: rotate(16deg);
  position: absolute;
  left: 13px;
}
.__ag__vote_lineb_3__ {
  background-color: #00d867;
}
.__ag__votebottom__ {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: 20wx;
  padding: 30px;
  padding-top: 0px;
  padding-bottom: 0px;
  align-items: center;
  justify-content: space-between;
}
.__ag__bottomleft__ {
  flex: 1;
}
.__ag__votebottom_lf_text__ {
  color: #fff;
  font-size: 12wx;
  width: 140px;
  height: 60px;
  border-radius: 60px;
  background-image: linear-gradient(to right, #ff1621, #fe993e);
  line-height: 60px;
  text-align: center;
}
.__ag__bottomright__ {
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
}
.__ag__votebottom_rg_text__ {
  color: #fff;
  font-size: 12wx;
  width: 140px;
  height: 60px;
  border-radius: 60px;
  line-height: 60px;
  text-align: center;
  background-image: linear-gradient(to right, #02d561, #19ab01);
}
.__ag__votebottomcontent__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.pointer {
  background-image: linear-gradient(to right, #a5a5a6, #dcdcdc);
}
.pointertext {
  color: #000;
}
.__ag__bottom_center__ {
  flex: 1;
  flex-direction: row;
  justify-content: center;
}
</style>
