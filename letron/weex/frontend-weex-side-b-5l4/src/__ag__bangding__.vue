<template>
  <div class="__ag__login-main__">
    <ag-hbtitle :isback="true"></ag-hbtitle>
    <div class="__ag__login-main-content__" :class="[ipx ? 'login-ipx' : '']">
      <div class="__ag__loginpc-text__">
        <text class="__ag__login-text__">绑定电话号码</text>
      </div>
      <div class="__ag__login-phone__">
        <div class="__ag__login-phone-item__">
          <div class="__ag__login__head__" @click="showCountry = true">
            <input
              type="text"
              class="__ag__country__"
              :hideDoneButton="true"
              v-model="form.country"
            />
          </div>
          <input
            type="number"
            class="__ag__login-phone-input__"
            v-model="form.account"
            :hideDoneButton="true"
            placeholder="请输入手机号码"
          />
        </div>
      </div>
      <div class="__ag__login-pw__">
        <div class="__ag__login-box__" v-if="pc == 'code'">
          <div class="__ag__login-item__">
            <div class="__ag__login__code__">
              <text class="__ag__code_text__">短信验证码</text>
            </div>
            <input
              type="number"
              class="__ag__login-item-input__"
              placeholder="请输入验证码"
              :hideDoneButton="true"
              v-model="form.code"
            />
          </div>
          <!-- :class="[!form.account?'disabled':'']" -->
          <div class="__ag__message-btn__" v-show="ag__sec__ == 0">
            <text
              class="__ag__message-btn-text__"
              @click="__ag__sendCode__"
              v-if="ag__sec__ == 0"
              >{{ ag__loading__ ? "发送中..." : "获取验证码" }}</text
            >
            <text class="__ag__message-btn-text__" v-if="ag__sec__ > 0">{{
              ag__sec__
            }}</text>
          </div>
        </div>
      </div>
      <!-- <div class="__ag__loginpc__">
				<text @click="pc ='code'"  class="__ag__loginphonec__" >验证码登录</text>
			</div> -->
      <div class="__ag__login-service__">
        <text
          class="agiconfont __ag__login-gou__"
          :class="[service ? 'gouselected' : '']"
          @click="service = !service"
          >&#xe682;</text
        >
        <div class="__ag__policy__">
          <text class="__ag__policy_text__">请阅读并同意</text
          ><text @click.stop="__ag__goJump__(0)" class="__ag__policy_text__"
            >《用户隐私协议》</text
          ><text class="__ag__policy_text__">和</text
          ><text @click.stop="__ag__goJump__(1)" class="__ag__policy_text__"
            >《用户服务协议》</text
          >
        </div>
      </div>
      <div class="__ag__login-btn__" @click="__ag__sendLogin__">
        <text class="__ag__login-btn-text__">确定</text>
      </div>
      <div class="__ag__login-regist__" v-if="pc == 'code'">
        <text class="__ag__login-regist-text__"
          >绑定登录后将自动为您创建帐号</text
        >
      </div>
    </div>
  </div>
</template>

