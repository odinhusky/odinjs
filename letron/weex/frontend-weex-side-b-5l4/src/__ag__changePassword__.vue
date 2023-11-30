<template>
  <div class="__ag__kefu-main__">
    <ag-hbtitle :isback="true" title="修改密码"></ag-hbtitle>
    <div class="__ag__kefu-contairner__" :class="[ipx ? 'kefu-ipx' : '']">
      <div class="__ag__kefu-textarea__">
        <text class="__ag__preText__">新密码</text>
        <input
          class="__ag__input__"
          :hideDoneButton="true"
          v-model="form.password"
          placeholder="请输入新密码"
        />
      </div>
      <div class="__ag__kefu-textarea__">
        <text class="__ag__preText__">确认新密码</text>
        <input
          class="__ag__input__"
          :hideDoneButton="true"
          v-model="form.confirm"
          placeholder="请输入确认密码"
        />
      </div>
      <div class="__ag__kefu-textarea__">
        <text class="__ag__preText__">验证码</text>
        <input
          type="number"
          class="__ag__inputConfirm__"
          :hideDoneButton="true"
          v-model="form.code"
          placeholder="请输入验证码"
        />
        <div class="__ag__button__">
          <div class="__ag__input__code__">
            <text
              class="__ag__input__codeButton__"
              @click="__ag__sendCode__"
              v-if="ag__sec__ == 0"
              >{{ ag__loading__ ? "发送中..." : "获取验证码" }}</text
            >
            <text class="__ag__input__codeButton__" v-if="ag__sec__ > 0">{{
              ag__sec__
            }}</text>
          </div>
        </div>
      </div>

      <div class="__ag__kefu-btn__" @click="tapSubmit">
        <text class="__ag__kefu-btn-text__">确定</text>
      </div>
    </div>
  </div>
</template>

<script>
import util from "./components/util.js"
import a__ag__env__ from "./components/env.js"
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"

let cd = 0
export default {
  mixins: [agMinix],
  components: {
    "ag-hbtitle": HbTitle,
  },
  data() {
    return {
      a__ag__env__,
      a__ag__newPass__: "",
      a__ag__comfirm__: "",
      a__ag__code__: "",
      a__ag__loading__: false,
      ag__sec__: 0,
      ag__loading__: false,
      a__ag__user__: {},
      form: {
        password: "",
        confirm: "",
        code: "",
        source: "h5",
      },
    }
  },
  methods: {
    async __ag__loadData__() {
      let that = this
      that.a__ag__user__ = util.getItem("user")
    },
    async __ag__sendCode__() {
      if (this.ag__sec__ > 0) {
        util.error("请稍等...")
        return
      }
      if (this.ag__loading__) {
        util.error("发送中...")
        return
      }
      this.ag__loading__ = true
      try {
        let mobile = this.a__ag__user__.mobile
        let country = this.a__ag__user__.country
        if (!country) {
          country = "86"
        }
        let resp = await __ag__sportApi__.editSendCode({ mobile, country })

        if (resp.success) {
          this.ag__loading__ = false
          this.startCountDown(599)
        } else {
          this.ag__loading__ = false
        }
        util.message(resp.message)
      } catch (e) {
        this.ag__loading__ = false
        util.message(e.message)
        //TODO handle the exception
      }
    },
    startCountDown(sec) {
      if (cd) {
        clearInterval(cd)
      }
      this.ag__sec__ = sec
      cd = setInterval(() => {
        if (this.ag__sec__ <= 0) {
          clearInterval(cd)
          return
        }
        this.ag__sec__ = this.ag__sec__ - 1
      }, 1000)
    },
    async tapSubmit() {
      if (this.a__ag__loading__) {
        return
      }
      if (!this.form.password) {
        util.error("请输入新密码")
        return
      }
      if (!this.form.confirm) {
        util.error("请输入确认密码")
        return
      }
      if (this.form.password != this.form.confirm) {
        util.error("确认密码与新密码不一致")
        return
      }
      this.a__ag__loading__ = true
      try {
        let resp = await this.__ag__editUsersPassByCode__(this.form)
        this.a__ag__loading__ = false
        this.form = {}
        util.message(resp.message)
        util.pop()
      } catch (error) {
        this.a__ag__loading__ = false
        util.message(error.message)
      }
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__fankui-content-box {
  width: 750px;
  height: 30wx;
  flex-direction: row;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.5);
}
.__ag__fankui-con-status,
.__ag__fankui-con-time,
.__ag__fankui-con-text {
  line-height: 30wx;
  font-size: 22px;
  color: rgba(0, 0, 0, 0.5);
  lines: 1;
}
.__ag__fankui-con-text {
  flex: 5;
  padding-left: 14wx;
  padding-right: 10wx;
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
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.5);
}
.__ag__fankui-title-text1 {
  flex: 5;
  padding-left: 14wx;
  font-size: 28px;
  font-weight: 500;
}

.__ag__fankui-title-text2 {
  flex: 2;
  font-size: 28px;
  font-weight: 500;
}
.__ag__fankui-title-text3 {
  flex: 4;
  font-size: 28px;
  font-weight: 500;
}
.__ag__fankui-head {
  margin-top: 29wx;
  padding-left: 14wx;
}
.__ag__fankui-head-text {
  color: #000000;
  font-size: 34px;
  font-weight: 900;
}
.__ag__kefu-main__ {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #ffffff;
}
.__ag__kefu-contairner__ {
  position: absolute;
  top: 0px;
  bottom: 0;
  width: 750px;
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
  color: #000000;
}
.__ag__kefu-textarea__ {
  width: 750px;
  /* 	height: 400px; */
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 16px;
  background-color: #ffffff;
  flex-direction: row;
  border-bottom-style: solid;
  border-bottom-width: 1wx;
  border-bottom-color: #f2f3f4;
  /* border-radius: 4px; */
}
.__ag__preText__ {
  flex: 3;
  height: 56wx;
  line-height: 56wx;
  font-size: 17wx;
  color: #000000;
}
.__ag__input__ {
  padding: 10px;
  height: 56wx;
  flex: 6;
  line-height: 56wx;
}
.__ag__inputConfirm__ {
  flex: 3;
  padding: 10px;
  height: 56wx;
  line-height: 56wx;
}
.__ag__button__ {
  flex: 3;
  align-items: center;
  justify-content: center;
}
.__ag__input__code__ {
  width: 83wx;
  height: 37wx;
  line-height: 37wx;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: @main-color;
  border-radius: 5wx;
}
.__ag__input__codeButton__ {
  /* 	width: 63wx;
	height: 17wx; */
  font-size: 12wx;
  font-weight: 500;
  color: @main-color;
  line-height: 17wx;
  text-align: center;
  padding: 10wx;
}
.__ag__kefu-btn__ {
  width: 718px;
  height: 80px;
  text-align: center;
  line-height: 40px;
  background-color: @main-color;
  border-radius: 4px;
  color: #fff;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  margin-right: 16px;
}
.__ag__kefu-btn-text__ {
  color: #ffffff;
  font-size: 17wx;
  font-weight: 600;
}
</style>
