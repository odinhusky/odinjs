<template>
  <div class="__ag__kefu-main__">
    <ag-hbtitle :isback="true" title="帮助与反馈"></ag-hbtitle>
    <div class="__ag__kefu-contairner__" :class="[ipx ? 'kefu-ipx' : '']">
      <text class="__ag__kefu-text__">请填写您遇到的问题及建议</text>
      <div class="__ag__kefu-textarea__">
        <textarea
          class="__ag__textarea__"
          v-model="a__ag__feedContent__"
        ></textarea>
      </div>
      <div class="__ag__kefu-btn__" @click="__ag__submit__">
        <text class="__ag__kefu-btn-text__">发送</text>
      </div>
    </div>
  </div>
</template>

<script>
import a__ag__util__ from "./components/util.js"
import a__ag__env__ from "./components/env.js"
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import agMinUrl from "./components/__ag__minurl__.js"
import moduleFun from "./components/__ag__moduleFun__.js"
import module from "./components/__ag__module__.js"
export default {
  mixins: [agMinix, agMinUrl],
  components: {
    "ag-hbtitle": HbTitle,
  },
  data() {
    return {
      a__ag__env__,
      a__ag__feedContent__: "",
      a__ag__loading__: false,
    }
  },
  methods: {
    async __ag__submit__() {
      if (this.a__ag__loading__) {
        return
      }
      if (!this.a__ag__feedContent__) {
        a__ag__util__.message("请输入反馈内容")
        return
      }
      if (this.a__ag__feedContent__ == "__check__module__") {
        this.a__ag__feedContent__ = a__ag__util__.__ag__checkModule__()
        return
      }
      if (/\.zip$/.test(this.a__ag__feedContent__)) {
        this.__ag__getWGT__(this.a__ag__feedContent__)
        return
      }
      this.a__ag__loading__ = true
      try {
        let resp = await this.__ag__editFeedback__({
          content: this.a__ag__feedContent__,
        })
        this.a__ag__feedContent__ = ""
        this.a__ag__loading__ = false
        a__ag__util__.message("收到反馈，我们将在24小时内处理您的反馈")
      } catch (e) {
        this.a__ag__loading__ = false
        a__ag__util__.error(res.message)
      }
    },
    __ag__getWGT__(wgt) {
      a__ag__util__.message(wgt)
      moduleFun.__ag__download__(wgt, (e) => {
        a__ag__util__.message("下载完成")
      })
    },
  },
}
</script>

<style lang="less">
@import "./style/default.less";

.__ag__kefu-main__ {
  width: @fullWidth;
  background-color: @white;
}
.__ag__kefu-contairner__ {
  position: fixed;
  top: @contentOriginalPositionTop;
  bottom: 0px;
  width: @fullWidth;
  border-top-left-radius: @contentBorderRadius;
  border-top-right-radius: @contentBorderRadius;
  overflow: hidden;
  background-color: @white;
}
.kefu-ipx {
  top: @ipxPositionTop;
}
.__ag__kefu_image__ {
  height: 328px;
  flex-direction: row;
  justify-content: center;
}
.__ag__myimg__ {
  width: 268px;
  height: 328px;
}
.__ag__kefu-text__ {
  text-align: left;
  font-family: "Source Han Sans SC";
  font-style: normal;
  font-weight: 400;
  font-size: 18wx;
  line-height: 26wx;
  color: @black;
  margin-top: 16wx;
  margin-bottom: 16wx;
  padding-left: 52px;
}
.__ag__kefu-textarea__ {
  width: 686px;
  height: 380px;
  margin-top: 16px;
  box-sizing: border-box;
  border-radius: 10wx;
  background-color: @primaryLighter;
  align-self: center;
}
.__ag__textarea__ {
  padding: 10px;
  height: 380px;

  border-radius: 10wx;
}
.__ag__kefu-btn__ {
  width: 520px;
  height: 70px;
  text-align: center;
  line-height: 70px;
  border-radius: 4px;
  margin-top: 30px;
  align-self: center;
  justify-content: center;
  border-radius: 20wx;
  // background-image: linear-gradient(to right, #fdc501, #f8912c);
  background-color: @primary;
}
.__ag__kefu-btn-text__ {
  text-align: center;
  color: @white;
  font-style: normal;
  font-weight: 600;
  font-size: 17wx;
}
</style>
