<template>
  <div class="__ag__matchrequestitem__">
    <div class="__ag__matchcontent__" @click="onMatch">
      <div class="__ag__matchitemcontent__">
        <div class="__ag__matchitemtitle__">
          <text class="__ag__matchdatatext__">{{
            util.formatTime(dateItem.beginTime)
          }}</text>
          <text class="__ag__matchdatatext__">{{ dateItem.matchName }}</text>
        </div>
        <div class="__ag__matchstatudiv__">
          <div v-if="dateItem.islive == 1" class="__ag__statusislivediv__">
            <div class="__ag__statusyuan__"></div>
            <text class="__ag__matchstatu__ __ag__statusislive__">直播中</text>
          </div>
          <text v-else class="__ag__matchstatu__">{{
            vars.status[dateItem.status]
          }}</text>
        </div>
      </div>
      <div class="__ag__matchitemdiv__">
        <div class="__ag__matchitem__">
          <text class="__ag__matchitemtext__ __ag__matchitemtextleft__">{{
            dateItem.teamNamea
          }}</text>
          <team-logo
            teamType="1"
            :teamFlag="dateItem.teamFlaga"
            :teamName="dateItem.teamNamea"
            resize="medium"
          ></team-logo>
          <!-- <ag-userimg class="__ag__matchitemimg__" resize="contain" :avatar="dateItem.teamFlaga" :name="dateItem.teamNamea" :islive="true"></ag-userimg> -->
        </div>
        <text v-if="dateItem.islive == 1" class="__ag__matchvstext__">VS</text>
        <div class="__ag__yydiv__" v-if="dateItem.islive != 1">
          <text
            v-if="isAppoint"
            class="agiconfont __ag__notyy__"
            @click="onMakeAppointment"
            >&#xe705;</text
          >
          <image
            v-if="isUserMatch"
            resize="contain"
            :src="__ag__url__(`static/${env.brand}-yy1.png`)"
            @click="cancelAppointment"
            class="__ag__yy__"
          ></image>
        </div>
        <div class="__ag__matchitem__">
          <!-- <ag-userimg class="__ag__matchitemimg__" resize="contain" :avatar="dateItem.teamFlagb" :name="dateItem.teamNameb" :islive="true"></ag-userimg> -->
          <team-logo
            teamType="2"
            :teamFlag="dateItem.teamFlagb"
            :teamName="dateItem.teamNameb"
            resize="medium"
          ></team-logo>
          <text class="__ag__matchitemtext__">{{ dateItem.teamNameb }}</text>
        </div>
      </div>
    </div>
    <div
      class="__ag__matchup__"
      v-if="dateItem.userlist && dateItem.userlist.length > 0"
    >
      <div
        class="__ag__matchupitem__"
        @click.stop="onlive(dateItem.userlist, item, item.islive)"
        v-for="item in dateItem.userlist"
        :key="dateItem.id + item.uid"
      >
        <div class="__ag__matchupimgdiv__">
          <ag-userimg
            class="__ag__matchupimg__"
            :class="[item.islive == 1 ? '__ag__islive__' : '']"
            @itemtap="onlive(dateItem.userlist, item, item.islive)"
            :avatar="item.avatar"
            :name="item.userNicename"
          ></ag-userimg>
          <text v-if="item.islive == 1" class="__ag__matchupimgtext__"
            >直播中</text
          >
        </div>
        <text class="__ag__matchupitemtext__">{{ item.userNicename }}</text>
      </div>
    </div>
  </div>
