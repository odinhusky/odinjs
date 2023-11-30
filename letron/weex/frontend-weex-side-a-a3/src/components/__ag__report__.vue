<template>
  <div class="__ag__report__" v-if="isreport1">
    <div class="__ag__reporttab__">
      <div class="__ag__reporttitle__">
        <text class="__ag__reporttitletext__">举报</text>
        <text class="__ag__reporttitletext__ iconfont" @click="onclose"
          >&#xe64b;</text
        >
      </div>
      <div class="__ag__reportbody__">
        <div
          class="__ag__reportcontent__"
          v-for="(item, index) in reportList"
          @click="__ag__ontabreport__(index + 1)"
          :key="'rt' + index"
        >
          <div class="__ag__resportcellon__" v-if="tab != index + 1"></div>
          <text
            class="iconfont __ag__resportcellonclass__"
            v-if="tab == index + 1"
            >&#xe682;</text
          >
          <text class="__ag__reportcontenttext__">{{ item }}</text>
        </div>
      </div>
      <div class="__ag__reportbottom__">
        <div class="__ag__reportbottomqx__" @click="onclose">
          <text class="__ag__reportbottomtext__">取消</text>
        </div>
        <div class="__ag__reportbottomwc__" @click="__ag__onReport__">
          <text class="__ag__reportbottomwctext__">完成</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import __ag__sportApi__ from "./__ag__sport_api__.js"
import __ag__sport from "./__ag__sport__.js"
import util from "./util.js"
export default {
  props: {
    roomId: {
      type: Number,
      default: 0,
    },
    isreport: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      reportList: ["涉黄涉赌內容", "涉政内容", "其他不良内容"],
      tab: 0,
      isreport1: false,
    }
  },
  watch: {
    isreport(n) {
      util.message(this.isreport1)
      this.isreport1 = n
    },
  },
  mounted() {
    this.isreport1 = this.isreport
  },
  methods: {
    onclose() {
      this.isreport1 = false
      this.tab = 0

      this.$emit("onclose")
    },
    __ag__ontabreport__(i) {
      if (this.tab == i) {
        this.tab = 0
        return
      }
      this.tab = i
    },
    __ag__onReport__() {
      if (this.tab == 0) {
        util.message("请选择举报选项")
        return
      }
      __ag__sportApi__
        .editRoomReport({ roomId: this.roomId, type: this.tab })
        .then((resp) => {
          // this.$emit('onreport')
          this.isreport1 = false
          this.tab = 0
          this.$emit("onclose")
          util.message(
            "我们会在24小时内处理，超管确认违规后对内容进行相应处理！"
          )
        })
        .catch((err) => {
          console.log("__ag__onReport__ =>", util.toStirng(err))
          if (err && err.message) {
            // if (err.message === "未登录") {
            //   __ag__sport.__ag__infoUser_editGuest__()
            // } else {
            util.message(util.toStirng(err.message))
            // }
          }
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.__ag__report__ {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 750px;
  background-color: @halfBlack;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__reporttab__ {
  margin-left: 60px;
  margin-right: 60px;
  width: 630px;
  background-color: @white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  /* height: 286px; */
}
.__ag__reporttitle__ {
  width: 630px;
  height: 60wx;
  background-color: #2b2b2b;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
}
.__ag__reporttitletext__ {
  color: @white;
  font-style: normal;
  font-weight: 900;
  font-size: 20wx;
}
.__ag__reportbody__ {
  height: 136wx;
  width: 630px;
  padding: 20px;
  padding-bottom: 0px;
}
.__ag__reportcontent__ {
  display: flex;
  flex-direction: row;
  height: 24wx;
  margin-bottom: 20wx;
}
.__ag__resportcellon__ {
  width: 23wx;
  height: 23wx;
  font-size: 24wx;
  border-radius: 17wx;
  border-style: solid;
  border-width: 1px;
  border-color: @black;
  opacity: 0.3;
  margin-right: 16wx;
  cursor: pointer;
}
.__ag__reportcontenttext__ {
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
  text-align: center;
  color: @black;
}
.__ag__resportcellonclass__ {
  font-size: 23wx;
  color: @primary;
  margin-right: 16wx;
  cursor: pointer;
}
.__ag__reportbottom__ {
  height: 60wx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.__ag__reportbottomwc__ {
  width: 250px;
  height: 40wx;
  border-radius: 4px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  background-color: @primary;
}
.__ag__reportbottomwctext__ {
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  color: @white;
}
.__ag__reportbottomqx__ {
  width: 250px;
  height: 40wx;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 20px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}
.__ag__reportbottomtext__ {
  font-style: normal;
  font-weight: 500;
  font-size: 17wx;
  color: rgba(0, 0, 0, 0.3);
}
</style>
