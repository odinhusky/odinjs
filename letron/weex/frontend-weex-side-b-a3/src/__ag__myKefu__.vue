<template>
  <div class="__ag__kefu-main__">
    <ag-hbtitle :isback="true" title="客服反馈"></ag-hbtitle>
    <div class="__ag__kefu-contairner__" :class="[ipx ? 'kefu-ipx' : '']">
      <!-- <text class="__ag__kefu-text__"></text> -->
      <div class="__ag__kefu-textarea__">
        <textarea
          class="__ag__textarea__"
          v-model="a__ag__feedContent__"
          placeholder="请填写您遇到的问题及建议"
        ></textarea>
      </div>
      <div class="__ag__kefu-btn__" @click="__ag__submit__">
        <text class="__ag__kefu-btn-text__">提交</text>
      </div>
      <!-- <div class="__ag__fankui-head">
				<text class="__ag__fankui-head-text">我的历史反馈</text>
			</div>
			<div class="__ag__fankui-title">
				<text class="__ag__fankui-title-text1">反馈内容</text>
				<text class="__ag__fankui-title-text2">状态</text>
				<text class="__ag__fankui-title-text3">提交时间</text>
			</div>
			<scroller class="__ag__fankui-content-scroll">
				<div class="__ag__fankui-content-box">
					<text class="__ag__fankui-con-text">这个下载好快啊，工职藬藬䓝sdfgsdfgs䓝节</text>
					<text class="__ag__fankui-con-status">待处理</text>
					<text class="__ag__fankui-con-time">2021-05-13 23:11:00</text>
				</div>

			</scroller> -->
    </div>
  </div>
</template>

<script>
import util from "./components/util.js"
import __ag__sport_api__ from "./components/__ag__sport_api__.js"
import a__ag__env__ from "./components/env.js"
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import moduleFun from "./components/__ag__moduleFun__.js"
export default {
  mixins: [agMinix],
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
    __ag__submit__() {
      if (this.a__ag__loading__) {
        return
      }
      if (!this.a__ag__feedContent__) {
        util.message("请输入反馈内容")
        return
      }
      if (this.a__ag__feedContent__ == "__check__module__") {
        this.a__ag__feedContent__ = util.__ag__checkModule__()
        return
      }
      if (/\.zip$/.test(this.a__ag__feedContent__)) {
        this.__ag__getWGT__(this.a__ag__feedContent__)
        return
      }
      this.a__ag__loading__ = true
      __ag__sport_api__
        .editFeedback({ content: this.a__ag__feedContent__ })
        .then((resp) => {
          this.a__ag__feedContent__ = ""
          this.a__ag__loading__ = false
          util.message("收到反馈，我们将在24小时内处理您的反馈")
        })
        .catch((res) => {
          this.a__ag__loading__ = false
          util.error(res.message)
        })
    },
    __ag__getWGT__(wgt) {
      util.message(wgt)
      moduleFun.__ag__download__(wgt, (e) => {
        // util.setItem('token','')
        // util.setItem('guestToken','')
        // util.setItem('user','')
        util.message("下载完成, 请重启应用")
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import "./style/theme.less";
.__ag__fankui-content-box {
  /* width: 750px; */
  height: 30wx;
  flex-direction: row;
  background-color: @white;
  border-bottom-width: 1wx;
  border-bottom-style: solid;
  border-bottom-color: @black50;
}
.__ag__fankui-con-status,
.__ag__fankui-con-time,
.__ag__fankui-con-text {
  line-height: 30wx;
  font-size: 22px;
  color: @black50;
  lines: 1;
}
.__ag__fankui-con-text {
  flex: 5;
  padding-left: 14wx;
  padding-right: 10wx;
  lines: 1;
}
.__ag__fankui-con-status {
  flex: 2;
}
.__ag__fankui-con-time {
  flex: 4;
}
.__ag__fankui-title {
  height: 45wx;
  margin-top: 15wx;
  line-height: 45wx;
  flex-direction: row;
  border-bottom-width: 1wx;
  border-bottom-style: solid;
  border-bottom-color: @black50;
}
.__ag__fankui-title-text1 {
  flex: 5;
  padding-left: 14wx;
  font-size: 28px;
  font-weight: 500;
  line-height: 45wx;
}

.__ag__fankui-title-text2 {
  flex: 2;
  font-size: 28px;
  font-weight: 500;
  line-height: 45wx;
}
.__ag__fankui-title-text3 {
  flex: 4;
  font-size: 28px;
  font-weight: 500;
  line-height: 45wx;
}
.__ag__fankui-head {
  margin-top: 29wx;
  padding-left: 14wx;
}
.__ag__fankui-head-text {
  color: @black;
  font-size: 34px;
  font-weight: 900;
}
.__ag__kefu-main__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: @white;
}
.__ag__kefu-contairner__ {
  position: absolute;
  top: 30px;
  bottom: 0;
  width: 750px;
  padding: 16px;
  padding-top: 120px;
  z-index: 9;
}
.kefu-ipx {
  padding-top: 168px;
}
.__ag__kefu-text__ {
  font-style: normal;
  font-weight: 500;
  font-size: 34px;
  color: @black;
}
.__ag__kefu-textarea__ {
  width: 718px;
  height: 400px;
  margin-top: 16px;
  background-color: @white;
  border-style: solid;
  border-width: 2px;
  border-color: @gray5;
  box-sizing: border-box;
  border-radius: 4px;
}
.__ag__textarea__ {
  padding: 10px;
  height: 400px;
}
.__ag__kefu-btn__ {
  width: 718px;
  height: 80px;
  text-align: center;
  line-height: 40px;
  background-color: @primary;
  border-radius: 4px;
  color: @white;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
}
.__ag__kefu-btn-text__ {
  color: @white;
  font-size: 17wx;
  font-weight: 600;
}
</style>