<script>
import hbtitle from "./components/__ag__headTop__.vue"
import agMinix from "./components/__ag__minix__.js"
import util from "./components/util.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
let cd = 0
export default {
  mixins: [agMinix],
  data() {
    return {
      ag__sec__: 0,
      form: {
        account: "",
        password: "",
        code: "",
        country: "+86",
        deviceType: 2,
        source: "ios",
      },
      pc: "code",
      ag__loading__: false,
      service: true,
      showCountry: false,
      bdloading: false,
    }
  },
  components: {
    "ag-hbtitle": hbtitle,
  },
  computed: {},
  methods: {
    __ag__goJump__(n) {
      if (n == 0) {
        ag__sport__.goPolicy(this)
        return
      }
      if (n == 1) {
        ag__sport__.goAgreement(this)
        return
      }
    },
    async __ag__sendCode__() {
      if (!this.form.account) {
        util.error("请输入手机号码")
        return
      }
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
        let resp = await __ag__sportApi__.editSendCode({
          mobile: this.form.account,
          country: this.form.country,
        })

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
    async __ag__sendLogin__() {
      if (!this.service) {
        util.error("请同意用户隐私协议和用户服务协议")
        return
      }
      if (this.form.account == "") {
        util.message("请输入手机号码")
        return
      }
      if (this.pc == "code" && this.form.code == "") {
        util.message("请输入验证码")
        return
      }
      if (this.pc == "code") {
        if (this.bdloading) {
          util.message("请稍等")
          return
        }
        try {
          this.bdloading = true
          await this.__ag__loginBind__(this.form)
          this.bdloading = false
        } catch (error) {
          this.bdloading = false
          // let data = error.data
          util.message(error.message)
        }
      }
    },
  },
}
</script>

<style lang="less">
@import "./style/theme.less";
.__ag__login-main__ {
  width: 750px;
  /* padding-top: 40px; */
  position: fixed;
  top: 100px;
  bottom: 0px;
  background-color: #ffffff;
}
.__ag__loginpc-text__ {
  width: 750px;
  padding-top: 78wx;
  padding-bottom: 38wx;
}
.__ag__login-text__ {
  font-size: 40wx;
  color: #000000;
  text-align: center;
}
.__ag__login-main-content__ {
  width: 750px;
}
.__ag__login-phone__ {
  height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f2f3f4;
  align-items: center;
  width: 750px;
  justify-content: center;
  padding-left: 30wx;
  padding-right: 30wx;
}
.__ag__login-pw__ {
  height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f2f3f4;
  align-items: center;
  width: 750px;
  justify-content: center;
}
.__ag__loginphoneText__ {
  font-size: 40px;
}
.__ag__login-phone-item__ {
  width: 750px;
  flex-direction: row;
  align-items: center;
  padding-left: 30wx;
  padding-right: 30wx;
}
.__ag__login__head__ {
  width: 150px;
  border-right-width: 1px;
  border-right-color: #f2f3f4;
}
.__ag__login__code__ {
  width: 180px;
}
.__ag__code_text__ {
  font-size: 16wx;
  font-weight: 500;
  color: #000000;
}
.__ag__country__ {
  border-radius: 3px;
  height: 52px;
  line-height: 52px;
  padding-right: 11px;
  font-style: normal;
  color: #252932;
  font-weight: 500;
  font-size: 17wx;
}
.__ag__login-phone-input__ {
  flex: 1;
  padding-left: 20wx;
  font-style: normal;
  font-weight: normal;
  font-size: 17wx;
  line-height: 60px;
  height: 60px;
  color: #252932;
}
.__ag__navmore__ {
  color: #252932;
}
.__ag__login-code__ {
  width: 750px;
  height: 112px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(37, 41, 50, 0.3);
  align-items: center;
  width: 750px;
  position: absolute;
  top: 202px;
  justify-content: center;
}
.__ag__login-box__ {
  width: 750px;
  flex-direction: row;
  align-items: center;
  padding-left: 30wx;
  padding-right: 15wx;
}
.__ag__login-item__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.__ag__login-item-input__ {
  flex: 1;
  padding-left: 10wx;
  height: 60px;
  line-height: 60px;
  font-style: normal;
  font-weight: normal;
  font-size: 34px;
  color: #252932;
}
.__ag__message-btn__ {
  width: 150px;
  height: 70px;
  padding: 0 5px;
  line-height: 70px;
  border-radius: 10px;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: @main-color;
  background-color: #fff;
}
.__ag__message-btn-text__ {
  color: @main-color;
  font-size: 12wx;
  padding: 0 5px;
  line-height: 70px;
  text-align: center;
}
.__ag__loginpc__ {
  flex-direction: row;
  padding-left: 30wx;
  margin-bottom: 25wx;
  margin-top: 25wx;
  width: 750px;
}
.__ag__loginphonec__,
.__ag__loginphone__ {
  flex: 1;
  margin-right: 20px;
  font-size: 17wx;
  color: #576b95;
  opacity: 0.9;
}
.select {
  flex: 1;
  text-align: center;
  color: @main-color;
}
.__ag__login-regist__ {
  width: 750px;
  margin-top: 16wx;
  padding-left: 30wx;
}
.__ag__login-regist-text__ {
  font-size: 12wx;
  color: rgba(0, 0, 0, 0.4);
}
.__ag__login-service__ {
  color: #8c97a5;
  flex-direction: row;
  width: 750px;
  padding-left: 30wx;
  align-items: center;
}
.__ag__login-btn__ {
  width: 750px;
  height: 80px;
  border-radius: 4px;
  color: #fff;
  margin-top: 60px;
  padding: 30wx;
  padding-top: 0px;
  padding-bottom: 0px;
  justify-content: center;
}
.__ag__login-btn-text__ {
  line-height: 80px;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 17wx;
  color: #fff;
  background-color: @main-color;
}
.__ag__login-gou__ {
  font-size: 40px;
  margin-right: 8px;
  color: #596379;
}
.gouselected {
  font-size: 40px;
  margin-right: 8px;
  color: @main-color;
}
.__ag__policy__ {
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.__ag__policy_text__ {
  font-size: 12wx;
  color: rgba(0, 0, 0, 0.4);
}
.__ag__policytext__ {
  width: 670px;
  font-size: 28px;
  display: unset;
  overflow: auto !important;
  color: #000000;
}
.__ag__policyspan__ {
  font-size: 30px;
}
</style>