</template>
<script>
import userimg from "./__ag__userImg__.vue"
import agMinUrl from "./__ag__minurl__.js"
import util from "./util.js"
import env from "./env.js"
import vars from "./vars.js"
import bc from "./__ag__bc__.js"
import agMinix from "./__ag__minix__.js"
import teamLogo from "./__ag__teamLogo__.vue"
export default {
  mixins: [agMinUrl, agMinix],
  components: {
    "ag-userimg": userimg,
    "team-logo": teamLogo,
  },
  props: {
    dateItem: {
      type: Object,
      default: function () {
        return {}
      },
    },
    liveUpList: {
      type: Object,
      default: function () {
        return {}
      },
    },
    userMatchMap: {
      type: Object,
      default: function () {
        return {}
      },
    },
    user: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  computed: {
    isAppoint() {
      if (this.dateItem && this.dateItem.islive && this.dateItem.islive == 1) {
        return false
      }
      let r = this.userMatchMap[this.dateItem.id]
      if (this.dateItem.status == 0 && !r) {
        return true
      }
      return false
    },
    isUserMatch() {
      if (this.dateItem && this.dateItem.islive && this.dateItem.islive == 1) {
        return false
      }
      if (!this.userMatchMap) {
        return false
      }
      let r = this.userMatchMap[this.dateItem.id]
      if (r && this.dateItem.status == 0) {
        return true
      }
      return false
    },
  },
  data() {
    return {
      vars,
      util,
      yuyurl: "static/yuy.png",
      env,
    }
  },
  methods: {
    async onMakeAppointment() {
      if (!this.user || !this.user.userType || this.user.userType == 3) {
        util.getPush("__ag__login__")
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      let id = this.dateItem.id
      try {
        let resp = await this.__ag__editUserMatch__({ scheId: id })
        this.loading = false
        if (resp.success) {
          this.loading = false
          this.$set(
            this.userMatchMap,
            resp.data.scheduleId,
            resp.data.scheduleId
          )
          bc.postMessage("makeAppoint", resp.data)
          let userMatchMap = util.getItem("userMatchMap")
          if (userMatchMap) {
            userMatchMap[resp.data.scheduleId] = {
              scheduleId: resp.data.scheduleId,
              id: resp.data.scheduleId,
            }
            util.setItem("userMatchMap", userMatchMap)
          } else {
            util.getStorageItem("userMatchMap").then((res) => {
              userMatchMap = res
              if (userMatchMap) {
                userMatchMap[resp.data.scheduleId] = {
                  scheduleId: resp.data.scheduleId,
                  id: resp.data.scheduleId,
                }
                util.setStorageItem("userMatchMap", userMatchMap)
              }
            })
          }
          util.message("预约成功")
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    async cancelAppointment() {
      if (this.loading) {
        return
      }
      this.loading = true

      let r = this.userMatchMap[this.dateItem.id]
      let id = r
      try {
        let resp = await this.__ag__removeUserMatch__({ id: id })
        this.loading = false
        if (resp.success) {
          this.loading = false
          this.$delete(this.userMatchMap, this.dateItem.id)
          bc.postMessage("cancelAppoint", { scheduleId: this.dateItem.id })
          let userMatchMap = util.getItem("userMatchMap")
          if (userMatchMap) {
            let match = userMatchMap[this.dateItem.id]
            if (match) {
              this.$delete(userMatchMap, this.dateItem.id)
            }
            util.setItem("userMatchMap", userMatchMap)
          } else {
            util.getStorageItem("userMatchMap").then((res) => {
              userMatchMap = res
              if (userMatchMap) {
                let match = userMatchMap[this.dateItem.id]
                if (match) {
                  this.$delete(userMatchMap, this.dateItem.id)
                }
                util.setStorageItem("userMatchMap", userMatchMap)
              }
            })
          }
          util.message("已取消预约")
        }
      } catch (err) {
        this.loading = false
        util.message(err.message)
      }
    },
    onlive(userlist, item, islive) {
      let uid = item.uid
      if (islive) {
        let params = {
          uid: uid,
        }
        util.getPush("__ag__live__", params)
      } else {
        let livelist = Object.values(this.liveUpList)
        if (livelist && livelist.length > 0) {
          let u = this.liveUpList[uid]
          if (u && u.id) {
            // item.islive = 1
            let i = Object.assign({}, item)
            i.islive = 1
            bc.postMessage("matchlive", { upitem: i, liveitem: u })
            return
          }
          for (let i in userlist) {
            let r = userlist[i]
            if (r.uid == uid) {
              continue
            }
            if (r.islive == 1) {
              let ru = this.liveUpList[r.uid]
              bc.postMessage("matchlive", { upitem: item, liveitem: ru })
              return
            }
          }
          let uplive = livelist[0]
          bc.postMessage("matchlive", { upitem: item, liveitem: uplive })
        } else {
          this.onMatch()
        }
      }
    },
    onMatch() {
      util.getPush("__ag__datalive__", { id: this.dateItem.id })
    },
  },
}
</script>
<style lang="less" scoped>
@import "../style/theme.less";
.__ag__matchrequestitem__ {
  width: 750px;
  padding-left: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #fff;
  margin-bottom: 1wx;
}
.__ag__matchcontent__ {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  margin-right: 10px;
}
.__ag__matchitemdiv__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 740px;
  flex: 1;
}
.__ag__matchitem__ {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.__ag__matchitemimg__ {
  width: 60px;
  height: 60px;
}
.__ag__matchitemtext__ {
  width: 160px;
  // align-items: center;
  // justify-content: center;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  font-size: 11wx;
  lines: 2;
  text-overflow: ellipsis;
  color: #000000;
  text-align: left;
  margin-left: 24px;
}
.__ag__matchitemtextleft__ {
  text-align: right;
  margin-right: 24px;
}
.__ag__matchitemcontent__ {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 740px;
  position: relative;
}
.__ag__matchstatudiv__ {
  position: absolute;
  top: 0px;
  right: 32px;
}
.__ag__statusislivediv__ {
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__statusyuan__ {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #ff3551;
  margin-right: 4px;
}
.__ag__matchitemtitle__ {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-bottom: 16px;
}
.__ag__matchdatatext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 13wx;
  color: #515151;
  margin-right: 5px;
}
.__ag__matchvstext__ {
  font-style: normal;
  font-weight: 400;
  font-size: 14wx;
  color: #515151;
  margin-bottom: 16px;
}
.__ag__matchstatu__ {
  font-style: normal;
  font-weight: 400;
  font-size: 10wx;
  color: #8c97a5;
}
.__ag__matchup__ {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.__ag__matchupitem__ {
  width: 55wx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-right: 20px;
}
.__ag__matchupitemtext__ {
  width: 55wx;
  font-style: normal;
  font-weight: 400;
  font-size: 10wx;
  color: #000000;
  margin-top: 8px;
  lines: 1;
  text-overflow: ellipsis;
  text-align: center;
}
.__ag__matchupimg__ {
  width: 80px;
  height: 80px;
}
.__ag__matchupimgdiv__ {
  width: 84px;
  height: 84px;
  position: relative;
  justify-content: center;
  align-items: center;
}
.__ag__islive__ {
  border-style: solid;
  border-width: 2wx;
  border-color: @main-color;
  border-radius: 40px;
}
.__ag__matchupimgtext__ {
  position: absolute;
  bottom: 2px;
  padding: 2px;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-style: normal;
  font-weight: 500;
  font-size: 6wx;
  color: #ffffff;
  background-color: @main-color;
}
.__ag__notyy__ {
  font-size: 22wx;
  color: #000000;
}
.__ag__yy__ {
  width: 40px;
  height: 40px;
  // font-size: 16wx;
  // color: @main-color;
}
.__ag__yydiv__ {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}
.__ag__statusislive__ {
  color: #ff3551;
}
</style>
